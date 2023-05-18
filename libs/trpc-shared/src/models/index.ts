import { Post } from './Post';
import { User } from './User';

export const models = {
	common: {
		post: Post,
	},
	auth: User,
} as const;
