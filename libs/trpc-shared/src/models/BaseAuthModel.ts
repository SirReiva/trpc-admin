import { z } from 'zod';
import { PasswordSchema } from '../utils/schemas';

export enum ROLES {
	ADMIN = 'ADMIN',
	WRITTER = 'WRITTER',
	READER = 'READER',
}

export const BaseAuthModel = z.object({
	id: z.string().uuid(),
	identifier: z.string().min(4),
	password: PasswordSchema,
	role: z.nativeEnum(ROLES),
});

export type BaseAuthModelType = typeof BaseAuthModel;
export type InferBaseAuthModelType = z.infer<BaseAuthModelType>;
