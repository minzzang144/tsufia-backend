/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Room } from '@rooms/entities/room.entity';

@WebSocketGateway(undefined, { cors: { origin: 'http:://localhost:3000', credentials: true } })
export class RoomsGateway {
  @WebSocketServer() server: Server;

  // Join Rooms
  @SubscribeMessage('rooms:join:server')
  handleJoinRoom(@ConnectedSocket() client: Socket) {
    client.join('rooms');
    console.log(this.server.sockets.adapter.rooms);
  }

  // Create Room
  @SubscribeMessage('rooms:create:server')
  handleCreateRoom(@MessageBody() data: Room, @ConnectedSocket() client: Socket) {
    client.leave('rooms');
    client.join(`rooms/${data.id}`);
    console.log(this.server.sockets.adapter.rooms);
    this.server.to('rooms').emit('rooms:create:client', data);
  }

  // Update Rooms
  @SubscribeMessage('rooms:update:server')
  handleUpdateRoom(@MessageBody() data: Room, @ConnectedSocket() client: Socket) {
    this.server.to('rooms').emit('rooms:update:client', data);
    this.server.to(`rooms/${data.id}`).emit('rooms:update:each-client', data);
  }

  // Remove Room
  @SubscribeMessage('rooms:remove:server')
  handleRemoveRoom(@MessageBody() data: number, @ConnectedSocket() client: Socket) {
    this.server.to('rooms').emit('rooms:remove:client', data);
    client.leave(`rooms/${data}`);
    console.log(this.server.sockets.adapter.rooms);
  }

  // Enter Room
  @SubscribeMessage('rooms:enter:server')
  handleEnterRoom(@MessageBody() data: Room, @ConnectedSocket() client: Socket) {
    client.leave('rooms');
    client.join(`rooms/${data.id}`);
    console.log(this.server.sockets.adapter.rooms);
    this.server.to('rooms').emit('rooms:enter:client', data);
    this.server.to(`rooms/${data.id}`).emit('rooms:enter:each-client', data);
  }

  // Leave Room
  @SubscribeMessage('rooms:leave:server')
  handleLeaveRoom(@MessageBody() data: Room, @ConnectedSocket() client: Socket) {
    client.leave(`rooms/${data.id}`);
    console.log(this.server.sockets.adapter.rooms);
    this.server.to('rooms').emit('rooms:leave:client', data);
    this.server.to(`rooms/${data.id}`).emit('rooms:leave:each-client', data);
  }
}
