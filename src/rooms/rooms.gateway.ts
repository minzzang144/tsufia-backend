/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(undefined, { cors: { origin: 'http:://localhost:3000', credentials: true } })
export class RoomsGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('rooms:test:server')
  handleTestRoom(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(data);
  }
}
