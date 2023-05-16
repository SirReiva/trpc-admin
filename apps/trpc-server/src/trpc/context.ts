import { ROLES } from '@trpc-shared/models/BaseAuthModel';
import { verifyJWT } from '@trpc-shared/utils/jwt';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export interface AuthContext {
	identifier: string;
	role: ROLES;
}

export const createContext = async ({
	req,
	res,
}: CreateFastifyContextOptions) => {
	const token = req.headers.authorization;
	let auth: AuthContext | undefined;
	if (token) {
		auth = await verifyJWT<AuthContext>(token, 'ZASCA').catch(() => undefined);
	}

	return { req, res, auth };
};

export type AuthContextType = inferAsyncReturnType<typeof createContext>;
