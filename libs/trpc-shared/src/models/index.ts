import { Post } from './Post';
import { User } from './User';

export const models = {
	post: Post,
	auth: User,
} as const;

export type TrpcModels = keyof typeof models;
