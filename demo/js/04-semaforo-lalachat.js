// Semáforo médico y conversaciones de LalaChat por WhatsApp.
// Los archivos de js/ se cargan en orden y comparten variables (scripts clásicos, sin empaquetador).
/* ============ SEMÁFORO ============ */
function vSemaforo(){
  const lista = D.mensajes.filter(m=>m.color===filtroSem).sort((a,b)=> (a.estado==='pendiente'?-1:1) - (b.estado==='pendiente'?-1:1) || new Date(b.creado)-new Date(a.creado));
  const n = c => D.mensajes.filter(m=>m.color===c && (c==='verde' || m.estado==='pendiente')).length;
  return cab('Semáforo médico', 'Todo lo que tus pacientes escriben por WhatsApp (LalaChat) y Circle pasa por aquí. Lo clínico nunca le llega a un paciente sin tu aprobación.') + `
    <div class="leyenda">
      <div class="tarjeta"><span class="punto verde" style="margin-top:5px"></span><div><b>Verde · se responde solo</b><span>Agenda, recordatorios, guías de alimentación, dudas que ya respondiste antes.</span></div></div>
      <div class="tarjeta"><span class="punto amarillo" style="margin-top:5px"></span><div><b>Amarillo · borrador para ti</b><span>Exámenes, suplementos, cambios de plan. La IA escribe, tú apruebas.</span></div></div>
      <div class="tarjeta"><span class="punto rojo" style="margin-top:5px"></span><div><b>Rojo · lo atiendes tú</b><span>Síntomas de alarma o medicamentos. LalaChat solo da la indicación de seguridad. Si quieres responder tú, pausas el bot en esa conversación de LalaChat.</span></div></div>
    </div>
    <div class="pestanas">${['amarillo','rojo','verde'].map(c => `<button class="pestana ${filtroSem===c?'act':''}" data-sem="${c}"><span class="punto ${c}"></span>${COLORES[c][0]} · ${n(c)}</button>`).join('')}</div>
    ${lista.map(m => { const p = pac(m.paciente_id); return `<article class="tarjeta msj ${m.color}">
      <div class="de">${bolita(p)}<div><b>${esc(p.nombre)}</b><span>${m.canal==='WhatsApp'?'WhatsApp · LalaChat':'Circle'} · ${hace(m.creado)}</span></div><div style="margin-left:auto">${pastillaColor(m.color)}</div></div>
      <p class="texto">“${esc(m.texto)}”</p>
      ${m.color==='amarillo' && m.estado==='pendiente' ? `<textarea class="borrador" id="b${m.id}">${esc(m.respuesta)}</textarea>
        <div class="acciones"><button class="boton verde chico" data-aprobar="${m.id}">Aprobar y enviar</button><button class="boton sec chico" data-ir="pacientes" data-p="${p.id}">Ver expediente</button></div>` : ''}
      ${m.color==='rojo' && m.estado==='pendiente' ? `<textarea class="borrador" id="b${m.id}" placeholder="Escribe tu respuesta o déjala vacía si vas a llamar…">${esc(m.respuesta)}</textarea>
        <div class="acciones"><button class="boton rojo chico" data-aprobar="${m.id}">Enviar mi respuesta</button><button class="boton sec chico" data-abrirlc="1">Pausar bot y responder</button><button class="boton sec chico" data-llamar="${m.id}">La llamo yo</button><button class="boton sec chico" data-ir="pacientes" data-p="${p.id}">Ver expediente</button></div>` : ''}
      ${m.estado!=='pendiente' ? `<div class="respondido"><b>${m.color==='verde'?'LalaChat respondió sola':'Respondido'}:</b> ${esc(m.respuesta || 'Lo atendiste por llamada.')}</div>` : ''}
    </article>`; }).join('') || '<p class="vacio">Nada por aquí.</p>'}`;
}
async function aprobar(id){
  const m = D.mensajes.find(x=>x.id===id); const txt = document.getElementById('b'+id)?.value.trim() || '';
  if (!txt){ toast('Escribe la respuesta primero'); return; }
  await actualizar('mensajes', id, {estado:'aprobado', respuesta:txt});
  await insertar('whatsapp', {paciente_id:m.paciente_id, de:'lalachat', color:m.color, texto:txt + '\n— aprobado por el Dr. Juanpe'});
  toast(`Enviado a ${primer(pac(m.paciente_id).nombre)} por ${m.canal}`); pintar();
}

