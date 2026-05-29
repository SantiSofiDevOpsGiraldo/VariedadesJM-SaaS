# Contexto de Controladores

## Propósito
Asegurar una interfaz de comunicación limpia y estandarizada entre el frontend y el backend.

## Reglas Locales
- **Cero Lógica de Negocio**: Ningún controlador debe contener lógica de negocio; todo debe estar en los servicios.
- **Validación**: Siempre usar `@Valid` para peticiones `POST` y `PUT`.
- **Respuestas**: Preferir retornar `ResponseEntity<T>` para tener control sobre los códigos de estado HTTP.

## Decisiones Técnicas
- **Multitenencia**: El `company_id` no se recibe como parámetro en los endpoints; se extrae automáticamente del token en la capa de seguridad/servicio.
