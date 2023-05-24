import { z } from 'zod';
import { BaseAuthModel } from './BaseAuthModel';
import { PasswordSchema } from '@trpc-shared/utils/schemas';

export const User = BaseAuthModel.extend({
	password: PasswordSchema,
});

export type UserType = z.infer<typeof User>;
