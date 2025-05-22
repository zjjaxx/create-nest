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
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUser, UserResponse } from "./user.dto";
import { AuthGuard } from "src/common/auth/auth.guard";
import { RolesGuard } from "src/common/auth/roles.guard";
import { RolePermissionKey } from "@/common/auth/roles.type";
import { Permission, PermissionRead } from "@/common/auth/roles.decorator";
@Controller("user")
@Permission("user")
export class UserController {
  constructor(
    private logger: Logger,
    @Inject(RolePermissionKey) private userServce: UserService
  ) {}

  @Post("create")
  async create(@Body() createUser: CreateUser) {
    return await this.userServce.create(createUser);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: UserResponse })
  @UseGuards(AuthGuard, RolesGuard)
  @PermissionRead()
  @Get("info")
  getInfo(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
