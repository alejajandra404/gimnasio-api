import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClasesModule } from './clases/clases.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';
import { MiembrosModule } from './miembros/miembros.module';
import { HorariosModule } from './horarios/horarios.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule, // registro, login y la estrategia JWT
    ClasesModule,
    InscripcionesModule,
    MiembrosModule,
    HorariosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
