-- Datos de prueba del demo (generado desde datos.js)
truncate pacientes, citas, sesiones, examenes, mensajes, whatsapp, recordatorios, leads, pagos, landings, checkins restart identity cascade;
insert into pacientes (id,codigo,quien,como_hablarle,nombre,edad,telefono,programa,mes,estado,color,motivo,tener_presente,puntajes,plan,pendientes) values
(1,'4821','Diseñadora gráfica, 2 hijos pequeños. Trabaja de noche cuando los niños duermen, por eso le cuesta el sueño.','Le gustan las explicaciones con el porqué. Responde mejor por WhatsApp que por Circle.','Mariana Restrepo',38,'+57 310 555 0101','Inicial 4 meses',2,'activo','#2457a7','Cansancio en las tardes, sueño cortado y antojos de dulce.','Le subió la vitamina D desde la última sesión. Sigue despertándose a las 3 a.m. Pidió ajustar la cena.','{"Energía":58,"Sueño":42,"Nutrición":66,"Estrés":50,"Movimiento":72,"Metabólico":61}'::jsonb,'["Mes 1 · Ordenar horarios de comida y luz de la mañana","Mes 2 · Sueño: rutina de cierre y magnesio","Mes 3 · Fuerza 3 veces por semana","Mes 4 · Re-diagnóstico y plan de mantenimiento"]'::jsonb,'["Mandar foto del diario de sueño","Agendar control de ferritina"]'::jsonb),
(2,'5307','Ingeniero, maneja una constructora. Su papá tuvo diabetes y eso lo motiva mucho.','Directo y con números. Le encanta ver las gráficas de sus exámenes.','Andrés Giraldo',45,'+57 311 555 0102','Inicial 4 meses',4,'ultimo_mes','#1e8e3e','Prediabetes y grasa abdominal. Quiere bajar la glucosa sin medicamento.','Último mes del programa. La HbA1c bajó de 6,1 a 5,6. Buen momento para hablar de continuación y pedir testimonio.','{"Energía":78,"Sueño":70,"Nutrición":81,"Estrés":64,"Movimiento":75,"Metabólico":73}'::jsonb,'["Mes 1 · Desayuno con proteína, caminar después de comer","Mes 2 · Ayuno de 12 horas","Mes 3 · Fuerza y control de porciones","Mes 4 · Re-diagnóstico y continuación"]'::jsonb,'["Enviar link de pago de la suscripción semestral"]'::jsonb),
(3,'6194','Abogada en una firma grande, viaja mucho. Entró muy motivada pero el trabajo la absorbió.','No presionarla. Funciona mejor un mensaje corto y cálido que un recordatorio formal.','Camila Ochoa',33,'+57 312 555 0103','Suscripción mensual',7,'enfriandose','#d98a1c','Mantenimiento: energía y rendimiento en el trabajo.','Canceló las dos últimas sesiones y no respondió el check-in de octubre. Riesgo de que no renueve.','{"Energía":61,"Sueño":55,"Nutrición":58,"Estrés":38,"Movimiento":49,"Metabólico":66}'::jsonb,'["Mantenimiento · check-in mensual","Retomar fuerza 2 veces por semana"]'::jsonb,'["Responder check-in de octubre"]'::jsonb),
(4,'7740','Empresario, 52 años. Llegó referido por Andrés Giraldo. Tiene la presión alta y duerme 5 horas.','Le gusta que le expliquen todo con calma en la primera sesión. Prefiere llamadas a mensajes largos.','Santiago Mejía',52,'+57 313 555 0104','Inicial 4 meses',1,'nuevo','#7a4fc4','Hipertensión leve, estrés alto, duerme 5 horas.','Paciente nuevo. Ya llenó el onboarding y pagó. Faltan los exámenes de sangre para cerrar el diagnóstico.','{"Energía":45,"Sueño":35,"Nutrición":52,"Estrés":30,"Movimiento":40,"Metabólico":50}'::jsonb,'["Borrador · esperando tu aprobación"]'::jsonb,'["Subir exámenes de sangre","Firmar consentimiento actualizado"]'::jsonb),
(5,'3368','Estudiante de maestría. Llegó con colon irritable después de años de molestias.','Muy juiciosa con los registros. Le da ansiedad no saber qué puede comer, darle opciones concretas.','Valentina Ruiz',29,'+57 314 555 0105','Inicial 4 meses',3,'activo','#c0392b','Colon irritable e inflamación.','Re-diagnóstico del tercer mes esta semana. Reporta menos inflamación. Pregunta si puede volver a los lácteos.','{"Energía":70,"Sueño":68,"Nutrición":74,"Estrés":57,"Movimiento":66,"Metabólico":71}'::jsonb,'["Mes 1 · Eliminación","Mes 2 · Reintroducción guiada","Mes 3 · Re-diagnóstico","Mes 4 · Plan de mantenimiento"]'::jsonb,'[]'::jsonb),
(6,'2915','Psicóloga, 41 años, en perimenopausia. Lleva 9 meses y es de las pacientes más comprometidas.','Le gusta el detalle y las guías por escrito. Buena candidata para testimonio.','Juliana Peña',41,'+57 315 555 0106','Suscripción semestral',9,'activo','#0b7a8a','Perimenopausia, sueño y peso.','Va muy bien. Pidió una guía de comidas para un viaje de diciembre.','{"Energía":76,"Sueño":64,"Nutrición":80,"Estrés":69,"Movimiento":82,"Metabólico":72}'::jsonb,'["Mantenimiento · check-in mensual"]'::jsonb,'[]'::jsonb),
(7,'8452','Contador, entrena triatlón los fines de semana. Colesterol alto de familia.','Práctico. Le sirven los recordatorios por WhatsApp. Se le olvida actualizar la tarjeta.','Felipe Arango',47,'+57 316 555 0107','Inicial 4 meses',2,'activo','#365777','Colesterol alto y poca energía para entrenar.','Le falló el pago de noviembre en Stripe. LalaChat ya le mandó el recordatorio.','{"Energía":60,"Sueño":66,"Nutrición":55,"Estrés":62,"Movimiento":70,"Metabólico":48}'::jsonb,'["Mes 1 · Grasas buenas y fibra","Mes 2 · Cardio zona 2","Mes 3 · Fuerza","Mes 4 · Re-diagnóstico"]'::jsonb,'["Actualizar tarjeta en Stripe"]'::jsonb),
(8,'9076','Docente, hipotiroidismo hace 6 años. Toma levotiroxina.','Se preocupa rápido por los síntomas. Responderle pronto y con calma.','Daniela Vélez',36,'+57 317 555 0108','Suscripción mensual',6,'activo','#9a5f0c','Hipotiroidismo, energía y ánimo.','Escribió anoche que se siente con palpitaciones. Está en rojo, te toca a ti.','{"Energía":52,"Sueño":60,"Nutrición":70,"Estrés":45,"Movimiento":58,"Metabólico":63}'::jsonb,'["Mantenimiento · check-in mensual"]'::jsonb,'["Respuesta tuya sobre las palpitaciones"]'::jsonb);
insert into citas (paciente_id,dia,hora,tipo,estado) values
(1,0,'07:30','Sesión de seguimiento','confirmada'),
(5,0,'09:00','Re-diagnóstico mes 3','confirmada'),
(2,0,'11:00','Cierre del programa','confirmada'),
(4,0,'16:00','Primera sesión','por confirmar'),
(7,1,'08:00','Sesión de seguimiento','confirmada'),
(6,2,'10:00','Check-in mensual','confirmada'),
(3,3,'07:00','Sesión de seguimiento','por confirmar'),
(8,4,'15:00','Sesión de seguimiento','confirmada');
insert into sesiones (paciente_id,dia,titulo,resumen,tareas) values
(1,-14,'Sesión 3 · sueño','Se despierta a las 3 a.m. Empezamos magnesio en la noche y luz de mañana. Bajó el café a una taza.','["Diario de sueño 7 días","Caminar 15 min después de almorzar"]'::jsonb),
(1,-28,'Sesión 2 · alimentación','Ordenamos horarios. Antojos de dulce en la tarde, se cambia el snack por proteína.','["Snack con proteína a las 4 p.m."]'::jsonb),
(2,-15,'Sesión 7 · glucosa','HbA1c en 5,6. Muy comprometido. Se habla de la continuación semestral.','["Pensar en suscripción semestral"]'::jsonb),
(5,-13,'Sesión 5 · reintroducción','Toleró bien el huevo y el trigo. Pendiente probar lácteos.','["Registro de síntomas"]'::jsonb),
(3,-40,'Sesión de mantenimiento','Mucho estrés en el trabajo. Dejó de entrenar.','["Retomar fuerza"]'::jsonb),
(7,-12,'Sesión 3 · colesterol','Cambió a aceite de oliva y aguacate. Empezó cardio zona 2.','["3 sesiones de zona 2"]'::jsonb);
insert into examenes (paciente_id,marcador,unidad,min,max,dia,valor) values
(1,'Vitamina D','ng/mL',30,80,-120,18),
(1,'Vitamina D','ng/mL',30,80,-60,24),
(1,'Vitamina D','ng/mL',30,80,-7,33),
(1,'Ferritina','ng/mL',30,150,-120,22),
(1,'Ferritina','ng/mL',30,150,-60,26),
(1,'Ferritina','ng/mL',30,150,-7,29),
(1,'Glucosa','mg/dL',70,99,-120,96),
(1,'Glucosa','mg/dL',70,99,-60,92),
(1,'Glucosa','mg/dL',70,99,-7,88),
(2,'HbA1c','%',4,5.6,-120,6.1),
(2,'HbA1c','%',4,5.6,-60,5.8),
(2,'HbA1c','%',4,5.6,-10,5.6),
(2,'Triglicéridos','mg/dL',0,150,-120,210),
(2,'Triglicéridos','mg/dL',0,150,-60,170),
(2,'Triglicéridos','mg/dL',0,150,-10,138),
(5,'PCR ultrasensible','mg/L',0,1,-90,3.2),
(5,'PCR ultrasensible','mg/L',0,1,-45,1.8),
(5,'PCR ultrasensible','mg/L',0,1,-5,0.9),
(7,'LDL','mg/dL',0,130,-60,172),
(7,'LDL','mg/dL',0,130,-12,151),
(8,'TSH','µUI/mL',0.4,4,-100,5.8),
(8,'TSH','µUI/mL',0.4,4,-40,3.1);
insert into mensajes (paciente_id,canal,color,estado,texto,respuesta,creado) values
(6,'WhatsApp','verde','enviado','¿Me puedes recordar a qué hora es mi check-in del miércoles?','¡Hola Juliana! Tu check-in es el miércoles a las 10:00 a.m. Te mando el enlace de Meet una hora antes.',now() - interval '35 minutes'),
(1,'Circle','verde','enviado','¿Qué puedo comer en la cena para no despertarme con hambre?','Hola Mariana, como lo hablaron con el doctor: proteína + vegetales + una porción pequeña de carbohidrato (papa o arroz), y cenar 3 horas antes de dormir. Te dejo la guía de cenas en tu espacio de Circle.',now() - interval '80 minutes'),
(5,'WhatsApp','amarillo','pendiente','Doctor, ¿ya puedo volver a tomar leche? Me siento mucho mejor.','Hola Valentina, qué bueno que te sientas mejor. Vamos a probar con yogur griego natural, media taza al día por 3 días, y me cuentas cómo te va. Si hay inflamación, paramos y lo revisamos en tu re-diagnóstico.',now() - interval '50 minutes'),
(4,'WhatsApp','amarillo','pendiente','Les mandé los exámenes que me hice el año pasado, ¿sirven o me los repito?','Hola Santiago, gracias por enviarlos. Como tienen más de 6 meses, te pido repetir el perfil completo para tener una base actual. Te mando la orden con la lista de exámenes.',now() - interval '120 minutes'),
(8,'WhatsApp','rojo','pendiente','Anoche sentí palpitaciones fuertes y un poco de mareo. ¿Es por el medicamento de la tiroides?','',now() - interval '540 minutes'),
(2,'Circle','verde','enviado','¡Gracias doc! Ya me llegó el resumen de la sesión.','¡Con mucho gusto Andrés! Cualquier cosa me escribes por aquí.',now() - interval '200 minutes');
insert into whatsapp (paciente_id,de,texto,color,creado) values
(8,'paciente','Anoche sentí palpitaciones fuertes y un poco de mareo. ¿Es por el medicamento de la tiroides?',null,now() - interval '540 minutes'),
(8,'lalachat','Daniela, gracias por contarme. Esto lo tiene que ver el doctor directamente y ya le avisé como prioridad. Si las palpitaciones vuelven con dolor en el pecho, falta de aire o desmayo, ve a urgencias de inmediato.','rojo',now() - interval '539 minutes'),
(5,'paciente','Doctor, ¿ya puedo volver a tomar leche? Me siento mucho mejor.',null,now() - interval '50 minutes'),
(5,'lalachat','¡Qué bueno que te sientas mejor, Valentina! Le paso tu pregunta al doctor y te respondo hoy mismo.','amarillo',now() - interval '49 minutes'),
(6,'lalachat','Hola Juliana 👋 te recuerdo tu check-in de este mes. Son 5 minutos: https://forms.gle/checkin','verde',now() - interval '1440 minutes'),
(6,'paciente','¿Me puedes recordar a qué hora es mi check-in del miércoles?',null,now() - interval '36 minutes'),
(6,'lalachat','¡Hola Juliana! Tu check-in es el miércoles a las 10:00 a.m. Te mando el enlace de Meet una hora antes.','verde',now() - interval '35 minutes'),
(7,'lalachat','Hola Felipe, el pago de noviembre no pasó en tu tarjeta. Aquí puedes actualizarla en un minuto: https://pagos.drjuanpe.com/felipe','verde',now() - interval '300 minutes'),
(7,'paciente','Uy sí, se me venció la tarjeta. Ya la cambio hoy.',null,now() - interval '280 minutes'),
(7,'lalachat','¡Gracias Felipe! Te confirmo por aquí apenas quede el pago.','verde',now() - interval '279 minutes'),
(4,'lalachat','Hola Santiago, bienvenido al programa 🙌 Para armar tu diagnóstico necesitamos tus exámenes. Puedes mandarlos por aquí en PDF o foto.','verde',now() - interval '2880 minutes'),
(4,'paciente','Les mandé los exámenes que me hice el año pasado, ¿sirven o me los repito?',null,now() - interval '121 minutes'),
(4,'lalachat','Recibidos, Santiago. El doctor los revisa y te digo hoy si sirven o hay que repetirlos.','amarillo',now() - interval '120 minutes'),
(3,'lalachat','Hola Camila, ¿cómo vas? Te extrañamos en las últimas sesiones. ¿Quieres que te busque un espacio esta semana?','verde',now() - interval '4320 minutes');
insert into recordatorios (paciente_id,tipo,texto,dia,hora,estado) values
(1,'Sesión','Recordatorio de sesión de hoy 7:30 a.m. con enlace de Meet',0,'06:30','enviado'),
(4,'Exámenes','Recordar subir exámenes de sangre (3er aviso)',0,'12:00','programado'),
(3,'Check-in','Check-in de octubre sin responder',0,'15:00','programado'),
(7,'Pago','Seguimiento al pago fallido de noviembre',1,'09:00','programado'),
(6,'Check-in','Enlace de Meet para el check-in',2,'09:00','programado'),
(2,'Renovación','Link de pago de la suscripción semestral',1,'11:00','programado');
insert into leads (nombre,fuente,etapa,valor,nota) values
('Carolina Montoya','Instagram','nuevo',2000,'Llenó el formulario de la landing de enero.'),
('Esteban Cárdenas','Referido','nuevo',2000,'Lo refirió Andrés Giraldo.'),
('Laura Toro','Landing','llamada',2000,'Llamada de valoración el jueves.'),
('Mateo Sierra','Instagram','llamada',2000,'Pregunta por el plan para deportistas.'),
('Natalia Gómez','Referido','propuesta',2000,'Le mandamos el link de pago 50/50.'),
('Santiago Mejía','Landing','pagado',2000,'Pagó. Ficha y expediente creados solos.');
insert into checkins (paciente_id,mes,estado,resumen,color) values
(6,'Noviembre','respondido','Duerme mejor (7 h). Energía 8/10. Pide guía de comidas para viaje en diciembre. Nada en rojo.','verde'),
(1,'Noviembre','respondido','Sigue despertándose a las 3 a.m. aunque menos días. Antojos bajaron. Pregunta si sube el magnesio.','amarillo'),
(8,'Noviembre','respondido','Reporta palpitaciones y cansancio. Cambió la hora de la levotiroxina. Revisar contigo.','rojo'),
(2,'Noviembre','respondido','Muy contento con los resultados. Quiere seguir en semestral. Dispuesto a dar testimonio.','verde'),
(3,'Octubre','sin_respuesta','No ha respondido. LalaChat le recordó 2 veces.',null),
(7,'Noviembre','enviado','Enviado hoy. LalaChat le recuerda en 2 días si no responde.',null);
insert into pagos (paciente_id,concepto,monto,estado,dia,intentos) values
(7,'Mensualidad noviembre',500,'fallido',-2,2),
(3,'Suscripción mensual',350,'pendiente',3,0),
(2,'Renovación semestral',1800,'pendiente',6,0),
(4,'Programa inicial · 50%',1000,'pagado',-3,1),
(1,'Mensualidad noviembre',500,'pagado',-5,1),
(6,'Suscripción semestral',1800,'pagado',-30,1),
(5,'Mensualidad noviembre',500,'pagado',-4,1);
select setval(pg_get_serial_sequence('pacientes','id'), (select max(id) from pacientes));
