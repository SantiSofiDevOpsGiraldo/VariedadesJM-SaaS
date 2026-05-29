# Contexto General - CajaClara SAAS

## Propósito
CajaClara SAAS es una solución integral de Punto de Venta (POS) diseñada para pequeñas y medianas empresas (pymes) que requieren un control eficiente de sus inventarios, ventas, servicios y finanzas. Originalmente concebido para "Variedades JM", el sistema ha evolucionado hacia un modelo SAAS (Software as a Service) multi-inquilino.

## Objetivos
1. **Multitenencia**: Permitir que múltiples empresas operen en la misma infraestructura de forma aislada y segura.
2. **Control de Inventario**: Gestión precisa de productos, existencias y categorías.
3. **Gestión de Ventas y Servicios**: Registro de transacciones tanto de productos físicos como de servicios prestados.
4. **Flujo de Caja**: Monitoreo en tiempo real de las sesiones de caja, ingresos y egresos.
5. **Mantenibilidad**: Código limpio y documentado para facilitar la evolución por humanos y agentes IA.

## Principios de Diseño
- **Seguridad por Aislamiento**: Cada empresa (Tenant) solo puede acceder a sus propios datos.
- **Simplicidad**: Interfaz intuitiva y flujos de trabajo optimizados.
- **Escalabilidad**: Arquitectura preparada para crecer en volumen de datos y usuarios.
- **Autodocumentación**: El sistema debe explicar su propia estructura y lógica.

## Decisiones Clave
- **Monolito Modular**: Se optó por un monolito bien estructurado en Spring Boot para facilitar el despliegue inicial y la cohesión.
- **Frontend SPA**: React con TypeScript para una experiencia de usuario fluida y reactiva.
- **Estrategia de Multitenencia**: Discriminador por `company_id` en la base de datos (Shared Schema).

---
*Próximos pasos: Revisar [Contexto de Dominio](domain-context.md)*
