import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { MaybePromise, TRPCError } from '@trpc/server';
import { z } from 'zod';
import { AuthRepository, Repository } from '../trpc/repository';
import { BaseAuthModelType } from '@trpc-shared/models/BaseAuthModel';
import { signJWT } from '@trpc-shared/utils/jwt';
import EventEmitter from 'events';

export const buildInMemoryRepository = <T extends BaseModelType>() => {
	let store: z.infer<T>[] = [];
	return class implements Repository<z.infer<T>> {
		events = new EventEmitter();
		create(data: z.infer<T>): MaybePromise<void> {
			store.push(data);
		}
		deleteById(id: string): MaybePromise<void> {
			store = store.filter(it => it.id !== id);
		}
		findById(id: string): MaybePromise<z.infer<T> | null> {
			return store.find(it => it.id === id) || null;
		}

		updateById(id: string, data: Omit<z.infer<T>, 'id'>): MaybePromise<void> {
			const index = store.findIndex(it => it.id === id);
			if (!store[index]) return;
			const newItem = {
				id,
				...data,
			} as z.infer<T>;
			store[index] = newItem;
		}
		list(
			page: number,
			pageSize: number
		): MaybePromise<{ data: z.infer<T>[]; total: number; page: number }> {
			return {
				data: store.slice((page - 1) * pageSize, page * pageSize),
				page,
				total: store.length,
			};
		}
	};
};

export const buildInMemoryAuthRepository = <T extends BaseAuthModelType>() => {
	let store: z.infer<T>[] = [];
	return class implements AuthRepository<z.infer<T>> {
		events = new EventEmitter();
		create(data: z.infer<T>): MaybePromise<void> {
			store.push(data);
		}
		deleteById(id: string): MaybePromise<void> {
			store = store.filter(it => it.id !== id);
		}
		findById(id: string): MaybePromise<z.infer<T> | null> {
			const item = store.find(it => it.id === id);
			if (!item) return null;

			return {
				...item,
				password: '*********',
			};
		}

		updateById(id: string, data: Omit<z.infer<T>, 'id'>): MaybePromise<void> {
			const index = store.findIndex(it => it.id === id);
			if (!store[index]) return;
			const newItem = {
				id,
				...data,
			} as z.infer<T>;
			store[index] = newItem;
		}
		list(
			page: number,
			pageSize: number
		): MaybePromise<{ data: z.infer<T>[]; total: number; page: number }> {
			return {
				data: store
					.slice((page - 1) * pageSize, page * pageSize)
					.map(item => ({ ...item, password: '*******' })),
				page,
				total: store.length,
			};
		}
		async generateToken(
			identifier: string,
			password: string
		): Promise<{ token: string }> {
			const user = store.find(
				it => it.identifier === identifier && it.password === password
			);
			if (!user)
				throw new TRPCError({
					code: 'UNAUTHORIZED',
				});

			return {
				token: await signJWT(
					{ identifier, role: user.role, id: user.id },
					'ZASCA'
				),
			};
		}
	};
};
