import { Module } from '@nestjs/common';

import { RoomsGateway } from '@rooms/rooms.gateway';

@Module({
  providers: [RoomsGateway],
  exports: [RoomsGateway],
})
export class RoomsModule {}
