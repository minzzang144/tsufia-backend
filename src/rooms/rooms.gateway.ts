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

  // Create Room
  @SubscribeMessage('rooms:create:server')
  handleCreateRoom(@MessageBody() data: Room, @ConnectedSocket() client: Socket) {
    client.join(`rooms/${data.id}`);
    this.server.emit('rooms:create:client', data);
  }

  // Update Rooms
  @SubscribeMessage('rooms:update:server')
  handleUpdateRoom(@MessageBody() data: Room, @ConnectedSocket() client: Socket) {
    this.server.emit('rooms:update:client', data);
  }

  // Enter Room
  @SubscribeMessage('rooms:enter:server')
  handleEnterRoom(@MessageBody() data: Room, @ConnectedSocket() client: Socket) {
    client.join(`rooms/${data.id}`);
    this.server.emit('rooms:enter:client', data);
    this.server.to(`rooms/${data.id}`).emit('rooms:enter:each-client', data);
    console.log(client.rooms);
  }
}
