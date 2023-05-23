import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { typedObjectEntries } from '@trpc-shared/utils/object';
import bulidListModel from './app/list-model';
import buildNewFormModel from './app/new-form-model';
import { TrpcModels } from './trpc';
import { Route } from 'react-router-dom';

export const buildRouter = (models: Record<TrpcModels, BaseModelType>) => {
	return typedObjectEntries(models)
		.map(([name, model]) => [
			<>
				<Route
					key={`${name.toString()}/new`}
					path={`${name.toString()}/new`}
					Component={buildNewFormModel(model, name)}
				/>
				<Route
					key={`${name.toString()}`}
					path={`${name.toString()}`}
					Component={bulidListModel(model, name)}
				/>
			</>,
		])
		.reduce((acc, item) => [...acc, ...item], []);
};
