# Portal web institucional · Escuela Particular Monterrey N° 500

Sitio público y panel de administración de la **Escuela Particular Monterrey** (Cajón, comuna de Vilcún, Región de La Araucanía).
Todo el contenido institucional proviene del **Proyecto Educativo Institucional (PEI) 2019–2023**; lo que el PEI no dice se deja como
marcador visible `[por confirmar]`, nunca inventado.

> Diseño de referencia (portada, versión móvil y panel): lienzo «Portal Escuela Monterrey» en Claude Design.

## Qué incluye

| Área | Estado |
| --- | --- |
| Portada: hero (ilustración o carrusel de fotos oficiales), accesos rápidos, bienvenida, misión y visión, sellos, noticias, agenda, comunicados, galería, accesos de la comunidad | ✅ operativo |
| Quiénes somos (historia, misión/visión, sellos y valores, PEI + descarga, equipo directivo, establecimiento) | ✅ contenido del PEI |
| Formación (enfoque pedagógico, niveles, inclusión/PIE, talleres, plan de estudios, recursos) | ✅ contenido del PEI |
| Noticias (lista con búsqueda, categorías, años y paginación; página individual con galería, adjuntos, compartir, relacionadas) | ✅ operativo |
| Calendario (vista mensual y lista, filtros, detalle, descarga `.ics`, hora de Chile) | ✅ operativo |
| Centro de documentos (buscador, categorías, visualizar/descargar) y centro de comunicados (vigentes/archivo) | ✅ operativo |
| Galerías con visor ampliado (teclado ← → Esc, táctil) | ✅ operativo |
| Matrículas, convivencia, vida escolar, preguntas frecuentes, privacidad, contacto, buscador general | ✅ operativo |
| **Panel de administración** (login, roles, noticias, eventos, comunicados, avisos con expiración, documentos PDF, galerías, equipo, FAQ, contacto/redes/accesos, portada, textos, usuarios) | ✅ operativo con persistencia real en servidor |
| Formulario de contacto | ⚠️ se habilita al configurar el servicio de correo (Resend); mientras tanto el sitio informa que **no está habilitado** |
| Mapa integrado | ⚠️ se activa cuando el colegio valida latitud/longitud (panel → Portada y contacto) |
| Supabase / base de datos administrada | ⏳ preparado a nivel de arquitectura, no conectado (ver `docs/PERSISTENCIA.md`) |

Seguridad: contraseñas con scrypt, sesiones firmadas (HMAC) en cookie `HttpOnly`, permisos verificados **en el servidor** en cada acción,
límite de intentos de ingreso, sanitización del texto enriquecido, validación de archivos por su contenido (JPG/PNG/WebP/PDF), documentos
no publicados privados, trampa antispam + límite en el formulario de contacto, cabeceras de seguridad y `noindex` en el panel.

## Puesta en marcha

Requisitos: Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local     # y completa los valores (ver más abajo)
npm run dev                    # http://localhost:3000
```

1. En `.env.local` define al menos `SETUP_TOKEN` (mínimo 12 caracteres). En desarrollo la clave de sesiones se genera sola.
2. Abre `http://localhost:3000/admin`: te llevará a **Crear el primer administrador** (pide el `SETUP_TOKEN`).
3. (Opcional) `npm run seed:demo` carga contenido de **demostración** claramente rotulado para probar el diseño;
   se elimina con `npm run seed:demo:limpiar` o desde el panel (Resumen → Contenido de demostración).

### Cargar muchas fotografías de una vez

`node scripts/importar-fotos.mjs <carpeta> --titulo "Taller de cocina" --categoria "Actividades escolares"` crea una galería **en borrador** con todas las
imágenes de la carpeta. Para publicarla agrega `--publicar --confirmo-autorizacion` (autorizaciones de los apoderados). Las fotos quedan en `data/` (ignorada por git):
**no subas fotografías de estudiantes a este repositorio si es público.** Quita antes los datos visibles (credenciales con nombre o teléfono) y la ubicación GPS de las fotos.

### Producción

```bash
npm run build && npm start      # o: docker build -t monterrey-web . 
```

Variables obligatorias en el servidor: `SESSION_SECRET` (≥ 32 caracteres), `SETUP_TOKEN`, `NEXT_PUBLIC_SITE_URL`, y `DATA_DIR`
apuntando a un **disco persistente** con respaldo periódico. Detalles en `docs/PERSISTENCIA.md`.

> ⚠️ Plataformas «serverless» (Vercel, Netlify) tienen disco efímero: con la persistencia actual (archivos) **no** sirven. Usa un VPS, un contenedor con volumen
> (Docker, Fly.io, Railway, Render con disco) o migra a Supabase siguiendo `docs/PERSISTENCIA.md`.

## Estructura

```
src/
  app/(site)/…          páginas públicas (todas leen el contenido en cada visita)
  app/admin/…           panel: login, instalación, recuperación y (panel)/ con las secciones
  app/admin/actions/    acciones de servidor (validación zod + permisos + subida de archivos)
  app/media/[id]        entrega de archivos subidos (privados solo con sesión)
  components/           layout, home, content (tarjetas, calendario, galería), admin, ui
  content/pei.ts        contenido oficial extraído del PEI (misión, visión, sellos, historia, plan de estudios…)
  content/defaults.ts   datos iniciales (contacto, PEI como documento, equipo, FAQ)
  lib/db/               modelo de datos y almacenamiento (interfaz `Collection`)
  lib/auth.ts           contraseñas, sesión, permisos, límites de intentos
scripts/seed-demo.mjs   contenido de demostración
docs/                   guía de administración y persistencia
```

## Contenido y datos pendientes de validar con la dirección

- Datos del PEI **2019**: número de docentes, infraestructura y programas pueden haber cambiado; revísalos.
- Equipo directivo: solo figuran la Directora y el Jefe de UTP, tal como aparecen firmando el PEI. Agrega fotografías y más fichas desde el panel.
- Reglamentos (Orden, Higiene y Seguridad; Convivencia; Evaluación), PISE, PME y protocolos: se muestran como «en preparación» hasta que se suban los PDF autorizados.
- Matrículas: proceso, requisitos, fechas y documentos están como marcadores para completar con información oficial (panel → Portada y contacto → Textos).
- Redes sociales, plataformas de la comunidad, coordenadas del mapa y fotografías institucionales: se cargan desde el panel.
- La política de privacidad es un borrador de buenas prácticas: debe ser revisada por el sostenedor.
- Misión, visión y sellos usan la formulación oficial del PEI (están en `src/content/pei.ts`).
