import { Injectable } from '@nestjs/common';

export interface Clase {
  id: number;
  nombre: string;
}

const clases: Clase[] = [
  { id: 1, nombre: 'Yoga' },
  { id: 2, nombre: 'Spinning' }
];

@Injectable()
export class ClasesService {
    listar(): Clase[] {
        return clases;
    }

    crear(nombre: string): Clase {
        const nueva: Clase = { id: clases.length + 1, nombre: nombre };
        clases.push(nueva);
        return nueva;
    }
}
