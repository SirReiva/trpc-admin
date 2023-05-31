import { typedObjectKeys } from '@trpc-shared/utils/object';
import { Route } from 'react-router-dom';
import bulidListModel from './app/list-model';
import buildNewFormModel from './app/new-form-model';
import { models } from '@trpc-shared/models';

export const buildRouter = () => {
	return typedObjectKeys(models)
		.map(name => [
			<>
				<Route
					key={`${name.toString()}/new`}
					path={`${name.toString()}/new`}
					Component={buildNewFormModel(name)}
				/>
				<Route
					key={`${name.toString()}`}
					path={`${name.toString()}`}
					Component={bulidListModel(name)}
				/>
			</>,
		])
		.reduce((acc, item) => [...acc, ...item], []);
};
