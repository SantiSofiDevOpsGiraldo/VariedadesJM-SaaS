# Workflows - CajaClara SAAS

## 1. Onboarding de Empresa y Usuario

Este flujo describe cómo una nueva empresa se registra en la plataforma.

```mermaid
sequenceDiagram
    participant U as Usuario Propietario
    participant A as AuthController
    participant S as AuthService
    participant C as CompanyRepository
    participant DB as Base de Datos

    U->>A: Registro (Datos Empresa + Admin)
    A->>S: createCompanyAndAdmin(dto)
    S->>C: save(Company)
    C->>DB: Insert Company
    S->>S: createAdminUser(companyId)
    S->>DB: Insert User (Role: ADMIN)
    S-->>A: Confirmación + JWT
    A-->>U: Bienvenida / Dashboard
```

## 2. Flujo de Venta y Stock

```mermaid
graph TD
    A[Inicio Venta] --> B{¿Caja Abierta?}
    B -- No --> C[Solicitar Apertura de Caja]
    B -- Sí --> D[Agregar Productos al Carrito]
    D --> E{¿Hay Stock?}
    E -- No --> F[Mostrar Advertencia/Bloqueo]
    E -- Sí --> G[Procesar Pago]
    G --> H[Generar Registro de Venta]
    H --> I[Actualizar Stock en BD]
    I --> J[Registrar Movimiento en Caja]
    J --> K[Fin de Venta]
```

## 3. Gestión de Servicios

```mermaid
stateDiagram-v2
    [*] --> PENDING: Orden Creada
    PENDING --> IN_PROGRESS: Trabajo Iniciado
    IN_PROGRESS --> COMPLETED: Trabajo Terminado
    COMPLETED --> PAID: Pago Recibido
    PAID --> [*]
```
