import { z } from 'zod';

export const User = z.object({
	id: z.string().uuid(),
	name: z.string().min(4),
	password: z.string().min(4).describe('password'),
});

export type UserType = z.infer<typeof User>;
