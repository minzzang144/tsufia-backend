import * as bcrypt from 'bcrypt';
import { classToPlain, Exclude } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

import { Core } from '@common/entities/core.entity';

export enum Provider {
  Local,
  Google,
  Kakao,
}

@Entity()
export class User extends Core {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  nickname?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  photo?: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  password?: string;

  @Column({ type: 'enum', enum: Provider, default: Provider.Local })
  provider: Provider;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.provider === Provider.Local) this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJSON(): Record<string, any> {
    return classToPlain(this);
  }
}
