-- Crear esquema completo para Recursos Certifica Global (MXN)

-- Catálogo de productos (ebooks, plantillas, cursos, masterclasses, bundles)
CREATE TABLE IF NOT EXISTS public.resource_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  type TEXT CHECK (type IN ('ebook','plantilla','toolkit','curso','masterclass','bundle')) NOT NULL,
  standards TEXT[] DEFAULT '{}',      -- ['EC0217','EC0301']
  level TEXT,                         -- 'Básico', 'Intermedio', 'Avanzado'
  sector TEXT,                        -- 'Educación', 'Tecnología', etc.
  duration TEXT,                      -- '2h', '12 lecciones', '45 páginas'
  price_cents INT NOT NULL,           -- Precio en centavos MXN
  currency TEXT NOT NULL DEFAULT 'MXN' CHECK (currency = 'MXN'),
  is_free BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  cover_url TEXT,
  hero_media_url TEXT,
  instructor TEXT,
  outcomes JSONB DEFAULT '[]',        -- ["Diseñar sesiones con rúbricas", ...]
  target_audience JSONB DEFAULT '[]', -- ["Para quién es", "No es para"]
  curriculum JSONB DEFAULT '[]',      -- Módulos/lecciones
  bonuses JSONB DEFAULT '[]',         -- Bonos adicionales
  testimonials JSONB DEFAULT '[]',    -- Testimonios
  faq JSONB DEFAULT '[]',             -- FAQ
  guarantee_days INT DEFAULT 7,       -- Días de garantía
  seo JSONB DEFAULT '{}',             -- {title, description, og_image}
  rating DECIMAL(3,2) DEFAULT 0,
  total_purchases INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Assets/descargas/clases de cada producto
CREATE TABLE IF NOT EXISTS public.resource_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.resource_products(id) ON DELETE CASCADE,
  kind TEXT CHECK (kind IN ('pdf','video','zip','link','bonus')) NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  size_mb DECIMAL(10,2),
  duration_minutes INT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Items de bundles (cuando un bundle contiene múltiples productos)
