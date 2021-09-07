import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestWithUser } from '@common/common.interface';
import { CreateRoomInputDto, CreateRoomOutputDto } from '@rooms/dtos/create-room.dto';
import { GetRoomsOutputDto } from '@rooms/dtos/get-rooms.dts';
import { GetRoomOutputDto } from '@rooms/dtos/get-room.dto';
import { PatchRoomInputDto, PatchRoomOutputDto } from '@rooms/dtos/patch-room.dto';
import { DeleteRoomOutputDto } from '@rooms/dtos/delete-room.dto';
import { Room, Status } from '@rooms/entities/room.entity';
import { User, UserRole } from '@users/entities/user.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /* User Authenticate Service */
  private authUser(requestWithUser: RequestWithUser) {
    const {
      user: { id },
    } = requestWithUser;
    if (!id) return { ok: false, error: '사용자를 찾을 수 없습니다' };
    return { id };
  }

  /* Generate Random Service */
  private generateRandom(max: number, except: number[]) {
    let random: number = Math.floor(Math.random() * max);
    while (except.includes(random)) {
      random = Math.floor(Math.random() * max);
    }
    return random;
  }

  /* Create Room Service */
  async createRoom(
    requestWithUser: RequestWithUser,
    createRoomInputDto: CreateRoomInputDto,
  ): Promise<CreateRoomOutputDto> {
    try {
      const { ok, error, id } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      const user = await this.userRepository.findOne({ id }, { select: ['id', 'firstName', 'lastName', 'nickname'] });
      if (!user) return { ok: false, error: '사용자를 찾을 수 없습니다' };

      // Dto 입력값 확인
      const { title, totalHeadCount } = createRoomInputDto;
      if (!title) return { ok: false, error: '방 제목 입력은 필수입니다' };
      if (!totalHeadCount) return { ok: false, error: '총 인원 수 입력은 필수입니다' };

      // Room 생성
      const room = this.roomRepository.create({ title, totalHeadCount });
      room.currentHeadCount = 1;
      room.status = Status.대기중;
      user.host = true;
      room.userList = [user];
      await this.roomRepository.save(room);
      return { ok: true, room };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '방 생성을 실패하였습니다' };
    }
  }

  /* Get Rooms Service */
  async getRooms(requestWithUser: RequestWithUser): Promise<GetRoomsOutputDto> {
    try {
      const { ok, error } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      const rooms = await this.roomRepository.find({ relations: ['userList'] });
      return { ok: true, rooms };
    } catch (error) {
      return { ok: false, error: '방들의 정보를 불러올 수 없습니다' };
    }
  }

  /* Get Room Service */
  async getRoom(requestWithUser: RequestWithUser, roomId: string): Promise<GetRoomOutputDto> {
    try {
      const { ok, error } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      const room = await this.roomRepository.findOneOrFail({ id: +roomId }, { relations: ['userList', 'game'] });
      if (!room) return { ok: false, error: '방이 삭제 되었거나 정보를 불러올 수 없습니다' };
      return { ok: true, room };
    } catch (error) {
      return { ok: false, error: '방의 정보를 불러올 수 없습니다' };
    }
  }

  /* Patch Room Service */
  async patchRoom(requestWithUser: RequestWithUser, patchRoomInputDto: PatchRoomInputDto): Promise<PatchRoomOutputDto> {
    try {
      const { ok, error, id } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      // 방장 여부 확인
      const { title, totalHeadCount } = patchRoomInputDto;
      const currentUser = await this.userRepository.findOne({ id }, { select: ['id', 'roomId', 'host'] });
      const room = await this.roomRepository.findOne({ id: currentUser.roomId }, { relations: ['userList'] });
      if (currentUser.host === false) return { ok: false, error: '방장 외에 다른 사람이 변경할 수 없습니다' };
      if (currentUser.host === true) {
        if (title) room.title = title;
        if (totalHeadCount && room.currentHeadCount > totalHeadCount)
          return { ok: false, error: '업데이트 하려는 인원수를 이미 초과하였습니다' };
        if (totalHeadCount) room.totalHeadCount = totalHeadCount;
      }
      await this.roomRepository.save(room);
      return { ok: true, room };
    } catch (error) {
      return { ok: false, error: '방의 정보를 업데이트 할 수 없습니다' };
    }
  }

  /* Delete Room Service */
  async deleteRoom(requestWithUser: RequestWithUser): Promise<DeleteRoomOutputDto> {
    try {
      const { ok, error, id } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      const currentUser = await this.userRepository.findOne({ id }, { select: ['id', 'roomId', 'host'] });
      const currnetRoom = await this.roomRepository.findOne({ id: currentUser.roomId }, { relations: ['userList'] });
      const roomId = currnetRoom.id;
      if (currnetRoom.userList.length !== 1) return { ok: false };
      if (currnetRoom.userList.length === 1) {
        // 방장 권한 삭제
        currentUser.host = false;

        // 게임에서 필요한 역할을 회수한다
        currentUser.role = null;

        const index = currnetRoom.userList.findIndex((user) => user.id === currentUser.id);
        currnetRoom.userList.splice(index, 1, currentUser);
        await this.roomRepository.save(currnetRoom);

        // 방 삭제
        const result = await this.roomRepository.remove(currnetRoom);
        if (!result) return { ok: false, error: '방을 삭제하는데 실패하였습니다' };
      }
      return { ok: true, roomId };
    } catch (error) {
      return { ok: false, error: '방을 삭제할 수 없습니다' };
    }
  }

  /* Enter Room API Service */
  async enterRoom(requestWithUser: RequestWithUser, roomId: string): Promise<PatchRoomOutputDto> {
    try {
      const { ok, error, id } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      const currentUser = await this.userRepository.findOne({ id });
      const roomToEnter = await this.roomRepository.findOne({ id: +roomId }, { relations: ['userList'] });

      switch (roomToEnter.currentHeadCount < roomToEnter.totalHeadCount) {
        // 입장하려는 방이 최대인원을 초과하지 않은 경우
        case true:
          // 방장인 경우 Create Room에서 userList에 추가하였기 때문에 enterRoom 메서드를 종료한다
          if (roomToEnter.userList.find((user) => user.id === currentUser.id)) return { ok: false };

          roomToEnter.currentHeadCount += 1;
          roomToEnter.userList.push(currentUser);
          const result = await this.roomRepository.save(roomToEnter);
          return { ok: true, room: result };
        // 입장하려는 방이 최대인원을 초과한 경우
        case false:
          if (roomToEnter.userList.some((user) => JSON.stringify(user) === JSON.stringify(currentUser)))
            return { ok: false };
          return { ok: false, error: '더 이상 입장하실 수 없습니다' };
        default:
          break;
      }
    } catch (error) {
      return { ok: false, error: '입장할 수 없습니다' };
    }
  }

  /* Leave Room API Service */
  async leaveRoom(requestWithUser: RequestWithUser, roomId: string): Promise<PatchRoomOutputDto> {
    try {
      const { ok, error, id } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      const currentUser = await this.userRepository.findOne({ id });
      const roomToLeave = await this.roomRepository.findOne({ id: +roomId }, { relations: ['userList'] });
      let room: Room;
      if (roomToLeave.userList.length === 1) return { ok: false };
      switch (currentUser.host) {
        // 방에서 나가려는 유저가 방장인 경우
        case true:
          const hostNumber = roomToLeave.userList.findIndex((user) => user.id === currentUser.id);
          const randomNumber = this.generateRandom(roomToLeave.userList.length, [hostNumber]);
          const randomUser = roomToLeave.userList.find((user, index) => index === randomNumber);

          // 방장을 userList에서 삭제
          roomToLeave.userList.splice(hostNumber, 1);
          roomToLeave.currentHeadCount -= 1;

          // 다른 사람에게 방장의 권한을 넘겨준다
          randomUser.host = true;
          currentUser.host = false;

          // 게임에서 필요한 역할을 회수한다
          currentUser.role = null;

          await this.userRepository.save(currentUser);
          await this.userRepository.save(randomUser);
          room = await this.roomRepository.save(roomToLeave);
          return { ok: true, room };
        // 방에서 나가려는 유저가 방장이 아닌 경우
        case false:
          const currentNumber = roomToLeave.userList.findIndex((user) => user.id === currentUser.id);

          // 방에서 나가는 유저를 유저리스트에서 제거
          roomToLeave.userList.splice(currentNumber, 1);
          roomToLeave.currentHeadCount -= 1;
          // 게임에서 필요한 역할을 회수한다
          currentUser.role = null;
          await this.userRepository.save(currentUser);
          room = await this.roomRepository.save(roomToLeave);
          return { ok: true, room };
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      return { ok: false, error: '방을 나갈 수 없습니다' };
    }
  }

  /* Create UserRole from Room Userlist Service */
  async createUserRole(requestWithUser: RequestWithUser, roomId: string): Promise<PatchRoomOutputDto> {
    try {
      const { ok, error } = this.authUser(requestWithUser);
      if (ok === false && error) return { ok, error };

      const room = await this.roomRepository.findOneOrFail({ id: +roomId }, { relations: ['userList'] });
      switch (room.userList.length) {
        case 4:
          const mafiaIndex = this.generateRandom(room.userList.length, []);
          room.userList = room.userList.map((user, index) => {
            if (mafiaIndex === index) {
              user.role = UserRole.Mafia;
              user.survive = false;
              return user;
            } else {
              user.role = UserRole.Citizen;
              user.survive = false;
              return user;
            }
          });
        default:
          break;
      }
      const patchRoom = await this.roomRepository.save(room);
      console.log(patchRoom);
      return { ok: true, room: patchRoom };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '사용자에게 역할을 부여할 수 없습니다' };
    }
  }
}
