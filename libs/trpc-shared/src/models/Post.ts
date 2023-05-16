import { z } from 'zod';
import { BaseModel } from './BaseModel';

export const Post = BaseModel.extend({
	title: z.string(),
	description: z.string(),
});

export type PostType = z.infer<typeof Post>;
