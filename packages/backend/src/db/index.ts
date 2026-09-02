import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';
import { config } from '../config/env';

// Create a PostgreSQL connection pool
// Default to a local database if DATABASE_URL is not set
const connectionString = config.db.url;

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

export const db = drizzle(pool, { schema });
