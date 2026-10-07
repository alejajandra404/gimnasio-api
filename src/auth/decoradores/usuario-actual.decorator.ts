import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadJwt } from '../dominio/entidades';

export const UsuarioActual = createParamDecorator(
  (_dato: unknown, contexto: ExecutionContext): PayloadJwt => {
    const req = contexto.switchToHttp().getRequest<{ user: PayloadJwt }>();
    return req.user; // lo dejo ahi el validate() de la JwtStrategy
  },
);
