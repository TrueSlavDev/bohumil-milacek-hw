import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  let httpsOptions:
    | {
        key: Buffer;
        cert: Buffer;
      }
    | undefined;

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    cors: {
      origin: '*',
    },
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      enableImplicitConversion: true,
    }),
  );

  await app.listen(process.env.PORT!);

  const server = app.getHttpServer();
  const router = server._events.request._router;

  console.log(`[SERVER] Server url: ${await app.getUrl()}`);
  const availableRoutes: [] = router.stack
    .map((layer) => {
      if (layer.route) {
        return {
          route: {
            path: layer.route?.path,
            method: layer.route?.stack[0].method,
          },
        };
      }
    })
    .filter((item) => item !== undefined);
  console.log(availableRoutes);
}

bootstrap();
