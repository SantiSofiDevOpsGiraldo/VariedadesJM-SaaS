# Contexto de Servicios

## Reglas de Negocio Locales
- **Aislamiento**: Todo servicio que realice una búsqueda por ID debe verificar que el objeto resultante pertenece a la `company_id` del contexto actual, lanzando `ResourceNotFoundException` o `BusinessException` en caso contrario.
- **Atomicidad**: Operaciones complejas (como una venta que descuenta stock y registra movimiento) deben ser atómicas mediante `@Transactional`.

## Decisiones Técnicas
- Se prefiere la inyección por constructor para facilitar las pruebas unitarias.
- El manejo de errores debe ser semántico, usando las excepciones definidas en `com.variedadesjm.exception`.
