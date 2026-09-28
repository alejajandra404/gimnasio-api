import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

// Todo opcional: un PATCH manda solo lo que cambia.
export class ActualizarClaseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nombre?: string;
}
