/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { Chat } from '@chats/entities/chat.entity';

const ORIGIN = process.env.NODE_ENV === 'production' ? 'https://tsufia.netlify.app' : 'http:://localhost:3000';

@WebSocketGateway(undefined, { cors: { origin: ORIGIN, credentials: true } })
export class ChatsGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('chats:create:server')
  handleCreateChat(
    @MessageBody('roomId') roomId: string,
    @MessageBody('data') data: Chat,
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(`rooms/${roomId}`).emit('chats:create:each-client', data);
  }
}
