import { Request } from 'express';

type UserId = { id: number };

export type RequestWithUser = Request & { user: UserId };
