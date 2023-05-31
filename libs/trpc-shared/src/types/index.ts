import { BRAND, ZodBranded, ZodType } from 'zod';

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

type Basic = string | number | boolean | symbol | undefined | null;

type UnwrapObject<T> = {
	[K in keyof T]: T[K] extends BRAND<any> ? Omit<T[K], keyof BRAND<any>> : T[K];
};

type Unwrap<T> = T extends infer U & BRAND<any>
	? U
	: T extends Basic
	? T
	: T extends {}
	? UnwrapObject<T>
	: never;

export type InferTypeOf<T extends ZodType<any, any, any>> =
	T extends ZodBranded<infer U, any> ? U['_output'] : Unwrap<T['_output']>;
