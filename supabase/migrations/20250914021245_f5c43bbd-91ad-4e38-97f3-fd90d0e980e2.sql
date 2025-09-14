-- Insert ebook resources with unique slugs
INSERT INTO public.resource_products (
  slug, title, subtitle, description, type, standards, level, sector, duration,
  price_cents, currency, is_free, published, cover_url, instructor, outcomes,
  target_audience, guarantee_days, rating, total_purchases
) VALUES 
(
  'ebook-completo-ec0217-2024',
  'Guía Completa EC0217 - Impartición de Cursos',
  'Todo lo que necesitas saber para certificarte en EC0217',
  'Ebook completo con metodologías, plantillas y casos prácticos para dominar el estándar EC0217 de CONOCER.',
  'ebook',
  ARRAY['EC0217'],
  'Básico',
  'Educación',
  'Lectura: 2-3 horas',
  29900,
  'MXN',
  false,
  true,
  '/images/recursos/ebook-ec0217-cover.jpg',
  'Equipo Certifica Global',
  '["Metodología paso a paso", "15 plantillas incluidas", "Casos reales de éxito", "Checklist de preparación"]'::jsonb,
  '["Instructores novatos", "Profesionales en capacitación", "Candidatos a certificación EC0217"]'::jsonb,
  7,
  4.8,
  127
),
(
  'ebook-evaluador-ec0366-avanzado',
  'Toolkit del Evaluador EC0366',
  'Rúbricas y herramientas para evaluar competencias en desarrollo de software',
  'Ebook especializado con instrumentos de evaluación, rúbricas y metodologías para el estándar EC0366.',
  'ebook',
  ARRAY['EC0366'],
  'Avanzado',
  'Tecnología',
  'Lectura: 4-5 horas',
  49900,
  'MXN',
  false,
  true,
  '/images/recursos/ebook-ec0366-cover.jpg',
  'Ing. Carlos Mendoza, Evaluador Independiente',
  '["20+ rúbricas listas", "Casos de evaluación reales", "Metodología de portafolios", "Tips de retroalimentación"]'::jsonb,
  '["Evaluadores certificados", "Líderes técnicos", "Instructores de programación"]'::jsonb,
  7,
  4.9,
  89
),
(
  'ebook-introduccion-conocer-gratis',
  'Introducción a CONOCER - Guía Gratuita',
  'Todo lo básico sobre el sistema de certificación laboral mexicano',
  'Ebook gratuito de introducción al sistema CONOCER, estándares de competencia y proceso de certificación.',
  'ebook',
  ARRAY['EC0217', 'EC0301'],
  'Básico',
  'General',
  'Lectura: 1 hora',
  0,
  'MXN',
  true,
  true,
  '/images/recursos/ebook-introduccion-conocer.jpg',
  'Equipo Certifica Global',
  '["Conceptos fundamentales", "Mapa de estándares", "Proceso de certificación", "Primeros pasos"]'::jsonb,
  '["Cualquier persona interesada", "Profesionales nuevos en CONOCER", "Instructores principiantes"]'::jsonb,
  0,
  4.5,
  245
);

-- Update existing resources with more realistic purchase numbers
UPDATE public.resource_products 
SET total_purchases = CASE 
  WHEN type = 'curso' THEN 156
  WHEN type = 'plantilla' THEN 234
  WHEN type = 'masterclass' THEN 67
  ELSE total_purchases
END
WHERE type IN ('curso', 'plantilla', 'masterclass');