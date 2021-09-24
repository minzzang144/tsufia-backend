import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { Chat } from '@chats/entities/chat.entity';
import { Core } from '@common/entities/core.entity';
import { User } from '@users/entities/user.entity';
import { Game } from '@games/entities/game.entity';

export enum TotalHeadCount {
  Four = 4,
  Six = 6,
  Eight = 8,
}

export enum Status {
  대기중,
  진행중,
  종료,
}

@Entity()
export class Room extends Core {
  @Column()
  @IsString()
  public title: string;

  @Column({ default: 0 })
  @IsNumber()
  public currentHeadCount: number;

  @Column({ type: 'enum', enum: TotalHeadCount })
  @IsEnum(TotalHeadCount)
  public totalHeadCount: TotalHeadCount;

  @Column({ type: 'enum', enum: Status })
  @IsEnum(Status)
  public status: Status;

  // cascase: true -> Room Entity가 저장될 때 User Entity도 같이 저장한다
  @OneToMany(() => User, (user) => user.room, { cascade: true })
  public userList: User[];

  @OneToMany(() => Chat, (chat) => chat.room, { cascade: true })
  public chatList: Chat[];

  @OneToOne(() => Game, (game) => game.room, { cascade: true })
  public game: Game;
}
