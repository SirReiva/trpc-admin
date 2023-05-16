import { z } from 'zod';
import { PasswordSchema } from '../utils/schemas';
import { BaseAuthModel } from './BaseAuthModel';

export const User = BaseAuthModel.extend({
	name: z.string().min(4),
	password: PasswordSchema,
});

export type UserType = z.infer<typeof User>;
