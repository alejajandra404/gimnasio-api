import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ErrorDominioFilter } from './comun/filtros/error-dominio.filter';
import { requestIdMiddleware } from './comun/middleware/request-id.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(requestIdMiddleware);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:4200'],
    exposedHeaders: ['Location', 'X-Request-Id'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: true,
    }),
  );

  app.useGlobalFilters(new ErrorDominioFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
