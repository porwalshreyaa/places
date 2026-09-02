import { db } from '../db';
import { eq } from 'drizzle-orm';
import { users } from '../schema/users.schema';
import { User, NewUser } from '../models/users.model';

class UsersCrud {
  async findAll(): Promise<User[]> {
    return db.select().from(users);
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0] || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  }

  async create(data: NewUser): Promise<User> {
    const result = await db.insert(users).values(data).returning();
    return result[0];
  }

  async update(id: string, data: Partial<NewUser>): Promise<User | null> {
    const result = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return result[0] || null;
  }

  async delete(id: string): Promise<User | null> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result[0] || null;
  }
}

export const usersCrud = new UsersCrud();
