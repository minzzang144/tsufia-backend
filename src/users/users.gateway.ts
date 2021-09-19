/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { User } from '@users/entities/user.entity';

@WebSocketGateway(undefined, { cors: { origin: 'http://localhost:3000', credentials: true } })
export class UsersGateway {
  @WebSocketServer() server: Server;

  // Get User
  @SubscribeMessage('users:get:server')
  handleGetUser(@MessageBody() data: User, @ConnectedSocket() client: Socket) {
    client.data.user = data;
  }
}
