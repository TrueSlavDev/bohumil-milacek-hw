import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { resolve } from 'path';
import { AppController } from './app.controller';

import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { FilesystemModule } from './filesystem/filesystem.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1_000,
        limit: 20,
      },
      {
        name: 'medium',
        ttl: 10_000,
        limit: 80,
      },
      {
        name: 'long',
        ttl: 60_000,
        limit: 300,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: resolve('public'),
      serveRoot: '',
      serveStaticOptions: {
        index: false,
      },
    }),
    ConfigModule.forRoot({
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid('development', 'production')
          .default('development'),
        PORT: Joi.number().required(),
      }),
      isGlobal: true,
    }),
    FilesystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
