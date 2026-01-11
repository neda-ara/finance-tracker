"use server";

import { ACTION_ERRORS } from "@/lib/constants/constants";
import { ActionResult } from "@/lib/actions/types";
import { createSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { loginInputSchema } from "@/lib/schema/login-schema";
import { verifyPassword } from "@/lib/utils/auth";
import z from "zod";

export async function login(formData: FormData): Promise<ActionResult<void>> {
  const input = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsedInput = loginInputSchema.safeParse(input);

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

  const { email, password } = parsedInput.data;

  const result = await db.query(
    "SELECT id, password_hash FROM users WHERE email = $1",
    [email]
  );

  if (!result.rowCount) {
    // Do not reveal to user which field is incorrect for security purpose
    return {
      ok: false,
      type: ACTION_ERRORS.AUTH,
      message: "Invalid email or password",
    };
  }

  const user = result.rows[0];
  const isValidPassword = await verifyPassword(password, user.password_hash);

  if (!isValidPassword) {
    return {
      ok: false,
      type: ACTION_ERRORS.AUTH,
      message: "Invalid email or password",
    };
  }

  await createSession(user.id);
  return { ok: true };
}
