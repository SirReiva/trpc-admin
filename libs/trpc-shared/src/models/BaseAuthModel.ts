import { z } from 'zod';

export const BaseAuthModel = z.object({
	id: z.string().uuid(),
	identifier: z.string(),
	password: z.string().min(4).describe('password'),
});

export type BaseAuthModelType = typeof BaseAuthModel;
export type InferBaseAuthModelType = z.infer<BaseAuthModelType>;
