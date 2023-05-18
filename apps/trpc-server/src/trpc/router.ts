import { BaseAuthModelType, ROLES } from '@trpc-shared/models/BaseAuthModel';
import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import {
	buildInMemoryAuthRepository,
	buildInMemoryRepository,
} from '../test/InMemoryRepositories';
import { AuthContextType } from './context';
import { AuthRepository, Repository } from './repository';
import { observable } from '@trpc/server/observable';
import { models } from '@trpc-shared/models';
import mapMapObject from 'just-map-object';
import uuid from 'uuid-random';

const t = initTRPC.context<AuthContextType>().create();

const proceduresBuilder = <T extends BaseModelType>(
	model: T,
	repository: Repository<z.infer<T>>
) => {
	return {
		onCreate: t.procedure.subscription(() => {
			return observable<z.infer<T>>(emit => {
				const onAdd = (data: z.infer<T>) => {
					emit.next(data);
				};
				repository.events.on('onCreate', onAdd);
				return () => {
					repository.events.off('onCreate', onAdd);
				};
			});
		}),
		onUpdate: t.procedure.subscription(() => {
			return observable<z.infer<T>>(emit => {
				const onAdd = (data: z.infer<T>) => {
					emit.next(data);
				};
				repository.events.on('onUpdate', onAdd);
				return () => {
					repository.events.off('onUpdate', onAdd);
				};
			});
		}),
		onDelete: t.procedure.subscription(() => {
			return observable<z.infer<T>>(emit => {
				const onAdd = (data: z.infer<T>) => {
					emit.next(data);
				};
				repository.events.on('onDelete', onAdd);
				return () => {
					repository.events.off('onDelete', onAdd);
				};
			});
		}),
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

const buildLoginProcedure = <T extends BaseAuthModelType>(
	model: T,
	repository: AuthRepository<z.infer<T>>
) => ({
	login: t.procedure
		.input(model.pick({ identifier: true, password: true }))
		.output(z.object({ token: z.string() }))
		.mutation(({ input }) =>
			repository.generateToken(input.identifier, input.password)
		),
});

export const buildAuthModel = <T extends BaseAuthModelType>(
	model: T,
	repository: AuthRepository<z.infer<T>>
) => ({
	...proceduresBuilder(model, repository),
	...buildLoginProcedure(model, repository),
});

type ResultRouteModel<T extends BaseModelType> = ReturnType<
	typeof proceduresBuilder<T>
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
			[key]: t.router(proceduresBuilder(item.model, item.repository)),
		}),
		{} as BuildType<T>
	);
};

export const modelsWithRepositories = <
	T extends Record<string, BaseModelType>,
	P extends keyof T
>(
	models: T,
	repositories: Record<P, Repository<z.infer<T[P]>>>
): Record<P, { model: T[P]; repository: Repository<z.infer<T[P]>> }> =>
	mapMapObject(models, (name, model) => ({
		model,
		repository: repositories[name as keyof typeof repositories],
	})) as Record<P, { model: T[P]; repository: Repository<z.infer<T[P]>> }>;

const buildAuthModelRouter = <T extends BaseAuthModelType>(
	authModel: T,
	repository: AuthRepository<z.infer<T>>
) => t.router(buildAuthModel(authModel, repository));

const postRepo = new (buildInMemoryRepository<typeof models.common.post>())();
const authRepo = new (buildInMemoryAuthRepository<typeof models.auth>())();
authRepo.create({
	id: uuid(),
	identifier: 'admin',
	password: '123456789',
	role: ROLES.ADMIN,
});

export const appRouter = t.router({
	...buildModelsRouter(
		modelsWithRepositories(models.common, {
			post: postRepo,
		})
	),
	auth: buildAuthModelRouter(models.auth, authRepo),
});
