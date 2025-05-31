import { createPool, type Pool } from "mysql2/promise";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR update. Does not create a new connection
 */

const globalForDb = globalThis as unknown as { conn: Pool | undefined };
console.log("printing envs ", env.SINGLESTORE_HOST, env.SINGLESTORE_PORT);
const conn =
  globalForDb.conn ??
  createPool({
    host: env.SINGLESTORE_HOST,
    port: env.SINGLESTORE_PORT,
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS,
    database: env.SINGLESTORE_DB_NAME,
    ssl: {},
    maxIdle: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
}

conn.addListener("error", (err) => {
  console.error("Database connection error ", err);
});
