import { BaseAuthModelType } from '@trpc-shared/models/BaseAuthModel';
import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { signJWT } from '@trpc-shared/utils/jwt';
import { MaybePromise, TRPCError } from '@trpc/server';
import EventEmitter from 'events';
import { z } from 'zod';
import { AuthRepository, Repository } from '../trpc/repository';
import argon2 from 'argon2';

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
		cursorPagination(
			cursor: string | null | undefined,
			pageSize: number | null
		): MaybePromise<{
			items: z.infer<T>[];
			nextCursor: string | null;
		}> {
			const start = Math.max(
				cursor ? store.findIndex(it => it.id === cursor) : 0,
				0
			);
			const size = pageSize ?? 10;
			return {
				items: store.slice(start, start + size),
				nextCursor: store[start + size]?.id || null,
			};
		}
	};
};

export const buildInMemoryAuthRepository = <T extends BaseAuthModelType>() => {
	let store: z.infer<T>[] = [];
	return class implements AuthRepository<z.infer<T>> {
		events = new EventEmitter();
		async create(data: z.infer<T>): Promise<void> {
			store.push({
				...data,
				password: await argon2.hash(data.password),
			});
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
		cursorPagination(
			cursor: string | null | undefined,
			pageSize: number | null
		): MaybePromise<{
			items: z.infer<T>[];
			nextCursor: string | null;
		}> {
			const start = Math.max(
				cursor ? store.findIndex(it => it.id === cursor) : 0,
				0
			);
			const size = pageSize ?? 10;
			return {
				items: store
					.slice(start, start + size)
					.map(item => ({ ...item, password: '*******' })),
				nextCursor: store[start + size]?.id || null,
			};
		}
		async generateToken(
			identifier: string,
			password: string
		): Promise<{ token: string }> {
			const user = store.find(it => it.identifier === identifier);
			if (!user)
				throw new TRPCError({
					code: 'UNAUTHORIZED',
				});
			if (!(await argon2.verify(user.password, password)))
				throw new TRPCError({
					code: 'UNAUTHORIZED',
				});

			return {
				token: await signJWT(
					{ identifier, role: user.role, id: user.id },
					'ZASCA',
					'24h'
				),
			};
		}
	};
};
