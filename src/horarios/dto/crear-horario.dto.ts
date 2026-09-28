import { IsInt, IsString, IsNotEmpty, Min } from 'class-validator';

export class CrearHorarioDto {
  @IsInt()
  claseId: number;

  @IsString()
  @IsNotEmpty()
  dia: string;

  @IsString()
  @IsNotEmpty()
  horaInicio: string;

  @IsInt()
  @Min(1)
  cupoMaximo: number;

  @IsString()
  @IsNotEmpty()
  entrenador: string;
}
