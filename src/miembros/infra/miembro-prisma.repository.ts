import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Miembro } from '../dominio/entidades';
import { MiembroRepository } from '../dominio/miembro.repository';
import { CrearMiembroDto } from '../dto/crear-miembro.dto';
import { ActualizarMiembroDto } from '../dto/actualizar-miembro.dto';

@Injectable()
export class MiembroPrismaRepository implements MiembroRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Miembro[]> {
    return this.prisma.miembro.findMany();
  }

  async buscarPorId(id: number): Promise<Miembro | null> {
    return this.prisma.miembro.findUnique({ where: { id } });
  }

  async crear(datos: CrearMiembroDto): Promise<Miembro> {
    return this.prisma.miembro.create({
      data: { nombre: datos.nombre, correo: datos.correo, membresia: datos.membresia },
    });
  }

  async actualizar(id: number, datos: ActualizarMiembroDto): Promise<Miembro | null> {
    try {
      return await this.prisma.miembro.update({ where: { id }, data: datos });
    } catch {
      return null;
    }
  }

  async eliminar(id: number): Promise<Miembro | null> {
    try {
      return await this.prisma.miembro.delete({ where: { id } });
    } catch {
      return null;
    }
  }
}
