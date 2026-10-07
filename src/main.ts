import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ErrorDominioFilter } from './comun/filtros/error-dominio.filter';
import { requestIdMiddleware } from './comun/middleware/request-id.middleware';
import { LoggingInterceptor } from './comun/interceptores/logging.interceptor';
import { SobreInterceptor } from './comun/interceptores/sobre.interceptor';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  app.useGlobalInterceptors(new LoggingInterceptor(), new SobreInterceptor());

  const reflector = app.get(Reflector); // el guard lo usa para leer @Publico()
  app.useGlobalGuards(new JwtAuthGuard(reflector)); // TODAS las rutas piden token

  const config = new DocumentBuilder()
    .setTitle('API del Gimnasio') // titulo que sale arriba de /docs
    .setVersion('1.0')
    .addBearerAuth() // agrega el boton Authorize
    .addSecurityRequirements('bearer') // pone el candado en todas las rutas
    .build();
  const documento = SwaggerModule.createDocument(app, config); // recorre controllers y DTO
  SwaggerModule.setup('docs', app, documento); // lo publica en /docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
