import { DeepPartial, EntityRepository, FindConditions, Repository } from 'typeorm';

import { User } from '@users/entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findOneOrCreate(conditions: FindConditions<User>, entityLike: DeepPartial<User>): Promise<User> {
    try {
      const findUser = await this.findOne(conditions);
      if (findUser) return findUser;
      const createUser = this.create(entityLike);
      await this.save(createUser);
      return createUser;
    } catch (error) {
      throw new Error('사용자를 찾거나 생성하는데 실패하였습니다');
    }
  }
}
