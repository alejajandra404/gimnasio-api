import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  CupoLlenoError,
  ErrorDominio,
  HorarioNoEncontradoError,
  InscripcionDuplicadaError,
  MiembroNoEncontradoError,
} from '../../inscripciones/dominio/errores';

@Catch(ErrorDominio)
export class ErrorDominioFilter implements ExceptionFilter {
  // Todo lo que escriba sale en la consola con la etiqueta [Dominio].
  private readonly logger = new Logger('Dominio');

  catch(excepcion: ErrorDominio, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = this.mapearCodigo(excepcion);

    // En la consola: WARN [Dominio] POST /inscripciones -> 409 CupoLlenoError
    this.logger.warn(
      `${request.method} ${request.url} -> ${statusCode} ${excepcion.constructor.name}`,
    );

    response.status(statusCode).json({
      statusCode,
      error: excepcion.constructor.name, // el nombre de la clase: "CupoLlenoError"
      message: excepcion.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private mapearCodigo(excepcion: ErrorDominio): number {
    if (
      excepcion instanceof HorarioNoEncontradoError ||
      excepcion instanceof MiembroNoEncontradoError
    ) {
      return HttpStatus.NOT_FOUND;
    }
    if (excepcion instanceof CupoLlenoError || excepcion instanceof InscripcionDuplicadaError) {
      return HttpStatus.CONFLICT;
    }
    // Un error de dominio que olvidamos mapear -> 500, para que se note.
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
