import { z } from 'zod';
import { MDXSchema } from '../utils/schemas';
import { BaseModel } from './BaseModel';

export const Post = BaseModel.extend({
	title: z.string(),
	description: MDXSchema,
});

export type PostType = z.infer<typeof Post>;
