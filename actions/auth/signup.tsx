"use server";

import { ActionResult } from "@/lib/actions/types";
import { createSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/utils/auth";
import { safeRunAction } from "@/lib/actions/helpers";
import { signUpInputSchema } from "@/lib/schema/sign-up-schema";

export async function signup(formData: FormData): Promise<ActionResult<void>> {
  return safeRunAction(async () => {
    const input = {
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const parsedInput = signUpInputSchema.safeParse(input);

    if (!parsedInput.success) {
      throw {
        fieldErrors: Object.fromEntries(
          Object.entries(parsedInput.error.flatten().fieldErrors)
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
      throw new Error("Email already exists");
    }

    const passwordHash = await hashPassword(password);

    const result = await db.query(
      "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id",
      [email, username, passwordHash]
    );

    const userId = result.rows[0].id;
    await createSession(userId);
  });
}
