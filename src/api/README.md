# Módulo de API (Frontend)

## Propósito
Centraliza todas las llamadas HTTP al backend mediante Axios.

## Estructura
- `axios.ts`: Configuración global de Axios (interceptores para JWT, base URL).
- `...Api.ts`: Funciones específicas para cada módulo del backend.

## Cómo extender
1. Crear un nuevo archivo `nombreApi.ts`.
2. Definir funciones asíncronas que usen la instancia de `api` (configurada en `axios.ts`).
3. Exportar las funciones para ser usadas en hooks de React Query.
