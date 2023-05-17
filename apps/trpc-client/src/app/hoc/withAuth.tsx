import { FC } from 'react';

export const withAuth = (Component: FC<any>) => (props: any) =>
	<Component {...props} />;
