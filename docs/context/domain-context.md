# Contexto de Dominio - CajaClara SAAS

## Propósito
Este documento describe el dominio de negocio de CajaClara SAAS, sus actores principales y las reglas que rigen sus interacciones.

## Actores del Sistema
1. **Super Administrador**: Gestiona la plataforma, los inquilinos (empresas) y configuraciones globales.
2. **Administrador de Empresa**: Responsable de configurar su propia empresa, gestionar usuarios, inventario y reportes.
3. **Cajero/Vendedor**: Realiza ventas, gestiona sesiones de caja y registra servicios.
4. **Afiliado**: Cliente recurrente o socio que puede tener niveles y beneficios asociados.

## Entidades Principales
- **Empresa (Company)**: La unidad fundamental del sistema multi-inquilino.
- **Usuario (User)**: Personal que interactúa con el sistema, vinculado a una empresa.
- **Producto (Product)**: Artículos para la venta con stock, precio y categoría.
- **Servicio (Service)**: Labores o actividades prestadas (ej. reparaciones, consultorías).
- **Venta (Sale)**: Registro de una transacción comercial de productos.
- **Sesión de Caja (CashSession)**: Periodo de tiempo en el que se registran movimientos de dinero.
- **Afiliado (Affiliate)**: Registro de clientes con seguimiento de nivel.

## Reglas de Negocio Clave
1. **Aislamiento de Datos**: Un usuario solo puede ver y operar sobre datos de la empresa a la que pertenece.
2. **Sesiones de Caja**: No se pueden realizar ventas si no hay una sesión de caja abierta.
3. **Control de Inventario**: Las ventas deben descontar automáticamente del stock disponible.
4. **Seguimiento de Servicios**: Los servicios tienen estados (PENDING, IN_PROGRESS, COMPLETED, etc.).
5. **Niveles de Afiliación**: Los afiliados pueden subir de nivel según su actividad (regla a definir en detalle).

## Flujos Principales
1. **Onboarding de Empresa**: Registro de una nueva empresa y su primer administrador.
2. **Ciclo de Venta**: Apertura de caja -> Selección de productos -> Pago -> Cierre de caja.
3. **Gestión de Servicios**: Creación de orden -> Actualización de estado -> Pago final.

---
*Próximos pasos: Revisar [Contexto Técnico](technical-context.md)*
