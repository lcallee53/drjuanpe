// Reporte de hoy y agenda.
// Los archivos de js/ se cargan en orden y comparten variables (scripts clásicos, sin empaquetador).
/* ============ HOY ============ */
function vHoy(){
  const carly = esCarly();
  const hoy = citasDia(0);
  const amar = D.mensajes.filter(m=>m.color==='amarillo' && m.estado==='pendiente');
  const rojos = D.mensajes.filter(m=>m.color==='rojo' && m.estado==='pendiente');
  const fallidos = D.pagos.filter(p=>p.estado==='fallido');
  const sinCons = D.pacientes.filter(p=>!p.consentimiento);
  const verdes = D.whatsapp.filter(w=>w.de==='lalachat' && w.color==='verde').length;
  const alertas = [
    ...(carly ? [] : rojos.map(m => ({p:pac(m.paciente_id), t:`Mensaje en rojo de ${primer(pac(m.paciente_id).nombre)}`, s:m.texto, tag:pastillaColor('rojo'), ir:`semaforo`}))),
    ...D.pacientes.filter(p=>p.estado==='enfriandose').map(p => ({p, t:`${primer(p.nombre)} se está enfriando`, s:carly ? 'Canceló sesiones y no ha respondido. Hay que buscarle espacio.' : p.tener_presente, tag:estadoP(p), ir:`p:${p.id}`})),
    ...D.pacientes.filter(p=>p.estado==='ultimo_mes').map(p => ({p, t:`${primer(p.nombre)} entra a su último mes`, s:'Buen momento para la renovación y el testimonio.', tag:estadoP(p), ir:`p:${p.id}`})),
    ...fallidos.map(f => ({p:pac(f.paciente_id), t:`Pago fallido · ${pac(f.paciente_id).nombre}`, s:`${f.concepto} · ${usd(f.monto)} · ${f.intentos} intentos. LalaChat ya le escribió.`, tag:'<span class="pastilla roja">Stripe</span>', ir:'cobros'})),
    ...D.pacientes.filter(p=>(p.pendientes||[]).some(x=>/exámenes/i.test(x))).map(p => ({p, t:`${primer(p.nombre)} no ha mandado exámenes`, s:'LalaChat le recuerda hoy a las 12:00.', tag:'<span class="pastilla azul">Exámenes</span>', ir:`p:${p.id}`})),
    ...sinCons.map(p => ({p, t:`${primer(p.nombre)} no ha firmado el consentimiento nuevo`, s:'Sin la firma no se pueden manejar sus datos con IA.', tag:pastillaCons(p), ir:`p:${p.id}`}))
  ];
  const h = Number(new Intl.DateTimeFormat('en-GB', {timeZone:miZona, hour:'2-digit', hour12:false}).format(new Date()));
  const saludo = h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches';
  const apodo = vistaCarly ? 'Carly' : /^Juan/.test(USUARIO.nombre) ? 'Juanpe' : esc(primer(USUARIO.nombre));
  return cab(`${saludo}, ${apodo}`, `${nomDia(0)} ${fechaDia(0).toLocaleDateString('es-CO',{weekday:'long', day:'numeric', month:'long'})}. ${carly ? 'Esto es lo que hay que mover hoy.' : 'Esto es lo que tienes hoy y lo que se te puede estar pasando.'}`,
      `<button class="boton wa" data-envivo="1">${ic('wa')}Ver a LalaChat respondiendo</button>${carly ? '' : `<button class="boton sec" data-chat="reporte de hoy">Mándamelo por Telegram</button>`}`) + `
    <div class="cifras">
      <button class="cifra oscura" data-ir="agenda"><span class="k">Sesiones hoy</span><span class="v">${hoy.length}</span><span class="d">La primera a las ${hoy[0] ? hc(hoy[0]) : '—'}${miZona !== 'America/Bogota' ? ' · hora de ' + ZONAS[miZona] : ''}</span></button>
      ${carly ? `<button class="cifra" data-ir="cobros"><span class="k">Pagos fallidos</span><span class="v rojo">${fallidos.length}</span><span class="d">Stripe · hay que hacer seguimiento</span></button>
      <button class="cifra" data-ir="pacientes"><span class="k">Consentimientos por firmar</span><span class="v ambar">${sinCons.length}</span><span class="d">Sin esto no entran sus datos</span></button>` :
      `<button class="cifra" data-ir="semaforo" data-sem="amarillo"><span class="k">Borradores para aprobar</span><span class="v ambar">${amar.length}</span><span class="d">Amarillo · tú das el visto bueno</span></button>
      <button class="cifra" data-ir="semaforo" data-sem="rojo"><span class="k">Lo que es tuyo</span><span class="v rojo">${rojos.length}</span><span class="d">Rojo · necesita tu respuesta</span></button>`}
      <button class="cifra" data-ir="lalachat"><span class="k">Respondido solo por LalaChat</span><span class="v verde">${verdes}</span><span class="d">Verde · WhatsApp y recordatorios</span></button>
    </div>
    <div class="grilla3">
      <section class="tarjeta seccion"><div class="seccion-cab"><h2>${carly ? 'Sesiones de hoy' : 'Tus sesiones de hoy · reporte pre-sesión'}</h2></div>
        ${hoy.map(c => { const p = pac(c.paciente_id); return `<div class="fila clic" data-ir="pacientes" data-p="${p.id}">
          <span class="hora">${hc(c)}</span>${bolita(p)}<div class="cuerpo"><div class="t">${esc(p.nombre)} · ${esc(c.tipo)}</div>
          <div class="s">${esc(p.programa)} · mes ${p.mes}${horaPac(c, p)} ${estadoP(p)} ${p.consentimiento ? '' : pastillaCons(p)}</div>
          ${carly ? `<div class="s">Estado: ${esc(c.estado)}</div>` : `<div class="presente"><b>Ten presente:</b> ${esc(p.tener_presente)}</div>`}</div></div>`; }).join('') || '<p class="vacio">Hoy no hay sesiones.</p>'}
      </section>
      <section class="tarjeta seccion"><div class="seccion-cab"><h2>${carly ? 'Pendientes de hoy' : 'Lo que se te puede estar pasando'}</h2></div>
        ${alertas.map(a => `<div class="fila clic" data-alerta="${a.ir}">${bolita(a.p,34)}<div class="cuerpo"><div class="t">${esc(a.t)}</div><div class="s">${esc(a.s)}</div><div style="margin-top:6px">${a.tag}</div></div></div>`).join('') || '<p class="vacio">Todo al día 🎉</p>'}
      </section>
    </div>
    <section class="tarjeta seccion"><div class="seccion-cab"><h2>LalaChat hoy por WhatsApp</h2><button data-ir="lalachat">Abrir conversaciones →</button></div>
      ${D.recordatorios.filter(r=>r.dia===0).map(r => { const p = pac(r.paciente_id); return `<div class="fila"><span class="hora">${horaEn(r.hora, 0)}</span><div class="cuerpo"><div class="t">${esc(r.tipo)} · ${esc(p.nombre)}</div><div class="s">${esc(r.texto)}</div></div><div class="der"><span class="pastilla ${r.estado==='enviado'?'verde':'azul'}">${r.estado==='enviado'?'Enviado':'Programado'}</span></div></div>`; }).join('')}
    </section>`;
}