CREATE TABLE IF NOT EXISTS public.resource_bundle_items (
  bundle_id UUID NOT NULL REFERENCES public.resource_products(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.resource_products(id) ON DELETE RESTRICT,
  quantity INT DEFAULT 1,
  PRIMARY KEY (bundle_id, product_id)
);

-- Sistema de cupones
CREATE TABLE IF NOT EXISTS public.resource_coupons (
  code TEXT PRIMARY KEY,
  discount_pct INT CHECK (discount_pct BETWEEN 1 AND 90) NOT NULL,
  expires_at TIMESTAMPTZ,
  max_uses INT,
  used_count INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Órdenes de compra (solo MXN)
CREATE TABLE IF NOT EXISTS public.resource_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider TEXT CHECK (provider IN ('stripe','mercadopago')) NOT NULL,
  provider_session_id TEXT,
  provider_payment_id TEXT,
  amount_cents INT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MXN' CHECK (currency = 'MXN'),
  status TEXT CHECK (status IN ('created','paid','failed','refunded','cancelled')) DEFAULT 'created',
  coupon_code TEXT,
  discount_cents INT DEFAULT 0,
  utm JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Items de cada orden
CREATE TABLE IF NOT EXISTS public.resource_order_items (
  order_id UUID NOT NULL REFERENCES public.resource_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.resource_products(id) ON DELETE RESTRICT,
  quantity INT DEFAULT 1,
  price_cents INT NOT NULL,
  PRIMARY KEY(order_id, product_id)
);

-- Control de acceso a recursos
CREATE TABLE IF NOT EXISTS public.resource_access (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.resource_products(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ, -- Para recursos con acceso temporal
  PRIMARY KEY(user_id, product_id)
);

-- Ofertas inteligentes (pop-ups, bonos, etc)
CREATE TABLE IF NOT EXISTS public.resource_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('popup','banner','bonus','coupon')) NOT NULL,
  target_segment TEXT, -- 'nuevo', 'explorador_conocer', 'sensible_precio', etc.
  trigger_event TEXT,  -- 'exit_intent', 'scroll_60', 'second_visit', etc.
  content JSONB NOT NULL, -- {title, message, cta, image_url, etc.}
  discount_pct INT,
  expires_hours INT DEFAULT 72, -- Horas de validez del cupón generado
  active BOOLEAN DEFAULT true,
  max_shows_per_user INT DEFAULT 3,
  cooldown_hours INT DEFAULT 24,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tracking de ofertas mostradas/reclamadas por usuario
CREATE TABLE IF NOT EXISTS public.resource_offer_interactions (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES public.resource_offers(id) ON DELETE CASCADE,
  session_id TEXT,
  action TEXT CHECK (action IN ('shown','clicked','claimed','dismissed')) NOT NULL,
  coupon_generated TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Partners/licenciatarios (opcional para reparto de ganancias)
CREATE TABLE IF NOT EXISTS public.resource_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  payout_pct INT CHECK (payout_pct BETWEEN 1 AND 90),
  stripe_connect_account TEXT,
  mp_merchant_id TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.resource_partner_products (
  partner_id UUID NOT NULL REFERENCES public.resource_partners(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.resource_products(id) ON DELETE CASCADE,
  PRIMARY KEY (partner_id, product_id)
);

-- Habilitar RLS
ALTER TABLE public.resource_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_offer_interactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
-- Productos: público puede ver productos publicados
CREATE POLICY "public_can_view_published_products" ON public.resource_products
  FOR SELECT USING (published = true);

-- Assets: solo usuarios con acceso pueden ver
CREATE POLICY "users_can_view_accessible_assets" ON public.resource_assets
  FOR SELECT TO authenticated USING (
    product_id IN (
      SELECT product_id FROM public.resource_access 
      WHERE user_id = auth.uid()
    ) OR 
    product_id IN (
      SELECT id FROM public.resource_products 
      WHERE is_free = true AND published = true
    )
  );

-- Bundle items: público puede ver
CREATE POLICY "public_can_view_bundle_items" ON public.resource_bundle_items
  FOR SELECT USING (true);

-- Órdenes: usuarios pueden ver sus propias órdenes
CREATE POLICY "users_can_view_own_orders" ON public.resource_orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_orders" ON public.resource_orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "service_role_can_update_orders" ON public.resource_orders
  FOR UPDATE TO service_role USING (true);

-- Order items: usuarios pueden ver items de sus órdenes
CREATE POLICY "users_can_view_own_order_items" ON public.resource_order_items
  FOR SELECT TO authenticated USING (
    order_id IN (
      SELECT id FROM public.resource_orders WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "users_can_insert_order_items" ON public.resource_order_items
  FOR INSERT TO authenticated WITH CHECK (true);

-- Acceso: usuarios pueden ver su propio acceso
CREATE POLICY "users_can_view_own_access" ON public.resource_access
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "service_role_can_manage_access" ON public.resource_access
  FOR ALL TO service_role USING (true);

-- Ofertas: público puede ver ofertas activas
CREATE POLICY "public_can_view_active_offers" ON public.resource_offers
  FOR SELECT USING (active = true);

-- Interacciones: usuarios pueden ver/insertar sus interacciones
CREATE POLICY "users_can_manage_offer_interactions" ON public.resource_offer_interactions
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resource_products_updated_at
  BEFORE UPDATE ON public.resource_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resource_orders_updated_at
  BEFORE UPDATE ON public.resource_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar algunos productos de ejemplo
INSERT INTO public.resource_products (
  slug, title, subtitle, description, type, standards, level, sector, 
  duration, price_cents, is_free, cover_url, instructor, 
  outcomes, target_audience, curriculum, bonuses, testimonials, faq, guarantee_days
) VALUES 
(
  'curso-express-ec0217',
  'Curso Express EC0217 - Impartición de Cursos CONOCER',
  'Domina la Impartición CONOCER (EC0217) en 4 horas con ejercicios prácticos',
  'Aprende todo lo necesario para certificarte en el estándar EC0217 de Impartición de Cursos de Capacitación Presenciales, Grupales.',
  'curso',
  '["EC0217"]',
  'Intermedio',
  'Educación',
  '4 horas',
  149000, -- $1,490 MXN
  false,
  '/images/recursos/curso-ec0217-cover.jpg',
  'Lic. María González, Evaluadora Independiente CONOCER',
  '["Diseñar sesiones con rúbricas alineadas al estándar", "Preparar evidencias completas para tu evaluación", "Evitar errores que cuestan la certificación", "Aplicar técnicas de facilitación efectivas"]',
  '["Instructores que buscan certificarse en CONOCER", "Profesionales de capacitación", "Facilitadores con experiencia básica", "NO es para principiantes sin experiencia docente"]',
  '[
    {"module": "Módulo 1: Fundamentos del EC0217", "lessons": ["Elementos del estándar", "Criterios de evaluación", "Productos esperados"], "duration": "60 min"},
    {"module": "Módulo 2: Diseño de Sesiones", "lessons": ["Planeación didáctica", "Recursos y materiales", "Evaluación del aprendizaje"], "duration": "90 min"},
    {"module": "Módulo 3: Facilitación Efectiva", "lessons": ["Técnicas de facilitación", "Manejo de grupos", "Resolución de conflictos"], "duration": "90 min"},
    {"module": "Módulo 4: Preparación para Evaluación", "lessons": ["Portafolio de evidencias", "Simulacro de evaluación", "Tips para el éxito"], "duration": "60 min"}
  ]',
  '["Plantillas de planeación didáctica listas", "Rúbricas de evaluación", "30 minutos de mentoría 1:1", "Acceso al grupo privado de Telegram"]',
  '[
    {"name": "Carlos R.", "text": "Me certifiqué en mi primer intento gracias a este curso. Las plantillas fueron clave.", "rating": 5, "position": "Instructor Corporativo"},
    {"name": "Ana M.", "text": "Excelente contenido, muy práctico y directo al punto.", "rating": 5, "position": "Consultora en Capacitación"}
  ]',
  '[
    {"question": "¿Necesito experiencia previa?", "answer": "Sí, recomendamos al menos 6 meses de experiencia impartiendo cursos."},
    {"question": "¿Incluye certificado?", "answer": "Incluye certificado de participación. La evaluación CONOCER es por separado."},
    {"question": "¿Por cuánto tiempo tengo acceso?", "answer": "Acceso de por vida con todas las actualizaciones incluidas."}
  ]',
  7
),
(
  'ebook-plantillas-ec0301',
  'Plantillas EC0301 - Diseño de Cursos',
  'Kit completo de plantillas para el estándar EC0301',
  'Descarga inmediata de todas las plantillas necesarias para diseñar cursos bajo el estándar EC0301.',
  'plantilla',
  '["EC0301"]',
  'Básico',
  'Educación',
  '25 plantillas',
  49900, -- $499 MXN
  false,
  '/images/recursos/plantillas-ec0301-cover.jpg',
  'Equipo Certifica Global',
  '["25+ plantillas listas para usar", "Formatos oficiales CONOCER", "Rúbricas de evaluación", "Checklist de evidencias"]',
  '["Diseñadores instruccionales", "Instructores certificándose en EC0301", "Coordinadores académicos", "NO para uso comercial sin licencia"]',
  '[
    {"section": "Plantillas de Diagnóstico", "items": ["DNC (Detección de Necesidades de Capacitación)", "Perfil del participante", "Análisis de contexto"]},
    {"section": "Diseño Curricular", "items": ["Carta descriptiva", "Objetivos de aprendizaje", "Secuencia didáctica", "Evaluación del aprendizaje"]},
    {"section": "Materiales Didácticos", "items": ["Presentaciones base", "Manuales del participante", "Ejercicios y actividades"]},
    {"section": "Evaluación", "items": ["Rúbricas", "Instrumentos de evaluación", "Formato de retroalimentación"]}
  ]',
  '["Video explicativo de 20 min", "Ejemplos completamente desarrollados", "Checklist de autoevaluación"]',
  '[
    {"name": "Roberto L.", "text": "Las plantillas me ahorraron semanas de trabajo. Muy completas.", "rating": 5, "position": "Diseñador Instruccional"},
    {"name": "Patricia K.", "text": "Justo lo que necesitaba para mi certificación.", "rating": 5, "position": "Coordinadora Académica"}
  ]',
  '[
    {"question": "¿Son editables?", "answer": "Sí, todas las plantillas vienen en formato Word y PowerPoint editables."},
    {"question": "¿Incluye ejemplos?", "answer": "Sí, cada plantilla incluye un ejemplo completamente desarrollado."},
    {"question": "¿Puedo usarlas comercialmente?", "answer": "Para uso comercial requieres licencia extendida (consulta por separado)."}
  ]',
  7
),
(
  'masterclass-evaluacion-competencias',
  'Masterclass: Evaluación por Competencias CONOCER',
  'Técnicas avanzadas de evaluación según metodología CONOCER',
  'Masterclass en vivo sobre evaluación por competencias con casos reales y mejores prácticas.',
  'masterclass',
  '["EC0076", "EC0217", "EC0301"]',
  'Avanzado',
  'Evaluación',
  '2 horas en vivo + Q&A',
  299000, -- $2,990 MXN
  false,
  '/images/recursos/masterclass-evaluacion-cover.jpg',
  'Mtra. Sandra Hernández, Evaluadora Master CONOCER',
  '["Dominar técnicas de evaluación por competencias", "Aplicar instrumentos de evaluación efectivos", "Interpretar evidencias según CONOCER", "Retroalimentar de forma constructiva"]',
  '["Evaluadores certificados o en proceso", "Instructores con experiencia", "Coordinadores de capacitación", "NO para principiantes sin base en competencias"]',
  '[
    {"topic": "Fundamentos de Evaluación por Competencias", "duration": "30 min", "content": "Marco teórico CONOCER, tipos de evidencias, criterios de evaluación"},
    {"topic": "Instrumentos de Evaluación", "duration": "45 min", "content": "Listas de cotejo, guías de observación, cuestionarios"},
    {"topic": "Casos Prácticos", "duration": "30 min", "content": "Análisis de evidencias reales, toma de decisiones"},
    {"topic": "Sesión de Preguntas", "duration": "15 min", "content": "Q&A en vivo con la experta"}
  ]',
  '["Grabación de la sesión", "Plantillas de instrumentos", "Certificado de participación", "Acceso al grupo exclusivo"]',
  '[
    {"name": "Miguel A.", "text": "La mejor masterclass que he tomado. Casos muy reales y aplicables.", "rating": 5, "position": "Evaluador Independiente"},
    {"name": "Laura S.", "text": "Sandra explica de manera muy clara conceptos complejos.", "rating": 5, "position": "Coordinadora de Evaluación"}
  ]',
  '[
    {"question": "¿Qué pasa si no puedo asistir en vivo?", "answer": "Recibes la grabación completa por 30 días."},
    {"question": "¿Incluye certificado oficial CONOCER?", "answer": "No, es un certificado de participación de Certifica Global."},
    {"question": "¿Puedo hacer preguntas?", "answer": "Sí, hay sesión de Q&A en vivo y chat durante toda la masterclass."}
  ]',
  14
);

