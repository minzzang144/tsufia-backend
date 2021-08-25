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

  // Remove Room
  @SubscribeMessage('rooms:remove:server')
  handleRemoveRoom(@MessageBody() data: number, @ConnectedSocket() client: Socket) {
    console.log(client.rooms);
    this.server.emit('rooms:remove:client', data);
    this.server.to(`rooms/${data}`).emit('rooms:remove:each-client');
    client.leave(`rooms/${data}`);
  }

  // Enter Room
  @SubscribeMessage('rooms:enter:server')
  handleEnterRoom(@MessageBody() data: Room, @ConnectedSocket() client: Socket) {
    client.join(`rooms/${data.id}`);
    this.server.emit('rooms:enter:client', data);
    this.server.to(`rooms/${data.id}`).emit('rooms:enter:each-client', data);
  }

  // Leave Room
  @SubscribeMessage('rooms:leave:server')
  handleLeaveRoom(@MessageBody() data: Room, @ConnectedSocket() client: Socket) {
    console.log(client.rooms);
    client.leave(`rooms/${data.id}`);
    this.server.emit('rooms:leave:client', data);
    this.server.to(`rooms/${data.id}`).emit('rooms:leave:each-client', data);
  }
}
