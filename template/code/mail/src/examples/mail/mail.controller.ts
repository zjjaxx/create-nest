import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get } from '@nestjs/common';

@Controller('mail')
export class MailController {
  constructor(private readonly mailerService: MailerService) {}
  @Get('send')
  async sendEmail() {
    await this.mailerService.sendMail({
      to: '2495893564@qq.com',
      from: '2495893564@qq.com',
      subject: 'Testing Nest Mailermodule with template ✔',
      template: 'index', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
      context: {
        name: 'zjj',
      },
    });
    return 'ok';
  }
}
