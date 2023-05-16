import { Repository } from '@trpc-server/trpc/repository';
import { BaseModelType } from '@trpc-shared/models/BaseModel';
import { MaybePromise } from '@trpc/server';
import { z } from 'zod';

export const buildInMemoryRepository = <T extends BaseModelType>() => {
	let store: z.infer<T>[] = [];
	return class implements Repository<z.infer<T>> {
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
