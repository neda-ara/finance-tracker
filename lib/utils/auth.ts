import { ActionResult, User } from "../actions/types";
import { db } from "../db";
import { getAuthenticatedSession, safeRunAction } from "../actions/helpers";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser(): Promise<ActionResult<User>> {
  return safeRunAction(async () => {
    const session = await getAuthenticatedSession();

    const result = await db.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [session.userId],
    );

    if (result.rowCount === 0) {
      throw new Error("User not found");
    }

    return result.rows[0];
  });
}
