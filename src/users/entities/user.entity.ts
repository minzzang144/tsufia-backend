import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { BeforeInsert, Column, Entity } from 'typeorm';

import { Core } from '@common/entities/core.entity';

@Entity()
export class User extends Core {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  firstName: string;

  @Column()
  @IsString()
  lastName: string;

  @Column({ select: false })
  @Exclude()
  @IsString()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
