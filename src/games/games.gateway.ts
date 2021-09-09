/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Game } from '@games/entities/game.entity';
import { Room } from '@rooms/entities/room.entity';
import { User } from '@users/entities/user.entity';

@WebSocketGateway(undefined, { cors: { origin: 'http://localhost:3000', credentials: true } })
export class GamesGateway {
  @WebSocketServer() server: Server;

  /* Create Game Event */
  @SubscribeMessage('games:create:server')
  handleCreateGame(
    @MessageBody('game') game: Game,
    @MessageBody('roomId') roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(`rooms/${roomId}`).emit('games:create:each-client', game);
  }

  /* Patch Game First Event */
  @SubscribeMessage('games:patch:game/1:server')
  handlePatchGame(
    @MessageBody('gameId') gameId: number,
    @MessageBody('roomId') roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('games:patch:game:self-client', gameId, roomId);
  }

  /* Patch Game Second Event */
  @SubscribeMessage('games:patch:game/2:server')
  handlePatchRoomGame(
    @MessageBody('game') game: Game,
    @MessageBody('roomId') roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(`rooms/${roomId}`).emit('games:patch:game:each-client', game);
  }

  /* Patch User Role First Event */
  @SubscribeMessage('games:patch:user-role/1:server')
  handleUserRolebyHost(@MessageBody() roomId: number, @ConnectedSocket() client: Socket) {
    client.emit('games:patch:user-role:self-client', roomId);
  }

  /* Patch User Role Second Event */
  @SubscribeMessage('games:patch:user-role/2:server')
  handlePatchUserRole(@MessageBody() room: Room, @ConnectedSocket() client: Socket) {
    this.server.to(`rooms/${room.id}`).emit('games:patch:user-role:each-client', room);
  }

  /* Select User Event */
  @SubscribeMessage('games:select:user:server')
  handleSelectUser(
    @MessageBody('roomId') roomId: number,
    @MessageBody('userId') userId: number,
    @MessageBody('userList') userList: User[],
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(`rooms/${roomId}`).emit('games:select:user:each-client', userId, userList);
  }
}
