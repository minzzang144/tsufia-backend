import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserInputDto } from '@users/dtos/create-user.dto';
import { UsersService } from '@users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserInputDto: CreateUserInputDto) {
    return this.usersService.createUser(createUserInputDto);
  }
}
