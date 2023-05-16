import { Entries } from '@trpc-shared/types';

export const typedObjectEntries = <T extends object>(obj: T): Entries<T> =>
	Object.entries(obj) as Entries<T>;
