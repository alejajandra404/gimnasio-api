import { IsInt, IsString, IsNotEmpty, IsOptional, Min } from 'class-validator';

// Todo opcional: un PATCH manda solo lo que cambia.
export class ActualizarHorarioDto {
  @IsOptional()
  @IsInt()
  claseId?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  dia?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  horaInicio?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  cupoMaximo?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  entrenador?: string;
}