-- Insertar algunos assets de ejemplo
INSERT INTO public.resource_assets (product_id, kind, title, url, sort_order) VALUES
((SELECT id FROM public.resource_products WHERE slug = 'curso-express-ec0217'), 'video', 'Bienvenida al Curso EC0217', 'https://example.com/videos/bienvenida-ec0217.mp4', 1),
((SELECT id FROM public.resource_products WHERE slug = 'curso-express-ec0217'), 'pdf', 'Manual del Participante', 'https://example.com/pdfs/manual-ec0217.pdf', 2),
((SELECT id FROM public.resource_products WHERE slug = 'ebook-plantillas-ec0301'), 'zip', 'Paquete Completo Plantillas EC0301', 'https://example.com/downloads/plantillas-ec0301.zip', 1),
((SELECT id FROM public.resource_products WHERE slug = 'masterclass-evaluacion-competencias'), 'link', 'Acceso a la Masterclass en Vivo', 'https://zoom.us/j/masterclass-evaluacion', 1);

-- Insertar cupones de ejemplo
INSERT INTO public.resource_coupons (code, discount_pct, expires_at, max_uses) VALUES
('LANZAMIENTO10', 10, now() + interval '30 days', 100),
('PRIMERAVEZ15', 15, now() + interval '60 days', 500),
('BLACKFRIDAY25', 25, now() + interval '7 days', 200);

-- Insertar ofertas de ejemplo
INSERT INTO public.resource_offers (name, type, target_segment, trigger_event, content, discount_pct, expires_hours) VALUES
(
  'Bono Mentoría Nuevos',
  'popup', 
  'nuevo', 
  'scroll_60',
  '{"title": "¡Bienvenido a Certifica Global!", "message": "Inscríbete en cualquier curso en las próximas 72h y recibe 30 min de mentoría 1:1 GRATIS", "cta": "Explorar Cursos", "image": "/images/ofertas/bono-mentoria.jpg"}',
  0,
  72
),
(
  'Descuento Segunda Visita',
  'popup',
  'explorador_conocer',
  'second_visit', 
  '{"title": "Te vemos interesado 👀", "message": "Aprovecha 10% de descuento en tu primer recurso. Válido por 48 horas.", "cta": "Aplicar Descuento", "countdown": true}',
  10,
  48
);