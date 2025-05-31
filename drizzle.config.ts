import { type Config } from "drizzle-kit";

import { env } from "~/env"; // Make sure this path is correct

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "singlestore",
  tablesFilter: ["StoreBox_*"],
  dbCredentials: {
    host: env.SINGLESTORE_HOST,
    database: env.SINGLESTORE_DB_NAME,
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS,
    port: env.SINGLESTORE_PORT,
  },
} satisfies Config;
