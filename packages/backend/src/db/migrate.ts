import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './index';

const runMigration = async () => {
  console.log('Running migrations...');
  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('Migrations completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

runMigration();
