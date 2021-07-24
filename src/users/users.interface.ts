import { User } from '@users/entities/user.entity';

export type RequestWithUserData = Request & { user: User };
