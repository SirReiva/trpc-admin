import { ROLES } from '@trpc-shared/models/BaseAuthModel';
import { SignJWT, jwtVerify, decodeJwt } from 'jose';

export interface TokenPayload {
	identifier: string;
	id: string;
	role: ROLES;
}

export const signJWT = (
	payload: TokenPayload,
	key: string,
	duration: string | number
): Promise<string> => {
	const jwtSign = new SignJWT(payload as any);
	return jwtSign
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime(duration)
		.sign(Buffer.from(key));
};

export const verifyJWT = async (
	token: string,
	key: string
): Promise<TokenPayload> => {
	const data = await jwtVerify(token, Buffer.from(key));
	return data.payload as any as TokenPayload;
};

export const decodeJWT = (token: string): TokenPayload => {
	return decodeJwt(token) as any as TokenPayload;
};
