import * as winston from 'winston';
import { utilities } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
export const createLoggerOptions = (log_output: boolean) => {
  const prodTransports: DailyRotateFile[] = [];
  const format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    utilities.format.nestLike('日志', {
      colors: log_output ? false : true,
      prettyPrint: true,
      processId: false,
      appName: true,
    }),
  );
  const createTransport = ({
    level,
    fileName,
  }: {
    level: string;
    fileName: string;
  }) => {
    return new DailyRotateFile({
      level,
      dirname: 'log',
      filename: `${fileName}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format,
    });
  };
  if (log_output) {
    prodTransports.push(
      ...[
        createTransport({ level: 'log', fileName: 'application' }),
        createTransport({
          level: 'error',
          fileName: 'application-error',
        }),
      ],
    );
  }

  return {
    transports: [
      ...prodTransports,
      new winston.transports.Console({
        format,
      }),
    ],
  };
};
