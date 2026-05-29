# Módulo de Modelos (Models)

## Propósito

Contiene todas las definiciones de datos del sistema, incluyendo entidades de persistencia, objetos de transferencia (DTOs) y enumeraciones.

## Estructura

- **`entity/`**: Clases anotadas con `@Entity` que representan tablas.
- **`dto/`**: Clases para entrada/salida de la API, organizadas por módulo.
- **`enums/`**: Tipos constantes para estados, categorías, etc.

## Reglas

- Las entidades deben mantener la coherencia con el esquema de base de datos definido en las migraciones de Flyway.
- Los DTOs no deben contener lógica, solo datos y anotaciones de validación.
