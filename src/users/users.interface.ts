import { Request } from 'express';

type UserWithId = { id: number };

export type RequestWithUserData = Request & { user: UserWithId };
