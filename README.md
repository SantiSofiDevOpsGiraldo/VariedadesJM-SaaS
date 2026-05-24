# 💰 Variedades JM - POS SaaS (Java + React)

**Sistema de Punto de Venta (POS) para la gestión de inventario, ventas y caja en pequeñas y medianas empresas**

---

## 📌 Descripción del Proyecto

**Variedades JM - POS SaaS** es una solución tecnológica orientada a la digitalización de negocios como misceláneas, tiendas de barrio y emprendimientos locales.

El sistema permite gestionar de manera eficiente procesos clave como ventas, inventario, control de caja y administración de usuarios, mediante una arquitectura moderna **full stack**.

Este proyecto hace parte del proceso de formación en **Análisis y Desarrollo de Software (SENA)**, aplicando buenas prácticas de ingeniería de software, arquitectura por capas y desarrollo de aplicaciones web escalables.

---

## 🎯 Objetivos

### Objetivo General

Desarrollar un sistema POS tipo SaaS que optimice la gestión operativa de pequeños negocios.

### Objetivos Específicos

* Implementar un backend robusto con Spring Boot
* Desarrollar una interfaz interactiva con React
* Gestionar inventario y ventas en tiempo real
* Aplicar autenticación segura mediante JWT
* Integrar base de datos relacional con control de migraciones

---

## 🚀 Funcionalidades Principales

* 🧾 Registro de ventas (POS)
* 📦 Gestión de inventario (CRUD de productos)
* 💵 Control de caja (ingresos y egresos)
* 👤 Gestión de usuarios y autenticación (JWT)
* 📊 Base para generación de reportes
* 🔐 Seguridad en endpoints

---

## 🛠️ Tecnologías Utilizadas

### Backend

* Java 17
* Spring Boot
* Maven
* MySQL
* Flyway (migraciones)
* JWT (autenticación y seguridad)

### Frontend

* React (Vite)
* TypeScript
* React Router
* React Query
* Zustand

### DevOps / Infraestructura

* Docker
* Docker Compose

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura cliente-servidor con separación de responsabilidades:

* **Backend (Spring Boot)**
  Manejo de lógica de negocio, seguridad, persistencia y API REST.

* **Frontend (React)**
  Interfaz de usuario, consumo de API y manejo de estado.

* **Base de datos (MySQL)**
  Persistencia estructurada con control de versiones mediante Flyway.

---

## 📁 Estructura del Proyecto

```text
VariedadesJM_JAVA/
  src/
    main/
      java/com/variedadesjm/     # Backend (Spring Boot)
      resources/
        application.properties
        db/migration/            # Migraciones Flyway
    api/                         # Cliente HTTP (frontend)
    components/                  # Componentes React
    pages/                       # Vistas principales
    stores/                      # Estado global (Zustand)
    App.tsx
    main.tsx
    types.ts
  pom.xml                        # Configuración Maven (backend)
  package.json                   # Dependencias frontend
  Dockerfile                     # Contenedor frontend
  docker-compose.yml             # Orquestación de servicios
```

---

## ⚙️ Requisitos del Sistema

* Java 17 o superior
* Maven 3.9 o superior
* Node.js 20 o superior
* MySQL 8.0 o superior
* Docker (opcional)

---

## 🔧 Configuración

Archivo principal:

```bash
src/main/resources/application.properties
```

Configuraciones por defecto:

* Base de datos: `variedadesjm`
* Usuario: `root`
* Contraseña: `rootpassword`
* Puerto backend: `8080`
* Seguridad: JWT configurado internamente

---

## ▶️ Ejecución en Entorno de Desarrollo

### 1. Base de Datos (MySQL)

**Opción Docker:**

```bash
docker run --name variedades-jm-mysql ^
  -e MYSQL_ROOT_PASSWORD=rootpassword ^
  -e MYSQL_DATABASE=variedadesjm ^
  -p 3307:3306 ^
  -d mysql:8.0
```

---

### 2. Backend (Spring Boot)

```bash
mvn spring-boot:run
```

Disponible en:
http://localhost:8080

---

### 3. Frontend (React)

```bash
pnpm install
pnpm dev
```

Disponible en:
http://localhost:3000

---

## 📦 Construcción para Producción

### Backend

```bash
mvn -DskipTests package
```

Ejecutar:

```bash
java -jar target/backend-variedades-jm-1.0.0.jar
```

---

### Frontend

```bash
pnpm build
```

Salida en carpeta:

```bash
dist/
```

## ⚙️ Uso de pnpm (reemplazo de npm)

Este repositorio usa `pnpm` como gestor de paquetes. Recomendado usar `corepack` para controlar la versión de `pnpm` en entornos CI/Docker.

- Instalar/activar `pnpm` con Corepack (local/CI):

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm -v
```

- Instalar dependencias y ejecutar en desarrollo:

```bash
pnpm install
pnpm dev
```

- Construir para producción:

```bash
pnpm build
```

- Aprobación de build scripts (si pnpm muestra advertencia):

```bash
pnpm approve-builds
```

### Ejemplo para CI / Dockerfile

En pipelines o `Dockerfile` use `corepack` antes de instalar y fije el lockfile:

```dockerfile
# copiar lockfile y package.json primero para aprovechar cache
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate \
  && pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build
```

En CI, reemplace `npm ci` / `npm install` por:

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm install --frozen-lockfile
pnpm run build
```


---

## 🐳 Despliegue con Docker

El proyecto incluye configuración para contenedores:

* Backend (Spring Boot)
* Frontend (Nginx + build Vite)
* Base de datos MySQL

### Ejecutar todo el entorno

```bash
docker compose up -d --build
```

### Comandos útiles

```bash
docker compose ps
docker compose logs -f
docker compose down
```

---

## 📊 Estado del Proyecto

* ✔ Estructura del proyecto definida
* ✔ Backend funcional
* ✔ Frontend funcional
* ✔ Integración básica completa
* 🚧 En desarrollo: mejoras de seguridad, reportes y despliegue en la nube

---

## 🎓 Contexto Académico

Proyecto desarrollado como parte del programa de formación:

**Tecnólogo en Análisis y Desarrollo de Software – SENA**

Aplicando:

* Buenas prácticas de desarrollo
* Arquitectura en capas
* Control de versiones (Git)
* Documentación técnica

---

## 📄 Licencia

Uso académico y formativo. Proyecto desarrollado para **Variedades JM**.
