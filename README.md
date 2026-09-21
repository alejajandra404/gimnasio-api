# Gimnasio API

Práctica 5 – Mi primera API con NestJS. API mínima que expone el catálogo de clases de un gimnasio, con una ruta para consultarlas y otra para agregar una nueva, guardando los datos en un arreglo en memoria.

## Instalación y ejecución

```bash
npm install
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000`.

## Rutas

- `GET /` — mensaje de bienvenida (generado por el `AppService`)
- `GET /clases` — devuelve el arreglo completo de clases
- `POST /clases` — recibe `{ "nombre": "..." }` en el body y agrega una clase nueva al arreglo

## Preguntas de la práctica

**1. ¿Qué generó el comando `nest new`?**
Creó todos los archivos y carpetas necesarios para tener un proyecto de NestJS funcionando desde cero. Es como una base: ya trae el archivo que arranca el servidor (`main.ts`), un controlador y un servicio de ejemplo, y todo lo necesario para instalar dependencias y ejecutar el proyecto.

**2. ¿Qué hace el `AppService` que ya viene generado?**
Solo tiene una función llamada `getHello()` que devuelve un texto de saludo (un simple `string`). El controlador (`AppController`) usa esa función para responder cuando alguien visita la ruta principal (`/`). 

**3. ¿Por qué la ruta funciona sin declarar nada en `app.module.ts`?**
Porque en `app.module.ts` solo hay que decirle a Nest qué controladores existen, no qué rutas tiene cada uno. Eso ya estaba puesto desde que se generó el proyecto (`controllers: [AppController]`). Las rutas nuevas (como `/clases`) se definen arriba de cada función en el controlador. Como el controlador ya estaba registrado, cualquier ruta que agreguemos ahí adentro funciona automáticamente.

**4. ¿Qué pasaría si el cuerpo de la petición viniera vacío?**
Si mandamos un `POST /clases` sin escribir nada en el body, la propiedad `nombre` llegaría vacía (`undefined`). Como en el código no se revisa si el dato viene o no, igual se crearía una clase nueva, pero sin nombre real. 

**5. ¿En qué archivo vive hoy toda la lógica de la práctica?**
Todo está en un solo archivo: [src/app.controller.ts](src/app.controller.ts). Ahí está el arreglo de clases, y ahí están las tres funciones que responden a `GET /`, `GET /clases` y `POST /clases`.

## Práctica 6 – Conectar el dominio con la API

Rutas nuevas de inscripciones:

- `GET /inscripciones` — lista todas las inscripciones
- `GET /inscripciones/:id` — busca una inscripción por id
- `POST /inscripciones` — crea una inscripción (`{ "horarioId": number, "miembroId": number }`)
- `DELETE /inscripciones/:id` — cancela una inscripción

### Preguntas de la práctica

**1. ¿Qué pasaría si el módulo no quedara registrado en la raíz?**
Sus rutas dejarían de funcionar. Nest solo activa lo que está declarado en algún `imports`, así que si quito `ClasesModule` de `app.module.ts`, las rutas de `/clases` empiezan a dar 404, aunque el archivo del controlador siga ahí sin tocarlo. Básicamente el módulo tiene que estar "conectado" para que Nest se entere de que existe.

**2. ¿Por qué los métodos del repositorio devuelven promesas si los datos van a estar en memoria?**
Porque la interfaz no sabe (ni le importa) si detrás hay un arreglo en memoria o una base de datos de verdad. Ahora mismo no hace falta esperar nada porque todo es instantáneo, pero el día de mañana puede cambiarse por MySQL o algo así, donde sí se tarda en responder. Como ya devuelve `Promise` desde ahorita, el día que se cambie el repositorio no hay que tocar el resto del código.

