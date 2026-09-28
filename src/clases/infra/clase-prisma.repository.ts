import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Clase } from '../dominio/entidades';
import { ClaseRepository } from '../dominio/clase.repository';
import { CrearClaseDto } from '../dto/crear-clase.dto';
import { ActualizarClaseDto } from '../dto/actualizar-clase.dto';

@Injectable()
export class ClasePrismaRepository implements ClaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Clase[]> {
    return this.prisma.clase.findMany({
      select: { id: true, nombre: true },
    });
  }

  async buscarPorId(id: number): Promise<Clase | null> {
    return this.prisma.clase.findUnique({
      where: { id },
      select: { id: true, nombre: true },
    });
  }

  async crear(datos: CrearClaseDto): Promise<Clase> {
    return this.prisma.clase.create({
      data: { nombre: datos.nombre, duracionMin: 0 },
      select: { id: true, nombre: true },
    });
  }

  async actualizar(id: number, datos: ActualizarClaseDto): Promise<Clase | null> {
    try {
      return await this.prisma.clase.update({
        where: { id },
        data: { nombre: datos.nombre },
        select: { id: true, nombre: true },
      });
    } catch {
      return null;
    }
  }

  async eliminar(id: number): Promise<Clase | null> {
    try {
      return await this.prisma.clase.delete({
        where: { id },
        select: { id: true, nombre: true },
      });
    } catch {
      return null;
    }
  }
}
