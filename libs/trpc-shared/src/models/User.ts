import { z } from 'zod';
import { PasswordSchema } from '../utils/schemas';
import { BaseAuthModel } from './BaseAuthModel';

export const User = BaseAuthModel.extend({
	password: PasswordSchema,
});

export type UserType = z.infer<typeof User>;
