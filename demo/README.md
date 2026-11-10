# Demo Dr. Juanpe

App de demostración del sistema del Dr. Juanpe. Todos los pacientes son de prueba.

- `index.html`, `estilos.css`, `js/`: la app. Los archivos de `js/` se cargan en orden.
- `datos.js`: los datos de prueba. Sin Supabase configurado, la app corre con ellos y sin login.
- `api/config.js`: le entrega al navegador la dirección y la llave pública de Supabase.
- `api/ia.js` y `api/examen.js`: la IA (semáforo, asistente y lectura de exámenes). Necesitan `ANTHROPIC_API_KEY` en Vercel; sin ella la app usa reglas y una lectura de ejemplo.
- `supabase/schema.sql`: tablas. `supabase/seguridad.sql`: login con roles, portal por código y reinicio del demo. `supabase/seed.sql`: datos de prueba.

Variables en Vercel: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `ANTHROPIC_API_KEY` (opcional), `LALACHAT_URL` (opcional).
