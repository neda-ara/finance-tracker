"use server";

import { ACTION_ERRORS } from "@/lib/constants/constants";
import { ActionResult } from "@/lib/actions/types";
import { createSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/utils/auth";
import { signUpInputSchema } from "@/lib/schema/sign-up-schema";
import z from "zod";

export async function signup(formData: FormData): Promise<ActionResult<void>> {
  const input = {
    email: formData.get("email"),
    username: formData.get("username"),
    password: formData.get("password"),
  };

  const parsedInput = signUpInputSchema.safeParse(input);

  if (!parsedInput.success) {
    const fieldErrors = z.flattenError(parsedInput.error).fieldErrors;

    return {
      ok: false,
      type: ACTION_ERRORS.VALIDATION,
      errors: Object.fromEntries(
        Object.entries(fieldErrors)
          .filter(([, v]) => v?.length)
          .map(([k, v]) => [k, v![0]])
      ),
    };
  }

  const { email, username, password } = parsedInput.data;

  const existing = await db.query("SELECT 1 FROM users WHERE email = $1", [
    email,
  ]);

  if (existing.rowCount) {
    return {
      ok: false,
      type: ACTION_ERRORS.CONFLICT,
      message: "Email already exists",
    };
  }

  const passwordHash = await hashPassword(password);

  const result = await db.query(
    "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id",
    [email, username, passwordHash]
  );

  const userId = result.rows[0].id;
  createSession(userId);
  return { ok: true };
}
