import Koa from 'koa';
import { Server } from 'next';
import { TLogger } from '../services/Logger';

export declare module 'koa' {
  interface Context {
    next: Server;
    logger: TLogger;
  }
}
