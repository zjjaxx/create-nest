import { Module } from '@nestjs/common';
import { NormalizeInterceptor } from './normalize.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: NormalizeInterceptor,
    },
  ],
})
export class NormalizeModule {}
