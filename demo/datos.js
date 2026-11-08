// Datos de prueba del demo. Pacientes ficticios, nada real.
// Las fechas van como "dia" (0 = hoy, -1 = ayer, 1 = mañana) para que el demo nunca se vea viejo.
window.SEED = {
  pacientes: [
    { id: 1, codigo: '4821', quien: 'Diseñadora gráfica, 2 hijos pequeños. Trabaja de noche cuando los niños duermen, por eso le cuesta el sueño.', como_hablarle: 'Le gustan las explicaciones con el porqué. Responde mejor por WhatsApp que por Circle.', nombre: 'Mariana Restrepo', edad: 38, telefono: '+57 310 555 0101', programa: 'Inicial 4 meses', mes: 2, estado: 'activo', color: '#2457a7',
      motivo: 'Cansancio en las tardes, sueño cortado y antojos de dulce.',
      tener_presente: 'Le subió la vitamina D desde la última sesión. Sigue despertándose a las 3 a.m. Pidió ajustar la cena.',
      puntajes: { Energía: 58, Sueño: 42, Nutrición: 66, Estrés: 50, Movimiento: 72, Metabólico: 61 },
      plan: ['Mes 1 · Ordenar horarios de comida y luz de la mañana', 'Mes 2 · Sueño: rutina de cierre y magnesio', 'Mes 3 · Fuerza 3 veces por semana', 'Mes 4 · Re-diagnóstico y plan de mantenimiento'],
      pendientes: ['Mandar foto del diario de sueño', 'Agendar control de ferritina'] },
    { id: 2, codigo: '5307', quien: 'Ingeniero, maneja una constructora. Su papá tuvo diabetes y eso lo motiva mucho.', como_hablarle: 'Directo y con números. Le encanta ver las gráficas de sus exámenes.', nombre: 'Andrés Giraldo', edad: 45, telefono: '+57 311 555 0102', programa: 'Inicial 4 meses', mes: 4, estado: 'ultimo_mes', color: '#1e8e3e',
      motivo: 'Prediabetes y grasa abdominal. Quiere bajar la glucosa sin medicamento.',
      tener_presente: 'Último mes del programa. La HbA1c bajó de 6,1 a 5,6. Buen momento para hablar de continuación y pedir testimonio.',
      puntajes: { Energía: 78, Sueño: 70, Nutrición: 81, Estrés: 64, Movimiento: 75, Metabólico: 73 },
      plan: ['Mes 1 · Desayuno con proteína, caminar después de comer', 'Mes 2 · Ayuno de 12 horas', 'Mes 3 · Fuerza y control de porciones', 'Mes 4 · Re-diagnóstico y continuación'],
      pendientes: ['Enviar link de pago de la suscripción semestral'] },
    { id: 3, codigo: '6194', quien: 'Abogada en una firma grande, viaja mucho. Entró muy motivada pero el trabajo la absorbió.', como_hablarle: 'No presionarla. Funciona mejor un mensaje corto y cálido que un recordatorio formal.', nombre: 'Camila Ochoa', edad: 33, telefono: '+57 312 555 0103', programa: 'Suscripción mensual', mes: 7, estado: 'enfriandose', color: '#d98a1c',
      motivo: 'Mantenimiento: energía y rendimiento en el trabajo.',
      tener_presente: 'Canceló las dos últimas sesiones y no respondió el check-in de octubre. Riesgo de que no renueve.',
      puntajes: { Energía: 61, Sueño: 55, Nutrición: 58, Estrés: 38, Movimiento: 49, Metabólico: 66 },
      plan: ['Mantenimiento · check-in mensual', 'Retomar fuerza 2 veces por semana'],
      pendientes: ['Responder check-in de octubre'] },
    { id: 4, codigo: '7740', quien: 'Empresario, 52 años. Llegó referido por Andrés Giraldo. Tiene la presión alta y duerme 5 horas.', como_hablarle: 'Le gusta que le expliquen todo con calma en la primera sesión. Prefiere llamadas a mensajes largos.', nombre: 'Santiago Mejía', edad: 52, telefono: '+57 313 555 0104', programa: 'Inicial 4 meses', mes: 1, estado: 'nuevo', color: '#7a4fc4',
      motivo: 'Hipertensión leve, estrés alto, duerme 5 horas.',
      tener_presente: 'Paciente nuevo. Ya llenó el onboarding y pagó. Faltan los exámenes de sangre para cerrar el diagnóstico.',
      puntajes: { Energía: 45, Sueño: 35, Nutrición: 52, Estrés: 30, Movimiento: 40, Metabólico: 50 },
      plan: ['Borrador · esperando tu aprobación'],
      pendientes: ['Subir exámenes de sangre', 'Firmar consentimiento actualizado'] },
    { id: 5, codigo: '3368', quien: 'Estudiante de maestría. Llegó con colon irritable después de años de molestias.', como_hablarle: 'Muy juiciosa con los registros. Le da ansiedad no saber qué puede comer, darle opciones concretas.', nombre: 'Valentina Ruiz', edad: 29, telefono: '+57 314 555 0105', programa: 'Inicial 4 meses', mes: 3, estado: 'activo', color: '#c0392b',
      motivo: 'Colon irritable e inflamación.',
      tener_presente: 'Re-diagnóstico del tercer mes esta semana. Reporta menos inflamación. Pregunta si puede volver a los lácteos.',
      puntajes: { Energía: 70, Sueño: 68, Nutrición: 74, Estrés: 57, Movimiento: 66, Metabólico: 71 },
      plan: ['Mes 1 · Eliminación', 'Mes 2 · Reintroducción guiada', 'Mes 3 · Re-diagnóstico', 'Mes 4 · Plan de mantenimiento'],
      pendientes: [] },
    { id: 6, codigo: '2915', quien: 'Psicóloga, 41 años, en perimenopausia. Lleva 9 meses y es de las pacientes más comprometidas.', como_hablarle: 'Le gusta el detalle y las guías por escrito. Buena candidata para testimonio.', nombre: 'Juliana Peña', edad: 41, telefono: '+57 315 555 0106', programa: 'Suscripción semestral', mes: 9, estado: 'activo', color: '#0b7a8a',
      motivo: 'Perimenopausia, sueño y peso.',
      tener_presente: 'Va muy bien. Pidió una guía de comidas para un viaje de diciembre.',
      puntajes: { Energía: 76, Sueño: 64, Nutrición: 80, Estrés: 69, Movimiento: 82, Metabólico: 72 },
      plan: ['Mantenimiento · check-in mensual'], pendientes: [] },
    { id: 7, codigo: '8452', quien: 'Contador, entrena triatlón los fines de semana. Colesterol alto de familia.', como_hablarle: 'Práctico. Le sirven los recordatorios por WhatsApp. Se le olvida actualizar la tarjeta.', nombre: 'Felipe Arango', edad: 47, telefono: '+57 316 555 0107', programa: 'Inicial 4 meses', mes: 2, estado: 'activo', color: '#365777',
      motivo: 'Colesterol alto y poca energía para entrenar.',
      tener_presente: 'Le falló el pago de noviembre en Stripe. LalaChat ya le mandó el recordatorio.',
      puntajes: { Energía: 60, Sueño: 66, Nutrición: 55, Estrés: 62, Movimiento: 70, Metabólico: 48 },
      plan: ['Mes 1 · Grasas buenas y fibra', 'Mes 2 · Cardio zona 2', 'Mes 3 · Fuerza', 'Mes 4 · Re-diagnóstico'],
      pendientes: ['Actualizar tarjeta en Stripe'] },
    { id: 8, codigo: '9076', quien: 'Docente, hipotiroidismo hace 6 años. Toma levotiroxina.', como_hablarle: 'Se preocupa rápido por los síntomas. Responderle pronto y con calma.', nombre: 'Daniela Vélez', edad: 36, telefono: '+57 317 555 0108', programa: 'Suscripción mensual', mes: 6, estado: 'activo', color: '#9a5f0c',
      motivo: 'Hipotiroidismo, energía y ánimo.',
      tener_presente: 'Escribió anoche que se siente con palpitaciones. Está en rojo, te toca a ti.',
      puntajes: { Energía: 52, Sueño: 60, Nutrición: 70, Estrés: 45, Movimiento: 58, Metabólico: 63 },
      plan: ['Mantenimiento · check-in mensual'], pendientes: ['Respuesta tuya sobre las palpitaciones'] }
  ],

  citas: [
    { id: 1, paciente_id: 1, dia: 0, hora: '07:30', tipo: 'Sesión de seguimiento', estado: 'confirmada' },
    { id: 2, paciente_id: 5, dia: 0, hora: '09:00', tipo: 'Re-diagnóstico mes 3', estado: 'confirmada' },
    { id: 3, paciente_id: 2, dia: 0, hora: '11:00', tipo: 'Cierre del programa', estado: 'confirmada' },
    { id: 4, paciente_id: 4, dia: 0, hora: '16:00', tipo: 'Primera sesión', estado: 'por confirmar' },
    { id: 5, paciente_id: 7, dia: 1, hora: '08:00', tipo: 'Sesión de seguimiento', estado: 'confirmada' },
    { id: 6, paciente_id: 6, dia: 2, hora: '10:00', tipo: 'Check-in mensual', estado: 'confirmada' },
    { id: 7, paciente_id: 3, dia: 3, hora: '07:00', tipo: 'Sesión de seguimiento', estado: 'por confirmar' },
    { id: 8, paciente_id: 8, dia: 4, hora: '15:00', tipo: 'Sesión de seguimiento', estado: 'confirmada' }
  ],

  sesiones: [
    { id: 1, paciente_id: 1, dia: -14, titulo: 'Sesión 3 · sueño', resumen: 'Se despierta a las 3 a.m. Empezamos magnesio en la noche y luz de mañana. Bajó el café a una taza.', tareas: ['Diario de sueño 7 días', 'Caminar 15 min después de almorzar'] },
    { id: 2, paciente_id: 1, dia: -28, titulo: 'Sesión 2 · alimentación', resumen: 'Ordenamos horarios. Antojos de dulce en la tarde, se cambia el snack por proteína.', tareas: ['Snack con proteína a las 4 p.m.'] },
    { id: 3, paciente_id: 2, dia: -15, titulo: 'Sesión 7 · glucosa', resumen: 'HbA1c en 5,6. Muy comprometido. Se habla de la continuación semestral.', tareas: ['Pensar en suscripción semestral'] },
    { id: 4, paciente_id: 5, dia: -13, titulo: 'Sesión 5 · reintroducción', resumen: 'Toleró bien el huevo y el trigo. Pendiente probar lácteos.', tareas: ['Registro de síntomas'] },
    { id: 5, paciente_id: 3, dia: -40, titulo: 'Sesión de mantenimiento', resumen: 'Mucho estrés en el trabajo. Dejó de entrenar.', tareas: ['Retomar fuerza'] },
    { id: 6, paciente_id: 7, dia: -12, titulo: 'Sesión 3 · colesterol', resumen: 'Cambió a aceite de oliva y aguacate. Empezó cardio zona 2.', tareas: ['3 sesiones de zona 2'] }
  ],

  examenes: [
    { paciente_id: 1, marcador: 'Vitamina D', unidad: 'ng/mL', min: 30, max: 80, valores: [[-120, 18], [-60, 24], [-7, 33]] },
    { paciente_id: 1, marcador: 'Ferritina', unidad: 'ng/mL', min: 30, max: 150, valores: [[-120, 22], [-60, 26], [-7, 29]] },
    { paciente_id: 1, marcador: 'Glucosa', unidad: 'mg/dL', min: 70, max: 99, valores: [[-120, 96], [-60, 92], [-7, 88]] },
    { paciente_id: 2, marcador: 'HbA1c', unidad: '%', min: 4, max: 5.6, valores: [[-120, 6.1], [-60, 5.8], [-10, 5.6]] },
    { paciente_id: 2, marcador: 'Triglicéridos', unidad: 'mg/dL', min: 0, max: 150, valores: [[-120, 210], [-60, 170], [-10, 138]] },
    { paciente_id: 5, marcador: 'PCR ultrasensible', unidad: 'mg/L', min: 0, max: 1, valores: [[-90, 3.2], [-45, 1.8], [-5, 0.9]] },
    { paciente_id: 7, marcador: 'LDL', unidad: 'mg/dL', min: 0, max: 130, valores: [[-60, 172], [-12, 151]] },
    { paciente_id: 8, marcador: 'TSH', unidad: 'µUI/mL', min: 0.4, max: 4, valores: [[-100, 5.8], [-40, 3.1]] }
  ],

  // Bandeja del semáforo: lo que los pacientes escriben por WhatsApp (LalaChat) o Circle
  mensajes: [
    { id: 1, paciente_id: 6, canal: 'WhatsApp', color: 'verde', estado: 'enviado', min: 35,
      texto: '¿Me puedes recordar a qué hora es mi check-in del miércoles?',
      respuesta: '¡Hola Juliana! Tu check-in es el miércoles a las 10:00 a.m. Te mando el enlace de Meet una hora antes.' },
    { id: 2, paciente_id: 1, canal: 'Circle', color: 'verde', estado: 'enviado', min: 80,
      texto: '¿Qué puedo comer en la cena para no despertarme con hambre?',
      respuesta: 'Hola Mariana, como lo hablaron con el doctor: proteína + vegetales + una porción pequeña de carbohidrato (papa o arroz), y cenar 3 horas antes de dormir. Te dejo la guía de cenas en tu espacio de Circle.' },
    { id: 3, paciente_id: 5, canal: 'WhatsApp', color: 'amarillo', estado: 'pendiente', min: 50,
      texto: 'Doctor, ¿ya puedo volver a tomar leche? Me siento mucho mejor.',
      respuesta: 'Hola Valentina, qué bueno que te sientas mejor. Vamos a probar con yogur griego natural, media taza al día por 3 días, y me cuentas cómo te va. Si hay inflamación, paramos y lo revisamos en tu re-diagnóstico.' },
    { id: 4, paciente_id: 4, canal: 'WhatsApp', color: 'amarillo', estado: 'pendiente', min: 120,
      texto: 'Les mandé los exámenes que me hice el año pasado, ¿sirven o me los repito?',
      respuesta: 'Hola Santiago, gracias por enviarlos. Como tienen más de 6 meses, te pido repetir el perfil completo para tener una base actual. Te mando la orden con la lista de exámenes.' },
    { id: 5, paciente_id: 8, canal: 'WhatsApp', color: 'rojo', estado: 'pendiente', min: 540,
      texto: 'Anoche sentí palpitaciones fuertes y un poco de mareo. ¿Es por el medicamento de la tiroides?',
      respuesta: '' },
    { id: 6, paciente_id: 2, canal: 'Circle', color: 'verde', estado: 'enviado', min: 200,
      texto: '¡Gracias doc! Ya me llegó el resumen de la sesión.',
      respuesta: '¡Con mucho gusto Andrés! Cualquier cosa me escribes por aquí.' }
  ],

  // Conversaciones de LalaChat por WhatsApp
  whatsapp: [
    { paciente_id: 8, de: 'paciente', min: 540, texto: 'Anoche sentí palpitaciones fuertes y un poco de mareo. ¿Es por el medicamento de la tiroides?' },
    { paciente_id: 8, de: 'lalachat', min: 539, texto: 'Daniela, gracias por contarme. Esto lo tiene que ver el doctor directamente y ya le avisé como prioridad. Si las palpitaciones vuelven con dolor en el pecho, falta de aire o desmayo, ve a urgencias de inmediato.', color: 'rojo' },
    { paciente_id: 5, de: 'paciente', min: 50, texto: 'Doctor, ¿ya puedo volver a tomar leche? Me siento mucho mejor.' },
    { paciente_id: 5, de: 'lalachat', min: 49, texto: '¡Qué bueno que te sientas mejor, Valentina! Le paso tu pregunta al doctor y te respondo hoy mismo.', color: 'amarillo' },
    { paciente_id: 6, de: 'lalachat', min: 1440, texto: 'Hola Juliana 👋 te recuerdo tu check-in de este mes. Son 5 minutos: https://forms.gle/checkin', color: 'verde' },
    { paciente_id: 6, de: 'paciente', min: 36, texto: '¿Me puedes recordar a qué hora es mi check-in del miércoles?' },
    { paciente_id: 6, de: 'lalachat', min: 35, texto: '¡Hola Juliana! Tu check-in es el miércoles a las 10:00 a.m. Te mando el enlace de Meet una hora antes.', color: 'verde' },
    { paciente_id: 7, de: 'lalachat', min: 300, texto: 'Hola Felipe, el pago de noviembre no pasó en tu tarjeta. Aquí puedes actualizarla en un minuto: https://pagos.drjuanpe.com/felipe', color: 'verde' },
    { paciente_id: 7, de: 'paciente', min: 280, texto: 'Uy sí, se me venció la tarjeta. Ya la cambio hoy.' },
    { paciente_id: 7, de: 'lalachat', min: 279, texto: '¡Gracias Felipe! Te confirmo por aquí apenas quede el pago.', color: 'verde' },
    { paciente_id: 4, de: 'lalachat', min: 2880, texto: 'Hola Santiago, bienvenido al programa 🙌 Para armar tu diagnóstico necesitamos tus exámenes. Puedes mandarlos por aquí en PDF o foto.', color: 'verde' },
    { paciente_id: 4, de: 'paciente', min: 121, texto: 'Les mandé los exámenes que me hice el año pasado, ¿sirven o me los repito?' },
    { paciente_id: 4, de: 'lalachat', min: 120, texto: 'Recibidos, Santiago. El doctor los revisa y te digo hoy si sirven o hay que repetirlos.', color: 'amarillo' },
    { paciente_id: 3, de: 'lalachat', min: 4320, texto: 'Hola Camila, ¿cómo vas? Te extrañamos en las últimas sesiones. ¿Quieres que te busque un espacio esta semana?', color: 'verde' }
  ],

  recordatorios: [
    { id: 1, paciente_id: 1, tipo: 'Sesión', texto: 'Recordatorio de sesión de hoy 7:30 a.m. con enlace de Meet', dia: 0, hora: '06:30', estado: 'enviado' },
    { id: 2, paciente_id: 4, tipo: 'Exámenes', texto: 'Recordar subir exámenes de sangre (3er aviso)', dia: 0, hora: '12:00', estado: 'programado' },
    { id: 3, paciente_id: 3, tipo: 'Check-in', texto: 'Check-in de octubre sin responder', dia: 0, hora: '15:00', estado: 'programado' },
    { id: 4, paciente_id: 7, tipo: 'Pago', texto: 'Seguimiento al pago fallido de noviembre', dia: 1, hora: '09:00', estado: 'programado' },
    { id: 5, paciente_id: 6, tipo: 'Check-in', texto: 'Enlace de Meet para el check-in', dia: 2, hora: '09:00', estado: 'programado' },
    { id: 6, paciente_id: 2, tipo: 'Renovación', texto: 'Link de pago de la suscripción semestral', dia: 1, hora: '11:00', estado: 'programado' }
  ],

  leads: [
    { id: 1, nombre: 'Carolina Montoya', fuente: 'Instagram', etapa: 'nuevo', valor: 2000, nota: 'Llenó el formulario de la landing de enero.' },
    { id: 2, nombre: 'Esteban Cárdenas', fuente: 'Referido', etapa: 'nuevo', valor: 2000, nota: 'Lo refirió Andrés Giraldo.' },
    { id: 3, nombre: 'Laura Toro', fuente: 'Landing', etapa: 'llamada', valor: 2000, nota: 'Llamada de valoración el jueves.' },
    { id: 4, nombre: 'Mateo Sierra', fuente: 'Instagram', etapa: 'llamada', valor: 2000, nota: 'Pregunta por el plan para deportistas.' },
    { id: 5, nombre: 'Natalia Gómez', fuente: 'Referido', etapa: 'propuesta', valor: 2000, nota: 'Le mandamos el link de pago 50/50.' },
    { id: 6, nombre: 'Santiago Mejía', fuente: 'Landing', etapa: 'pagado', valor: 2000, nota: 'Pagó. Ficha y expediente creados solos.' }
  ],

  pagos: [
    { id: 1, paciente_id: 7, concepto: 'Mensualidad noviembre', monto: 500, estado: 'fallido', dia: -2, intentos: 2 },
    { id: 2, paciente_id: 3, concepto: 'Suscripción mensual', monto: 350, estado: 'pendiente', dia: 3, intentos: 0 },
    { id: 3, paciente_id: 2, concepto: 'Renovación semestral', monto: 1800, estado: 'pendiente', dia: 6, intentos: 0 },
    { id: 4, paciente_id: 4, concepto: 'Programa inicial · 50%', monto: 1000, estado: 'pagado', dia: -3, intentos: 1 },
    { id: 5, paciente_id: 1, concepto: 'Mensualidad noviembre', monto: 500, estado: 'pagado', dia: -5, intentos: 1 },
    { id: 6, paciente_id: 6, concepto: 'Suscripción semestral', monto: 1800, estado: 'pagado', dia: -30, intentos: 1 },
    { id: 7, paciente_id: 5, concepto: 'Mensualidad noviembre', monto: 500, estado: 'pagado', dia: -4, intentos: 1 }
  ],
  // Check-in mensual: se envía solo, LalaChat recuerda y llega pre-leído contra el expediente
  checkins: [
    { id: 1, paciente_id: 6, mes: 'Noviembre', estado: 'respondido', resumen: 'Duerme mejor (7 h). Energía 8/10. Pide guía de comidas para viaje en diciembre. Nada en rojo.', color: 'verde' },
    { id: 2, paciente_id: 1, mes: 'Noviembre', estado: 'respondido', resumen: 'Sigue despertándose a las 3 a.m. aunque menos días. Antojos bajaron. Pregunta si sube el magnesio.', color: 'amarillo' },
    { id: 3, paciente_id: 8, mes: 'Noviembre', estado: 'respondido', resumen: 'Reporta palpitaciones y cansancio. Cambió la hora de la levotiroxina. Revisar contigo.', color: 'rojo' },
    { id: 4, paciente_id: 2, mes: 'Noviembre', estado: 'respondido', resumen: 'Muy contento con los resultados. Quiere seguir en semestral. Dispuesto a dar testimonio.', color: 'verde' },
    { id: 5, paciente_id: 3, mes: 'Octubre', estado: 'sin_respuesta', resumen: 'No ha respondido. LalaChat le recordó 2 veces.', color: null },
    { id: 6, paciente_id: 7, mes: 'Noviembre', estado: 'enviado', resumen: 'Enviado hoy. LalaChat le recuerda en 2 días si no responde.', color: null }
  ],

  // Lo que va llegando por WhatsApp mientras el demo está abierto (para mostrar a LalaChat en vivo)
  envivo: [
    { paciente_id: 6, texto: '¿Me puedes mandar la guía de comidas para el viaje?' },
    { paciente_id: 1, texto: '¿Puedo subir el magnesio a dos pastillas?' },
    { paciente_id: 2, texto: 'Listo, ya quiero pagar la semestral, ¿me mandas el link?' },
    { paciente_id: 5, texto: 'Hola! ¿mi cita de hoy sigue a las 9?' },
    { paciente_id: 3, texto: 'Perdón por desaparecer, ¿me ayudas a reagendar?' },
    { paciente_id: 4, texto: 'Ya me hice los exámenes, se los mando en foto' }
  ]
};
