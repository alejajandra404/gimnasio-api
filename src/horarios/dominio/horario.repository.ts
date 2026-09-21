import { Horario } from './entidades.js';
import { CrearHorarioDto } from '../dto/crear-horario.dto.js';
import { ActualizarHorarioDto } from '../dto/actualizar-horario.dto.js';

// La interfaz que el Service conoce. No sabe si detras hay un arreglo
// en memoria o MySQL: ese es el punto de la Sesion 7.
export interface HorarioRepository {
  listar(): Promise<Horario[]>;
  buscarPorId(id: number): Promise<Horario | null>;
  crear(datos: CrearHorarioDto): Promise<Horario>;
  actualizar(id: number, datos: ActualizarHorarioDto): Promise<Horario | null>;
  eliminar(id: number): Promise<Horario | null>;
}
