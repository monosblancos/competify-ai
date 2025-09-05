import type { Standard } from '../types';

export const standardsData: Standard[] = [
    {
        code: 'EC0217.01',
        title: 'Impartición de cursos de formación del capital humano de manera presencial grupal',
        description: 'Estándar de Competencia para personas que imparten cursos de formación de manera presencial y grupal, abarcando desde la planeación hasta la evaluación del curso.',
        category: 'Educación y Formación',
        isCoreOffering: true,
        modules: [
            { id: '217_1', title: 'Preparación de la sesión', description: 'Revisar la planeación, los materiales y el equipo necesario.', duration: '2 Horas', isPractical: false, content: [{ type: 'video', title: 'Bienvenida al EC0217.01', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] },
            { id: '217_2', title: 'Conducción de la sesión', description: 'Aplicar técnicas de instrucción y manejo de grupo.', duration: '4 Horas', isPractical: true, content: [{ type: 'pdf', title: 'Manual del Instructor', url: '#' }] },
            { id: '217_3', title: 'Evaluación del aprendizaje', description: 'Aplicar instrumentos de evaluación y retroalimentar a los participantes.', duration: '2 Horas', isPractical: true, content: [{ type: 'text', text: 'Este módulo se enfoca en las mejores prácticas para la evaluación formativa y sumativa.' }] }
        ]
    },
    {
        code: 'EC0301',
        title: 'Diseño de cursos de formación del capital humano de manera presencial grupal',
        description: 'Competencias para diseñar cursos de formación, incluyendo la elaboración de objetivos, temarios, instrumentos de evaluación y los manuales.',
        category: 'Educación y Formación',
        isCoreOffering: true,
        modules: [
            { id: '301_1', title: 'Diseño del curso', description: 'Elaborar la carta descriptiva y los objetivos de aprendizaje.', duration: '3 Horas', isPractical: true },
            { id: '301_2', title: 'Diseño de instrumentos de evaluación', description: 'Crear los reactivos y herramientas para medir el aprendizaje.', duration: '3 Horas', isPractical: true },
            { id: '301_3', title: 'Diseño de manuales', description: 'Desarrollar el manual del instructor y del participante.', duration: '2 Horas', isPractical: false }
        ]
    },
    {
        code: 'EC0076',
        title: 'Evaluación de la competencia de candidatos con base en Estándares de Competencia',
        description: 'Define las competencias que un evaluador requiere para llevar a cabo el proceso de evaluación de competencia de personas, desde la preparación hasta la presentación de resultados.',
        category: 'Evaluación y Certificación',
        isCoreOffering: true,
        modules: [
            { id: '076_1', title: 'Preparación de la evaluación', description: 'Revisar el portafolio de evidencias y preparar los instrumentos.', duration: '2 Horas', isPractical: false },
            { id: '076_2', title: 'Recopilación de evidencias', description: 'Observar el desempeño, aplicar cuestionarios y revisar productos.', duration: '4 Horas', isPractical: true },
            { id: '076_3', title: 'Emisión del juicio de competencia', description: 'Analizar las evidencias y determinar si el candidato es competente.', duration: '2 Horas', isPractical: false }
        ]
    },
    {
        code: 'EC0366',
        title: 'Desarrollo de cursos de formación en línea',
        description: 'Competencias para diseñar, desarrollar y tutorizar cursos en línea, utilizando plataformas tecnológicas y estrategias de aprendizaje a distancia.',
        category: 'Educación y Formación',
        isCoreOffering: true,
        modules: [
            { id: '366_1', title: 'Diseño instruccional para e-learning', description: 'Adaptar contenidos y actividades para el entorno virtual.', duration: '4 Horas', isPractical: true },
            { id: '366_2', title: 'Producción de contenido digital', description: 'Crear videos, infografías y otros materiales interactivos.', duration: '4 Horas', isPractical: true },
            { id: '366_3', title: 'Tutoría y seguimiento en línea', description: 'Moderar foros, dar retroalimentación y motivar a los estudiantes.', duration: '3 Horas', isPractical: false }
        ]
    },
    {
        code: 'EC0586',
        title: 'Prestación de servicios de consultoría en general',
        description: 'Establece las mejores prácticas para ofrecer servicios de consultoría, incluyendo el diagnóstico, diseño de soluciones y presentación de la propuesta.',
        category: 'Consultoría',
        isCoreOffering: false,
        modules: [
            { id: '586_1', title: 'Diagnóstico de la situación del cliente', description: 'Recopilar información y analizar las necesidades del cliente.', duration: '5 Horas', isPractical: true },
            { id: '586_2', title: 'Diseño de la solución de consultoría', description: 'Desarrollar la metodología y el plan de trabajo.', duration: '5 Horas', isPractical: false },
            { id: '586_3', title: 'Presentación de la propuesta', description: 'Comunicar el valor y los entregables de la consultoría.', duration: '3 Horas', isPractical: true }
        ]
    }
];