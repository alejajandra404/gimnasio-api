import { Module } from '@nestjs/common';
import { InscripcionesController } from './inscripciones.controller.js';
import { InscripcionesService } from './inscripciones.service.js';
import { InscripcionMemoriaRepository } from './infra/inscripcion-memoria.repository.js';

@Module({
  controllers: [InscripcionesController],
  providers: [
    InscripcionesService,
    {
      provide: 'INSCRIPCION_REPOSITORY',
      useClass: InscripcionMemoriaRepository,
    },
  ],
})
export class InscripcionesModule {}
