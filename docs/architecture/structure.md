# Estructura del Proyecto - CajaClara SAAS

## Organización de Carpetas

La aplicación sigue una estructura de monorepo simplificado donde el backend (Java) y el frontend (React/TS) conviven en la misma raíz, aunque con límites claros.

### Raíz del Proyecto
- `/src`: Contiene tanto el código fuente de la web (React) como el del servidor (Spring Boot).
- `/docs`: Documentación del sistema (esta carpeta).
- `/archive`: Archivos obsoletos o duplicados.
- `pom.xml`: Configuración de Maven (Backend).
- `package.json`: Configuración de NPM/PNPM (Frontend).
- `Dockerfile`, `docker-compose.yml`: Configuración de contenedorización.

### Backend (`src/main/java/com/variedadesjm/`)
El backend sigue una arquitectura en capas tradicional:
1. **`config/`**: Configuraciones globales (CORS, Seguridad).
2. **`controller/`**: Puntos de entrada de la API REST.
3. **`service/`**: Lógica de negocio y orquestación.
4. **`repository/`**: Capa de acceso a datos (Spring Data JPA).
5. **`model/`**:
   - `entity/`: Clases de persistencia (Base de Datos).
   - `dto/`: Objetos de transferencia de datos.
   - `enums/`: Definiciones de tipos constantes.
6. **`mapper/`**: Conversión entre Entidades y DTOs.
7. **`security/`**: Componentes de JWT, detalles de usuario y contexto de multitenencia.
8. **`exception/`**: Manejo de excepciones personalizadas.

### Frontend (`src/`)
El frontend está organizado por responsabilidades funcionales:
1. **`api/`**: Clientes Axios configurados para cada módulo del backend.
2. **`components/`**: Componentes React reutilizables y layout.
3. **`pages/`**: Vistas principales de la aplicación (Dashboard, Ventas, Inventario, etc.).
4. **`stores/`**: Gestión de estado global con Zustand.
5. **`resources/`**: Migraciones SQL y recursos estáticos.

## Responsabilidades por Capa

| Capa | Responsabilidad |
| :--- | :--- |
| **Controller** | Validar entrada, llamar al servicio y retornar respuesta HTTP. |
| **Service** | Implementar reglas de negocio, gestionar transacciones. |
| **Repository** | Consultas a la base de datos y persistencia. |
| **DTO** | Definir el contrato de datos entre cliente y servidor. |
| **Entity** | Representar la estructura de las tablas en la BD. |

---
*Próximos pasos: Revisar [Agentes y Roles](agents.md)*
