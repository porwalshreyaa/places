import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  db: {
    url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/ghoomi',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'ghoomi-ghoomi-super-secret',
  },
  upload: {
    catboxUrl: process.env.CATBOX_API_URL || 'https://catbox.moe/user/api.php',
    userhash: process.env.CATBOX_USERHASH || '',
  }
};
