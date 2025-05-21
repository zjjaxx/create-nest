import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Photo, Role, Permission } from './user.entity';
import { UserService } from './user.service';
import { RolePermissionKey } from '@/common/auth/roles.type';

@Module({
  imports: [TypeOrmModule.forFeature([User, Photo, Role, Permission])],
  controllers: [UserController],
  providers: [
    {
      provide: RolePermissionKey,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
