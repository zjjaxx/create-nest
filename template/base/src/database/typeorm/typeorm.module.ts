import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        timezone: '+08:00',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_DATABASE'),
        entities: [],
        retryAttempts: 3,
        autoLoadEntities:
          configService.get('DATABASE_AUTOLOAD', 'false') === 'true',
        synchronize: configService.get('DATABASE_SYNC', 'true') === 'true',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class TypeormModule {}
