/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { RoomsService } from '@rooms/rooms.service';

@WebSocketGateway(undefined, { cors: { origin: 'http:://localhost:3000', credentials: true } })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly roomService: RoomsService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleDisconnect(client: Socket) {
    if (client['roomId']) {
      const deleteResponse = await this.roomService.deleteRoom({ id: +client.data.user.id });
      const { ok: deleteOk, roomId } = deleteResponse;
      if (deleteOk) {
        this.server.to('rooms').emit('rooms:remove:client', roomId);
      }
      const leaveResponse = await this.roomService.leaveRoom({ id: +client.data.user.id }, client['roomId']);
      const { ok: leaveOk, room } = leaveResponse;
      if (leaveOk) {
        this.server.to('rooms').emit('rooms:leave:client', room);
        client.broadcast.to(`rooms/${room.id}`).emit('rooms:leave:broadcast-client', client.data.user);
        this.server.to(`rooms/${room.id}`).emit('rooms:leave:each-client', room);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
