import * as Pino from 'pino';

export type TLogger = Pino.Logger;

interface ILogger {
  logger: TLogger;
}

class Logger {
  public static inject(name: string, isStatic: boolean = false) {
    return <T extends { new (...args: any[]): {} }>(Base: T) =>
      class extends Base implements ILogger {
        logger = Logger.getLogger(name);
        static logger = isStatic ? Logger.getLogger(name) : undefined;
      };
  }

  public static getLogger(name: string): TLogger {
    const prettyOptions = {
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss o',
      crlf: true
    };
    return Pino(<any>{
      level: 'debug',
      name,
      prettyPrint: process.env.PRETTY === 'true' && prettyOptions
    });
  }
}

export default Logger;
