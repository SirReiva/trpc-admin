import { initTRPC } from '@trpc/server';
import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { User } from '@trpc-shared/models/User';
import { AuthContextType } from './context';
import { Repository } from './repository';
import { z } from 'zod';

const t = initTRPC.context<AuthContextType>().create();

export const buildModelrouter = <T extends BaseModelType>(
	model: T,
	repository: Repository<z.infer<T>>
) => {
	return t.router({
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
	});
};

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
			[key]: item,
		}),
		{} as BuildType<T>
	);
};

export const appRouter = t.router(
	buildModelsRouter({
		user: {
			model: User,
			repository: {} as any,
		},
	})
);
