import { Miembro } from './entidades.js';
import { CrearMiembroDto } from '../dto/crear-miembro.dto.js';
import { ActualizarMiembroDto } from '../dto/actualizar-miembro.dto.js';

// La interfaz que el Service conoce. No sabe si detras hay un arreglo
// en memoria o MySQL: ese es el punto de la Sesion 7.
export interface MiembroRepository {
  listar(): Promise<Miembro[]>;
  buscarPorId(id: number): Promise<Miembro | null>;
  crear(datos: CrearMiembroDto): Promise<Miembro>;
  actualizar(id: number, datos: ActualizarMiembroDto): Promise<Miembro | null>;
  eliminar(id: number): Promise<Miembro | null>;
}
