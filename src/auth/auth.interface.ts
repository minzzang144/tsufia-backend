import { ValidateAuthOutputDto } from '@auth/dtos/validate-auth.dto';

export type RequestWithUser = Request & { user: ValidateAuthOutputDto };
