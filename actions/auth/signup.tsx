"use server";

import { ACTION_ERRORS } from "@/lib/constants/constants";
import { ActionResult } from "@/lib/actions/types";
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

  const parsed = signUpInputSchema.safeParse(input);

  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;

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

  const { email, username, password } = parsed.data;

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

  await db.query(
    "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3)",
    [email, username, passwordHash]
  );

  return { ok: true };
}
