# Módulo de Servicios (Services)

## Propósito

Esta es la capa central del sistema donde reside toda la lógica de negocio y la orquestación de procesos.

## Responsabilidades

- Implementar las reglas de negocio descritas en `docs/business/logic.md`.
- Gestionar transacciones de base de datos (`@Transactional`).
- Coordinar llamadas a múltiples repositorios.
- Realizar validaciones de seguridad y multitenencia a nivel de lógica.

## Relaciones con otros componentes

- **Repositorios**: Utiliza `com.variedadesjm.repository` para persistencia.
- **Mappers**: Utiliza `com.variedadesjm.mapper` para convertir entre entidades y DTOs.
- **Seguridad**: Consulta `TenantContext` para aplicar filtros de empresa.

## Cómo extender este módulo

1. Definir la lógica en una clase anotada con `@Service`.
2. Asegurar que las operaciones de escritura tengan `@Transactional`.
3. Validar siempre que los datos pertenecen a la empresa actual.
