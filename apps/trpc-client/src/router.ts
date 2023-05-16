import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { typedObjectEntries } from '@trpc-shared/utils/object';
import { createBrowserRouter } from 'react-router-dom';
import buildNewFormModel from './app/form-model';
import Login from './app/pages/login';
import { TrpcModels } from './trpc';

export const buildRouter = (models: Record<TrpcModels, BaseModelType>) => {
	return createBrowserRouter(
		typedObjectEntries(models)
			.map(([name, model]) => [
				{
					path: `/admin/${name.toString()}/new`,
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
