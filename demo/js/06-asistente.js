// Chat del asistente y avisos de LalaChat a Juanpe antes de cada cita.
// Los archivos de js/ se cargan en orden y comparten variables (scripts clásicos, sin empaquetador).
/* ============ ASISTENTE (chat flotante) ============ */
const SUGERIDAS = ['Reporte de hoy', '¿Qué le está contestando LalaChat?', 'Mañana viajo, acomódalos', 'Cóbrale la semestral a Andrés', '¿Cuánto he cobrado?', '¿Qué tengo por aprobar?'];
function burbujaChat(html, yo){ const m = document.getElementById('chatMsjs'); const b = document.createElement('div'); b.className = 'burbuja' + (yo?' yo':''); b.innerHTML = html + `<span class="meta">${new Date().toLocaleTimeString('es-CO',{hour:'numeric',minute:'2-digit'})}</span>`; m.appendChild(b); m.scrollTop = m.scrollHeight; return b; }
async function responder(q){
  const s = q.toLowerCase();
  if (/viaj|acom[oó]d|mover|bloque/.test(s)) return await moverViaje();
  if (/prep[aá]r|sesi[oó]n de/.test(s)){ const p = D.pacientes.find(x => s.includes(primer(x.nombre).toLowerCase())); if (p) return `<b>Sesión con ${esc(p.nombre)}</b>\nMes ${p.mes} de ${esc(p.programa)}.\n\n<b>Ten presente:</b> ${esc(p.tener_presente)}\n\n<b>Pendientes:</b> ${(p.pendientes||[]).map(esc).join(', ') || 'ninguno'}<button class="accion" data-chatir="p:${p.id}">Abrir expediente</button>`; }
  if (/enfri|renov|[uú]ltimo mes/.test(s)){ const ps = D.pacientes.filter(p=>['enfriandose','ultimo_mes'].includes(p.estado)); return ps.map(p => `• <b>${esc(p.nombre)}</b>: ${p.estado==='enfriandose'?'se está enfriando':'entra a su último mes'}. ${esc(p.tener_presente)}`).join('\n\n') + `<button class="accion" data-chatir="hoy">Ver en el reporte</button>`; }
  if (!/cu[aá]nto|cobrado/.test(s) && /c[oó]br(a|ale)\b|link de pago/.test(s)){ const p = D.pacientes.find(x => s.includes(primer(x.nombre).toLowerCase())); if (!p) return 'Dime a quién le cobro, por ejemplo: “cóbrale la semestral a Andrés”.';
    const sem = /semestral/.test(s); const monto = sem ? 1800 : 500; const concepto = sem ? 'Suscripción semestral' : 'Mensualidad';
    const ex = D.pagos.find(x => x.paciente_id===p.id && x.estado!=='pagado' && (!sem || /semestral/i.test(x.concepto)));
    if (!ex) await insertar('pagos', {paciente_id:p.id, concepto, monto, estado:'pendiente', dia:0, intentos:0});
    const link = `https://buy.stripe.com/drjuanpe-${primer(p.nombre).toLowerCase()}`;
    await insertar('whatsapp', {paciente_id:p.id, de:'lalachat', color:'verde', texto:`Hola ${primer(p.nombre)} 👋 te comparto el link para tu ${(ex?ex.concepto:concepto).toLowerCase()} (${usd(ex?ex.monto:monto)}): ${link}\nCualquier duda me escribes por aquí.`});
    pintar(); return `Listo. Creé el link de pago en Stripe por <b>${usd(ex?ex.monto:monto)}</b> (${esc(ex?ex.concepto:concepto)}) y LalaChat ya se lo mandó a ${esc(p.nombre)} por WhatsApp. Te aviso cuando pague.<button class="accion" data-chatir="cobros">Ver cobros</button>`; }
  if (/cu[aá]nto|cobrado|factur/.test(s)){ const pag = D.pagos.filter(p=>p.estado==='pagado'); const pend = D.pagos.filter(p=>p.estado!=='pagado'); return `Según Stripe, este mes llevas <b>${usd(pag.reduce((a,p)=>a+Number(p.monto),0))}</b> cobrados en ${pag.length} pagos.\nTienes <b>${usd(pend.reduce((a,p)=>a+Number(p.monto),0))}</b> por cobrar (${pend.length} pagos), de los cuales ${D.pagos.filter(p=>p.estado==='fallido').length} fallaron.<button class="accion" data-chatir="cobros">Ver cobros</button>`; }
  if (/lalachat|contestando|respondiendo|whatsapp/.test(s)){ abrirCajon(); const ult = D.whatsapp.filter(w=>w.de==='lalachat').sort((a,b)=>new Date(b.creado)-new Date(a.creado)).slice(0,3); return `LalaChat lleva <b>${D.whatsapp.filter(w=>w.de==='lalachat').length} respuestas</b>. Las últimas:\n\n` + ult.map(w => `• A ${esc(primer(pac(w.paciente_id).nombre))}: “${esc(w.texto.slice(0,110))}${w.texto.length>110?'…':''}”`).join('\n\n') + `\n\nTe abrí el panel en vivo a la derecha.`; }
  if (/pag|cobr|stripe/.test(s)){ const f = D.pagos.filter(p=>p.estado==='fallido'); return (f.length ? f.map(x => `• <b>${esc(pac(x.paciente_id).nombre)}</b>: ${esc(x.concepto)}, ${usd(x.monto)}, ${x.intentos} intentos. LalaChat ya le escribió por WhatsApp.`).join('\n') : 'No hay pagos fallidos 🎉') + `<button class="accion" data-chatir="cobros">Ver cobros</button>`; }
  if (/aprob|amarill|rojo|pendiente/.test(s)){ const a = D.mensajes.filter(m=>m.estado==='pendiente'); return `Tienes <b>${a.filter(m=>m.color==='amarillo').length} borradores en amarillo</b> y <b>${a.filter(m=>m.color==='rojo').length} en rojo</b>:\n\n` + a.map(m => `• ${m.color==='rojo'?'🔴':'🟡'} ${esc(pac(m.paciente_id).nombre)}: “${esc(m.texto)}”`).join('\n') + `<button class="accion" data-chatir="semaforo">Abrir semáforo</button>`; }
  if (/landing|p[aá]gina/.test(s)){ return `Tus landings se quedan en GoDaddy. Lo que la gente llene ahí cae solo en Ventas, y LalaChat le escribe por WhatsApp a cada persona nueva.<button class="accion" data-chatir="ventas">Ver ventas</button>`; }
  if (!/reporte|mi d[ií]a|qu[eé] tengo hoy/.test(s)){ const r = await ia({tipo:'asistente', pregunta:q, contexto:contextoIA()}); if (r?.respuesta) return esc(r.respuesta); }
  const hoy = D.citas.filter(c=>c.dia===0).sort((a,b)=>a.hora.localeCompare(b.hora));
  return `<b>Tu día, ${fechaDia(0).toLocaleDateString('es-CO',{weekday:'long', day:'numeric', month:'long'})}</b>\n\n` + hoy.map(c => { const p = pac(c.paciente_id); return `• <b>${hc(c)} ${esc(p.nombre)}</b> (${esc(c.tipo)}): ${esc(p.tener_presente)}`; }).join('\n\n') +
    `\n\n🔴 ${D.mensajes.filter(m=>m.color==='rojo'&&m.estado==='pendiente').length} en rojo · 🟡 ${D.mensajes.filter(m=>m.color==='amarillo'&&m.estado==='pendiente').length} por aprobar · 💳 ${D.pagos.filter(p=>p.estado==='fallido').length} pago fallido<button class="accion" data-chatir="hoy">Abrir el reporte</button>`;
}
function contextoIA(){
  const carly = esCarly();
  return {quien_pregunta: carly ? 'Carly, la asistente (no puede ver nada clínico)' : 'Dr. Juanpe', hoy: fechaDia(0).toLocaleDateString('es-CO',{weekday:'long', day:'numeric', month:'long'}),
    citas: D.citas.filter(c=>c.dia>=0).map(c => ({paciente:pac(c.paciente_id).nombre, cuando:`${nomDia(c.dia)} ${hc(c)}`, tipo:c.tipo, estado:c.estado})),
    pacientes: D.pacientes.map(p => ({nombre:p.nombre, programa:p.programa, mes:p.mes, estado:p.estado, pais:p.pais, consentimiento_firmado:!!p.consentimiento, pendientes:p.pendientes, ...(carly ? {} : {tener_presente:p.tener_presente, quien_es:p.quien})})),
    pagos_sin_pagar: D.pagos.filter(f=>f.estado!=='pagado').map(f => ({paciente:pac(f.paciente_id).nombre, concepto:f.concepto, monto_usd:f.monto, estado:f.estado})),
    semaforo_pendiente: carly ? [] : D.mensajes.filter(m=>m.estado==='pendiente').map(m => ({paciente:pac(m.paciente_id).nombre, color:m.color, canal:m.canal, mensaje:m.texto}))};
}
async function preguntar(q){
  if (!q.trim()) return; burbujaChat(esc(q), true);
  const m = document.getElementById('chatMsjs'); const e = document.createElement('div'); e.className = 'escribiendo'; e.innerHTML = '<i></i><i></i><i></i>'; m.appendChild(e); m.scrollTop = m.scrollHeight;
  await new Promise(r=>setTimeout(r, 700)); const r = await responder(q); e.remove(); burbujaChat(r);
}
function abrirChat(q){ document.getElementById('chat').classList.add('abierto'); document.getElementById('abrirChat').style.display='none'; if (q) preguntar(q); }

