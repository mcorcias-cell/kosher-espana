# ✡️ Kosher España — Guía de Implementación Completa

Tiempo estimado: **2-3 horas** para tenerlo funcionando en producción.

---

## ÍNDICE
1. [Requisitos previos](#1-requisitos-previos)
2. [Crear cuentas en servicios gratuitos](#2-crear-cuentas-en-servicios-gratuitos)
3. [Configurar la base de datos (Supabase)](#3-configurar-la-base-de-datos-supabase)
4. [Configurar almacenamiento de imágenes (Cloudinary)](#4-configurar-almacenamiento-de-imágenes-cloudinary)
5. [Configurar el email (Resend)](#5-configurar-el-email-resend)
6. [Desplegar el Backend (Railway)](#6-desplegar-el-backend-railway)
7. [Desplegar el Frontend (Vercel)](#7-desplegar-el-frontend-vercel)
8. [Configurar el primer administrador](#8-configurar-el-primer-administrador)
9. [Verificar que todo funciona](#9-verificar-que-todo-funciona)
10. [Mantenimiento y seguridad](#10-mantenimiento-y-seguridad)

---

## 1. REQUISITOS PREVIOS

Necesitas tener instalado en tu ordenador:
- **Node.js** versión 18 o superior → https://nodejs.org
- **Git** → https://git-scm.com
- Una cuenta de **GitHub** → https://github.com (gratis)

Para verificar que los tienes, abre una terminal y escribe:
```
node --version   # debe mostrar v18.x.x o superior
git --version    # debe mostrar cualquier versión
```

---

## 2. CREAR CUENTAS EN SERVICIOS GRATUITOS

Necesitas crear cuenta en estos 4 servicios (todos gratuitos para empezar):

### A) Supabase (base de datos)
1. Ve a https://supabase.com y haz clic en "Start for free"
2. Regístrate con tu email o GitHub
3. Haz clic en "New Project"
4. Ponle nombre: `kosher-espana`
5. Crea una contraseña segura para la base de datos y **guárdala**
6. Selecciona región: **Frankfurt (eu-central-1)** (más cerca de España)
7. Haz clic en "Create new project" y espera 2 minutos

### B) Cloudinary (imágenes de productos)
1. Ve a https://cloudinary.com y haz clic en "Sign Up for Free"
2. Rellena el formulario (plan gratuito es suficiente)
3. Una vez dentro, ve al **Dashboard**
4. Anota estos 3 datos que necesitarás:
   - Cloud name
   - API Key
   - API Secret

### C) Resend (emails)
1. Ve a https://resend.com y haz clic en "Get Started"
2. Regístrate con tu email
3. Una vez dentro, ve a **API Keys** en el menú lateral
4. Haz clic en "Create API Key" y dale un nombre: `kosher-espana`
5. **Copia y guarda la API key** (solo se muestra una vez)

**Nota sobre el email:** Para empezar, Resend te permite enviar emails desde `onboarding@resend.dev`. Más adelante puedes agregar tu propio dominio.

### D) Railway (backend)
1. Ve a https://railway.app y haz clic en "Get Started"
2. Regístrate con tu cuenta de GitHub
3. El plan gratuito incluye $5/mes de crédito (suficiente para empezar)

### E) Vercel (frontend)
1. Ve a https://vercel.com y haz clic en "Sign Up"
2. Regístrate con tu cuenta de GitHub
3. Plan gratuito es suficiente indefinidamente para el frontend

---

## 3. CONFIGURAR LA BASE DE DATOS (SUPABASE)

### Obtener la URL de conexión
1. En Supabase, ve a tu proyecto → **Settings** → **Database**
2. Baja hasta "Connection string" y selecciona la pestaña **URI**
3. Copia la URL que aparece (tiene el formato: `postgresql://...`)
4. **Reemplaza `[YOUR-PASSWORD]`** con la contraseña que creaste en el paso 2A
5. Guarda esta URL, la necesitarás en el siguiente paso

### Crear las tablas
Hay dos formas de hacerlo:

**Opción A: Desde el SQL Editor de Supabase** (más fácil)
1. En Supabase, ve a **SQL Editor** en el menú lateral
2. Abre el archivo `backend/src/config/migrate.js` de este proyecto
3. Copia solo el contenido que está entre las comillas del `const schema = \`...\``
4. Pégalo en el SQL Editor y haz clic en **Run**

**Opción B: Ejecutando el script localmente**
1. Copia `backend/.env.example` como `backend/.env`
2. Rellena `DATABASE_URL` con la URL de Supabase
3. Ejecuta: `cd backend && npm install && npm run migrate`

---

## 4. CONFIGURAR ALMACENAMIENTO DE IMÁGENES (CLOUDINARY)

No necesitas configurar nada adicional en Cloudinary.
Solo necesitas los 3 datos del Dashboard (Cloud name, API Key, API Secret).
Los añadirás como variables de entorno en Railway (paso 6).

---

## 5. CONFIGURAR EL EMAIL (RESEND)

Para empezar a usar Resend:
1. La API key que copiaste antes es todo lo que necesitas
2. El email de origen será: `onboarding@resend.dev` (gratis, sin configuración)
3. Cuando quieras usar tu propio dominio (p.ej. `noreply@kosherespana.es`):
   - Ve a Resend → **Domains** → "Add Domain"
   - Sigue las instrucciones para verificar tu dominio

---

## 6. DESPLEGAR EL BACKEND (RAILWAY)

### Preparar el código
1. Sube el proyecto a GitHub:
```bash
cd kosher-app
git init
git add .
git commit -m "Primera versión de Kosher España"
```
2. Ve a https://github.com → "New repository"
3. Ponle nombre: `kosher-espana`
4. Haz clic en "Create repository"
5. Copia y ejecuta los comandos que GitHub te muestra (git remote add origin... git push)

### Desplegar en Railway
1. Ve a https://railway.app y haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Selecciona el repositorio `kosher-espana`
4. Railway detectará el proyecto. Haz clic en el proyecto creado
5. Ve a **Settings** → cambia el **Root Directory** a `/backend`
6. Ve a **Variables** y añade estas variables una por una:

```
DATABASE_URL        = (la URL de Supabase del paso 3)
JWT_SECRET          = (genera una cadena aleatoria larga, p.ej.: kosher_espana_secreto_seguro_2024_madrid)
JWT_EXPIRES_IN      = 7d
CLOUDINARY_CLOUD_NAME = (de tu Dashboard de Cloudinary)
CLOUDINARY_API_KEY  = (de tu Dashboard de Cloudinary)
CLOUDINARY_API_SECRET = (de tu Dashboard de Cloudinary)
RESEND_API_KEY      = (la API key de Resend)
EMAIL_FROM          = onboarding@resend.dev
NODE_ENV            = production
ADMIN_EMAIL         = (tu email de administrador)
ADMIN_PASSWORD      = (una contraseña segura para el admin)
```

7. Para `FRONTEND_URL`: por ahora pon `https://kosher-espana.vercel.app` (lo actualizarás después)
8. Railway desplegará automáticamente. En 2-3 minutos tendrás una URL tipo: `https://kosher-espana-production.up.railway.app`
9. **Guarda esa URL**, la necesitas para el siguiente paso

### Crear las tablas y el admin
Una vez desplegado:
1. En Railway, ve a tu proyecto → pestaña **Deploy** → haz clic en los tres puntos → "Run Command"
2. Ejecuta: `npm run migrate`
3. Luego ejecuta: `npm run seed`

---

## 7. DESPLEGAR EL FRONTEND (VERCEL)

1. Ve a https://vercel.com/new
2. Importa el repositorio `kosher-espana` de GitHub
3. En "Configure Project":
   - **Root Directory**: haz clic en "Edit" y escribe `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Haz clic en **Environment Variables** y añade:
   ```
   REACT_APP_API_URL = https://TU-URL-DE-RAILWAY.up.railway.app/api
   ```
   (reemplaza con la URL real de Railway del paso 6)
5. Haz clic en "Deploy"
6. En 2-3 minutos tendrás tu URL del frontend: `https://kosher-espana.vercel.app`

### Actualizar el CORS en Railway
1. Vuelve a Railway → Variables
2. Actualiza `FRONTEND_URL` con la URL real de Vercel: `https://kosher-espana.vercel.app`
3. Railway redesplegará automáticamente

---

## 8. CONFIGURAR EL PRIMER ADMINISTRADOR

El usuario admin ya fue creado en el paso 6 con el email y contraseña que configuraste.

Para crear validadores:
1. Inicia sesión en la app con tu cuenta de admin
2. Ve al **Panel Admin** (aparece en el menú superior)
3. En la lista de usuarios, encuentra los usuarios que quieres convertir en validadores
4. Cambia su rol a "validador" en el dropdown
5. Añade la comunidad a la que pertenecen (p.ej. "Madrid", "Barcelona")

---

## 9. VERIFICAR QUE TODO FUNCIONA

Sigue esta lista de verificación:

### Backend
- [ ] Abre `https://tu-url-railway.up.railway.app/api/health` → debe devolver `{"status":"OK"}`
- [ ] Intenta hacer login con el usuario admin → debe funcionar

### Frontend
- [ ] Abre tu URL de Vercel → debe cargar la página de búsqueda
- [ ] Haz clic en "Registrarse" y crea una cuenta de prueba → debe funcionar
- [ ] Con la cuenta de admin, ve al Panel Admin → debes ver estadísticas
- [ ] Sube un producto de prueba → debe guardarse como "pendiente"
- [ ] Con el admin, valida ese producto desde el Panel Validador
- [ ] El producto debe aparecer en la búsqueda principal

### Emails
- [ ] Al validar un producto, el usuario que lo subió debe recibir un email de notificación

---

## 10. MANTENIMIENTO Y SEGURIDAD

### Backups automáticos
Supabase hace backups automáticos diarios (plan gratuito: 7 días de retención).
Para backups manuales: ve a Supabase → Settings → Database → Backups.

### Monitoreo
- Railway muestra logs en tiempo real en la pestaña "Logs"
- Si algo falla, los logs te mostrarán el error exacto

### Escalar cuando crezca
Cuando tengas muchos usuarios:
- **Railway**: cambia al plan Hobby ($5/mes, sin límite de tiempo)
- **Supabase**: el plan Pro ($25/mes) añade más conexiones y backups
- **Cloudinary**: el plan gratuito aguanta hasta ~25,000 imágenes

### Añadir tu dominio propio
1. Compra un dominio en cualquier registrador (Namecheap, Nominalia, etc.)
2. En Vercel: Settings → Domains → "Add Domain"
3. Sigue las instrucciones para apuntar el DNS a Vercel
4. El HTTPS se configura automáticamente

### Seguridad - cosas importantes
- Nunca compartas el archivo `.env` con nadie
- Cambia el JWT_SECRET si sospechas que fue comprometido
- Los validadores solo deben ser personas de confianza de la comunidad
- Revisa regularmente el panel de admin para detectar contenido inapropiado

---

## ESTRUCTURA DEL PROYECTO

```
kosher-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       ← Conexión a PostgreSQL
│   │   │   ├── cloudinary.js     ← Configuración de imágenes
│   │   │   ├── migrate.js        ← Crea las tablas
│   │   │   └── seed.js           ← Crea el admin inicial
│   │   ├── controllers/          ← Lógica de negocio
│   │   ├── middleware/           ← Auth y seguridad
│   │   ├── routes/               ← Endpoints de la API
│   │   ├── services/             ← Email y cron jobs
│   │   └── index.js              ← Punto de entrada
│   ├── package.json
│   ├── .env.example              ← Copia esto a .env
│   └── railway.toml              ← Config de Railway
└── frontend/
    ├── src/
    │   ├── components/           ← Componentes reutilizables
    │   ├── context/              ← Estado global (Auth)
    │   ├── pages/                ← Páginas de la app
    │   ├── services/             ← Llamadas a la API
    │   ├── App.js                ← Rutas principales
    │   └── index.js              ← Punto de entrada
    ├── public/
    │   └── index.html
    ├── package.json
    ├── .env.example
    └── vercel.json               ← Config de Vercel
```

---

## FLUJOS PRINCIPALES

### Usuario regular
1. Se registra → puede buscar productos y subir nuevos
2. Sube un producto (con foto y justificación) → queda en "pendiente"
3. Recibe email cuando su producto es validado o rechazado
4. Puede reportar dónde encontrar un producto (supermercado + localidad)
5. Puede suscribirse a reportes semanales o mensuales

### Usuario intermedio
1. Ve los productos pendientes en su panel
2. Puede añadir información adicional para ayudar a los validadores
3. No puede aprobar ni rechazar productos

### Validador
1. Recibe notificaciones de productos pendientes
2. Revisa el producto, la justificación y la info intermedia
3. Elige el tipo de validación y puede añadir notas
4. Valida o rechaza el producto
5. Recibe resumen mensual con productos para revalidar
6. Revalida productos a los 2 meses de su última validación

### Administrador
1. Gestiona usuarios (cambiar roles, activar/desactivar)
2. Asigna comunidades a los validadores
3. Ve estadísticas generales
4. Puede validar productos directamente
5. Puede retirar cualquier producto

---

## SOPORTE Y AYUDA

Si algo no funciona:
1. Revisa los logs en Railway (pestaña "Logs")
2. Verifica que todas las variables de entorno están bien configuradas
3. Asegúrate de que ejecutaste `npm run migrate` y `npm run seed`

Para preguntas técnicas, puedes describir el error exacto que aparece en los logs.
