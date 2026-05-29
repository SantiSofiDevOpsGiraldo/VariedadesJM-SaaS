# Módulo de Repositorios (Repositories)

## Propósito
Capa de acceso a datos que utiliza Spring Data JPA para interactuar con la base de datos MySQL.

## Responsabilidades
- Definir consultas (Query Methods) para las entidades.
- Implementar filtros automáticos o manuales por `company_id`.

## Relaciones
- **Entidades**: Vinculado directamente con `com.variedadesjm.model.entity`.
- **Servicios**: Provee datos a la capa de servicios.

## Cómo extender
- Crear interfaces que extiendan de `JpaRepository<Entity, ID>`.
- Usar `@Query` para consultas complejas.
