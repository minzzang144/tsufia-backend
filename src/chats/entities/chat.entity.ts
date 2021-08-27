import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Core } from '@common/entities/core.entity';
import { User } from '@users/entities/user.entity';
import { Room } from '@rooms/entities/room.entity';

@Entity()
export class Chat extends Core {
  @Column()
  @IsString()
  public content: string;

  @ManyToOne(() => Room, (room) => room.chatList, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roomId' })
  public room: Room;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  public roomId?: number;

  @ManyToOne(() => User, (user) => user.chatList)
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  public userId?: number;
}
