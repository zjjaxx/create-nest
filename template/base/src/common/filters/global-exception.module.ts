import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './all-exception-filter';
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class GlobalExceptionModule {}
