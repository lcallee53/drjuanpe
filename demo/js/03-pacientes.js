// Lista de pacientes, expediente y lectura de exámenes.
// Los archivos de js/ se cargan en orden y comparten variables (scripts clásicos, sin empaquetador).
/* ============ PACIENTES / EXPEDIENTE ============ */
let busca = '';
function vPacientes(){
  if (pacienteSel) return vExpediente(pac(pacienteSel));
  const lista = D.pacientes.filter(p => p.nombre.toLowerCase().includes(busca.toLowerCase()));
  return cab('Expedientes', 'Cada paciente con su expediente vivo: onboarding, sesiones de Fathom, exámenes y conversaciones en un solo lugar.') + `
    <div style="display:flex; gap:10px; margin-bottom:16px"><input class="buscador" id="busca" placeholder="Busca a un paciente…" value="${esc(busca)}"></div>
    <div class="pacientes">${lista.map(p => `<button class="tarjeta pac" data-ir="pacientes" data-p="${p.id}">${bolita(p,50)}<div><b>${esc(p.nombre)}</b><span>${esc(p.programa)} · mes ${p.mes} · ${esc(p.pais || '')}</span><span style="margin-top:6px">${estadoP(p)} ${p.consentimiento ? '' : pastillaCons(p)}</span></div></button>`).join('')}</div>`;
}
// Tarjeta de un marcador: valor grande, estado, tendencia y dónde cae dentro del rango.
function grafica(ex){
  const pts = ex.slice().sort((a,b)=>a.dia-b.dia);
  const min = Number(ex[0].min), max = Number(ex[0].max), vals = pts.map(e=>Number(e.valor));
  const ult = vals[vals.length-1], prev = vals.length > 1 ? vals[vals.length-2] : null, ok = ult >= min && ult <= max;
  const color = ok ? 'var(--verde)' : 'var(--ambar)';
  // tendencia
  const lo = Math.min(...vals, min), hi = Math.max(...vals, max), pad = (hi-lo)*.18 || 1, y0 = lo-pad, y1 = hi+pad, W = 260, H = 64;
  const X = i => 6 + i*(W-12)/Math.max(1,pts.length-1), Y = v => H - 6 - (v-y0)/(y1-y0)*(H-12);
  // regla del rango: la zona verde ocupa el centro y el punto muestra el valor actual
  const ancho = (max-min) || 1, r0 = min - ancho*.5, r1 = max + ancho*.5, pos = v => Math.max(2, Math.min(98, (v-r0)/(r1-r0)*100));
  const delta = prev === null ? '' : ult === prev ? 'Igual que el anterior' : `${ult > prev ? '▲' : '▼'} ${Math.abs(+(ult-prev).toFixed(2))} desde ${fechaCorta(pts[pts.length-2].dia)}`;
  return `<div class="bio"><div class="bio-cab"><b>${esc(ex[0].marcador)}</b><span class="pastilla ${ok?'verde':'ambar'}">${ok?'En rango':'Fuera de rango'}</span></div>
    <div class="bio-val"><strong>${ult}</strong><span>${esc(ex[0].unidad)}</span><em>${delta}</em></div>
    ${pts.length > 1 ? `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tendencia de ${esc(ex[0].marcador)}"><rect x="0" y="${Y(max)}" width="${W}" height="${Math.max(2,Y(min)-Y(max))}" rx="3" fill="#1e8e3e12"/>
      <polyline fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" points="${pts.map((e,i)=>`${X(i)},${Y(e.valor)}`).join(' ')}"/>
      ${pts.map((e,i)=>`<circle cx="${X(i)}" cy="${Y(e.valor)}" r="${i===pts.length-1?4.5:3}" fill="${i===pts.length-1?color:'#fff'}" stroke="${color}" stroke-width="2"/>`).join('')}</svg>` : ''}
    <div class="regla"><i style="left:${pos(min)}%; width:${pos(max)-pos(min)}%"></i><b style="left:${pos(ult)}%; background:${color}"></b></div>
    <div class="regla-pie"><span>${min}</span><span>tu rango</span><span>${max}</span></div></div>`;
}
// Anillo con el puntaje general (promedio de las áreas) al lado de las barras por área.
function diagnostico(puntajes){
  const e = Object.entries(puntajes||{}); if (!e.length) return '';
  const col = v => v>=70 ? 'var(--verde)' : v>=50 ? 'var(--ambar)' : 'var(--rojo)';
  const prom = Math.round(e.reduce((a,[,v])=>a+Number(v),0)/e.length), C = 2*Math.PI*42;
  return `<div class="diag"><div class="anillo"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#eef0f4" stroke-width="9"/><circle cx="50" cy="50" r="42" fill="none" stroke="${col(prom)}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C*prom/100} ${C}" transform="rotate(-90 50 50)"/></svg><div><strong>${prom}</strong><span>general</span></div></div>
    <div class="areas">${e.map(([k,v]) => `<div class="area"><span>${k}</span><div class="barra"><i style="width:${v}%; background:${col(v)}"></i></div><b>${v}</b></div>`).join('')}</div></div>`;
}
let lectura = null;   // examen recién leído que espera la aprobación del médico
const PANEL_EJEMPLO = [['Vitamina D','ng/mL',30,80,36],['Ferritina','ng/mL',30,150,41],['Glucosa','mg/dL',70,99,91],['HbA1c','%',4,5.6,5.4],['TSH','µUI/mL',0.4,4,2.6],['LDL','mg/dL',0,130,128]];
function lecturaEjemplo(p){
  const previos = D.examenes.filter(e=>e.paciente_id===p.id); const nombres = [...new Set(previos.map(e=>e.marcador))];
  const marcadores = PANEL_EJEMPLO.filter(m => !nombres.length || nombres.includes(m[0]) || m[0]==='HbA1c').map(([marcador,unidad,min,max,valor]) => ({marcador,unidad,min,max,valor}));
  const fuera = marcadores.filter(m => m.valor < m.min || m.valor > m.max);
  return {marcadores, ia:false, nota: fuera.length ? `Fuera de tu rango: ${fuera.map(m=>m.marcador).join(', ')}. Lo demás está dentro de lo que buscas.` : 'Todo dentro de tus rangos. Buen momento para mantener el plan como va.'};
}
async function leerExamen(archivo, pid){
  const p = pac(pid);
  if (archivo.size > 3.5e6){ toast('El archivo pesa más de 3,5 MB. Prueba con uno más liviano.'); return; }
  lectura = {pid, cargando:true, archivo:archivo.name}; pintar();
  let r = null;
  const token = await tokenSesion();
  if (token){
    try {
      const b64 = await new Promise((ok, mal) => { const f = new FileReader(); f.onload = () => ok(String(f.result).split(',')[1]); f.onerror = mal; f.readAsDataURL(archivo); });
      const resp = await fetch('/api/examen', {method:'POST', headers:{'Content-Type':'application/json', Authorization:'Bearer ' + token}, body:JSON.stringify({archivo:b64, tipo:archivo.type || 'application/pdf', paciente:{nombre:p.nombre, edad:p.edad, motivo:p.motivo}, previos:D.examenes.filter(e=>e.paciente_id===pid)})});
      if (resp.ok) r = {...(await resp.json()), ia:true};
    } catch(e){ console.warn('No se pudo leer con IA', e); }
  }
  if (!r){ await new Promise(x => setTimeout(x, 1600)); r = lecturaEjemplo(p); }
  lectura = {pid, archivo:archivo.name, ...r}; pintar();
}
async function aprobarLectura(){
  const l = lectura; const p = pac(l.pid);
  for (const [i, m] of l.marcadores.entries()){
    const v = Number(document.getElementById('lv' + i)?.value ?? m.valor);
    await insertar('examenes', {paciente_id:l.pid, marcador:m.marcador, unidad:m.unidad, min:m.min, max:m.max, dia:0, valor:v});
  }
  const pend = (p.pendientes||[]).filter(x => !/exámenes/i.test(x)); if (pend.length !== (p.pendientes||[]).length) await actualizar('pacientes', p.id, {pendientes:pend});
  lectura = null; toast(`Examen guardado en el expediente de ${primer(p.nombre)}`); pintar();
}
function tarjetaLectura(){
  const l = lectura;
  if (l.cargando) return `<div class="lectura"><div class="cargando" style="padding:6px 0"><i></i>Leyendo ${esc(l.archivo)} con tu criterio…</div></div>`;
  return `<div class="lectura"><h3>Lectura de ${esc(l.archivo)}</h3><span class="pastilla ${l.ia?'azul':''}">${l.ia ? 'Leído por la IA · revísalo antes de guardar' : 'Lectura de ejemplo · la IA real se conecta con la llave de Claude'}</span>
    <p class="nota"><b>Resumen:</b> ${esc(l.nota)}</p>
    <div class="tabla"><table><thead><tr><th>Marcador</th><th class="r">Valor</th><th>Unidad</th><th>Tu rango</th><th></th></tr></thead><tbody>
    ${l.marcadores.map((m,i) => { const ok = m.valor >= m.min && m.valor <= m.max; return `<tr><td><b>${esc(m.marcador)}</b></td><td class="r"><input id="lv${i}" type="number" step="any" value="${m.valor}"></td><td>${esc(m.unidad)}</td><td>${m.min}–${m.max}</td><td><span class="pastilla ${ok?'verde':'ambar'}">${ok?'En rango':'Fuera de rango'}</span></td></tr>`; }).join('')}
    </tbody></table></div>
    <div class="acciones" style="margin-top:14px"><button class="boton verde chico" data-aprobarlectura="1">Aprobar y guardar en el expediente</button><button class="boton sec chico" data-descartarlectura="1">Descartar</button></div></div>`;
}
function vExpediente(p){
  const carly = esCarly();
  const ses = D.sesiones.filter(s=>s.paciente_id===p.id).sort((a,b)=>b.dia-a.dia);
  const ex = D.examenes.filter(e=>e.paciente_id===p.id); const marc = [...new Set(ex.map(e=>e.marcador))];
  const wa = D.whatsapp.filter(w=>w.paciente_id===p.id).slice(-3);
  const citas = D.citas.filter(c=>c.paciente_id===p.id && c.dia>=0).sort((a,b)=>a.dia-b.dia); const cita = citas[0];
  const pagos = D.pagos.filter(f=>f.paciente_id===p.id);
  const col = v => v>=70 ? 'var(--verde)' : v>=50 ? 'var(--ambar)' : 'var(--rojo)';
  const plan = p.plan || [];
  const proxima = cita ? `<b>Próxima sesión:</b> ${nomDia(cita.dia)} ${hc(cita)}${horaPac(cita, p)}` : '<b>Próxima sesión:</b> por agendar';
  const pendientes = `<section class="tarjeta seccion"><div class="seccion-cab"><h2>Pendientes y WhatsApp</h2></div>
        ${(p.pendientes||[]).map((x,i) => `<label class="check"><input type="checkbox" data-pend="${p.id}" data-i="${i}">${esc(x)}</label>`).join('') || '<p class="vacio">Sin pendientes 🎉</p>'}
        <div style="margin-top:10px">${wa.map(w => `<div class="fila"><div class="cuerpo"><div class="s"><b style="color:var(--tinta)">${w.de==='lalachat'?'LalaChat':w.de==='juanpe'?'Dr. Juanpe':primer(p.nombre)}:</b> ${esc(w.texto)}</div></div><div class="der">${hace(w.creado)}</div></div>`).join('')}</div></section>`;
  const cabecera = `<button class="volver" data-ir="pacientes">← Todos los pacientes</button>` +
    cab(`${esc(p.nombre)}`, `${p.edad} años · ${esc(p.programa)} · mes ${p.mes} · ${esc(p.telefono)} · ${esc(p.pais || '')}${p.zona ? ' (' + (ZONAS[p.zona] || p.zona) + ')' : ''} &nbsp; ${estadoP(p)} ${pastillaCons(p)}`,
      `<button class="boton wa" data-ir="lalachat" data-conv="${p.id}">${ic('wa')}Conversación con LalaChat</button>${carly ? '' : `<button class="boton sec" data-portal="${esc(p.codigo)}">Ver lo que ve ${esc(primer(p.nombre))}</button>`}`) +
    (p.consentimiento ? '' : `<div class="aviso" style="justify-content:space-between"><span><b>Falta el consentimiento actualizado.</b> Hasta que ${esc(primer(p.nombre))} lo firme no se manejan sus datos con IA.</span><span style="display:flex; gap:8px"><button class="boton wa chico" data-pedircons="${p.id}">Pedírselo por WhatsApp</button><button class="boton sec chico" data-firmocons="${p.id}">Ya lo firmó</button></span></div>`);
  if (carly) return cabecera + `
    <div class="tarjeta seccion" style="margin-bottom:20px"><div class="presente" style="margin:0">${proxima}</div></div>
    <div class="grilla2">
      <section class="tarjeta seccion"><div class="seccion-cab"><h2>Citas</h2></div>${citas.map(c => `<div class="fila"><span class="hora">${hc(c)}</span><div class="cuerpo"><div class="t">${nomDia(c.dia)} · ${esc(c.tipo)}</div><div class="s">${esc(c.estado)}${horaPac(c, p)}</div></div></div>`).join('') || '<p class="vacio">Sin citas agendadas.</p>'}</section>
      <section class="tarjeta seccion"><div class="seccion-cab"><h2>Pagos</h2></div>${pagos.map(f => `<div class="fila"><div class="cuerpo"><div class="t">${esc(f.concepto)} · ${usd(f.monto)}</div><div class="s">${fechaCorta(f.dia)}</div></div><div class="der"><span class="pastilla ${f.estado==='pagado'?'verde':f.estado==='fallido'?'roja':'ambar'}">${f.estado}</span></div></div>`).join('') || '<p class="vacio">Sin pagos registrados.</p>'}</section>
    </div>
    <div class="grilla2">${pendientes}<section class="tarjeta seccion"><div class="seccion-cab"><h2>Lo clínico</h2></div><p class="vacio">El diagnóstico, el plan, los exámenes y las sesiones solo los ve el Dr. Juanpe.</p></section></div>`;
  return cabecera + `
    <div class="tarjeta seccion" style="margin-bottom:20px"><div class="presente" style="margin:0"><b>Ten presente:</b> ${esc(p.tener_presente)} &nbsp;·&nbsp; ${proxima}</div>
      <p style="margin-top:12px; font-size:14px; color:var(--gris)"><b style="color:var(--tinta)">Motivo de consulta (onboarding):</b> ${esc(p.motivo)}</p>
      ${p.quien ? `<div class="memoria" style="margin-top:14px"><h3>🧠 Lo que LalaChat recuerda · memoria-juanpe/pacientes/${slug(p.nombre)}.md</h3><p><b>Quién es:</b> ${esc(p.quien)}</p><p><b>Cómo hablarle:</b> ${esc(p.como_hablarle)}</p><p style="margin:0"><b>Código del portal:</b> ${esc(p.codigo)}</p></div>` : ''}</div>
    <div class="grilla2">
      <section class="tarjeta seccion"><div class="seccion-cab"><h2>Diagnóstico por áreas</h2><span class="pastilla azul">Con tu sistema de puntaje</span></div>
        ${diagnostico(p.puntajes)}</section>
      <section class="tarjeta seccion"><div class="seccion-cab"><h2>Plan macro a 4 meses</h2>${p.estado==='nuevo' ? '<button data-aprobarplan="'+p.id+'">Aprobar borrador →</button>' : '<span class="pastilla verde">Aprobado por ti</span>'}</div>
        <div class="pasos">${plan.map((x,i) => `<div class="paso ${i+1<p.mes?'ok':i+1===p.mes?'ahora':''}"><i>${i+1<p.mes?'✓':i+1}</i><span>${esc(x)}</span></div>`).join('')}</div></section>
    </div>
    <section class="tarjeta seccion" style="margin-bottom:20px"><div class="seccion-cab"><h2>Histórico de exámenes</h2><span style="display:flex; gap:14px; align-items:baseline"><a href="/ejemplo-examen.pdf" download style="font-size:13px; font-weight:600">Bajar examen de ejemplo</a><button data-subirexamen="${p.id}">Subir examen (PDF o foto) →</button></span></div>
      <input type="file" id="archivoExamen" accept="application/pdf,image/png,image/jpeg,image/webp" hidden>
      ${lectura && lectura.pid === p.id ? tarjetaLectura() : ''}
      ${marc.length ? `<div class="graficas">${marc.map(m => grafica(ex.filter(e=>e.marcador===m))).join('')}</div>` : (lectura ? '' : '<p class="vacio">Todavía no hay exámenes. LalaChat le está recordando.</p>')}
      <p style="font-size:12.5px; color:var(--gris); margin-top:10px">Leídos con tu criterio · la franja verde es tu rango óptimo. Nada se guarda sin tu aprobación.</p></section>
    <div class="grilla2">
      <section class="tarjeta seccion hist"><div class="seccion-cab"><h2>Sesiones · resumen de Fathom</h2></div>
        ${ses.map(s => `<div class="fila"><div class="cuerpo"><div class="t">${esc(s.titulo)}</div><div class="s">${esc(s.resumen)}</div><div class="s"><b>Tareas:</b> ${(s.tareas||[]).map(esc).join(' · ')}</div></div><div class="der">${fechaCorta(s.dia)}</div></div>`).join('') || '<p class="vacio">Aún no hay sesiones.</p>'}</section>
      ${pendientes}
    </div>`;
}

