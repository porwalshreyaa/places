import { destinations } from '../schema/destinations.schema';

export type Destination = typeof destinations.$inferSelect;
export type NewDestination = typeof destinations.$inferInsert;
