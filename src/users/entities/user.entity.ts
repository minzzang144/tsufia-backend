import { IsEmail, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';

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
  @IsString()
  password: string;
}
