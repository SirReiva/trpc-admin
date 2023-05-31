import { MaybePromise } from '@trpc-shared/types';

export const isPromise = <T>(data: MaybePromise<T>): data is Promise<T> =>
	data instanceof Promise;

export const executeAfter = <T>(
	promiseOrResult: MaybePromise<T>,
	afterFn: () => void
): MaybePromise<T> => {
	if (!isPromise(promiseOrResult)) {
		afterFn();
		return promiseOrResult;
	}

	return promiseOrResult.then(data => {
		afterFn();
		return data;
	});
};
