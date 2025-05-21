import { Global, Module, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { createLoggerOptions } from './index';

@Global()
@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const log_output =
          configService.get<string>('LOG_OUTPUT', 'false') === 'true';
        const options = createLoggerOptions(log_output);
        return options;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
