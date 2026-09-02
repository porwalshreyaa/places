import { pgTable, text, jsonb, uuid } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const destinations = pgTable('destinations', {
  id: text('id').primaryKey(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  name: text('name').notNull(),
  country: text('country').notNull(),
  coordinates: jsonb('coordinates').notNull(),
  description: text('description').notNull(),
  image: text('image').notNull(),
  notes: text('notes').notNull(),
  checklist: jsonb('checklist').notNull().default('[]'),
  stickers: jsonb('stickers').notNull().default('[]'),
});
