import { IsEmail, IsIn, IsString, IsNotEmpty } from 'class-validator';

const MEMBRESIAS_VALIDAS = ['basica', 'plus', 'premium'];

export class CrearMiembroDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  correo: string;

  @IsIn(MEMBRESIAS_VALIDAS)
  membresia: string;
}
