import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm';

import { RequestWithUser } from '@common/common.interface';
import { Provider, User } from '@users/entities/user.entity';
import { CreateUserInputDto, CreateUserOutputDto } from '@users/dtos/create-user.dto';
import { GetUserInputDto, GetUserOutputDto } from '@users/dtos/get-user.dto';
import { GetWillPatchUserOutput } from '@users/dtos/get-will-patch-user.dto';
import { PatchUserInputDto, PatchUserOutputDto } from '@users/dtos/patch-user.dto';
import { PostUserPasswordInputDto, PostUserPasswordOutputDto } from '@users/dtos/post-user-password.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  /* Create User Service */
  async createUser(createUserInputDto: CreateUserInputDto): Promise<CreateUserOutputDto> {
    try {
      const { email, firstName, lastName, password, checkPassword } = createUserInputDto;
      const userExist = await this.userRepository.findOne({ email });

      // 유저 중복 & 패스워드 일치 검사
      if (userExist) return { ok: false, error: '이미 존재하는 사용자 계정입니다.' };
      if (password !== checkPassword) return { ok: false, error: '패스워드가 일치하지 않습니다.' };

      // 유저 생성
      const user = this.userRepository.create({ email, firstName, lastName, password, provider: Provider.Local });
      await this.userRepository.save(user);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '계정을 생성할 수 없습니다.' };
    }
  }

  /* Post User Password Service */
  async postUserPassword(
    requsetWithUser: RequestWithUser,
    userId: string,
    postUserPasswordInputDto: PostUserPasswordInputDto,
    res: Response,
  ): Promise<PostUserPasswordOutputDto> {
    try {
      const { user } = requsetWithUser;
      const { password } = postUserPasswordInputDto;
      const findUser = await this.userRepository.findOne({ id: +userId });

      // 유저 인증
      if (!findUser) return { ok: false, error: '잘못된 접근입니다.' };
      if (user && findUser && user.id != findUser.id) return { ok: false, error: '접근 권한을 가지고 있지 않습니다.' };

      // 패스워드 검증
      if (!password) return { ok: false, error: '패스워드를 입력해주세요.' };
      if (!(await findUser.validatePassword(password)))
        return { ok: false, error: '패스워드를 틀렸습니다. 다시 입력해주세요' };

      // 쿠키 설정
      const now = new Date();
      now.setHours(now.getHours() + +this.configService.get('VERIFYCATION_EXPIRATION_TIME'));
      res.cookie('verification', true, { expires: now, httpOnly: true });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: '올바른 패스워드를 입력 하십시오.' };
    }
  }

  /* Get User Service */
  async getUser(getUserInputDto: GetUserInputDto): Promise<GetUserOutputDto> {
    try {
      const { id, email } = getUserInputDto;
      let user: User;

      // 유저 인증
      if (!id && !email) return { ok: false, error: '로그인이 필요합니다.' };

      // 로그인 메서드
      if (id) {
        user = await this.userRepository.findOne({ id });
      }
      if (email) {
        user = await this.userRepository.findOne({ email });
      }
      if (!user) return { ok: false, error: '해당 유저를 찾을 수 없습니다.' };
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: '유저 탐색을 실패했습니다.' };
    }
  }

  /* Get Will Patch User Service */
  async getWillPatchUser(requsetWithUser: RequestWithUser, userId: string): Promise<GetWillPatchUserOutput> {
    try {
      const { user } = requsetWithUser;

      // 유저 인증
      if (user.id !== +userId) return { ok: false, error: '접근 권한을 가지고 있지 않습니다.' };
      const willPatchUser = await this.userRepository.findOne({ id: user.id });
      return { ok: true, user: willPatchUser };
    } catch (error) {
      return { ok: false, error: '접근 권한을 가지고 있지 않습니다.' };
    }
  }

  /* Patch User Service */
  async patchUser(
    requsetWithUser: RequestWithUser,
    userId: string,
    patchUserInputDto: PatchUserInputDto,
  ): Promise<PatchUserOutputDto> {
    try {
      const { user } = requsetWithUser;
      const { firstName, lastName, password, checkPassword } = patchUserInputDto;

      // 유저 인증
      if (user.id != +userId) return { ok: false, error: '접근 권한을 가지고 있지 않습니다.' };

      // 유저 업데이트
      let patchUser = await this.userRepository.findOne({ id: user.id });
      if (firstName) patchUser.firstName = firstName;
      if (lastName) patchUser.lastName = lastName;
      if (password && !checkPassword) return { ok: false, error: '패스워드 확인이 필요합니다.' };
      if (password && checkPassword && password !== checkPassword)
        return { ok: false, error: '패스워드가 일치하지 않습니다.' };
      if (password && checkPassword && password === checkPassword) patchUser.password = password;
      patchUser = await this.userRepository.save(patchUser);
      return { ok: true, user: patchUser };
    } catch (error) {
      return { ok: false, error: '유저 업데이트를 실패 하였습니다.' };
    }
  }
}
