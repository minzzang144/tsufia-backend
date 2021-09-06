import { CoreOutput } from '@common/dtos/core.dto';
import { Game } from '@games/entities/game.entity';

export class PatchGameOutputDto extends CoreOutput {
  game?: Game;
}
