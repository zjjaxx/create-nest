import { Module } from '@nestjs/common';
import { CacheModule as nestCacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    nestCacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          stores: [createKeyv('redis://localhost:6379')],
        };
      },
    }),
  ],
})
export class CacheModule {}
