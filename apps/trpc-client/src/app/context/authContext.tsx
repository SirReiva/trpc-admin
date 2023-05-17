import { TokenPayload, decodeJWT } from '@trpc-shared/utils/jwt';
import { ReactNode, createContext, useContext, useState } from 'react';

export interface AuthData {
	token: string;
	data: TokenPayload;
}

export type AuthContext = {
	auth?: AuthData;
	setAuth: (token: string | undefined) => void;
};

const authContext = createContext<AuthContext>(null as any);

const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [auth, setAuthState] = useState<AuthData | undefined>(() => {
		const token = localStorage.getItem('token');
		if (!token) return undefined;
		const data = decodeJWT(token);
		return {
			token,
			data,
		};
	});

	const setAuth = (token: string | undefined) => {
		if (!token) {
			localStorage.removeItem('token');
			setAuthState(undefined);
		} else {
			const data = decodeJWT(token);
			setAuthState({
				token,
				data,
			});
		}
	};

	return (
		<authContext.Provider value={{ auth, setAuth }}>
			{children}
		</authContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(authContext);
};

export default AuthProvider;
