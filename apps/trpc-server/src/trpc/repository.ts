import { InferBaseModelType } from '@trpc-shared/models/BaseModel';
import { InferBaseAuthModelType } from '@trpc-shared/models/BaseAuthModel';
import { MaybePromise } from '@trpc/server';
import EventEmitter from 'events';

export interface Repository<T extends InferBaseModelType> {
	findById(id: string): MaybePromise<T | null>;
	list(
		page: number,
		pageSize: number
	): MaybePromise<{
		data: Array<T>;
		total: number;
		page: number;
	}>;
	deleteById(id: string): MaybePromise<void>;
	create(data: T): MaybePromise<void>;
	updateById(id: string, data: Omit<T, 'id'>): MaybePromise<void>;
	events: EventEmitter;
}

export interface AuthRepository<T extends InferBaseAuthModelType>
	extends Repository<T> {
	generateToken(
		identifier: string,
		password: string
	): MaybePromise<{ token: string }>;
}
