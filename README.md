# MartGo

MartGo es una aplicación web (SaaS) para tiendas de barrio. Ayuda a llevar el **inventario**, las **ventas** y los **fiados** (ventas a crédito) desde el computador o el celular.

Es un proyecto académico de la Universidad de la Costa.

## Funcionalidades

- **Inicio de sesión** con dos roles: Administrador y Vendedor. Cada usuario solo ve los datos de su tienda.
- **Resumen**: ventas del día, fiado pendiente, productos por reponer y gráficas de ventas (últimos 7 días, productos más vendidos, contado vs. fiado).
- **Inventario**:
  - Búsqueda por nombre o código.
  - Creación de productos (solo el administrador).
  - Estado "Reponer / Suficiente" según el stock mínimo y el ritmo de venta.
- **Ventas**: registro de ventas de contado o fiadas. El stock se descuenta automáticamente.
- **Fiados**: lista de clientes con deuda y registro de abonos. Cada abono paga primero la deuda más antigua.

## Tecnologías

| Parte          | Herramienta                                       |
| -------------- | ------------------------------------------------- |
| Framework      | Next.js 15 (App Router) + React 19 + TypeScript   |
| Estilos        | Tailwind CSS 4                                    |
| Base de datos  | PostgreSQL + Prisma 7                             |
| Autenticación  | Auth.js (next-auth v5) con usuario y contraseña   |
| Gráficas       | Recharts                                          |
| Pruebas        | Vitest                                            |
| CI/CD          | GitHub Actions                                    |

## Cómo correrlo en local

**Requisitos:** Node.js 24 y una base de datos PostgreSQL (local o en la nube).

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Crear un archivo `.env` en la raíz con estas variables (los valores de aquí son solo un ejemplo):

   ```env
   DATABASE_URL="postgresql://usuario:clave@localhost:5432/martgo"
   AUTH_SECRET="una-cadena-larga-y-aleatoria"
   ```

   El `AUTH_SECRET` se puede generar con `npx auth secret`. El archivo `.env` no se sube al repositorio.

3. Preparar la base de datos y cargar los datos de prueba:

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npm run db:seed
   ```

4. Arrancar la app:

   ```bash
   npm run dev
   ```

   Se abre en [http://localhost:3000](http://localhost:3000).

**Usuario de prueba** (lo crea el seed): `admin@martgo.test` / `MartGo2026*`

## Scripts

| Comando           | Qué hace                                     |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo                       |
| `npm run build`   | Compila la app para producción               |
| `npm start`       | Arranca la app ya compilada                  |
| `npm run lint`    | Revisa el código con ESLint                  |
| `npm test`        | Corre las pruebas unitarias (Vitest)         |
| `npm run db:seed` | Carga la tienda, el usuario y los productos de prueba |

## Estructura del proyecto

```
app/
  page.tsx            Página de inicio
  login/              Inicio de sesión
  dashboard/          Resumen, inventario, ventas y fiados
  api/                Rutas API (auth, productos, health)
components/           Menú lateral, encabezado, gráficas y piezas de interfaz
lib/                  Lógica compartida (Prisma, reglas de stock, datos de gráficas)
prisma/               Esquema, migraciones y datos de prueba
tests/                Pruebas unitarias
deploy/               Configuración de Nginx
.github/workflows/    CI (pull requests) y Deploy (rama main)
```

## Flujo de trabajo

- Cada tarea se hace en una rama `feature/...` creada desde `develop`.
- Al abrir un pull request hacia `develop` o `main`, el workflow **CI** corre lint, tests y build.
- `main` es la versión en producción: cada merge a `main` se despliega solo.

## Deployment

MartGo corre en un servidor **EC2** de AWS Academy:

- **Nginx** recibe las visitas y las pasa a la app (puerto 3000). Ver `deploy/nginx-martgo.conf`.
- **PM2** mantiene la app encendida y la reinicia si se cae. Ver `ecosystem.config.js`.
- **Certbot** genera y renueva el certificado HTTPS (Let's Encrypt).
- **RDS** (PostgreSQL) guarda los datos. El servidor la usa con la variable `DATABASE_URL`, que está en el archivo `.env` del servidor (nunca en el repositorio).

**Deploy automático:** cada merge a `main` ejecuta `.github/workflows/deploy.yml`, que también se puede lanzar a mano desde la pestaña *Actions*. El workflow hace tres cosas:

1. Revisa el código con lint, tests y build. Si algo falla, no se despliega.
2. Entra al EC2 por SSH, baja `main`, instala las dependencias, aplica las migraciones (`prisma migrate deploy`), compila y recarga la app con `pm2 reload martgo`.
3. Comprueba que `https://<dominio>/api/health` responda.

**Secrets necesarios** (GitHub → *Settings → Secrets and variables → Actions*):

| Secret        | Qué es                                                   |
| ------------- | -------------------------------------------------------- |
| `EC2_HOST`    | IP pública o dominio del servidor EC2                    |
| `EC2_USER`    | Usuario SSH del servidor (por ejemplo, `ubuntu`)         |
| `EC2_SSH_KEY` | Llave privada SSH (contenido completo del archivo `.pem`) |
| `APP_DOMAIN`  | Dominio de la app, sin `https://`                        |
