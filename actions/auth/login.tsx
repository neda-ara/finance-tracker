"use server";

import { ActionResult } from "@/lib/actions/types";
import { createSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { loginInputSchema } from "@/lib/schema/login-schema";
import { safeRunAction } from "@/lib/actions/helpers";
import { verifyPassword } from "@/lib/utils/auth";

export async function login(formData: FormData): Promise<ActionResult<void>> {
  return safeRunAction(async () => {
    const input = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const parsedInput = loginInputSchema.safeParse(input);

    if (!parsedInput.success) {
      throw {
        fieldErrors: Object.fromEntries(
          Object.entries(parsedInput.error.flatten().fieldErrors)
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
      throw new Error("Invalid email or password");
    }

    const user = result.rows[0];
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    await createSession(user.id);
  });
}
