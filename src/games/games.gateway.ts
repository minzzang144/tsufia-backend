/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RemoteSocket, Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { Game } from '@games/entities/game.entity';
import { Room } from '@rooms/entities/room.entity';
import { User } from '@users/entities/user.entity';
import { RoomsService } from '@rooms/rooms.service';

@WebSocketGateway(undefined, { cors: { origin: 'http://localhost:3000', credentials: true } })
export class GamesGateway {
  constructor(private readonly roomsService: RoomsService) {}
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

  /* Game CountDown Synchronization */
  @SubscribeMessage('games:countDown:server')
  handleCountdown(
    @MessageBody('roomId') roomId: number,
    @MessageBody('countDown') countDown: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(`rooms/${roomId}`).emit('games:countDown:client', countDown);
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

  /* Patch Survive First Event */
  @SubscribeMessage('games:patch:survive/1:server')
  handlePatchSurvive(
    @MessageBody('roomId') roomId: number,
    @MessageBody('selectId') selectId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.emit('games:patch:survive:self-client', roomId, selectId);
  }

  /* Patch Survive Second Event */
  @SubscribeMessage('games:patch:survive/2:server')
  handlePatchSurviveBroadcast(@MessageBody() room: Room | undefined, @ConnectedSocket() client: Socket) {
    if (room) this.server.to(`rooms/${room.id}`).emit('games:patch:survive:each-client', room);
  }

  /* Patch Vote User Event */
  @SubscribeMessage('games:patch:vote/1:server')
  async handleVote(
    @MessageBody('roomId') roomId: number,
    @MessageBody('userId') userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    // 방장을 찾아 방장에게 투표된 사용자 리스트를 전달한다
    const fetchSockets = await this.server.in(`rooms/${roomId}`).fetchSockets();
    const hostSocket = fetchSockets.find((client) => client.data.host === true);
    this.server.to(hostSocket.id).emit('games:patch:vote:host-client', userId);
  }

  /* Patch Vote User Event */
  @SubscribeMessage('games:patch:vote/2:server')
  async handleVoteBroadcast(
    @MessageBody('roomId') roomId: number,
    @MessageBody('votedUserList') votedUserList: number[],
    @ConnectedSocket() client: Socket,
  ) {
    const result: { [index: string]: number } = {};
    votedUserList.forEach((userId) => {
      if (!userId) return;
      result[userId] = (result[userId] || 0) + 1;
    });
    const response = await this.roomsService.patchVote(roomId, result);
    const { ok, room } = response;
    if (ok && room) {
      this.server.to(`rooms/${roomId}`).emit('games:patch:vote:each-client', room);
    }
  }
}
