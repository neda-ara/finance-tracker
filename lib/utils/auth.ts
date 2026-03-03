import { db } from "../db";
import { getSession } from "../auth/session";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const result = await db.query(
    "SELECT id, username, email FROM users WHERE id = $1",
    [session.userId]
  );

  if (result.rowCount) {
    return result.rows[0];
  }
  return null;
}