/* ============ TU WHATSAPP (LalaChat le escribe a Juanpe) ============ */
let chatJuanpe = [];
function hm(h, menos){ const [a,b] = h.split(':').map(Number); const t = a*60+b-menos; return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`; }
function briefCita(c){
  const p = pac(c.paciente_id); const ult = D.sesiones.filter(s=>s.paciente_id===p.id).sort((a,b)=>b.dia-a.dia)[0];
  const rojo = D.mensajes.find(m=>m.paciente_id===p.id && m.color==='rojo' && m.estado==='pendiente');
  const pago = D.pagos.find(f=>f.paciente_id===p.id && f.estado==='fallido');
  return `⏰ *En 30 min:* ${p.nombre} · ${c.tipo} (${hc(c)}${horaPac(c, p)})\n\n👤 *Quién es:* ${p.quien || p.motivo}\n📍 *Va en:* ${p.programa}, mes ${p.mes}\n🩺 *Ten presente:* ${p.tener_presente}` +
    (ult ? `\n📝 *Última sesión (${fechaCorta(ult.dia)}):* ${ult.resumen}` : '') +
    ((p.pendientes||[]).length ? `\n✅ *Pendientes:* ${p.pendientes.join(' · ')}` : '') +
    (rojo ? `\n🔴 *Ojo:* tiene un mensaje en rojo sin responder: “${rojo.texto}”` : '') +
    (pago ? `\n💳 *Ojo:* pago fallido de ${usd(pago.monto)}` : '') +
    (p.como_hablarle ? `\n💬 *Cómo hablarle:* ${p.como_hablarle}` : '');
}
function msjsTuWa(){
  const hoy = citasDia(0);
  const ahora = Date.now();
  const base = [{yo:false, hora:horaEn('06:30', 0), texto:`☀️ *Buenos días Juanpe.* Hoy tienes ${hoy.length} sesiones: ${hoy.map(c=>`${hc(c)} ${primer(pac(c.paciente_id).nombre)}`).join(', ')}.\n🔴 ${D.mensajes.filter(m=>m.color==='rojo'&&m.estado==='pendiente').length} en rojo · 🟡 ${D.mensajes.filter(m=>m.color==='amarillo'&&m.estado==='pendiente').length} por aprobar.\nTe escribo 30 minutos antes de cada cita con todo lo que necesitas saber.`},
    ...hoy.map(c => instante(c.hora, c.dia, 30) <= ahora
      ? {yo:false, hora:horaEn(c.hora, c.dia, miZona, 30), texto:briefCita(c)}
      : {yo:false, prog:true, hora:horaEn(c.hora, c.dia, miZona, 30), texto:`🕒 *Programado para las ${horaEn(c.hora, c.dia, miZona, 30)}:* aviso de tu cita con ${pac(c.paciente_id).nombre} (${hc(c)}).`})];
  return [...base, ...chatJuanpe];
}
const negrita = t => esc(t).replace(/\*([^*]+)\*/g,'<b>$1</b>');
async function preguntaJuanpe(q){
  const ahora = new Date().toTimeString().slice(0,5);
  chatJuanpe.push({yo:true, hora:ahora, texto:q}); pintar();
  let r;
  if (/pr[oó]xima|qui[eé]n (es|sigue|viene)|siguiente/.test(q.toLowerCase())){ const c = D.citas.filter(c => instante(c.hora, c.dia) >= Date.now()).sort((a,b) => instante(a.hora, a.dia) - instante(b.hora, b.dia))[0] || D.citas[0]; r = {texto: briefCita(c).replace('⏰ *En 30 min:*','⏰ *Tu próxima cita:*')}; }
  else { const html = (await responder(q)).replace(/<button[^>]*>.*?<\/button>/g,''); r = {html}; }
  chatJuanpe.push({yo:false, hora:new Date().toTimeString().slice(0,5), ...r}); pintar();
}

