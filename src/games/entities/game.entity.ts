import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { Core } from '@common/entities/core.entity';
import { IsNumber, IsOptional } from 'class-validator';
import { Room } from '@rooms/entities/room.entity';

export enum Cycle {
  밤,
  낮,
  저녁,
}

@Entity()
export class Game extends Core {
  @Column({ type: 'enum', enum: Cycle, nullable: true })
  @IsOptional()
  public cycle?: Cycle;

  @Column({ type: 'bigint' })
  @IsNumber()
  @IsOptional()
  public countDown?: number;

  @OneToOne(() => Room, (room) => room.game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  public room: Room;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  public roomId?: number;
}
