import { Request } from 'express';

type UserWithId = { id: number };

export type RequestWithUser = Request & { user: UserWithId };
