import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default {
  schema: "./src/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    ssl: process.env.DATABASE_URL?.includes('localhost') ? false : ({ rejectUnauthorized: false } as boolean | { rejectUnauthorized: boolean }),
  },
} satisfies Config;
