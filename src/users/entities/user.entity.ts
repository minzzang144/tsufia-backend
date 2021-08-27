import * as bcrypt from 'bcrypt';
import { classToPlain, Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Core } from '@common/entities/core.entity';
import { Room } from '@rooms/entities/room.entity';
import { Chat } from '@chats/entities/chat.entity';

export enum Provider {
  Local,
  Google,
  Kakao,
}

@Entity()
export class User extends Core {
  @Column({ unique: true })
  @IsEmail()
  public email: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  public firstName?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  public lastName?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  public nickname?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  public photo?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  public password?: string;

  @Column({ type: 'enum', enum: Provider, default: Provider.Local })
  public provider: Provider;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  public refreshToken?: string;

  // onDelete: 'SET NULL' -> 부모 Entity(Room)이 삭제될 경우 room값을 null로 설정한다.
  @ManyToOne(() => Room, (room) => room.userList, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'roomId' })
  public room: Room;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  public roomId?: number;

  @Column({ default: false })
  @IsBoolean()
  host: boolean;

  @OneToMany(() => Chat, (chat) => chat.user)
  chatList: Chat;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  @IsString()
  private tempPassword?: string;

  @AfterLoad()
  private loadTempPassword() {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this.password && this.provider === Provider.Local && this.tempPassword !== this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public toJSON(): Record<string, any> {
    return classToPlain(this);
  }
}
