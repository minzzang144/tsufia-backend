import { IsOptional } from 'class-validator';

import { CoreOutput } from '@common/dtos/core.dto';
import { User } from '@users/entities/user.entity';

// export type RequestWithUserData = Request & { user: User };

export class GetWillPatchUserOutput extends CoreOutput {
  @IsOptional()
  user?: User;
}
