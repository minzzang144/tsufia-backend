import { Core } from '@common/entities/core.entity';
import { User } from '@users/entities/user.entity';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';

export enum TotalHeadCount {
  Four = 4,
  Six = 6,
  Eight = 8,
}

export enum Status {
  대기중,
  진행중,
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

  @OneToMany(() => User, (user) => user.room, { cascade: true })
  public userList: User[];
}
