import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { MiembrosService } from './miembros.service.js';
import type { CrearMiembroDto } from './dto/crear-miembro.dto.js';
import type { ActualizarMiembroDto } from './dto/actualizar-miembro.dto.js';

@Controller('miembros')
export class MiembrosController {
    // El Service SI se inyecta sin token: es una clase, existe en
    // runtime y puede ser su propia llave. El token solo hace falta
    // para la interfaz del repositorio.
    constructor(private readonly servicio: MiembrosService) {}

    @Get()
    async listar() {
        return this.servicio.listar();
    }

    @Get(':id')
    async buscar(@Param('id') id: string) {
        const miembro = await this.servicio.buscar(Number(id));
        if (!miembro) {
            throw new NotFoundException(`No existe el miembro ${id}`);
        }
        return miembro;
    }

    @Post()
    @HttpCode(201)
    async crear(@Body() dto: CrearMiembroDto) {
        return this.servicio.crear(dto);
    }

    @Patch(':id')
    async actualizar(@Param('id') id: string, @Body() dto: ActualizarMiembroDto) {
        const actualizado = await this.servicio.actualizar(Number(id), dto);
        if (!actualizado) {
            throw new NotFoundException(`No existe el miembro ${id}`);
        }
        return actualizado;
    }

    @Delete(':id')
    async eliminar(@Param('id') id: string) {
        const eliminado = await this.servicio.eliminar(Number(id));
        if (!eliminado) {
            throw new NotFoundException(`No existe el miembro ${id}`);
        }
        return eliminado;
    }
}
