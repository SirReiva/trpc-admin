import { ToUnion, TuplifyUnion } from '@trpc-shared/types';

export const enumToTuple = <T extends Record<string, string>>(
	objEnum: T
): TuplifyUnion<ToUnion<T>> =>
	Object.values(objEnum) as any as TuplifyUnion<ToUnion<T>>;
