import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { PermissionAction } from '@/common/auth/roles.type';

export class Role {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true }) // 启用嵌套验证，each: true 表示验证数组每个元素[1,2](@ref)
  @Type(() => Permission)
  permissions: Permission[];
}

export class Permission {
  @IsString()
  name: string;

  @IsArray()
  action: PermissionAction[];
}

export class CreateUser {
  @IsString()
  firstName: string;

  @IsArray()
  @ValidateNested({ each: true }) // 启用嵌套验证，each: true 表示验证数组每个元素[1,2](@ref)
  @Type(() => Role)
  roles: Role[];

  @IsString()
  password: string;

  @IsArray()
  @ValidateNested({ each: true }) // 启用嵌套验证，each: true 表示验证数组每个元素[1,2](@ref)
  @Type(() => Photos)
  photos: Photos[];
}

export class Photos {
  @IsString()
  url: string;

  @IsString()
  url1: string;
}

export class UserResponse {
  @Exclude()
  uid: string;
}
