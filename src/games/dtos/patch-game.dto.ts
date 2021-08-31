import { CoreOutput } from '@common/dtos/core.dto';
import { Game } from '@games/entities/game.entity';

export class PatchGameInputDto {
  roomId: number;
}

export class PatchGameOutputDto extends CoreOutput {
  game?: Game;
}
