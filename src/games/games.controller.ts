import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@common/common.interface';
import { GamesService } from '@games/games.service';
import { CreateGameOutputDto } from '@games/dtos/create-game.dto';
import { GetGameInputDto, GetGameOutputDto } from '@games/dtos/get-game.dto';
import { PatchGameInputDto, PatchGameOutputDto } from '@games/dtos/patch-game.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  /* Create Game Controller */
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createGame(@Req() requestWithUser: RequestWithUser): Promise<CreateGameOutputDto> {
    return this.gamesService.createGame(requestWithUser);
  }

  /* Get Game Controller */
  @UseGuards(JwtAuthGuard)
  @Get('get')
  async getGame(
    @Req() requestWithUser: RequestWithUser,
    @Body() getGameInputDto: GetGameInputDto,
  ): Promise<GetGameOutputDto> {
    return this.gamesService.getGame(requestWithUser, getGameInputDto);
  }

  /* Patch Game Controller */
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async patchGame(
    @Req() requestWithUser: RequestWithUser,
    @Body() patchGameInputDto: PatchGameInputDto,
  ): Promise<PatchGameOutputDto> {
    return this.gamesService.patchGame(requestWithUser, patchGameInputDto);
  }
}
