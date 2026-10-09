# Persistencia, despliegue y migración a Supabase

## Cómo se guarda hoy (operativo)

El sitio guarda lo que se publica en el **disco del servidor**, dentro de `DATA_DIR` (por defecto `./data`):

```
data/
  db/        news.json, events.json, announcements.json, alerts.json, documents.json,
             galleries.json, team.json, faqs.json, users.json, media.json, settings.json
  uploads/   <id>.jpg|png|webp|pdf   (archivos subidos desde el panel)
```

- Escrituras **atómicas** (archivo temporal + renombre) y serializadas por colección, dentro del proceso.
- Es persistencia **real y compartida**: lo que publica un usuario lo ven todos y sobrevive a reinicios.
- **No es** `localStorage` ni datos de ejemplo en el navegador.
- Limitaciones honestas: una sola instancia del servidor (no balanceo entre varias máquinas), sin historial de versiones y con respaldo manual.
  Para un colegio con un único sitio es suficiente; para crecer, migrar (abajo).

### Despliegue recomendado

1. VPS o contenedor con **volumen persistente** montado en `DATA_DIR` (p. ej. `/var/monterrey-data`).
2. Variables de entorno: `SESSION_SECRET`, `SETUP_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `DATA_DIR` (+ Resend si se desea contacto).
3. HTTPS delante (Caddy, Nginx o el proxy de la plataforma). La cookie de sesión es `Secure` en producción.
4. Respaldo diario de `DATA_DIR` (rsync, snapshot del volumen, etc.).

Ejemplo `Dockerfile` incluido en el repositorio:

```bash
docker build -t monterrey-web .
docker run -d --name monterrey -p 3000:3000 -v monterrey-data:/data \
  -e DATA_DIR=/data -e SESSION_SECRET=… -e SETUP_TOKEN=… -e NEXT_PUBLIC_SITE_URL=https://… monterrey-web
```

## Migración a Supabase (preparada, no conectada)

No hay credenciales de Supabase en este proyecto, por lo que **no se conectó** y no se presenta como funcional. La capa de datos está aislada para migrar sin tocar páginas:

- `src/lib/db/store.ts` expone `db.<colección>` con la interfaz `all / find / insert / update / remove / replaceAll` y `db.settings.get / save`.
  Un adaptador Supabase implementa esos mismos métodos sobre tablas Postgres (una por colección, columnas = campos de `src/lib/db/types.ts`).
- `src/lib/media.ts` (subida/lectura/borrado de archivos) se reemplaza por **Supabase Storage** (bucket privado + URLs firmadas para documentos no publicados,
  bucket público para imágenes publicadas). La ruta `/media/[id]` ya controla visibilidad y puede delegar en Storage.
- Autenticación: hoy es propia (scrypt + cookie firmada). Con Supabase Auth se reemplazan `login`, `getSessionUser` y la recuperación por correo
  (que sí quedaría operativa al tener servicio de correo). Los roles se guardan en una tabla `profiles` y se mantienen las comprobaciones en servidor (`assertCan`).
- Activar **Row Level Security**: lectura pública solo de filas publicadas/vigentes; escritura solo por rol.

Pasos sugeridos cuando existan credenciales: crear el proyecto → tablas → adaptador `store.supabase.ts` → mover `uploads/` a Storage →
variables `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` (esta última **solo** en el servidor, nunca en el navegador).

## Seguridad: lista de verificación antes de publicar

- [ ] `SESSION_SECRET` largo y único; `SETUP_TOKEN` guardado en un gestor de contraseñas.
- [ ] Sitio servido por HTTPS.
- [ ] Respaldo de `DATA_DIR` probado (restaurar en otra máquina).
- [ ] Revisar con la dirección: datos del PEI 2019, política de privacidad, autorizaciones de imágenes.
- [ ] Cambiar las claves temporales y eliminar el contenido de demostración.
