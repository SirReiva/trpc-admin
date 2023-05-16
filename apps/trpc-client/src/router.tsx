import { createBrowserRouter } from 'react-router-dom';
import { BaseModelType } from '@trpc-shared/models/BaseModel';
import Login from './pages/login';
import buildNewFormModel from './app/form-model';

export const buildRouter = (models: Record<string, BaseModelType>) => {
	return createBrowserRouter(
		Object.entries(models)
			.map(([name, model]) => [
				{
					path: `/admin/${name}`,
					element: <div>List {name}</div>,
				},
				{
					path: `/admin/${name}/add`,
					Component: buildNewFormModel(model, name),
				},
			])
			.reduce(
				(acc, item) => [...acc, ...item],
				[
					{
						path: '/login',
						Component: Login,
					},
				]
			)
	);
};
