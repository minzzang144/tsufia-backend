import { PickType } from '@nestjs/mapped-types';

import { Chat } from '@chats/entities/chat.entity';
import { CoreOutput } from '@common/dtos/core.dto';

export class CreateChatInputDto extends PickType(Chat, ['content']) {}

export class CreateChatOutputDto extends CoreOutput {
  chat?: Chat;
}
