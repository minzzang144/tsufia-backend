import { Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@common/common.interface';
import { GamesService } from '@games/games.service';
import { CreateGameOutputDto } from '@games/dtos/create-game.dto';
import { PatchGameOutputDto } from '@games/dtos/patch-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  /* Create Game Controller */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createGame(@Req() requestWithUser: RequestWithUser): Promise<CreateGameOutputDto> {
    return this.gamesService.createGame(requestWithUser);
  }

  /* Patch Game Controller */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/update')
  async patchGame(@Req() requestWithUser: RequestWithUser, @Param('id') id: string): Promise<PatchGameOutputDto> {
    return this.gamesService.patchGame(requestWithUser, id);
  }
}
