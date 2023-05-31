import {
	PasswordSchema,
	LongTextSchema,
	MDXSchema,
	ReferenceSchema,
} from '@trpc-shared/utils/schemas';
import { RoleSchema } from '@trpc-shared/models/BaseAuthModel';
import { z } from 'zod';
import PasswordField from './components/PasswordField';
import SelectField from './components/SelectField';
import TextField from './components/TextField';
import TextAreaField from './components/TextAreaField';
import MDXField from './components/MDXField';
import ReferenceField from './components/ReferenceField';

export const formMapping = [
	[PasswordSchema, PasswordField] as const,
	[z.string(), TextField] as const,
	[RoleSchema, SelectField] as const,
	[LongTextSchema, TextAreaField] as const,
	[MDXSchema, MDXField] as const,
	[ReferenceSchema, ReferenceField] as const,
] as const;
