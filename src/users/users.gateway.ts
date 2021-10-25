/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { User } from '@users/entities/user.entity';

const ORIGIN = process.env.NODE_ENV === 'production' ? 'https://tsufia.netlify.app' : 'http:://localhost:3000';

@WebSocketGateway(undefined, { cors: { origin: ORIGIN, credentials: true } })
export class UsersGateway {
  @WebSocketServer() server: Server;

  // Get User
  @SubscribeMessage('users:get:server')
  handleGetUser(@MessageBody() data: User, @ConnectedSocket() client: Socket) {
    client.data.user = data;
  }
}
