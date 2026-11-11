-- =====================================================================
-- CARGA DE PREGUNTAS DEL CHATBOT
-- Fuente: "Preguntas (alimentacion del chatbot).docx"
-- Ejecutar sobre una base ya creada con database.txt:
--   mysql -u root -p --default-character-set=utf8mb4 < seed_preguntas.sql
-- Si el option_number ya existe, se actualiza (no se duplican filas).
-- =====================================================================

SET NAMES utf8mb4;
USE chatbot_db;

INSERT INTO questions (option_number, question, answer, is_active) VALUES
  -- 1. Inscripciones y Admisiones
  (1,  '¿Cuáles son las modalidades de ingreso a los programas académicos?',
       'Puedes ingresar como estudiante nuevo, en continuidad de ciclos propedéuticos, de reingreso, o por transferencia interna o externa.', 1),
  (2,  '¿Qué requisitos necesito para inscribirme como estudiante nuevo a un nivel Técnico Profesional?',
       'Debes diligenciar el formulario, presentar comprobante de pago de inscripción, documento de identidad, diploma de bachiller (o aprobación de básica secundaria según el caso), pruebas de Estado, dos recibos públicos recientes, una foto 3x4 y certificación del Sisbén (si aplica).', 1),
  (3,  '¿Cuáles son los requisitos de ingreso para los niveles Tecnológico y Profesional Universitario?',
       'Además del documento, formulario y fotos, debes presentar el título del nivel anterior (Técnico Profesional o Tecnólogo según corresponda), diploma de bachiller, recibos públicos, resultados de exámenes de Estado y contenidos programáticos de la institución de procedencia si aplica.', 1),
  (4,  '¿Qué es la formación por ciclos propedéuticos?',
       'Es una formación organizada en niveles secuenciales que te permite obtener tres títulos de manera progresiva: primero Técnico Profesional, luego Tecnólogo y posteriormente Profesional Universitario.', 1),

  -- 2. Transferencias y Reingresos
  (5,  '¿Qué es una transferencia externa y qué requisitos exigen?',
       'Es el proceso para estudiantes que vienen de otra institución de educación superior. Debes solicitarlo al menos 10 días hábiles antes de las matrículas, adjuntando certificado de calificaciones con intensidad horaria, constancia de buena conducta y contenidos programáticos.', 1),
  (6,  '¿Cuál es la nota mínima para que me homologuen módulos por transferencia externa?',
       'La calificación aprobatoria mínima en cada asignatura o módulo debe ser de tres punto cinco (3.5) o su equivalente.', 1),
  (7,  '¿Cuánto tiempo tengo para solicitar un reingreso si me retiro de la institución?',
       'Tienes un plazo máximo de tres (3) años contados a partir de la fecha de tu desvinculación. Pasado ese tiempo, deberás iniciar el proceso de inscripción nuevamente.', 1),

  -- 3. Matrículas y Costos
  (8,  '¿Cuáles son los pasos para realizar la renovación de la matrícula?',
       'El proceso comprende la liquidación y pago de derechos, la asesoría con el líder de programa y el registro de módulos en las fechas del calendario académico.', 1),
  (9,  '¿Puedo solicitar la devolución del dinero de la matrícula si no voy a estudiar?',
       'Sí, tienes derecho a la devolución del 100% si la institución decide no abrir el programa. Se devuelve el 80% si solicitas por escrito 5 días antes de iniciar clases (o por prestación de servicio militar), y el 50% si lo haces dentro de los primeros 10 días hábiles de clases.', 1),
  (10, '¿En qué casos puedo solicitar la congelación del valor de la matrícula?',
       'Se permite por causales justificadas como problemas socioeconómicos, situaciones judiciales, traslados laborales, pago completo por error en créditos, o por problemas graves de salud con incapacidad superior a 15 días avalada por Bienestar Universitario.', 1),

  -- 4. Evaluación y Rendimiento Académico
  (11, '¿Cómo se compone la nota definitiva de un módulo?',
       'Se conforma de dos (2) calificaciones parciales (cada una con un valor del 30%) y una calificación final al terminar el periodo (con un valor del 40%).', 1),
  (12, '¿Cuál es la nota mínima aprobatoria para un módulo?',
       'La calificación mínima aprobatoria es de tres punto cero (3.0), excepto en validaciones, homologaciones y transferencias externas donde se exige mínimo tres punto cinco (3.5).', 1),
  (13, '¿Cuántas fallas por inasistencia hacen que pierda un módulo?',
       'Pierdes el módulo por fallas si acumulas inasistencias injustificadas que superen el veinte por ciento (20%) de la intensidad horaria programada en el periodo académico.', 1),
  (14, '¿Qué pasa si repruebo un módulo por segunda vez?',
       'Entras en periodo de prueba académico y solo podrás matricular tres (3) módulos obligatorios (incluyendo los dos perdidos). Si repruebas un módulo por tercera vez, solo tendrás derecho a matricular ese único módulo en el periodo.', 1)
ON DUPLICATE KEY UPDATE
  question  = VALUES(question),
  answer    = VALUES(answer),
  is_active = VALUES(is_active);
