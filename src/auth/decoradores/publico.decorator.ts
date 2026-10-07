import { SetMetadata } from '@nestjs/common';

export const ES_PUBLICO = 'esPublico'; // la llave del dato

// Uso: @Publico() encima de un metodo o de un controller.
export const Publico = () => SetMetadata(ES_PUBLICO, true);
