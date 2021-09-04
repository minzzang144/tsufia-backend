/* eslint-disable @typescript-eslint/no-unused-vars */
import { Game } from '@games/entities/game.entity';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(undefined, { cors: { origin: 'http://localhost:3000', credentials: true } })
export class GamesGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('games:create:server')
  handleCreateGame(
    @MessageBody('game') data: Game,
    @MessageBody('roomId') roomId: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(`rooms/${roomId}`).emit('games:create:each-client', data);
  }
}
