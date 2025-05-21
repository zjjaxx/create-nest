import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  // 获取DI中具体的class类的实例 -> DI系统它们(controller 和 AppService)之间的依赖关系
  // 如果APP module没有AppService,则报错
  // 如何找？
  // 1. app module中providers没有AppService 则找imports -> 其它module ->其它模块 providers+exports -> AppService
  // 2 providers直接提供 -> AppService

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Version('2')
  @Get('getHello')
  getHello2(): string {
    return 'version2';
  }
}
