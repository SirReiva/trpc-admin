import { PasswordSchema } from '@trpc-shared/utils/schemas';
import PasswordField from './components/PasswordField';
import TextField from './components/TextField';
import { z } from 'zod';

export const formMapping = [
	[PasswordSchema, PasswordField],
	[z.string(), TextField],
] as const;
