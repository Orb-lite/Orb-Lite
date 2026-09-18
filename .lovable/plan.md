# Sección de video de unidades en la plataforma

## Objetivo
Añadir la pantalla "Video" que subiste a la plataforma de rastreo, para consultar las cámaras configuradas de cada unidad en cuentas ORB-FULL.

## Cambios
- Crear la página `/wialon/video` con el contenido del archivo que enviaste: selector de unidad, tarjetas por cámara (activa/inactiva, con o sin grabación) y enlace al visor oficial.
- En cuentas ORB-LITE la página avisa que el video solo está disponible en ORB-FULL.
- Agregar la lectura real de la configuración de cámaras desde la plataforma (falta hoy), para que la página muestre datos verdaderos y no un error.
- Sumar la pestaña "Video" al menú de la plataforma, visible solo cuando la cuenta conectada es ORB-FULL.
- Revisar que la página abra, cargue unidades y muestre mensajes claros cuando la cuenta no tenga cámaras o permisos.

## Detalles técnicos
- Nuevo `src/routes/wialon/video.tsx` (o `wialon.video.tsx`, según convención actual) tal como se subió.
- Nueva server function `wialonVideoSettings` en `src/lib/wialon.functions.ts`: valida sesión y `unitId`, consulta la unidad con los flags de propiedades/ajustes y devuelve `cameras: { index, name, active, recording }[]`, con mensaje de error si la cuenta carece de permisos o del servicio de video.
- La pestaña en `src/routes/wialon.tsx` se filtra por `session.host === 'full'`.
- `head()` propio con título, descripción y `noindex`, como el resto de las páginas de la plataforma.
