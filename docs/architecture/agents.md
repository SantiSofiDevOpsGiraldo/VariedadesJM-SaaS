# Agentes y Roles de IA - CajaClara SAAS

## Propósito
Este documento define cómo los agentes de IA (como Trae, GitHub Copilot, etc.) y los ingenieros humanos deben interactuar con el sistema para mantener su integridad y evolución.

## Roles de Agentes

### 1. Arquitecto de IA (Senior Software Architect)
- **Rol**: Guardián de la estructura y la documentación.
- **Responsabilidades**:
  - Asegurar que cada cambio en el código esté reflejado en `docs/`.
  - Validar que se sigan los patrones de diseño (Dada la arquitectura de capas).
  - Mantener la coherencia del modelo multi-inquilino.
- **Herramientas**: `SearchCodebase`, `Grep`, `TodoWrite`, `docs/`.
- **Objetivo**: Minimizar la deuda técnica y de documentación.

### 2. Desarrollador de Feature (Feature Agent)
- **Rol**: Implementador de nuevas funcionalidades.
- **Responsabilidades**:
  - Crear controladores, servicios y repositorios siguiendo el estándar.
  - Actualizar los DTOs y Mappers necesarios.
  - Implementar la lógica de negocio en la capa de `service/`.
- **Memoria**: Debe consultar siempre `docs/context/domain-context.md` antes de implementar.
- **Objetivo**: Entregar código funcional, probado y documentado a nivel de módulo.

### 3. Especialista en Frontend (UI/UX Agent)
- **Rol**: Desarrollador de la interfaz de usuario.
- **Responsabilidades**:
  - Crear componentes React mantenibles.
  - Asegurar la correcta integración con la API a través de `src/api/`.
  - Mantener el estado global limpio en `src/stores/`.
- **Objetivo**: Proporcionar una experiencia de usuario fluida y consistente.

## Interacción con la Memoria (Documentación)

Los agentes de IA deben seguir este flujo de "memoria" para cualquier tarea:
1. **Lectura de Contexto**: Leer `docs/index.md` y los archivos vinculados.
2. **Análisis de Impacto**: Identificar qué módulos se ven afectados.
3. **Actualización de Contexto**: Modificar los `.md` ANTES de tocar el código.
4. **Ejecución**: Realizar los cambios en el código.
5. **Verificación**: Asegurar que la documentación y el código son coherentes.

---
*Próximos pasos: Revisar [Lógica de Negocio](../business/logic.md)*
