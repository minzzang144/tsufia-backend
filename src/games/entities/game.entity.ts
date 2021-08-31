import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { Core } from '@common/entities/core.entity';
import { IsNumber, IsOptional } from 'class-validator';
import { Room } from '@rooms/entities/room.entity';
import { User } from '@users/entities/user.entity';

export enum Circle {
  밤,
  낮,
  저녁,
}

@Entity()
export class Game extends Core {
  @Column({ type: 'enum', enum: Circle, nullable: true })
  @IsOptional()
  public circle?: Circle;

  @Column()
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

  @OneToOne(() => User, (user) => user.game)
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  public userId?: number;
}
