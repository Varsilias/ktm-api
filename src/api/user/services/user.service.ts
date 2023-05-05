import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.respository';
import { UserEntity } from '../entities/user.entity';
import { FindOneOptions } from 'typeorm';
import { NotFoundException } from 'src/common/exceptions/notfound.exception';
import { SignUpDto } from 'src/api/auth/dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(signUpDto: SignUpDto) {
    const entity = this.userRepository.create(signUpDto);
    const user = await this.userRepository.save(entity);
    return user;
  }

  findAll() {
    return this.userRepository.find();
  }

  async findUserBy(option: FindOneOptions<UserEntity>): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ ...option });
    return user;
  }

  async update(
    condition: FindOneOptions<UserEntity>,
    user: Partial<UserEntity>,
  ) {
    const entity = await this.findUserBy(condition);
    if (!entity) {
      throw new NotFoundException('User does not exist', {});
    }
    const updatedUser = await this.userRepository.update(entity.id, user);
    return updatedUser;
  }
}
