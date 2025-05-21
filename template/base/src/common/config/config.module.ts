import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

const envFilePath = [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'];
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,
    }),
  ],
})
export class ConfigModule {}
