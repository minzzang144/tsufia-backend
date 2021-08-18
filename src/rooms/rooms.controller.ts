import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreateRoomInputDto, CreateRoomOutputDto } from '@rooms/dtos/create-room.dto';
import { RequestWithUser } from '@rooms/rooms.interface';
import { RoomsService } from '@rooms/rooms.service';

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
}
