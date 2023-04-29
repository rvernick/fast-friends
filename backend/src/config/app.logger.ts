import { ConsoleLogger } from '@nestjs/common';

export class AppLogger extends ConsoleLogger {
  constructor() {
    super();
    console.log('creating logger');
  }

  // error(message: any, stack?: string, context?: string) {
  //   // add your tailored logic here
  //   super.error(...arguments);
  // }
}