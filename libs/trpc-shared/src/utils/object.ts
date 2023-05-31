import { TuplifyUnion } from '../types';
import { Entries } from '../types';

export const typedObjectEntries = <T extends object>(obj: T): Entries<T> =>
	Object.entries(obj) as Entries<T>;

export const typedObjectKeys = <T extends Record<string, any>>(
	obj: T
): TuplifyUnion<keyof T> => Object.keys(obj) as TuplifyUnion<keyof T>;
