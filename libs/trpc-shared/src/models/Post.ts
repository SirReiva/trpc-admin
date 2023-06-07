import { z } from 'zod';
import { BaseModel } from './BaseModel';
import { MDXSchema, referenceTo } from '@trpc-shared/utils/schemas';

const AuthorReferenceSchema = referenceTo('auth');

export const Post = BaseModel.extend({
	title: z.string().describe('Título // Título del post'),
	description: MDXSchema.describe('Descripción // Texto del post'),
	editor: AuthorReferenceSchema.nullable().describe('Autor // Autor del post'),
	active: z.boolean().describe('Active'),
});

export type PostType = z.infer<typeof Post>;
