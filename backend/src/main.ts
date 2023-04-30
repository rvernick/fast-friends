import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { AppLogger } from './config/app.logger';
import { create } from 'domain';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: createLogger(),
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

function createLogger(): LoggerService {
  const winston = require('winston');

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
      new winston.transports.Console({format: winston.format.simple()}),
    ],
  });
  return logger;
}
bootstrap();
