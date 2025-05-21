import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';

@Controller('cache')
export class CacheController {
  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(50 * 1000)
  @CacheKey('zjj_key')
  getKey(@Query('id', ParseIntPipe) id: number) {
    return id;
  }
}
