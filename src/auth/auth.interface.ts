import { Request } from 'express';

import { ValidateAuthOutputDto } from '@auth/dtos/validate-auth.dto';

/* Local Login Strategy */
export type RequestWithUser = Request & { user: ValidateAuthOutputDto };

/* Silent Refresh */
export interface RefreshTokenPayload {
  id: number;
  iat: string;
  exp: string;
}

/* JWT Strategy */
export interface Payload {
  id: number;
}

/* Google Strategy */
type GoogleUser = {
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
};

export type GoogleRequest = Request & { user: GoogleUser };
