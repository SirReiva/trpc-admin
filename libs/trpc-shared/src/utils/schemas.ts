import { createUniqueFieldSchema } from '@ts-react/form';
import { z } from 'zod';

export const PasswordSchema = createUniqueFieldSchema(
	z.string().min(4),
	'password'
);
