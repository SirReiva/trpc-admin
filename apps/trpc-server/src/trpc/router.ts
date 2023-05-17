import { BaseAuthModelType } from '@trpc-shared/models/BaseAuthModel';
import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { User } from '@trpc-shared/models/User';
import { Post } from '@trpc-shared/models/Post';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import {
	buildInMemoryAuthRepository,
	buildInMemoryRepository,
} from '../test/InMemoryRepositories';
import { AuthContextType } from './context';
import { AuthRepository, Repository } from './repository';

const t = initTRPC.context<AuthContextType>().create();

const proceduresBuilder = <T extends BaseModelType>(
	model: T,
	repository: Repository<z.TypeOf<T>>
) => {
	return {
		create: t.procedure
			.input(model)
			.output(z.void())
			.mutation(({ input }) => repository.create(input as any)),
		updateById: t.procedure
			.input(
				z.object({
					id: z.string(),
					data: model.omit({ id: true }),
				})
			)
			.output(z.void())
			.mutation(({ input }) =>
				repository.updateById(input.id, input.data as any)
			),
		deleteById: t.procedure
			.input(
				z.object({
					id: z.string(),
				})
			)
			.output(z.void())
			.mutation(({ input }) => repository.deleteById(input.id)),
		getById: t.procedure
			.input(
				z.object({
					id: z.string(),
				})
			)
			.output(z.nullable(model))
			.query(({ input }) => repository.findById(input.id)),
		list: t.procedure
			.input(
				z.object({
					page: z.number(),
					pageSize: z.number(),
				})
			)
			.output(
				z.object({
					total: z.number(),
					page: z.number(),
					data: z.array(model),
				})
			)
			.query(({ input }) => repository.list(input.page, input.pageSize)),
	};
};

const buildModelrouter = <T extends BaseModelType>(
	model: T,
	repository: Repository<z.infer<T>>
) => t.router(proceduresBuilder<T>(model, repository));

const buildAuthModel = <T extends BaseAuthModelType>(
	model: T,
	repository: AuthRepository<z.infer<T>>
) => ({
	...buildModelrouter(model, repository),
	login: t.procedure
		.input(model.pick({ identifier: true, password: true }))
		.output(z.object({ token: z.string() }))
		.mutation(({ input }) =>
			repository.generateToken(input.identifier, input.password)
		),
});

type ResultRouteModel<T extends BaseModelType> = ReturnType<
	typeof buildModelrouter<T>
>;

type RouterBuilder<T extends BaseModelType> = {
	model: T;
	repository: Repository<z.infer<T>>;
};
type RouterMoldesBuilder = Record<string, RouterBuilder<any>>;

type BuildType<T extends RouterMoldesBuilder> = {
	[P in keyof T]: T[P] extends RouterBuilder<infer U>
		? ResultRouteModel<U>
		: never;
};

const buildModelsRouter = <T extends RouterMoldesBuilder>(
	rMb: T
): BuildType<T> => {
	return Object.entries(rMb).reduce(
		(acc, [key, item]) => ({
			...acc,
			[key]: buildModelrouter(item.model, item.repository),
		}),
		{} as BuildType<T>
	);
};

const PostClassRepo = buildInMemoryRepository<typeof Post>();
const AuthClassRepo = buildInMemoryAuthRepository<typeof User>();

export const appRouter = t.router({
	...buildModelsRouter({
		post: {
			model: Post,
			repository: new PostClassRepo(),
		},
	}),
	auth: buildAuthModel(User, new AuthClassRepo()),
});
