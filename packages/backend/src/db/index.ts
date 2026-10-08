import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';
import * as schema from '../schema';
import { config } from '../config/env';

const rawConnectionString = config.db.url;

function getPoolConfig(connectionString: string): PoolConfig {
  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

  if (isLocal) {
    return {
      connectionString,
      ssl: false,
    };
  }

  // Cloud Postgres (Render, Neon, Supabase, Heroku, Aiven, AWS RDS, etc.)
  // Strip `sslmode` and `ssl` query params from connectionString so pg-connection-string
  // doesn't override rejectUnauthorized: false with strict certificate verification.
  let cleanConnectionString = connectionString;
  try {
    const parsedUrl = new URL(connectionString);
    parsedUrl.searchParams.delete('sslmode');
    parsedUrl.searchParams.delete('ssl');
    parsedUrl.searchParams.delete('uselibpqcompat');
    cleanConnectionString = parsedUrl.toString();
  } catch {
    cleanConnectionString = connectionString
      .replace(/([?&])sslmode=[^&]*/gi, '')
      .replace(/([?&])ssl=[^&]*/gi, '')
      .replace(/\?&/, '?')
      .replace(/[?&]$/, '');
  }

  return {
    connectionString: cleanConnectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  };
}

const pool = new Pool(getPoolConfig(rawConnectionString));

export const db = drizzle(pool, { schema });
