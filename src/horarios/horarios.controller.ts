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
import { HorariosService } from './horarios.service.js';
import type { CrearHorarioDto } from './dto/crear-horario.dto.js';
import type { ActualizarHorarioDto } from './dto/actualizar-horario.dto.js';

@Controller('horarios')
export class HorariosController {
    // El Service SI se inyecta sin token: es una clase, existe en
    // runtime y puede ser su propia llave. El token solo hace falta
    // para la interfaz del repositorio.
    constructor(private readonly servicio: HorariosService) {}

    @Get()
    async listar() {
        return this.servicio.listar();
    }

    @Get(':id')
    async buscar(@Param('id') id: string) {
        const horario = await this.servicio.buscar(Number(id));
        if (!horario) {
            throw new NotFoundException(`No existe el horario ${id}`);
        }
        return horario;
    }

    @Post()
    @HttpCode(201)
    async crear(@Body() dto: CrearHorarioDto) {
        return this.servicio.crear(dto);
    }

    @Patch(':id')
    async actualizar(@Param('id') id: string, @Body() dto: ActualizarHorarioDto) {
        const actualizado = await this.servicio.actualizar(Number(id), dto);
        if (!actualizado) {
            throw new NotFoundException(`No existe el horario ${id}`);
        }
        return actualizado;
    }

    @Delete(':id')
    async eliminar(@Param('id') id: string) {
        const eliminado = await this.servicio.eliminar(Number(id));
        if (!eliminado) {
            throw new NotFoundException(`No existe el horario ${id}`);
        }
        return eliminado;
    }
}
