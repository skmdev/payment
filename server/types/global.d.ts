import Koa from 'koa';
import { Server } from 'next';

export declare module 'koa' {
  interface Context {
    next: Server;
  }
}
