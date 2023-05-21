import { z } from 'zod';
import { PasswordSchema } from '../utils/schemas';
import { enumToTuple } from '../utils/enum';

enum ROLES_ENUM {
	ADMIN = 'ADMIN',
	WRITTER = 'WRITTER',
	READER = 'READER',
}

export const RoleSchema = z.enum(enumToTuple(ROLES_ENUM));
export type ROLES = z.infer<typeof RoleSchema>;

export const BaseAuthModel = z.object({
	id: z.string().uuid(),
	identifier: z.string().min(4),
	password: PasswordSchema,
	role: RoleSchema,
});

export type BaseAuthModelType = typeof BaseAuthModel;
export type InferBaseAuthModelType = z.infer<BaseAuthModelType>;
