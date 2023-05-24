import { models } from '@trpc-shared/models';
import { BaseAuthModelType } from '@trpc-shared/models/BaseAuthModel';
import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { TRPCError, initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { z } from 'zod';
import { logger } from '../logger';
import { AuthContextType } from './context';
import {
	AuthRepository,
	Repository,
	getRepository,
	repositories,
} from './repository';
import { capitalizeFirstLetter } from '@trpc-shared/utils/string';

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

	if (result.ok) {
		if (opts.type === 'mutation') {
			const parts = opts.path.split('.');
			const action = capitalizeFirstLetter(parts.at(-1) as string);
			const model = parts.at(0) as keyof typeof repositories;
			const repo = getRepository(model);
			repo.events.emit(`on${action}`);
			logger.info(meta, 'OK request:');
		}
	} else {
		logger.error(meta, 'Non-OK request');
	}

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

const buildModelProcedure = <T extends BaseModelType>(
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

export const buildAuthProcedure = <T extends BaseAuthModelType>(
	model: T,
	repository: AuthRepository<z.infer<T>>
) => ({
	...buildModelProcedure(model, repository),
	...buildLoginProcedure(model, repository),
});

export const appRouter = t.router({
	post: t.router(buildModelProcedure(models.post, getRepository('post'))),
	auth: t.router(buildAuthProcedure(models.auth, getRepository('auth'))),
});
