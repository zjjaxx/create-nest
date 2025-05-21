import { MailerService } from '@nestjs-modules/mailer';

import {
  Body,
  Controller,
  Get,
  Post,
  Logger,
  UseInterceptors,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  SerializeOptions,
  Inject,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUser, UserResponse } from './user.dto';
import { AuthGuard } from 'src/common/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/auth/roles.guard';
import { RolePermissionKey } from '@/common/auth/roles.type';
import { Permission, PermissionRead } from '@/common/auth/roles.decorator';
@Controller('user')
@Permission('user')
export class UserController {
  constructor(
    private logger: Logger,
    @Inject(RolePermissionKey) private userServce: UserService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('create')
  async create(@Body() createUser: CreateUser) {
    return await this.userServce.create(createUser);
  }

  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: UserResponse })
  @UseGuards(AuthGuard, RolesGuard)
  @PermissionRead()
  @Get('info')
  getInfo(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
