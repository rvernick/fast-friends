import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = createLogger();
  const port = process.env.PORT || 3000;
  logger.log('info', 'Opening on port ' + port);

  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: createLogger(),
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  const url = await app.getUrl();
  console.log('Listening on: ' + url);
}

function createLogger(): LoggerService {
  const winston = require('winston');

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      // new winston.transports.File({
      //   format: winston.format.simple(),
      //   filename: 'logs/error.log',
      //   level: 'error',
      //   maxsize: 1000,
      //   maxFiles: 2,
      //   tailable: true,
      // }),
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
