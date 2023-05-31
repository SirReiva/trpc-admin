import { z } from 'zod';
import { BaseAuthModel } from './BaseAuthModel';

export const User = BaseAuthModel.extend({});

export type UserType = z.infer<typeof User>;
