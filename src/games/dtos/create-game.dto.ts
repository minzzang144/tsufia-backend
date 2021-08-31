import { CoreOutput } from '@common/dtos/core.dto';
import { Game } from '@games/entities/game.entity';
import { IsOptional } from 'class-validator';

export class CreateGameOutputDto extends CoreOutput {
  @IsOptional()
  game?: Game;
}
