import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, IsNotEmpty } from 'class-validator';

const MEMBRESIAS_VALIDAS = ['basica', 'plus', 'premium'];

// Todo opcional: un PATCH manda solo lo que cambia. "activo" es el
// campo pensado para dar de baja a un miembro sin borrar su historial.
export class ActualizarMiembroDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsIn(MEMBRESIAS_VALIDAS)
  membresia?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
