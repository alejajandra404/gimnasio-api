import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
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
  catch(excepcion: ErrorDominio, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = this.mapearCodigo(excepcion);

    response.status(statusCode).json({
      statusCode,
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
    return HttpStatus.BAD_REQUEST;
  }
}
