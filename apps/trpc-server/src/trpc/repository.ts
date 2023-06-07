import {
	BaseModelType,
	InferBaseModelType,
} from '@trpc-shared/models/BaseModel';
import {
	BaseAuthModelType,
	InferBaseAuthModelType,
} from '@trpc-shared/models/BaseAuthModel';
import { MaybePromise } from '@trpc/server';
import EventEmitter from 'events';
import { models } from '@trpc-shared/models';
import {
	buildInMemoryAuthRepository,
	buildInMemoryRepository,
} from '@trpc-server/test/InMemoryRepositories';
import { z } from 'zod';
import uuid from 'uuid-random';
import { MDXSchema, PasswordSchema } from '@trpc-shared/utils/schemas';

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
	cursorPagination(
		cursor: string | undefined | null,
		pageSize: number | null
	): MaybePromise<{ items: Array<T>; nextCursor: string | null }>;
	events: EventEmitter;
}

export interface AuthRepository<T extends InferBaseAuthModelType>
	extends Repository<T> {
	generateToken(
		identifier: string,
		password: string
	): MaybePromise<{ token: string }>;
}

type RecordRepositories<
	T extends Record<string, BaseModelType | BaseAuthModelType>
> = {
	[K in keyof T]: T[K] extends BaseAuthModelType
		? AuthRepository<z.infer<T[K]>>
		: T[K] extends BaseModelType
		? Repository<z.infer<T[K]>>
		: never;
};

const postRepo = new (buildInMemoryRepository<typeof models.post>())();
const authRepo = new (buildInMemoryAuthRepository<typeof models.auth>())();

authRepo.create({
	id: uuid(),
	identifier: 'admin',
	password: PasswordSchema.parse('1234'),
	role: 'ADMIN',
});

for (let index = 0; index < 1000; index++) {
	postRepo.create({
		id: uuid(),
		description: MDXSchema.parse('description ' + (index + 1)),
		title: 'title ' + (index + 1),
		editor: null,
		active: false,
	});
}

export const repositories: RecordRepositories<typeof models> = {
	auth: authRepo,
	post: postRepo,
} as const;

export const getRepository = <T extends keyof typeof repositories>(
	name: T
): (typeof repositories)[T] => repositories[name];
