import { Chat } from '@chats/entities/chat.entity';
import { CoreOutput } from '@common/dtos/core.dto';
import { IsArray, IsOptional } from 'class-validator';

export class GetChatsOutputDto extends CoreOutput {
  @IsOptional()
  @IsArray()
  chats?: Chat[];
}
