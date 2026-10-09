# Guía breve de administración

Para el personal del colegio: cómo publicar noticias, documentos y eventos **sin tocar código**.
Entra a `https://<dirección-del-sitio>/admin` (también hay un botón «Acceso administración» en la parte superior del sitio).

## Roles

| Rol | Puede |
| --- | --- |
| **Administrador general** | Todo: noticias, calendario, comunicados, avisos, galerías, **documentos**, equipo, preguntas frecuentes, portada/contacto/textos y **usuarios**. |
| **Editor** | Noticias, calendario, comunicados, avisos prioritarios y galerías. |

## Ingresar y recuperar el acceso

- Primera vez: quien instala el sitio crea el primer administrador en `/admin/instalacion` con el *código de instalación* (`SETUP_TOKEN`).
- Un administrador crea cuentas en **Usuarios**. Se muestra una *clave temporal una sola vez*; la persona debe cambiarla al ingresar.
- Olvidé mi clave: un administrador entra a **Usuarios → Editar o restablecer clave**. Si se pierde el acceso de todos los administradores,
  quien administra el servidor usa `/admin/recuperar` con el código `SETUP_TOKEN`.
  (La recuperación por correo requiere un servicio de correo; hoy no está conectado.)
- Las claves deben tener 10 o más caracteres con letras y números. Tras 6 intentos fallidos el ingreso se bloquea 15 minutos.

## Publicar una noticia

1. **Noticias → + Nueva noticia**.
2. Completa título, resumen, categoría y fecha. Si eliges una **fecha futura**, la noticia se publica sola ese día.
3. Escribe el texto con los botones de formato (Negrita, Título, Lista, Enlace…) y revisa en **Vista previa**.
4. Sube la **imagen de portada** (JPG, PNG o WebP, hasta 8 MB, ideal 1600 px de ancho) y escribe su descripción para lectores de pantalla.
5. Opcional: fotografías de galería y PDF adjuntos.
6. Pulsa **Publicar** (o **Guardar borrador** para seguir después).

Para retirarla del sitio: en la lista, **Despublicar** (queda como borrador) o **Eliminar** (pide confirmación y no se puede deshacer).

## Subir o reemplazar un documento (PDF)

1. **Documentos → + Subir documento** (solo administradores).
2. Elige la categoría, sube el PDF (hasta 25 MB) y marca **Publicar**; debes confirmar que está *autorizado para difusión pública*.
3. Para actualizarlo: abre el documento, elige **Reemplazar el archivo**. El anterior se elimina y la fecha de actualización pasa a hoy.
4. Un documento sin publicar queda **privado**: solo se abre con sesión iniciada.

> No subas listas de estudiantes, fichas, ni documentos con datos personales.

## Agendar un evento

**Calendario → + Nuevo evento**: nombre, tipo, fecha (y fecha de término si dura varios días), horas (hora de Chile), lugar, descripción, imagen y adjuntos opcionales.
Las familias pueden agregarlo a su calendario desde la página del evento.

## Comunicados y avisos urgentes

- **Comunicados**: avisos para apoderados. Indica *Vigente hasta*: pasada esa fecha pasan solos al **Archivo** y dejan de mostrarse como vigentes.
- **Avisos prioritarios**: mensaje breve en la parte superior de **todo el sitio**. Siempre requieren fecha de expiración.

## Galerías de fotografías

**Galerías → + Nueva galería**. Sube varias fotos a la vez y edita su texto alternativo. Para publicar debes **confirmar que existen las autorizaciones**
de los apoderados si aparecen estudiantes. No pongas nombres completos de menores en los textos.

## Portada, contacto y textos (solo administradores)

**Portada y contacto**: fotografías del carrusel de la portada (sin fotos se muestra una ilustración), título y mensaje de bienvenida,
dirección, teléfono, correos, horarios, coordenadas del mapa, redes sociales oficiales, accesos de la comunidad (plataformas oficiales)
y textos institucionales (admisión, convivencia, política de imágenes…).

## Respaldos (muy importante)

Todo lo que publicas vive en la carpeta `DATA_DIR` del servidor (`db/` = textos, `uploads/` = fotos y PDF).
**Respáldala periódicamente** (por ejemplo, una copia diaria de esa carpeta). Sin respaldo, un fallo del disco implica perder el contenido.

## Qué falta configurar (resumen para quien instala)

| Pendiente | Efecto mientras no esté |
| --- | --- |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | El formulario de contacto aparece como «aún no habilitado». |
| Coordenadas del mapa | Se muestran enlaces a mapas en lugar del mapa integrado. |
| Fotografías oficiales | Portada con ilustración referencial; galerías vacías. |
| Redes y plataformas | No se muestran. |
| Documentos reglamentarios (PDF autorizados) | Aparecen como «en preparación». |
