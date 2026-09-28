# Gimnasio API

API en NestJS para un gimnasio: `Clases`, `Horarios`, `Miembros` e `Inscripciones`. Este repo junta varias prácticas seguidas de la materia, cada una en su propia sección más abajo.

## Instalación y ejecución

```bash
npm install
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000`.

## Estructura

```
src/
  clases/        CRUD de clases del gimnasio
  horarios/      CRUD de horarios (día, hora, cupo, entrenador)
  miembros/      CRUD de miembros del gimnasio
  inscripciones/ inscribir a un miembro a un horario, con reglas de cupo y duplicados
  datos/         datos de arranque (seed) que usan Horarios y Miembros
```

Cada módulo tiene la misma forma: `dominio/` (entidades + interfaz del repositorio), `dto/`, `infra/` (repositorio) y el token de inyección en `<módulo>.tokens.ts`.

## Práctica 5 – Mi primera API con NestJS

API mínima que expone el catálogo de clases de un gimnasio, con una ruta para consultarlas y otra para agregar una nueva, guardando los datos en un arreglo en memoria.

Rutas:

- `GET /` — mensaje de bienvenida (generado por el `AppService`)
- `GET /clases` — devuelve el arreglo completo de clases
- `POST /clases` — recibe `{ "nombre": "..." }` en el body y agrega una clase nueva al arreglo

### Preguntas de la práctica

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

## Tarea – Construir el módulo Horarios

Rutas nuevas de horarios:

- `GET /horarios` — lista todos los horarios
- `GET /horarios/:id` — busca un horario por id
- `POST /horarios` — crea un horario (`{ "claseId": number, "dia": string, "horaInicio": string, "cupoMaximo": number, "entrenador": string }`)
- `PATCH /horarios/:id` — actualiza un horario (todos los campos opcionales)
- `DELETE /horarios/:id` — elimina un horario

### Preguntas de la tarea

**1. ¿Por qué el Service se inyecta sin token en el Controller, y el repositorio sí necesita uno?**
Es el mismo caso que con Miembros: `HorariosService` es una clase real, existe cuando el programa ya está corriendo, así que Nest la reconoce sola sin necesitar ningún identificador extra. En cambio `HorarioRepository` es una interfaz, y las interfaces se borran al compilar a JavaScript, no queda nada de ellas en tiempo de ejecución. Por eso el repositorio sí necesita un token (`HORARIO_REPOSITORY`) que le sirva de nombre a Nest para saber qué clase concreta conectar ahí.

**2. Si mandas un `claseId` que no es número, ¿qué código de estado esperarías, y por qué este Controller no lo detecta?**
El servidor respondió 201 y guardó el horario tal cual, con `claseId` como string. Esto pasa porque `HorariosController` no tiene ninguna validación escrita a mano (a diferencia de `InscripcionesController`, donde sí se revisa con `Number.isInteger(...)` antes de guardar).

## Práctica 8 – Prisma: esquema y migraciones

Se instaló Prisma sobre la API y se mapearon las cuatro entidades del dominio (`Clase`, `Horario`, `Miembro`, `Inscripcion`) a MySQL. El esquema completo está en `prisma/schema.prisma`, y la migración generada está en `prisma/migrations/`.

### Preguntas de la práctica

**1. ¿Por qué el paquete del adaptador se llama `adapter-mariadb` si usamos MySQL?**
Porque MariaDB y MySQL son casi lo mismo por dentro, MariaDB salió de una copia de MySQL y todavía funcionan igual para conectarse. Por eso Prisma usa un solo paquete para las dos, no hace falta uno diferente para cada una.

**2. ¿Editar `schema.prisma` cambió algo en la base de datos antes de migrar?**
No. El archivo `schema.prisma` es nada más un archivo de texto, con solo editarlo no pasa nada en la base de datos. Lo que sí cambia la base es correr el comando `npx prisma migrate dev`, ahí es cuando Prisma ve qué cambió y lo aplica de verdad en MySQL. 

**3. ¿La carpeta de migraciones es una foto del esquema o un historial?**
Es un historial. Cada carpeta que hay adentro de `prisma/migrations/` es un paso que se hizo en un momento distinto, con su propio archivo que dice qué se cambió en ese paso. Si alguien descarga el proyecto y corre las migraciones, se van aplicando una por una.

**4. ¿Por qué `Horario.clase` sí crea columna y `Clase.horarios` no?**
Porque en `Horario` hay una relación con `claseId`, que es la que de verdad guarda el dato de a qué clase pertenece ese horario, por eso ahí sí se crea una columna. En cambio en `Clase` esta `horarios`, pero eso es nada más para poder ver los horarios de esa clase, no guarda ningún dato nuevo.

**5. ¿De dónde sale la relación de muchos a muchos entre Miembro y Horario, si nunca se declaró?**
Sale porque `Inscripcion` tiene una relación con `Horario` y otra con `Miembro` al mismo tiempo. Entonces un miembro puede tener varias inscripciones a distintos horarios, y un horario puede tener inscripciones de varios miembros distintos. Así, usando la tabla `Inscripcion` de en medio, se conecta un miembro con muchos horarios y un horario con muchos miembros.

## Práctica 9 – Blindar la API

