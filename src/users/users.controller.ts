import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';

import { CreateUserInputDto, CreateUserOutputDto } from '@users/dtos/create-user.dto';
import { UsersService } from '@users/users.service';
import { GetUserOutputDto } from '@users/dtos/get-user.dto';
import { GetWillPatchUserOutput } from '@users/dtos/get-will-patch-user.dto';
import { PatchUserInputDto, PatchUserOutputDto } from '@users/dtos/patch-user.dto';
import { RequestWithUserData } from '@users/users.interface';
import { PostUserPasswordInputDto, PostUserPasswordOutputDto } from '@users/dtos/post-user-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /* Create User Controller */
  @Post('sign-up')
  async createUser(@Body() createUserInputDto: CreateUserInputDto): Promise<CreateUserOutputDto> {
    return this.usersService.createUser(createUserInputDto);
  }

  /* Post User Password Controller */
  @UseGuards(JwtAuthGuard)
  @Post(':id/validate-password')
  async postUserPassword(
    @Req() requsetWithUserData: RequestWithUserData,
    @Param('id') userId: string,
    @Body() postUserPasswordInputDto: PostUserPasswordInputDto,
  ): Promise<PostUserPasswordOutputDto> {
    return this.usersService.postUserPassword(requsetWithUserData, userId, postUserPasswordInputDto);
  }

  /* Get User Controller  */
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getUser(@Req() requestWithUserData: RequestWithUserData): Promise<GetUserOutputDto> {
    return this.usersService.getUser({ id: requestWithUserData.user.id });
  }

  /* Get Will Patch User Controller */
  @UseGuards(JwtAuthGuard)
  @Get(':id/profile-update')
  async getWillPatchUser(
    @Req() requsetWithUserData: RequestWithUserData,
    @Param('id') userId: string,
  ): Promise<GetWillPatchUserOutput> {
    return this.usersService.getWillPatchUser(requsetWithUserData, userId);
  }

  /* Patch User Controller */
  @UseGuards(JwtAuthGuard)
  @Patch(':id/profile-update')
  async patchUser(
    @Req() requsetWithUserData: RequestWithUserData,
    @Param('id') userId: string,
    @Body() patchUserInputDto: PatchUserInputDto,
  ): Promise<PatchUserOutputDto> {
    return this.usersService.patchUser(requsetWithUserData, userId, patchUserInputDto);
  }
}
