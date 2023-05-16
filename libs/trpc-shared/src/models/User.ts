import { PasswordSchema } from '@trpc-shared/utils/schemas';
import { z } from 'zod';

export const User = z.object({
	id: z.string().uuid(),
	name: z.string().min(4),
	password: PasswordSchema,
});

export type UserType = z.infer<typeof User>;