Aquí ya no se usan los repositorios en memoria: los cuatro (`Clase`, `Horario`, `Miembro`, `Inscripcion`) ahora hablan directo con MySQL a través de Prisma. Además se le agregó validación de verdad a los datos que llegan, un filtro que traduce los errores del dominio a códigos HTTP, y CORS para controlar desde qué páginas se puede consumir la API.

Lo que se hizo:

- Se creó `PrismaService` (con el driver adapter de MariaDB) y `PrismaModule`, marcado como `@Global()` para no tener que importarlo en cada módulo
- Se crearon los cuatro repositorios "Prisma" (`ClasePrismaRepository`, `HorarioPrismaRepository`, `MiembroPrismaRepository`, `InscripcionPrismaRepository`), cada uno implementando la misma interfaz que ya existía, y se borraron los cuatro repositorios en memoria
- Los DTOs pasaron de ser interfaces a ser clases con decoradores de `class-validator` (`@IsString`, `@IsInt`, `@IsEmail`, `@IsIn`, etc.)
- Se activó el `ValidationPipe` de forma global en `main.ts`
- Se creó un filtro de excepciones (`ErrorDominioFilter`) que atrapa todos los errores del dominio desde una sola clase base y los traduce al código HTTP correcto
- Se configuró CORS para que solo dos orígenes de desarrollo puedan consumir la API

### Preguntas de la práctica

**1. ¿Qué línea del Service o del Controller tuvo que cambiar para que Clases hablara con MySQL?**
Ninguna. Ni `ClasesService` ni `ClasesController` se enteraron del cambio. Los dos solo conocen la interfaz `ClaseRepository`, no saben si atrás hay un arreglo en memoria o MySQL de verdad. Lo único que cambié fue una línea en `clases.module.ts`: donde decía `useClass: ClaseMemoriaRepository` ahora dice `useClass: ClasePrismaRepository`. Con eso Nest ya le inyecta al Service la versión que habla con la base de datos, y ni se entera.

**2. ¿Por qué `InscripcionesService` no tuvo que cambiar ni una línea de las reglas de cupo y duplicados?**
Porque esas reglas (no pasarse del cupo, no inscribirse dos veces al mismo horario) están escritas en el Service usando nada más los métodos de la interfaz (`buscarHorario`, `buscarMiembro`, `buscarPorHorario`, `guardar`). No les importa si esos datos vienen de un arreglo en memoria o de una consulta a MySQL, el Service solo cuenta y compara números. Cambié el repositorio por debajo y las reglas de negocio ni se movieron.

**3. ¿Por qué una interfaz no puede validar nada en tiempo de ejecución?**
Porque una interfaz de TypeScript es solo para que el editor te avise si algo está mal escrito, pero se borra por completo cuando el código se compila a JavaScript. O sea que cuando la API ya está corriendo y le llega una petición, no queda ni rastro de esa interfaz en ningún lado para revisar nada. En cambio una clase con decoradores de `class-validator` sí existe cuando el programa corre, así que Nest sí la puede usar para revisar el dato real que llegó.

**4. Una de las cuatro opciones del `ValidationPipe` es indispensable: sin ella la validación no hace nada y tampoco avisa. ¿Cuál es y qué código de estado responde?**
La opción indispensable es `transform: true`. Sin ella, el `ValidationPipe` nunca convierte el objeto plano que llega en el body a una instancia real de la clase del DTO, entonces `class-validator` no tiene de dónde leer los decoradores y no revisa nada, la petición pasaría como si no hubiera ninguna regla puesta. Al mandar un cuerpo con el tipo equivocado (por ejemplo `"nombre": 12345`) o con un campo que no existe en el DTO (por ejemplo `"colorFavorito"`), el servidor responde siempre `400 Bad Request`, con un arreglo `message` que dice exactamente qué estuvo mal (`"nombre must be a string"` o `"property colorFavorito should not exist"`).

**5. ¿Cuántas líneas quedó más corto el controlador?**
El archivo completo de `inscripciones.controller.ts` quedó 26 líneas más corto (se borraron 30, se agregaron 4). Nada más viendo el método `crear`, el bloque que validaba a mano y el `try/catch` que traducía los errores pasó de 24 líneas a 4, porque ahora todo eso lo hace el filtro de excepciones por su cuenta.

**6. Si la respuesta llega en los dos casos, ¿quién bloquea realmente y a quién protege?**
El servidor sí procesa y responde la petición en los dos casos, con el mismo código 200 y los mismos datos. La diferencia está nada más en un header: si el origen está permitido, viene `Access-Control-Allow-Origin` con ese origen; si no está permitido, ese header simplemente no aparece. El que realmente bloquea es el navegador del que hizo la petición: cuando no encuentra ese header con su propio origen, el navegador descarta la respuesta y no se la entrega al código JavaScript que la pidió, aunque la petición ya haya viajado completa por la red. Por eso desde REST Client (que no es un navegador) las dos peticiones "funcionan" igual, la protección de CORS es cosa del navegador, y a quien protege es al usuario que tiene esa página abierta, para que un sitio de otro origen no pueda leer a escondidas respuestas de una API donde el usuario tiene sesión iniciada.
