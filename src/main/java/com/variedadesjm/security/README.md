# Módulo de Seguridad y Multitenencia

## Propósito
Este módulo gestiona la autenticación, autorización y el aislamiento de datos (multitenencia) en el sistema.

## Responsabilidades
- **Autenticación**: Validación de tokens JWT y gestión de sesiones.
- **Autorización**: Definición de permisos basados en roles (`ADMIN`, `CASHIER`, `USER`).
- **Multitenencia**: Gestión del `TenantContext` para asegurar que cada petición opere bajo el ID de empresa correcto.

## Componentes Clave
- `JwtTokenProvider.java`: Generación y validación de tokens.
- `JwtAuthenticationFilter.java`: Interceptor que extrae el token y establece el contexto de seguridad.
- `TenantContext.java`: Almacén local al hilo (`ThreadLocal`) para el `company_id`.

## Reglas de Seguridad
- Ninguna ruta bajo `/api/` (excepto `/api/auth/**`) debe ser accesible sin un token válido.
- El `company_id` es inmutable durante la duración de la petición una vez establecido.
