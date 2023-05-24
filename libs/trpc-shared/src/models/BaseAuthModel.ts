import { enumToTuple } from '@trpc-shared/utils/enum';
import { PasswordSchema } from '@trpc-shared/utils/schemas';
import { z } from 'zod';

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
