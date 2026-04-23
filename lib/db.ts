import { ENV_PRODUCTION } from "./constants/constants";
import { Pool } from "pg";

const globalForDb = global as unknown as {
  pool: Pool | undefined;
};

export const db =
  globalForDb.pool ??
  new Pool(
    process.env.NODE_ENV === ENV_PRODUCTION
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false },
        }
      : {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        },
  );

if (process.env.NODE_ENV !== ENV_PRODUCTION) {
  globalForDb.pool = db;
}
