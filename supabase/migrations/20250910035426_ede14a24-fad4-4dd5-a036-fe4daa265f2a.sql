-- Crear esquema dedicado para extensiones si no existe
CREATE SCHEMA IF NOT EXISTS extensions;

-- Mover la extensión vector del esquema public al esquema extensions
ALTER EXTENSION vector SET SCHEMA extensions;

-- Configurar search_path para roles de aplicación (seguro)
-- Esto permite usar nombres no cualificados manteniendo extensiones separadas
ALTER ROLE anon SET search_path = extensions, public;
ALTER ROLE authenticated SET search_path = extensions, public;

-- Verificar que la extensión se movió correctamente
SELECT e.extname AS extension_name,
       n.nspname AS schema_name,
       e.extversion AS version
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname = 'vector';