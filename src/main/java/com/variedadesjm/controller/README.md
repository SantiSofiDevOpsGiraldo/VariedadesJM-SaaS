# Módulo de Controladores (Controllers)

## Propósito
Esta carpeta contiene los puntos de entrada (endpoints) de la API REST del sistema. Su función es recibir las peticiones HTTP, validar los datos de entrada y delegar la ejecución a la capa de servicios.

## Responsabilidades
- Exponer endpoints REST siguiendo las convenciones de Spring Web.
- Validar DTOs de entrada mediante anotaciones `@Valid`.
- Transformar respuestas en formatos adecuados (JSON).
- Manejar la autorización a nivel de método (si aplica).

## Relaciones con otros componentes
- **Servicios**: Llama a las interfaces de `com.variedadesjm.service` para ejecutar la lógica.
- **DTOs**: Utiliza objetos de `com.variedadesjm.model.dto` para el intercambio de datos.

## Decisiones Técnicas
- Se utiliza `@RestController` para asegurar que todas las respuestas sean serializadas como JSON.
- Se utiliza `@RequestMapping("/api/...")` para versionar o agrupar rutas.

## Cómo extender este módulo
Para agregar un nuevo endpoint:
1. Crear una nueva clase `...Controller` en esta carpeta.
2. Inyectar el servicio correspondiente mediante constructor (Inyección de dependencias).
3. Definir los métodos con `@GetMapping`, `@PostMapping`, etc.
