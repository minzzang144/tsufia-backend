/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { RoomsService } from '@rooms/rooms.service';
import cookieParser from 'cookie-parser';

@WebSocketGateway(undefined, { cors: { origin: 'http:://localhost:3000', credentials: true } })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly roomService: RoomsService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  private reconnected = null;

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  @SubscribeMessage('reconnect')
  handleReconnect(@MessageBody() reconnect: boolean, @ConnectedSocket() client: Socket) {
    if (reconnect !== null) {
      this.reconnected = reconnect;
    }
  }

  handleDisconnect(client: Socket) {
    this.reconnected = false;
    setTimeout(async () => {
      // 브라우저 새로고침이 아닌경우 종료된 것으로 간주하고 방을 삭제
      // Room 안이 아닌 밖에서 disconnect되면 reconnect 관계 여부 없이 방을 삭제
      if (this.reconnected === false) {
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
      }
    }, 2000);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
