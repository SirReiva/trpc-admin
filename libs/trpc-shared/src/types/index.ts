export type MaybePromise<T> = T | Promise<T>;
export type Entries<T> = {
	[K in keyof T]: [K, T[K]];
}[keyof T][];

export type ToUnion<T extends Record<string, string | number>> = keyof {
	[Prop in keyof T as `${T[Prop]}`]: Prop;
};
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;
type LastOf<T> = UnionToIntersection<
	T extends any ? () => T : never
> extends () => infer R
	? R
	: never;

type Push<T extends any[], V> = [...T, V];

export type TuplifyUnion<
	T,
	L = LastOf<T>,
	N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<TuplifyUnion<Exclude<T, L>>, L>;

export type First<T> = T extends [infer U, ...any[]] ? U : never;
