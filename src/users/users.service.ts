import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@users/entities/user.entity';
import { CreateUserInputDto, CreateUserOutputDto } from '@users/dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async createUser(createUserInputDto: CreateUserInputDto): Promise<CreateUserOutputDto> {}
}
