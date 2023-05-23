import { createUniqueFieldSchema } from '@ts-react/form';
import { ZodString, z } from 'zod';

export const PasswordSchema = createUniqueFieldSchema(
	z.string().min(4),
	'password'
) as any as ZodString;

export const LongTextSchema = createUniqueFieldSchema(
	z.string().min(4),
	'longtext'
) as any as ZodString;

export const MDXSchema = createUniqueFieldSchema(
	z.string().min(4),
	'mdx'
) as any as ZodString;