/* ============ AGENDA ============ */
function vAgenda(){
  const dias = [0,1,2,3,4];
  return cab('Agenda', 'Conectada a tu Google Calendar. Le puedes escribir al asistente "mañana viajo, acomódalos" y él mueve las citas y LalaChat le avisa a cada persona, a cada una en su hora local.',
    `<label class="zona">Estoy en <select id="miZona">${Object.entries(ZONAS).map(([z,n]) => `<option value="${z}" ${z===miZona?'selected':''}>${n}</option>`).join('')}</select></label><button class="boton" data-viajo="1">Mañana viajo, acomódalos</button>`) + `
    <div class="dias">${dias.map(d => { const cs = citasDia(d); return `<div class="dia ${d===0?'hoy':''}"><h3>${diaSemana(d)} <span style="color:var(--gris); font-weight:500; text-transform:none">${fechaMes(d)}</span></h3>
      ${cs.map(c => { const p = pac(c.paciente_id); return `<div class="cita ${c.movida?'movida':''}"><b>${hc(c)} · ${esc(p.nombre)}</b><span>${esc(c.tipo)} · ${c.movida ? 'movida por viaje' : c.estado}${horaPac(c, p)}</span></div>`; }).join('') || '<p class="vacio" style="font-size:13px">Libre</p>'}</div>`; }).join('')}</div>
    <p style="font-size:13px; color:var(--gris); margin-top:14px">Las horas se ven en la zona donde estás (${ZONAS[miZona]}). Cuando el paciente está en otra zona, sale también su hora local.</p>`;
}
async function moverViaje(){
  const man = D.citas.filter(c=>c.dia===1);
  if (!man.length){ toast('Mañana ya está libre'); return 'Mañana ya no tienes citas, quedó libre.'; }
  const horas = ['12:00','14:00','17:00'];
  for (const [i,c] of man.entries()){
    await actualizar('citas', c.id, {dia:2, hora:horas[i%3], estado:'confirmada', movida:true});
    const p = pac(c.paciente_id);
    await insertar('whatsapp', {paciente_id:p.id, de:'lalachat', color:'verde', texto:`Hola ${primer(p.nombre)}, el doctor tiene un viaje mañana. Movimos tu sesión para el ${nomDia(2)} a las ${horaEn(horas[i%3], 2, p.zona || 'America/Bogota')}${p.zona && p.zona !== 'America/Bogota' ? ' (hora de ' + (ZONAS[p.zona] || p.pais) + ')' : ''}. Si no te queda bien, respóndeme y te busco otro espacio 🙏`});
  }
  pintar();
  return `Listo. Moví ${man.length} cita${man.length>1?'s':''} de mañana al ${nomDia(2)} y LalaChat ya le avisó a cada persona por WhatsApp.`;
}

