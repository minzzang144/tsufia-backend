/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Room } from '@rooms/entities/room.entity';

@WebSocketGateway(undefined, { cors: { origin: 'http:://localhost:3000', credentials: true } })
export class RoomsGateway {
  @WebSocketServer() server: Server;

  // Get Rooms
  @SubscribeMessage('rooms:get:server')
  handleGetRooms(@MessageBody() data: Room[], @ConnectedSocket() client: Socket) {
    this.server.emit('rooms:get:client', data);
  }
}
