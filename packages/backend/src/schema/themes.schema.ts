import { pgTable, uuid, text, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const themes = pgTable('themes', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  creator_id: uuid('creator_id').references(() => users.id),
  base_color: text('base_color').notNull(),
  colors: jsonb('colors').notNull(), // { '50': '#...', '100': '#...', ..., '700': '#...' }
  color_hash: text('color_hash').notNull().unique(),
  is_system: boolean('is_system').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
