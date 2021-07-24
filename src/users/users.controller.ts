import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';

import { CreateUserInputDto, CreateUserOutputDto } from '@users/dtos/create-user.dto';
import { UsersService } from '@users/users.service';
import { GetUserOutputDto } from '@users/dtos/get-user.dto';
import { GetWillPatchUserOutput, RequestWithUserData } from '@users/dtos/get-will-patch-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* Create User Controller */
  @Post('sign-up')
  async createUser(@Body() createUserInputDto: CreateUserInputDto): Promise<CreateUserOutputDto> {
    return this.usersService.createUser(createUserInputDto);
  }

  /* Get User Controller  */
  @UseGuards(JwtAuthGuard)
  @Get(':id/profile')
  async getUser(@Param('id') userId: string): Promise<GetUserOutputDto> {
    return this.usersService.getUser({ id: +userId });
  }

  /* Get Will Patch User Controller */
  @UseGuards(JwtAuthGuard)
  @Get(':id/profile-update')
  async getWillPatchUser(
    @Req() reqWithUser: RequestWithUserData,
    @Param('id') userId: string,
  ): Promise<GetWillPatchUserOutput> {
    return this.usersService.getWillPatchUser(reqWithUser, userId);
  }
}
