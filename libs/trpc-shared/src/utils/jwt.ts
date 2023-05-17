import { SignJWT, jwtVerify, decodeJwt } from 'jose';
import { ROLES } from '../models/BaseAuthModel';

export interface TokenPayload {
	identifier: string;
	role: ROLES;
}

export const signJWT = (
	payload: TokenPayload,
	key: string
): Promise<string> => {
	const jwtSign = new SignJWT(payload as any);
	return jwtSign
		.setProtectedHeader({ alg: 'HS256' })
		.setExpirationTime('24h')
		.sign(Buffer.from(key));
};

export const verifyJWT = (
	token: string,
	key: string
): Promise<TokenPayload> => {
	return jwtVerify(token, Buffer.from(key)).then(
		data => data.payload as any as TokenPayload
	);
};

export const decodeJWT = (token: string): TokenPayload => {
	return decodeJwt(token) as any as TokenPayload;
};
