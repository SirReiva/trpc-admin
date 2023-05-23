import {
	PasswordSchema,
	LongTextSchema,
	MDXSchema,
} from '@trpc-shared/utils/schemas';
import { RoleSchema } from '@trpc-shared/models/BaseAuthModel';
import { z } from 'zod';
import PasswordField from './components/PasswordField';
import SelectField from './components/SelectField';
import TextField from './components/TextField';
import TextAreaField from './components/TextAreaField';
import MDXField from './components/MDXField';

export const formMapping = [
	[PasswordSchema, PasswordField],
	[z.string(), TextField],
	[RoleSchema, SelectField],
	[LongTextSchema, TextAreaField],
	[MDXSchema, MDXField],
] as const;
