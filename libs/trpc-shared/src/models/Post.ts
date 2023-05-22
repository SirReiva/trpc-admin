import { z } from 'zod';
import { BaseModel } from './BaseModel';
import { LongTextSchema } from '../utils/schemas';

export const Post = BaseModel.extend({
	title: z.string(),
	description: LongTextSchema,
});

export type PostType = z.infer<typeof Post>;
