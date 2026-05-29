# Lógica de Negocio - CajaClara SAAS

## Reglas Críticas

### 1. Gestión de Multitenencia (Multitenancy)
- **Filtro Obligatorio**: Todas las consultas a la base de datos deben incluir el `company_id` del usuario autenticado.
- **Contexto**: El `company_id` se extrae del JWT y se almacena en el `TenantContext` durante la petición.
- **Validación**: Un usuario no puede crear, leer, actualizar o eliminar registros que no pertenezcan a su `company_id`.

### 2. Ciclo de Vida de la Venta
- **Validación de Stock**: Antes de confirmar una venta, se debe verificar que hay stock suficiente para cada producto.
- **Descuento de Inventario**: Al finalizar la venta, el stock de los productos debe reducirse automáticamente.
- **Caja Abierta**: No se permite registrar una venta si el usuario no tiene una `CashSession` abierta en su empresa.

### 3. Control de Caja (Cash Control)
- **Apertura**: Se requiere un balance inicial. Solo puede haber una sesión abierta por usuario/caja a la vez.
- **Transacciones**: Cada venta genera un movimiento automático en la sesión de caja activa.
- **Cierre**: Se debe registrar el balance final y calcular la diferencia (sobrante/faltante).

### 4. Gestión de Servicios
- **Estados**: Los servicios deben seguir un flujo: `PENDING` -> `IN_PROGRESS` -> `COMPLETED` -> `PAID`.
- **Pagos**: Un servicio puede tener múltiples pagos parciales o un pago único.

## Flujos de Trabajo (Workflows)

### Proceso de Venta Estándar
1. El cajero inicia sesión y abre caja (si no está abierta).
2. Escanea o busca productos.
3. El sistema valida stock y calcula totales (con impuestos).
4. Se selecciona el método de pago.
5. Se confirma la venta:
   - Se crea el registro `Sale`.
   - Se crean los registros `SaleItem`.
   - Se descuenta stock de `Product`.
   - Se registra el ingreso en `CashSession`.

---
*Próximos pasos: Revisar [Workflows](workflows.md) para diagramas detallados.*
