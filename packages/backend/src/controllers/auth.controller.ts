import { handleServerError } from '../utils/error';
import { Request, Response } from 'express';
import { usersCrud } from '../crud/users.crud';
import { themesCrud } from '../crud/themes.crud';
import { authService } from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password required' });
      }

      const existingUser = await usersCrud.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      const existingEmail = await usersCrud.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await authService.hashPassword(password);
      
      const newUser = await usersCrud.create({
        username,
        email,
        password: hashedPassword,
      });

      const token = authService.generateToken(newUser.id, newUser.username, (newUser as { role?: string }).role || 'USER');
      
      res.json({ token, user: { id: newUser.id, username: newUser.username, role: (newUser as { role?: string }).role || 'USER' } });
    } catch (err: unknown) {
      handleServerError(res, err);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      
      const user = await usersCrud.findByUsername(username);
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isMatch = await authService.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = authService.generateToken(user.id, user.username, (user as { role?: string }).role || 'USER');
      
      res.json({ 
        token, 
        user: { id: user.id, username: user.username, role: (user as { role?: string }).role || 'USER', is_public: user.is_public } 
      });
    } catch (err: unknown) {
      handleServerError(res, err);
    }
  }

  async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      
      const user = await usersCrud.findById(req.user.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      
      let theme = null;
      if ((user as { theme_id?: string }).theme_id) {
        theme = await themesCrud.findById((user as { theme_id?: string }).theme_id!);
      }

      res.json({ 
        id: user.id, 
        username: user.username, 
        role: (user as { role?: string }).role || 'USER',
        is_public: user.is_public,
        notes_to_self: user.notes_to_self,
        map_drawings: user.map_drawings,
        theme_title: user.theme_title,
        theme_subtitle: user.theme_subtitle,
        theme_id: (user as { theme_id?: string }).theme_id,
        theme: theme || null
      });
    } catch (err: unknown) {
      handleServerError(res, err);
    }
  }

  async checkAvailability(req: Request, res: Response) {
    try {
      const { username, email } = req.query;
      
      if (username) {
        const existingUser = await usersCrud.findByUsername(username as string);
        return res.json({ available: !existingUser });
      }
      
      if (email) {
        const existingEmail = await usersCrud.findByEmail(email as string);
        return res.json({ available: !existingEmail });
      }

      res.status(400).json({ error: 'Must provide username or email to check' });
    } catch (err: unknown) {
      handleServerError(res, err);
    }
  }
}

export const authController = new AuthController();
