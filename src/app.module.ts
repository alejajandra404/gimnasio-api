import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ClasesModule } from './clases/clases.module.js';
import { InscripcionesModule } from './inscripciones/inscripciones.module.js';
import { MiembrosModule } from './miembros/miembros.module.js';
import { ClasesService } from './clases/clases.service.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [ClasesModule, InscripcionesModule, MiembrosModule],
  controllers: [AppController],
  providers: [AppService, ClasesService],
})
export class AppModule {}
