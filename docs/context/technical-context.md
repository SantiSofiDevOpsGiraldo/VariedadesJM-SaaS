# Contexto Técnico - CajaClara SAAS

## Stack Tecnológico

### Backend
- **Lenguaje**: Java 17
- **Framework**: Spring Boot 3.2.5
- **Persistencia**: Spring Data JPA con MySQL
- **Migraciones**: Flyway
- **Seguridad**: Spring Security + JWT (JSON Web Token)
- **Documentación API**: Swagger/OpenAPI (pendiente de verificar implementación)

### Frontend
- **Framework**: React 18
- **Lenguaje**: TypeScript
- **Build Tool**: Vite
- **Estado**: Zustand (Global) + React Query (Server state)
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Gráficos**: Recharts

## Decisiones Arquitectónicas

### 1. Estrategia Multi-Tenant
Se utiliza una estrategia de **Base de Datos Compartida con Esquema Compartido**. Cada tabla crítica contiene una columna `company_id`. El filtrado se realiza a nivel de aplicación mediante un `TenantContext` y filtros en las consultas (JPA/Hibernate).

### 2. Autenticación y Autorización
- Autenticación basada en JWT sin estado (stateless).
- Soporte para Login tradicional y Google OAuth (visto en `GoogleCallbackRequest.java`).
- Roles definidos en `UserRole` enum: `ADMIN`, `CASHIER`, `USER`.

### 3. Comunicación Frontend-Backend
- API RESTful.
- Axios como cliente HTTP en el frontend.
- Manejo de errores centralizado en el backend con `GlobalExceptionHandler`.

### 4. Estructura de Datos
- Uso intensivo de DTOs para la transferencia de datos entre capas y hacia el frontend.
- Mapeo entre entidades y DTOs mediante Mappers manuales (vistos en `mapper/`).

## Restricciones y Trade-offs
- **Conexión a BD**: Actualmente configurada para MySQL.
- **Sincronización**: Al ser una SPA, depende totalmente de la disponibilidad de la API.
- **Despliegue**: Dockerizado (presencia de `Dockerfile` y `docker-compose.yml`).

---
*Próximos pasos: Revisar [Estructura del Proyecto](../architecture/structure.md)*
