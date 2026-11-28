# MartGo

**Aplicación en producción:** [https://martgo.tech](https://martgo.tech)

**Usuario de prueba:** `admin@martgo.test` / `MartGo2026*`

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

## Screenshots

### Landing

![Landing](docs/landing.png)

### Inicio de sesión

![Login](docs/login.png)

### Dashboard

![Dashboard](docs/dashboard.png)

### Inventario

![Inventario](docs/inventario.png)

### Ventas

![Ventas](docs/ventas.png)

### Fiados

![Fiados](docs/fiados.png)

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

## Arquitectura en AWS

![Arquitectura en AWS](docs/screenshots/arquitectura.png)

El dominio `martgo.tech` apunta mediante DNS a una **Elastic IP** asociada a una instancia **EC2**. En EC2, Nginx recibe las solicitudes HTTPS administradas por **Certbot** y reenvía el tráfico a Next.js ejecutada con **PM2**. La base de datos **RDS PostgreSQL** está ubicada en una subred privada y solo el servidor EC2 puede acceder a ella. El almacenamiento privado de archivos y evidencias se administra en **S3 privado**.

## Deployment

MartGo corre en un servidor **EC2** de AWS Academy:

- **Nginx** recibe las visitas y las pasa a la app (puerto 3000). Ver `deploy/nginx-martgo.conf`.
- **PM2** mantiene la app encendida y la reinicia si se cae. Ver `ecosystem.config.js`.
- **Certbot** genera y renueva el certificado HTTPS (Let's Encrypt).
- **RDS** (PostgreSQL) guarda los datos. El servidor la usa con la variable `DATABASE_URL`, que está en el archivo `.env` del servidor (nunca en el repositorio).

### Flujo CI/CD

![Flujo CI/CD](docs/screenshots/flujo-ci-cd.png)

![GitHub Actions Deploy](docs/screenshots/github-actions-deploy.png)

El workflow `.github/workflows/ci.yml` se ejecuta en pull requests hacia `develop` o `main` y contiene los jobs secuenciales **lint**, **test** y **build**. Después de instalar las dependencias, lint revisa el código, test ejecuta las pruebas de Vitest y build genera Prisma y compila la aplicación.

El workflow `.github/workflows/deploy.yml` se ejecuta al publicar cambios en `main` o manualmente desde GitHub Actions. Contiene el job **build**, que instala, lint, prueba y compila; y el job **deploy**, que se conecta por SSH al EC2, actualiza el código, ejecuta migraciones, recompila y recarga PM2. Finalmente, verifica `/api/health` en `https://martgo.tech`.

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

## Evidencias del despliegue

### RDS y subredes

![RDS y subredes](docs/screenshots/aws-rds-subredes.png)

### Elastic IP

![Elastic IP](docs/screenshots/aws-elastic-ip.png)

### PM2 y health check

![PM2 y health check](docs/screenshots/servidor-pm2-health.png)

### Dominio HTTPS

![Dominio HTTPS](docs/screenshots/dominio-https.png)

## Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Auth.js](https://authjs.dev)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de Vitest](https://vitest.dev)
- [Documentación de AWS EC2](https://docs.aws.amazon.com/ec2/)
- [Documentación de AWS RDS](https://docs.aws.amazon.com/rds/)
- [Documentación de Nginx](https://nginx.org/en/docs/)
- [Documentación de PM2](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Documentación de Let's Encrypt](https://letsencrypt.org/docs/)

## Equipo

- **Daniel de Jesús Sánchez Sierra** — [DanielDev0625](https://github.com/DanielDev0625)
- **José Alejandro Muñoz Coronado** — [munoz08](https://github.com/munoz08)

Universidad de la Costa  
Buenas Prácticas de Desarrollo de Software  
Docente: Kelly Villa Collazos
