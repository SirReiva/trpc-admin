import { typedObjectKeys } from '@trpc-shared/utils/object';
import { Route } from 'react-router-dom';
import ListModelBuilder from './app/list-model';
import NewFormModelBuilder from './app/new-form-model';
import { models } from '@trpc-shared/models';
import EditModelBuilder from './app/edit-form-model';

export const buildRouter = () => {
	return typedObjectKeys(models)
		.map(name => [
			<>
				<Route
					key={`${name.toString()}/new`}
					path={`${name.toString()}/new`}
					Component={NewFormModelBuilder(name)}
				/>
				<Route
					key={`${name.toString()}/edit`}
					path={`${name.toString()}/edit/:modelId`}
					Component={EditModelBuilder(name)}
				/>
				<Route
					key={`${name.toString()}`}
					path={`${name.toString()}`}
					Component={ListModelBuilder(name)}
				/>
			</>,
		])
		.reduce((acc, item) => [...acc, ...item], []);
};
