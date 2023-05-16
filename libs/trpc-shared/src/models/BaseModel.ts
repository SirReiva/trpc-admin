import { z } from 'zod';

export const BaseModel = z.object({
	id: z.string().uuid(),
});

export type BaseModelType = typeof BaseModel;
export type InferBaseModelType = z.infer<BaseModelType>;
