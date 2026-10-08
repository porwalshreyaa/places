import { usersCrud } from '../crud/users.crud';
import { themesCrud } from '../crud/themes.crud';
import { destinationsCrud } from '../crud/destinations.crud';
import { authService } from './auth.service';
import { sanitizeUsername, sanitizeEmail, sanitizeString, sanitizeMapDrawings } from '../utils/sanitizer';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
  ConflictError
} from '../utils/errors';
import { RegisterPayload, AuthPayload, CheckAvailabilityQuery, UserSettingsPayload } from '../validators';

export interface UserProfileResponse {
  id: string;
  username: string;
  role: string;
  is_public: boolean;
  notes_to_self: string | null;
  map_drawings: unknown;
  theme_title: string | null;
  theme_subtitle: string | null;
  theme_id: string | null;
  theme: unknown | null;
}

export interface PublicProfileResponse {
  username: string;
  notes_to_self: string | null;
  map_drawings: unknown;
  theme_title: string | null;
  theme_subtitle: string | null;
  theme_id: string | null;
  theme: unknown | null;
  destinations: unknown[];
}

export class UserService {
  async register(payload: RegisterPayload) {
    const cleanUsername = sanitizeUsername(payload.username);
    const cleanEmail = sanitizeEmail(payload.email);
    const cleanPassword = payload.password.trim();

    if (!cleanUsername || !cleanEmail || !cleanPassword) {
      throw new BadRequestError('Valid username, email, and password required');
    }

    const existingUser = await usersCrud.findByUsername(cleanUsername);
    if (existingUser) {
      throw new ConflictError('Username already taken');
    }

    const existingEmail = await usersCrud.findByEmail(cleanEmail);
    if (existingEmail) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await authService.hashPassword(cleanPassword);

    const newUser = await usersCrud.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

    const role = (newUser as { role?: string }).role || 'USER';
    const token = authService.generateToken(newUser.id, newUser.username, role);

    return { token, user: { id: newUser.id, username: newUser.username, role } };
  }

  async login(payload: AuthPayload) {
    const cleanUsername = sanitizeUsername(payload.username);
    const cleanPassword = payload.password.trim();

    const user = await usersCrud.findByUsername(cleanUsername);
    if (!user) {
      throw new BadRequestError('Invalid credentials');
    }

    const isMatch = await authService.comparePassword(cleanPassword, user.password);
    if (!isMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const role = (user as { role?: string }).role || 'USER';
    const token = authService.generateToken(user.id, user.username, role);

    return {
      token,
      user: { id: user.id, username: user.username, role, is_public: user.is_public }
    };
  }

  async getMe(userId: string): Promise<UserProfileResponse> {
    const user = await usersCrud.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    let theme = null;
    if ((user as { theme_id?: string }).theme_id) {
      theme = await themesCrud.findById((user as { theme_id?: string }).theme_id!);
    }

    return {
      id: user.id,
      username: user.username,
      role: (user as { role?: string }).role || 'USER',
      is_public: user.is_public,
      notes_to_self: user.notes_to_self,
      map_drawings: user.map_drawings,
      theme_title: user.theme_title,
      theme_subtitle: user.theme_subtitle,
      theme_id: (user as { theme_id?: string }).theme_id || null,
      theme: theme || null
    };
  }

  async checkAvailability(query: CheckAvailabilityQuery) {
    const { username, email } = query;

    if (username) {
      const cleanUsername = sanitizeUsername(username);
      const existingUser = await usersCrud.findByUsername(cleanUsername);
      return { available: !existingUser };
    }

    if (email) {
      const cleanEmail = sanitizeEmail(email);
      const existingEmail = await usersCrud.findByEmail(cleanEmail);
      return { available: !existingEmail };
    }

    throw new BadRequestError('Must provide username or email to check');
  }

  async updateSettings(userId: string, payload: UserSettingsPayload) {
    const user = await usersCrud.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const { notes_to_self, is_public, map_drawings, theme_title, theme_subtitle, theme_id } = payload;

    const updates: Record<string, unknown> = {};
    if (notes_to_self !== undefined) updates.notes_to_self = sanitizeString(notes_to_self, 10000);
    if (is_public !== undefined) updates.is_public = Boolean(is_public);
    if (map_drawings !== undefined) updates.map_drawings = sanitizeMapDrawings(map_drawings);
    if (theme_title !== undefined) updates.theme_title = sanitizeString(theme_title, 100);
    if (theme_subtitle !== undefined) updates.theme_subtitle = sanitizeString(theme_subtitle, 200);
    if (theme_id !== undefined) updates.theme_id = sanitizeString(theme_id, 50);

    if (Object.keys(updates).length > 0) {
      await usersCrud.update(userId, updates);
    }

    let updatedTheme = null;
    if (theme_id !== undefined && updates.theme_id) {
      updatedTheme = await themesCrud.findById(updates.theme_id as string);
    }

    return { success: true, theme: updatedTheme };
  }

  async getPublicProfile(username: string): Promise<PublicProfileResponse> {
    const cleanUsername = sanitizeUsername(username);
    const user = await usersCrud.findByUsername(cleanUsername);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.is_public) {
      throw new ForbiddenError('This profile is private');
    }

    const userDestinations = await destinationsCrud.findByUserId(user.id);

    let theme = null;
    if ((user as { theme_id?: string }).theme_id) {
      theme = await themesCrud.findById((user as { theme_id?: string }).theme_id!);
    }

    return {
      username: user.username,
      notes_to_self: user.notes_to_self,
      map_drawings: user.map_drawings,
      theme_title: user.theme_title,
      theme_subtitle: user.theme_subtitle,
      theme_id: (user as { theme_id?: string }).theme_id || null,
      theme: theme || null,
      destinations: userDestinations,
    };
  }
}

export const userService = new UserService();
