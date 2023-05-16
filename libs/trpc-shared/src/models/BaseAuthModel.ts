import { PasswordSchema } from '@trpc-shared/utils/schemas';
import { z } from 'zod';

export const BaseAuthModel = z.object({
	id: z.string().uuid(),
	identifier: z.string(),
	password: PasswordSchema,
});

export type BaseAuthModelType = typeof BaseAuthModel;
export type InferBaseAuthModelType = z.infer<BaseAuthModelType>;
