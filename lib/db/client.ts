import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection
const connectionString = process.env.DATABASE_URL!;

// Create postgres client. Set search_path so tables in public are found (Neon defaults to empty).
const client = postgres(connectionString, {
  connection: { search_path: 'public' },
});

// Create drizzle instance
export const db = drizzle(client, { schema });
