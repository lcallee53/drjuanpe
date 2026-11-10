// Check-ins del mes y pantalla de conexiones.
// Los archivos de js/ se cargan en orden y comparten variables (scripts clásicos, sin empaquetador).
/* ============ CHECK-INS ============ */
function vCheckins(){
  const ord = {rojo:0, amarillo:1, verde:2};
  const lista = D.checkins.slice().sort((a,b)=>(ord[a.color] ?? 3)-(ord[b.color] ?? 3));
  const resp = D.checkins.filter(c=>c.estado==='respondido').length;
  return cab('Check-ins del mes', 'Se envían solos cada mes, LalaChat le recuerda a quien no responde, y te llegan ya leídos contra el expediente para que grabes tu respuesta directo.') + `
    <div class="cifras">
      <div class="cifra oscura"><span class="k">Respondidos</span><span class="v">${resp}/${D.checkins.length}</span><span class="d">Este mes</span></div>
      <div class="cifra"><span class="k">En rojo</span><span class="v rojo">${D.checkins.filter(c=>c.color==='rojo').length}</span><span class="d">Revisa tú primero</span></div>
      <div class="cifra"><span class="k">En amarillo</span><span class="v ambar">${D.checkins.filter(c=>c.color==='amarillo').length}</span><span class="d">Tienen una pregunta para ti</span></div>
      <div class="cifra"><span class="k">Sin responder</span><span class="v">${D.checkins.filter(c=>c.estado!=='respondido').length}</span><span class="d">LalaChat les está recordando</span></div>
    </div>
    <section class="tarjeta seccion">${lista.map(c => { const p = pac(c.paciente_id); return `<div class="fila">${bolita(p)}<div class="cuerpo"><div class="t">${esc(p.nombre)} · ${esc(c.mes)} ${c.color ? pastillaColor(c.color) : `<span class="pastilla">${c.estado==='enviado'?'Enviado':'Sin respuesta'}</span>`}</div>
      <div class="presente"><b>${c.estado==='respondido'?'Pre-leído:':'Estado:'}</b> ${esc(c.resumen)}</div></div>
      <div class="der">${c.estado==='respondido' ? `<button class="boton sec chico" data-ir="pacientes" data-p="${p.id}">Expediente</button>` : `<button class="boton wa chico" data-recordarck="${c.id}">Recordar por WhatsApp</button>`}</div></div>`; }).join('')}</section>`;
}

/* ============ CONEXIONES ============ */
const CONEX = [
  ['WhatsApp Business · LalaChat', 'LalaChat responde a los pacientes, manda recordatorios y lee lo que escriben, con el semáforo.', 'Plan Pro mensual', 'wa'],
  ['Stripe', 'Cobros, links de pago, reintentos de pagos fallidos y renovaciones. El asistente lo maneja por instrucción.', 'Fase 2', 'azul'],
  ['Google Calendar y Meet', 'Agenda, bloqueos por viaje y enlaces de Meet para cada sesión.', 'Fase 2', 'azul'],
  ['Notas de sesión · Fathom (o Granola)', 'El resumen y las tareas de cada sesión caen solos en el expediente. Las dos tienen API; Juanpe hoy usa Fathom.', 'Fase 1', 'azul'],
  ['Google Forms', 'El onboarding y el check-in mensual caen solos en el expediente de cada persona.', 'Fase 1', 'azul'],
  ['Google Drive', 'Los exámenes en PDF o foto que guarda Carly se leen con el criterio de Juanpe.', 'Fase 1', 'azul'],
  ['Circle', 'El asistente lee y responde en el espacio privado de cada paciente y publica el resumen de la sesión.', 'Fase 2 · responder a pacientes va en el plan Pro', 'azul'],
  ['Telegram', 'El reporte de cada mañana y las alertas en rojo le llegan a Juanpe al celular.', 'Fase 1', 'azul'],
  ['GoHighLevel · se queda', 'Sigue con todo lo de antes del pago: pipeline, landings, formularios de venta, newsletters e Instagram. Cuando alguien paga o firma allá, su ficha y su expediente se crean solos aquí.', 'Fase 2', 'azul'],
  ['Monday · se reemplaza', 'La ficha, la historia y los pendientes de cada paciente pasan a esta app. Es lo único que dejas de usar.', 'Fase 1', 'lima'],
  ['Memoria · GitHub memoria-juanpe', 'Un archivo por paciente con quién es, lo importante, los pendientes y el resumen de cada reunión. LalaChat lo lee antes de escribirle a Juanpe y lo actualiza después de cada sesión.', 'Fase 1', 'lima'],
  ['Portal del paciente', 'Cada paciente entra con su código y ve su plan, su diagnóstico, sus exámenes, sus tareas y sus pagos.', 'Función nueva · se cotiza aparte', 'ambar'],
  ['Voz de Juanpe (opcional)', 'Notas de voz con la voz de Juanpe para lo verde, si él quiere.', 'Fuera del contrato · se cotiza aparte', 'ambar']
];
function vIntegraciones(){
  return cab('Conexiones', 'Todo lo que la app conecta para que no tengas que saltar entre herramientas. GoHighLevel se queda para el mercadeo y las ventas, y esta app reemplaza a Monday.') + `
    <div class="integ">${CONEX.map(([n,t,f,c]) => `<div class="tarjeta"><b>${n}</b><p>${t}</p><span class="pastilla ${c}">${f}</span></div>`).join('')}</div>
    <section class="tarjeta seccion"><div class="seccion-cab"><h2>Quién entra a la app</h2></div>
      <div class="fila"><span class="avatar" style="background:var(--navy); color:#d8edbe">JP</span><div class="cuerpo"><div class="t">Juan Pedro Montoya</div><div class="s">Ve todo y aprueba lo clínico (amarillo y rojo).</div></div><div class="der"><span class="pastilla verde">Dueño</span></div></div>
      <div class="fila"><span class="avatar" style="background:#7a4fc4; color:#fff">CA</span><div class="cuerpo"><div class="t">Carly</div><div class="s">Agenda, exámenes y cobros. No ve ni aprueba lo clínico.</div></div><div class="der"><span class="pastilla azul">Asistente</span></div></div>
    </section>`;
}

