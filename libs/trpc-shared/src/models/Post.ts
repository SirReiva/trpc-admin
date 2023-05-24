import { z } from 'zod';
import { BaseModel } from './BaseModel';
import { MDXSchema } from '@trpc-shared/utils/schemas';

export const Post = BaseModel.extend({
	title: z.string(),
	description: MDXSchema,
});

export type PostType = z.infer<typeof Post>;
