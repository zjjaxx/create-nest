import { Controller, Get, Request } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('swagger')
export class SwaggerController {
  @ApiBearerAuth()
  @Get('auth')
  getInfo(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return req.user;
  }
}
