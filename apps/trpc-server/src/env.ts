import { z } from 'zod';

const EnvSchema = z.object({
	PORT: z.coerce.number().int(),
	DB_URL: z.string(),
});

export const ENV = EnvSchema.parse(process.env);
