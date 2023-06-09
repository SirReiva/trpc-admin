import { FC } from 'react';
import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

export const withAuth = (Component: FC<any>) => (props: any) => {
	const { auth } = useAuth();

	if (!auth) return <Navigate to='/login' replace />;

	return <Component {...props} />;
};
