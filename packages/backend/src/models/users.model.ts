import { users } from '../schema/users.schema';

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