/* ============ LALACHAT (WhatsApp) ============ */
function clasificar(t){
  const s = t.toLowerCase();
  if (/pecho|palpitaci|desmay|mareo|sangr|urgen|no puedo respirar|falta de aire|dolor fuerte|fiebre|vómito|vomit/.test(s)) return 'rojo';
  if (/examen/.test(s) && /(se los|te los|les) mando|en foto|ya me (los )?hice/.test(s)) return 'verde';
  if (/examen|resultado|medicament|dosis|suplement|pastilla|vitamina|leche|l[aá]cteo|puedo (comer|tomar|volver)|síntoma|sintoma|inflama|cambiar el plan/.test(s)) return 'amarillo';
  return 'verde';
}
function respuestaLalaChat(p, t, color){
  const n = primer(p.nombre), s = t.toLowerCase();
  if (color==='rojo') return `${n}, gracias por contarme. Esto lo tiene que ver el doctor directamente y ya le avisé como prioridad. Si tienes dolor en el pecho, falta de aire o te desmayas, ve a urgencias de inmediato.`;
  if (color==='amarillo') return `¡Gracias ${n}! Le paso tu pregunta al doctor y te respondo hoy mismo con su indicación.`;
  const cita = D.citas.filter(c=>c.paciente_id===p.id && c.dia>=0).sort((a,b)=>a.dia-b.dia)[0];
  if (/cita|sesi[oó]n|hora|cu[aá]ndo|agenda|reagend|cambiar/.test(s)) return cita ? `¡Hola ${n}! Tu próxima sesión es ${nomDia(cita.dia).toLowerCase()} a las ${horaEn(cita.hora, cita.dia, p.zona || 'America/Bogota')}${p.zona && p.zona !== 'America/Bogota' ? ' (hora de ' + (ZONAS[p.zona] || p.pais) + ')' : ''}. Si necesitas moverla, dime qué día te queda mejor y te busco espacio.` : `¡Hola ${n}! Ya te busco espacio con el doctor. ¿Prefieres mañana o tarde?`;
  if (/pag|tarjeta|factura|cobro/.test(s)) return `Claro ${n}, aquí puedes pagar o actualizar tu tarjeta en un minuto: https://pagos.drjuanpe.com/${n.toLowerCase()}`;
  if (/foto|mando|env[ií]o/.test(s) && /examen/.test(s)) return `¡Perfecto ${n}! Mándalos por aquí y quedan guardados en tu expediente. El doctor los revisa antes de tu próxima sesión.`;
  if (/comer|comida|receta|cena|desayuno|almuerzo|snack|men[uú]|gu[ií]a/.test(s)) return `${n}, te dejo la guía de comidas del doctor para tu etapa del plan. Recuerda: proteína en cada comida y cenar 3 horas antes de dormir 🥗`;
  if (/gracias|listo|ok|perfecto/.test(s)) return `¡Con mucho gusto ${n}! Aquí estoy para lo que necesites 🙌`;
  return `¡Hola ${n}! Recibido. Si es algo de tu plan te respondo enseguida, y si necesita al doctor se lo paso hoy mismo.`;
}
function convsOrden(){
  const ult = {}; D.whatsapp.forEach(w => { if (!ult[w.paciente_id] || new Date(w.creado) > new Date(ult[w.paciente_id].creado)) ult[w.paciente_id] = w; });
  return Object.values(ult).sort((a,b)=>new Date(b.creado)-new Date(a.creado));
}
function listaConvs(convs){
  return `<button class="conv ${convSel==='juanpe'?'act':''}" data-conv="juanpe"><span class="ini" style="background:var(--navy)">JP</span><div class="txt" style="min-width:0; flex:1"><b>Dr. Juanpe (tú)</b><span>Avisos antes de cada cita</span></div></button>` +
    convs.map(w => { const q = pac(w.paciente_id); return `<button class="conv ${q.id===convSel?'act':''}" data-conv="${q.id}">${bolita(q)}<div class="txt" style="min-width:0; flex:1"><b>${esc(q.nombre)}</b><span>${w.de==='lalachat'?'LalaChat: ':''}${esc(w.texto)}</span></div><small style="font-size:11px; color:var(--gris)">${hace(w.creado).replace('hace ','')}</small></button>`; }).join('');
}
function chatJuanpeHTML(){
  return `<section class="wachat">
      <div class="wa-cab"><span class="ini" style="background:var(--navy)">JP</span><div><b>Dr. Juanpe (tú)</b><span>LalaChat te escribe cada mañana y 30 min antes de cada cita</span></div></div>
      <div class="mensajes" id="waMsjs">${msjsTuWa().map(m => `<div class="burbuja ${m.yo?'yo':''}" ${m.prog ? 'style="opacity:.6; border:1px dashed #b9c8e0; box-shadow:none"' : ''}>${m.yo ? esc(m.texto) : '<span class="quien">LalaChat</span>' + (m.html || negrita(m.texto))}<span class="meta">${m.hora}</span></div>`).join('')}</div>
      <div class="wa-pie"><form id="juanpeForm"><input id="juanpeInput" autocomplete="off" placeholder="Pregúntale: “¿quién es mi próxima cita?” o “cóbrale a Felipe”"><button class="env" aria-label="Enviar">${ic('env')}</button></form></div>
    </section>`;
}
function vLalaChat(){
  const convs = convsOrden(); if (!convSel) convSel = 'juanpe';
  if (convSel === 'juanpe'){
    const recs = D.recordatorios.slice().sort((a,b)=>a.dia-b.dia || a.hora.localeCompare(b.hora));
    return cab('LalaChat · WhatsApp', 'LalaChat le responde a tus pacientes por WhatsApp, les manda los recordatorios y lee todo lo que escriben. A ti te escribe cada mañana y 30 minutos antes de cada cita con quién es la persona y qué tener presente.',
      `<button class="boton wa" data-abrirlc="1">${ic('wa')}Abrir LalaChat</button><button class="boton sec" data-ir="semaforo">${ic('sem')}Ver semáforo</button>`) + `
      <div class="lalachat"><section class="tarjeta convs">${listaConvs(convs)}</section>${chatJuanpeHTML()}
      <section class="tarjeta seccion recs"><div class="seccion-cab"><h2>Recordatorios de LalaChat</h2></div>${recs.map(r => { const q = pac(r.paciente_id); return `<div class="fila"><div class="cuerpo"><div class="t" style="font-size:14px">${esc(r.tipo)} · ${esc(primer(q.nombre))}</div><div class="s">${esc(r.texto)}</div><div class="s">${nomDia(r.dia)} · ${r.hora}</div></div><div class="der"><span class="pastilla ${r.estado==='enviado'?'verde':'azul'}">${r.estado==='enviado'?'Enviado':'Programado'}</span></div></div>`; }).join('')}</section></div>`;
  }
  const p = pac(convSel); const msjs = D.whatsapp.filter(w=>w.paciente_id===convSel).sort((a,b)=>new Date(a.creado)-new Date(b.creado));
  const recs = D.recordatorios.slice().sort((a,b)=>a.dia-b.dia || a.hora.localeCompare(b.hora));
  return cab('LalaChat · WhatsApp', 'LalaChat le responde a tus pacientes por WhatsApp, les manda los recordatorios y lee todo lo que escriben. Cada mensaje pasa por el semáforo antes de responder.',
    `<button class="boton wa" data-abrirlc="1">${ic('wa')}Abrir LalaChat</button><button class="boton sec" data-ir="semaforo">${ic('sem')}Ver semáforo</button>`) + `
    <div class="lalachat">
      <section class="tarjeta convs">${listaConvs(convs)}</section>
      <section class="wachat">
        <div class="wa-cab">${bolita(p)}<div><b>${esc(p.nombre)}</b><span>${esc(p.telefono)} · atendida por LalaChat</span></div><div class="der" style="display:flex; gap:6px"><button class="boton chico sec" data-abrirlc="1" style="min-height:32px; white-space:nowrap">Pausar bot y responder</button><button class="boton chico sec" data-ir="pacientes" data-p="${p.id}" style="min-height:32px">Expediente</button></div></div>
        <div class="mensajes" id="waMsjs">${msjs.map(w => `<div class="burbuja ${w.de!=='paciente'?'yo':''}">${w.de==='lalachat'?'<span class="quien">LalaChat</span>':w.de==='juanpe'?'<span class="quien" style="color:var(--azul)">Dr. Juanpe</span>':''}${esc(w.texto)}<span class="meta">${w.color && w.de==='lalachat' ? pastillaColor(w.color) : ''}${horaDe(w.creado)}</span></div>`).join('')}</div>
        <div class="wa-pie">
          <div class="modo"><button class="${modoWa==='paciente'?'act':''}" data-modo="paciente">Simular mensaje de ${esc(primer(p.nombre))}</button><button class="${modoWa==='juanpe'?'act':''}" data-modo="juanpe">Escribir yo</button></div>
          <form id="waForm"><input id="waInput" autocomplete="off" placeholder="${modoWa==='paciente' ? 'Prueba: “¿a qué hora es mi cita?” o “tengo dolor en el pecho”' : 'Escribe como el doctor…'}"><button class="env" aria-label="Enviar">${ic('env')}</button></form>
        </div>
      </section>
      <section class="tarjeta seccion recs"><div class="seccion-cab"><h2>Recordatorios de LalaChat</h2></div>
        ${recs.map(r => { const q = pac(r.paciente_id); return `<div class="fila"><div class="cuerpo"><div class="t" style="font-size:14px">${esc(r.tipo)} · ${esc(primer(q.nombre))}</div><div class="s">${esc(r.texto)}</div><div class="s">${nomDia(r.dia)} · ${r.hora}</div></div><div class="der"><span class="pastilla ${r.estado==='enviado'?'verde':'azul'}">${r.estado==='enviado'?'Enviado':'Programado'}</span></div></div>`; }).join('')}
      </section>
    </div>`;
}
// La IA real vive en /api/ia. Si no está configurada (o falla), todo sigue funcionando con las reglas de arriba.
async function ia(cuerpo){
  const token = await tokenSesion(); if (!token) return null;
  try { const r = await fetch('/api/ia', {method:'POST', headers:{'Content-Type':'application/json', Authorization:'Bearer ' + token}, body:JSON.stringify(cuerpo)}); return r.ok ? await r.json() : null; }
  catch { return null; }
}
const GRAVEDAD = {verde:0, amarillo:1, rojo:2};
// Decide el color y la respuesta a un mensaje de un paciente. Las reglas son el piso de seguridad:
// la IA puede subir la gravedad pero nunca bajarla, y lo rojo siempre sale con el mensaje fijo.
async function atender(p, texto){
  const base = clasificar(texto);
  let color = base, respuesta = respuestaLalaChat(p, texto, base);
  let borrador = base === 'amarillo' ? `Hola ${primer(p.nombre)}, sobre lo que me preguntas: [aquí va el borrador con tu criterio y el expediente de ${primer(p.nombre)}]. Lo revisamos en la próxima sesión.` : '';
  if (base !== 'rojo'){
    const cita = D.citas.filter(c=>c.paciente_id===p.id && c.dia>=0).sort((a,b)=>a.dia-b.dia)[0];
    const r = await ia({tipo:'paciente', texto, paciente:{nombre:p.nombre, programa:p.programa, mes:p.mes, como_hablarle:p.como_hablarle, plan:p.plan, pendientes:p.pendientes,
      proxima_cita: cita ? `${nomDia(cita.dia)} a las ${horaEn(cita.hora, cita.dia, p.zona || 'America/Bogota')} (hora del paciente)` : 'sin cita agendada'}});
    if (r && GRAVEDAD[r.color] !== undefined){
      color = GRAVEDAD[r.color] > GRAVEDAD[base] ? r.color : base;
      if (color === 'verde') respuesta = r.respuesta || respuesta;
      else { respuesta = respuestaLalaChat(p, texto, color); if (color === 'amarillo') borrador = r.borrador || borrador; }
    }
  }
  return {color, respuesta, borrador: color === 'amarillo' ? borrador : ''};
}
async function enviarWa(texto){
  const p = pac(convSel);
  if (modoWa==='juanpe'){ await insertar('whatsapp', {paciente_id:p.id, de:'juanpe', texto}); pintar(); return; }
  await insertar('whatsapp', {paciente_id:p.id, de:'paciente', texto}); pintar();
  const [a] = await Promise.all([atender(p, texto), new Promise(r=>setTimeout(r, 900))]);
  await insertar('whatsapp', {paciente_id:p.id, de:'lalachat', color:a.color, texto:a.respuesta});
  await insertar('mensajes', {paciente_id:p.id, canal:'WhatsApp', color:a.color, texto, respuesta: a.color==='verde' ? a.respuesta : a.borrador, estado: a.color==='verde' ? 'enviado' : 'pendiente'});
  pintar();
  toast(a.color==='verde' ? 'Verde: LalaChat respondió sola' : a.color==='amarillo' ? 'Amarillo: quedó un borrador para tu aprobación' : 'Rojo: te llegó una alerta, esto es tuyo');
}

