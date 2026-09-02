import { db } from '../db';
import { eq } from 'drizzle-orm';
import { destinations } from '../schema/destinations.schema';
import { Destination, NewDestination } from '../models/destinations.model';

class DestinationsCrud {
  async findAll(): Promise<Destination[]> {
    return db.select().from(destinations);
  }

  async findById(id: string): Promise<Destination | null> {
    const result = await db.select().from(destinations).where(eq(destinations.id, id));
    return result[0] || null;
  }

  async findByUserId(userId: string): Promise<Destination[]> {
    return db.select().from(destinations).where(eq(destinations.user_id, userId));
  }

  async create(data: NewDestination): Promise<Destination> {
    const result = await db.insert(destinations).values(data).returning();
    return result[0];
  }

  async update(id: string, data: Partial<NewDestination>): Promise<Destination | null> {
    const result = await db.update(destinations).set(data).where(eq(destinations.id, id)).returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<Destination | null> {
    const result = await db.delete(destinations).where(eq(destinations.id, id)).returning();
    return result[0] || null;
  }

  async bulkDeleteAndInsert(userId: string, newDestinations: NewDestination[]): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.delete(destinations).where(eq(destinations.user_id, userId));
      if (newDestinations.length > 0) {
        await tx.insert(destinations).values(newDestinations);
      }
    });
  }
}

export const destinationsCrud = new DestinationsCrud();
