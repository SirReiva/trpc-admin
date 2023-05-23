import { models } from '@trpc-shared/models';
import { BaseAuthModelType } from '@trpc-shared/models/BaseAuthModel';
import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { TRPCError, initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import mapMapObject from 'just-map-object';
import uuid from 'uuid-random';
import { z } from 'zod';
import {
	buildInMemoryAuthRepository,
	buildInMemoryRepository,
} from '../test/InMemoryRepositories';
import { AuthContextType } from './context';
import { AuthRepository, Repository } from './repository';
import { logger } from '../logger';

const t = initTRPC.context<AuthContextType>().create();

const loggerMiddleware = t.middleware(async opts => {
	const start = Date.now();

	const result = await opts.next();

	const durationMs = Date.now() - start;
	const meta = {
		path: opts.path,
		type: opts.type,
		durationMs,
		input: opts.input,
		output: (result as any).data,
		error: (result as any).error,
	};

	result.ok
		? logger.info(meta, 'OK request:')
		: logger.error(meta, 'Non-OK request');

	return result;
});

const authMiddleware = t.middleware(({ ctx, next }) => {
	if (!ctx.auth) throw new TRPCError({ code: 'UNAUTHORIZED' });
	return next();
});

const baseProcedure = t.procedure.use(loggerMiddleware);
const protectedProcedure = t.procedure
	.use(loggerMiddleware)
	.use(authMiddleware);

const proceduresBuilder = <T extends BaseModelType>(
	model: T,
	repository: Repository<z.infer<T>>
) => {
	return {
		onCreate: protectedProcedure.subscription(() => {
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
		onUpdate: protectedProcedure.subscription(() => {
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
		onDelete: protectedProcedure.subscription(() => {
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
		create: protectedProcedure
			.input(model)
			.output(z.void())
			.mutation(({ input }) => repository.create(input as any)),
		updateById: protectedProcedure
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
		deleteById: protectedProcedure
			.input(
				z.object({
					id: z.string(),
				})
			)
			.output(z.void())
			.mutation(({ input }) => repository.deleteById(input.id)),
		getById: protectedProcedure
			.input(
				z.object({
					id: z.string(),
				})
			)
			.output(z.nullable(model))
			.query(({ input }) => repository.findById(input.id)),
		list: protectedProcedure
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
	login: baseProcedure
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
	password: '1234',
	role: 'ADMIN',
});

for (let index = 0; index < 1000; index++) {
	postRepo.create({
		id: uuid(),
		description: 'decription' + (index + 1),
		title: 'title' + (index + 1),
	});
}

export const appRouter = t.router({
	...buildModelsRouter(
		modelsWithRepositories(models.common, {
			post: postRepo,
		})
	),
	auth: buildAuthModelRouter(models.auth, authRepo),
});
