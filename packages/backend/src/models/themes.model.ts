import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { themes } from '../schema/themes.schema';

export type Theme = InferSelectModel<typeof themes>;
export type NewTheme = InferInsertModel<typeof themes>;
