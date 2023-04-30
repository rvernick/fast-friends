import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = createLogger()
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: logger,
  });
  app.useGlobalPipes(new ValidationPipe());
  logger.log('info', 'Opening port 3000');
  await app.listen(3000);
  const url = await app.getUrl();
  logger.log('info', 'Listening on: ' + url);
}

function createLogger(): LoggerService {
  const winston = require('winston');

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({
        format: winston.format.simple(),
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 1000,
        maxFiles: 2,
        tailable: true,
      }),
      new winston.transports.File({
        format: winston.format.simple(),
        filename: 'logs/combined.log',
        level: 'info',
        maxsize: 1000,
        maxFiles: 3,
        tailable: true,
      }),
      new winston.transports.Console({ level: 'info', format: winston.format.simple() }),
    ],
  });
  return logger;
}
bootstrap();
