import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@rooms/rooms.interface';
import { RoomsService } from '@rooms/rooms.service';
import { CreateRoomInputDto, CreateRoomOutputDto } from '@rooms/dtos/create-room.dto';
import { PatchRoomInputDto, PatchRoomOutputDto } from '@rooms/dtos/patch-room.dto';
import { DeleteRoomOutputDto } from '@rooms/dtos/delete-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createRoom(
    @Req() requestWithUser: RequestWithUser,
    @Body() createRoomInputDto: CreateRoomInputDto,
  ): Promise<CreateRoomOutputDto> {
    return this.roomsService.createRoom(requestWithUser, createRoomInputDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getRooms(@Req() requestWithUser: RequestWithUser) {
    return this.roomsService.getRooms(requestWithUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getRoom(@Req() requestWithUser: RequestWithUser, @Param('id') roomId: string) {
    return this.roomsService.getRoom(requestWithUser, roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  async patchRoom(
    @Req() requestWithUser: RequestWithUser,
    @Body() patchRoomInputDto: PatchRoomInputDto,
  ): Promise<PatchRoomOutputDto> {
    return this.roomsService.patchRoom(requestWithUser, patchRoomInputDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteRoom(@Req() requestWithUser: RequestWithUser): Promise<DeleteRoomOutputDto> {
    return this.roomsService.deleteRoom(requestWithUser);
  }
}
