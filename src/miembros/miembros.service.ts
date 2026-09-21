import { Inject, Injectable } from '@nestjs/common';
import type { MiembroRepository } from './dominio/miembro.repository.js';
import { MIEMBRO_REPOSITORY } from './miembros.tokens.js';
import { Miembro } from './dominio/entidades.js';
import { CrearMiembroDto } from './dto/crear-miembro.dto.js';
import { ActualizarMiembroDto } from './dto/actualizar-miembro.dto.js';

@Injectable()
export class MiembrosService {
    constructor(
        @Inject(MIEMBRO_REPOSITORY)
        private readonly repo: MiembroRepository
    ){}

    listar(): Promise<Miembro[]> {
        return this.repo.listar();
    }

    buscar(id: number): Promise<Miembro | null> {
        return this.repo.buscarPorId(id);
    }

    crear(dto: CrearMiembroDto): Promise<Miembro> {
        return this.repo.crear(dto);
    }

    actualizar(id: number, dto: ActualizarMiembroDto): Promise<Miembro | null> {
        return this.repo.actualizar(id, dto);
    }

    eliminar(id: number): Promise<Miembro | null> {
        return this.repo.eliminar(id);
    }
}