**3. ¿Qué error apareció al cambiar a la interfaz, y por qué la clase sí se había resuelto sola?**
Con la clase concreta no truena porque una clase sí existe cuando el programa ya está corriendo, Nest la puede crear sin problema. Pero una interfaz de TypeScript no existe en el JavaScript final, se borra al compilar, es nada más para que el editor te avise si algo está mal escrito. Entonces cuando pongo la interfaz sola como tipo, a Nest no le queda ninguna pista de qué instancia darle, y tira un error de que no puede resolver las dependencias del servicio.

**4. ¿Por qué el servicio necesita un token para el repositorio, pero el controlador no lo necesita para el servicio?**
Porque `InscripcionesService` es una clase normal, existe de verdad y Nest la reconoce solita. En cambio `InscripcionRepository` es una interfaz, y como ya vimos, desaparece al compilar. Por eso hace falta un token (una constante como `INSCRIPCION_REPOSITORY`) que sirva como "nombre" para que Nest sepa a qué clase concreta conectarlo.

**5. ¿Cuál es la diferencia entre un 400 y un 409?**
El 400 es cuando la petición viene mal armada, por ejemplo si falta `horarioId` o no es un número; es como decir "no entendí lo que me mandaste". El 409 es cuando sí se entendió perfectamente lo que se pidió, pero no se puede hacer porque choca con algo que ya existe, como que el horario ya está lleno o el miembro ya está inscrito ahí. Uno es problema de forma, el otro es problema de que ahorita no se puede.

**6. ¿Por qué cambió el código de estado de esa última petición?**
Porque al cancelar una inscripción, su estado cambia a "cancelada", y la regla del cupo solo cuenta las que dicen "confirmada". Entonces, al cancelar una, se libera un lugar en el horario, y por eso la siguiente petición que antes daba 409 (por cupo lleno) ahora sí puede pasar y da 201.

## Práctica 7 – Construir el módulo Miembros

Rutas nuevas de miembros:

- `GET /miembros` — lista todos los miembros
- `GET /miembros/:id` — busca un miembro por id
- `POST /miembros` — crea un miembro (`{ "nombre": string, "correo": string, "membresia": string }`)
- `PATCH /miembros/:id` — actualiza un miembro (todos los campos opcionales)
- `DELETE /miembros/:id` — elimina un miembro

### Preguntas de la práctica

**1. ¿Por qué esta interfaz no menciona Express, NestJS ni memoria?**
Porque `MiembroRepository` solo dice qué se puede hacer (listar, buscar, crear, actualizar, eliminar), no cómo se hace ni dónde se guardan los datos. Es nada más un contrato. Nada de eso tiene que ver con si los datos vienen de un arreglo en memoria, de una base de datos, o de cualquier otra cosa.

**2. ¿Qué palabra de esa clase es la que promete cumplir la interfaz del paso anterior?**
La palabra `implements`. Cuando escribo `class MiembroMemoriaRepository implements MiembroRepository`, le estoy diciendo a TypeScript "esta clase se compromete a tener todos los métodos que pide esa interfaz, con los mismos tipos". 

**3. ¿Por qué este archivo no sabe qué es una petición HTTP?**
Porque `miembros.service.ts` no tiene ningún decorador de rutas (`@Get`, `@Post`, etc.) ni nada de Express o NestJS relacionado con HTTP. Solo recibe datos ya limpios (como un DTO) y llama al repositorio. Todo lo que tiene que ver con la petición en sí es trabajo del controlador, no del servicio. 

**4. ¿Por qué el Service se inyecta sin token en el Controller, y el repositorio sí necesita uno?**
Porque `MiembrosService` es una clase de verdad, existe en tiempo de ejecución y Nest la puede reconocer sola. En cambio `MiembroRepository` es una interfaz, y las interfaces desaparecen cuando se compila el código a JavaScript. Por eso el repositorio necesita un token (`MIEMBRO_REPOSITORY`) que sirva como identificador para que Nest sepa qué clase concreta darle, mientras que el servicio no necesita nada de eso porque ya es identificable por sí mismo.
