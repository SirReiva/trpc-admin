import { ROLES } from '@trpc-shared/models/BaseAuthModel';
import { TokenPayload, verifyJWT } from '@trpc-shared/utils/jwt';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { IncomingMessage } from 'http';
import { parse } from 'url';

export interface AuthContext {
	identifier: string;
	role: ROLES;
}

export const createContext = async ({
	req,
	res,
}: CreateFastifyContextOptions | CreateWSSContextFnOptions) => {
	let token: string | undefined;
	if (req instanceof IncomingMessage) {
		const query = parse(req.url || '/', true).query;
		token = query.token as string | undefined;
	} else {
		token = req.headers.authorization;
	}
	let auth: TokenPayload | undefined;
	if (token) {
		auth = await verifyJWT(token, 'ZASCA').catch(() => undefined);
	}

	return { req, res, auth };
};

export type AuthContextType = inferAsyncReturnType<typeof createContext>;
