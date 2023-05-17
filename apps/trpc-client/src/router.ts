import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { typedObjectEntries } from '@trpc-shared/utils/object';
import bulidListModel from './app/list-model';
import buildNewFormModel from './app/new-form-model';
import { TrpcModels } from './trpc';

export const buildRouter = (models: Record<TrpcModels, BaseModelType>) => {
	return typedObjectEntries(models)
		.map(([name, model]) => [
			{
				path: `${name.toString()}/new`,
				Component: buildNewFormModel(model, name),
			},
			{
				path: `${name.toString()}`,
				Component: bulidListModel(model, name),
			},
		])
		.reduce((acc, item) => [...acc, ...item], []);
};
