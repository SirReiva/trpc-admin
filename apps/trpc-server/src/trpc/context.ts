import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { verify, VerifyOptions } from 'jsonwebtoken';

const verifyAsync = <T extends object = any>(
	token: string,
	secret: string,
	options?: VerifyOptions & { complete: true }
): Promise<T> => {
	return new Promise<T>((resolve, reject) =>
		verify(token, secret, options, (err, decoded) =>
			err ? reject(err) : resolve(decoded as T)
		)
	);
};

export interface AuthContext {
	id: string;
	role: string;
}

export const createContext = async ({
	req,
	res,
}: CreateFastifyContextOptions) => {
	const token = req.headers.authorization;
	let auth: AuthContext | undefined;
	if (token) {
		auth = await verifyAsync<AuthContext>(token, '').catch(() => undefined);
	}

	return { req, res, auth };
};

export type AuthContextType = inferAsyncReturnType<typeof createContext>;
