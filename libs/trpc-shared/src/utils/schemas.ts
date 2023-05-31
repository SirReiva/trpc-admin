import { createUniqueFieldSchema } from '@ts-react/form';
import zod, {
	ZodBranded,
	ZodNullable,
	ZodOptional,
	ZodString,
	ZodTypeAny,
	z,
} from 'zod';
import { register } from 'zod-metadata';
register(zod);

export const PasswordSchema = createUniqueFieldSchema(
	z.string().min(4),
	'password'
);

export const LongTextSchema = createUniqueFieldSchema(
	z.string().min(4),
	'longtext'
);

export const MDXSchema = createUniqueFieldSchema(z.string().min(4), 'mdx');

export const ReferenceSchema = createUniqueFieldSchema(
	z.string().uuid(),
	'reference'
);

export const referenceTo = (modelName: string) =>
	createUniqueFieldSchema(
		z.string().uuid().meta({ modelName }) as any as ZodString,
		'reference'
	);

type UnWrapAll<T> = T extends ZodOptional<infer O>
	? UnWrapAll<O>
	: T extends ZodNullable<infer N>
	? UnWrapAll<N>
	: T extends ZodBranded<infer B, any>
	? UnWrapAll<B>
	: T extends ZodTypeAny
	? T
	: never;

export const unWrapAll = <T extends ZodTypeAny>(model: T): UnWrapAll<T> => {
	let resulModel = model;
	while (typeof (resulModel as any)?.unwrap === 'function') {
		resulModel = (resulModel as any).unwrap();
	}
	return resulModel as UnWrapAll<T>;
};
