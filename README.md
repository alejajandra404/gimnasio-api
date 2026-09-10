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
