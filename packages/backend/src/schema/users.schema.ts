import { pgTable, text, boolean, jsonb, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['USER', 'ADMIN']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: roleEnum('role').default('USER').notNull(),
  is_public: boolean('is_public').default(false).notNull(),
  notes_to_self: text('notes_to_self').default(''),
  map_drawings: jsonb('map_drawings').default('[]'),
  theme_title: text('theme_title').default('Dream Diary'),
  theme_subtitle: text('theme_subtitle').default('My memories and adventures'),
  theme_id: uuid('theme_id'),
});
