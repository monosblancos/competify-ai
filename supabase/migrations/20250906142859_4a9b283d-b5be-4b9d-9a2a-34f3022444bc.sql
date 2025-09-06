-- Poblar tabla standards con datos de ejemplo
INSERT INTO public.standards (code, title, description, category, modules, is_core_offering) VALUES
('EC0217.01', 'Impartición de cursos de formación del capital humano de manera presencial grupal', 'Estándar de Competencia para personas que imparten cursos de formación de manera presencial y grupal, abarcando desde la planeación hasta la evaluación del curso.', 'Educación y Formación', '[
  {"id": "217_1", "title": "Preparación de la sesión", "description": "Revisar la planeación, los materiales y el equipo necesario.", "duration": "2 Horas", "isPractical": false, "content": [{"type": "video", "title": "Bienvenida al EC0217.01", "url": "https://www.youtube.com/embed/dQw4w9WgXcQ"}]},
  {"id": "217_2", "title": "Conducción de la sesión", "description": "Aplicar técnicas de instrucción y manejo de grupo.", "duration": "4 Horas", "isPractical": true, "content": [{"type": "pdf", "title": "Manual del Instructor", "url": "#"}]},
  {"id": "217_3", "title": "Evaluación del aprendizaje", "description": "Aplicar instrumentos de evaluación y retroalimentar a los participantes.", "duration": "2 Horas", "isPractical": true, "content": [{"type": "text", "text": "Este módulo se enfoca en las mejores prácticas para la evaluación formativa y sumativa."}]}
]', true),

('EC0301', 'Diseño de cursos de formación del capital humano de manera presencial grupal', 'Competencias para diseñar cursos de formación, incluyendo la elaboración de objetivos, temarios, instrumentos de evaluación y los manuales.', 'Educación y Formación', '[
  {"id": "301_1", "title": "Diseño del curso", "description": "Elaborar la carta descriptiva y los objetivos de aprendizaje.", "duration": "3 Horas", "isPractical": true},
  {"id": "301_2", "title": "Diseño de instrumentos de evaluación", "description": "Crear los reactivos y herramientas para medir el aprendizaje.", "duration": "3 Horas", "isPractical": true},
  {"id": "301_3", "title": "Diseño de manuales", "description": "Desarrollar el manual del instructor y del participante.", "duration": "2 Horas", "isPractical": false}
]', true),

('EC0076', 'Evaluación de la competencia de candidatos con base en Estándares de Competencia', 'Define las competencias que un evaluador requiere para llevar a cabo el proceso de evaluación de competencia de personas, desde la preparación hasta la presentación de resultados.', 'Evaluación y Certificación', '[
  {"id": "076_1", "title": "Preparación de la evaluación", "description": "Revisar el portafolio de evidencias y preparar los instrumentos.", "duration": "2 Horas", "isPractical": false},
  {"id": "076_2", "title": "Recopilación de evidencias", "description": "Observar el desempeño, aplicar cuestionarios y revisar productos.", "duration": "4 Horas", "isPractical": true},
  {"id": "076_3", "title": "Emisión del juicio de competencia", "description": "Analizar las evidencias y determinar si el candidato es competente.", "duration": "2 Horas", "isPractical": false}
]', true),

('EC0366', 'Desarrollo de cursos de formación en línea', 'Competencias para diseñar, desarrollar y tutorizar cursos en línea, utilizando plataformas tecnológicas y estrategias de aprendizaje a distancia.', 'Educación y Formación', '[
  {"id": "366_1", "title": "Diseño instruccional para e-learning", "description": "Adaptar contenidos y actividades para el entorno virtual.", "duration": "4 Horas", "isPractical": true},
  {"id": "366_2", "title": "Producción de contenido digital", "description": "Crear videos, infografías y otros materiales interactivos.", "duration": "4 Horas", "isPractical": true},
  {"id": "366_3", "title": "Tutoría y seguimiento en línea", "description": "Moderar foros, dar retroalimentación y motivar a los estudiantes.", "duration": "3 Horas", "isPractical": false}
]', true),

('EC0586', 'Prestación de servicios de consultoría en general', 'Establece las mejores prácticas para ofrecer servicios de consultoría, incluyendo el diagnóstico, diseño de soluciones y presentación de la propuesta.', 'Consultoría', '[
  {"id": "586_1", "title": "Diagnóstico de la situación del cliente", "description": "Recopilar información y analizar las necesidades del cliente.", "duration": "5 Horas", "isPractical": true},
  {"id": "586_2", "title": "Diseño de la solución de consultoría", "description": "Desarrollar la metodología y el plan de trabajo.", "duration": "5 Horas", "isPractical": false},
  {"id": "586_3", "title": "Presentación de la propuesta", "description": "Comunicar el valor y los entregables de la consultoría.", "duration": "3 Horas", "isPractical": true}
]', false);

-- Poblar tabla job_openings con datos de ejemplo  
INSERT INTO public.job_openings (id, title, company, location, description, required_standards) VALUES
('1', 'Capacitador Corporativo Senior', 'Innovatech Solutions', 'Ciudad de México', 'Buscamos un capacitador dinámico para diseñar e impartir cursos de formación a nuestro personal. Se requiere experiencia comprobable y excelentes habilidades de comunicación.', ARRAY['EC0217.01', 'EC0301']),
('2', 'Diseñador Instruccional', 'EducaNext', 'Monterrey (Remoto)', 'Únete a nuestro equipo para crear experiencias de aprendizaje impactantes. Ideal para profesionales con sólida base pedagógica y creatividad.', ARRAY['EC0301', 'EC0366']),
('3', 'Coordinador de Calidad y Certificaciones', 'Manufactura Global', 'Guadalajara', 'Responsable de supervisar los procesos de evaluación de competencias del personal y asegurar el cumplimiento de los estándares de calidad.', ARRAY['EC0076']),
('4', 'Instructor de Habilidades Digitales', 'Tech Institute', 'Querétaro', 'Se busca instructor para impartir cursos de ofimática a nivel empresarial. Certificación Microsoft es un plus.', ARRAY['EC0217.01']);