import { TokenPayload, decodeJWT } from '@trpc-shared/utils/jwt';
import {
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useState,
} from 'react';

export interface AuthData {
	token: string;
	data: TokenPayload;
}

export type AuthContext = {
	auth?: AuthData;
	logIn: (token: string) => void;
	logOut: () => void;
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

	const logIn = useCallback(
		(token: string) => {
			const data = decodeJWT(token);
			localStorage.setItem('token', token);
			setAuthState({
				token,
				data,
			});
		},
		[setAuthState]
	);

	const logOut = useCallback(() => {
		localStorage.removeItem('token');
		setAuthState(undefined);
	}, [setAuthState]);

	return (
		<authContext.Provider value={{ auth, logIn, logOut }}>
			{children}
		</authContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(authContext);
};

export default AuthProvider;
