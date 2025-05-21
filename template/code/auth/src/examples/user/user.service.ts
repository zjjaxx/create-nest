import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUser } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { RolePermissionService } from '@/common/auth/roles.type';

@Injectable()
export class UserService implements RolePermissionService {
  constructor(
    private logger: Logger,
    private dataSource: DataSource,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async queryRolePermission(uid: number): Promise<unknown[]> {
    const user = await this.usersRepository.findOne({
      where: {
        id: uid,
      },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });
    if (user) {
      const userPermissions = user.roles.map((role) => {
        return role.permissions.map((permission) => {
          return permission.action.map(
            (_action: string) => `${permission.name}:${_action}`,
          );
        });
      });
      return userPermissions.flat(2);
    } else {
      return [];
    }
  }

  async create(createUser: CreateUser) {
    let password: string | null = null;
    try {
      password = await argon2.hash(createUser.password);
    } catch (err) {
      this.logger.error(err);
    }

    const user = this.usersRepository.create({
      name: createUser.firstName,
      password: password!,
      roles: createUser.roles,
      photos: createUser.photos,
    });
    const instance = await this.usersRepository.save(user);
    return await this.jwtService.signAsync({
      uid: instance.id,
    });
  }

  async login(loginUser: CreateUser) {
    const user = await this.usersRepository.find({
      where: {
        name: loginUser.firstName,
      },
      relations: {
        photos: true,
      },
    });
    if (user.length) {
      try {
        if (await argon2.verify(user[0].password, loginUser.password)) {
          return user;
        } else {
          throw new ForbiddenException('不匹配');
        }
      } catch (err) {
        this.logger.error(err);
      }
    }
    throw new ForbiddenException('没有该用户');
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: {
        photos: true,
      },
    });
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async createMany(users: User[]) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (const user of users) {
        await queryRunner.manager.save(user);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      this.logger.error(err);
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }
}
