import { FC } from 'react';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

export const withNoAuth = (Component: FC<any>) => (props: any) => {
	const { auth } = useAuth();

	if (auth) return <Navigate to='/admin' replace />;

	return <Component {...props} />;
};
