import { IsString, IsNotEmpty } from 'class-validator';

export class CrearClaseDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
