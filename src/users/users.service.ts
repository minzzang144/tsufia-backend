import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@users/entities/user.entity';
import { CreateUserInputDto, CreateUserOutputDto } from '@users/dtos/create-user.dto';
import { GetUserInputDto, GetUserOutputDto } from '@users/dtos/get-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  /* Create User */
  async createUser(createUserInputDto: CreateUserInputDto): Promise<CreateUserOutputDto> {
    try {
      const { email, firstName, lastName, password, checkPassword } = createUserInputDto;
      const userExist = await this.userRepository.findOne({ email });

      // 유저 중복 & 패스워드 일치 검사
      if (userExist) return { ok: false, error: '이미 존재하는 사용자 이름입니다.' };
      if (password !== checkPassword) return { ok: false, error: '패스워드가 일치하지 않습니다.' };

      // 유저 생성
      const user = this.userRepository.create({ email, firstName, lastName, password });
      await this.userRepository.save(user);

      return { ok: true };
    } catch (error) {
      return { ok: false, error: '계정을 생성할 수 없습니다.' };
    }
  }

  /* Find One User */
  async findOneUser(getUserInputDto: GetUserInputDto): Promise<GetUserOutputDto> {
    try {
      const { email } = getUserInputDto;
      const user = await this.userRepository.findOne({ email });
      if (!user) return { ok: false, error: '해당 유저를 찾을 수 없습니다.' };
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: '유저 탐색을 실패했습니다.' };
    }
  }
}
