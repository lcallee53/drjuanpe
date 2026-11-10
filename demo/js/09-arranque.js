// LalaChat en vivo, eventos de la página y arranque.
// Los archivos de js/ se cargan en orden y comparten variables (scripts clásicos, sin empaquetador).
/* ============ LALACHAT EN VIVO ============ */
let colaVivo = (window.SEED.envivo || []).slice(), timerVivo = null;
function pintarFeed(){
  const n = D.whatsapp.filter(w=>w.de==='lalachat').length;
  document.getElementById('envivoTxt').textContent = n;
  const f = document.getElementById('feed'); if (!f) return;
  const orden = D.whatsapp.slice().sort((a,b)=>new Date(b.creado)-new Date(a.creado));
  const vistos = new Set(); const items = [];
  for (const w of orden){ if (w.de!=='lalachat' || vistos.has(w.id)) continue;
    const prev = orden.find(x => x.paciente_id===w.paciente_id && x.de==='paciente' && new Date(x.creado) <= new Date(w.creado));
    items.push({w, prev}); vistos.add(w.id); if (items.length>=14) break; }
  f.innerHTML = items.map(({w,prev}) => { const p = pac(w.paciente_id); return `<div class="item-feed" data-feedp="${p.id}"><div class="quien">${bolita(p,26)}${esc(p.nombre)} ${pastillaColor(w.color)}<small>${hace(w.creado)}</small></div>
    ${prev ? `<p>“${esc(prev.texto)}”</p>` : ''}<p class="resp"><b>LalaChat:</b> ${esc(w.texto)}</p></div>`; }).join('');
}
async function llegaMensaje(){
  const m = colaVivo.shift(); if (!m){ document.getElementById('cajonEstado').textContent = 'Al día · no hay mensajes nuevos'; return; }
  const p = pac(m.paciente_id); document.getElementById('cajonEstado').textContent = `${primer(p.nombre)} está escribiendo…`;
  await insertar('whatsapp', {paciente_id:p.id, de:'paciente', texto:m.texto}); pintarFeed();
  await new Promise(r=>setTimeout(r, 1500));
  const a = await atender(p, m.texto); const color = a.color;
  await insertar('whatsapp', {paciente_id:p.id, de:'lalachat', color, texto:a.respuesta});
  if (color!=='verde') await insertar('mensajes', {paciente_id:p.id, canal:'WhatsApp', color, texto:m.texto, respuesta:a.borrador, estado:'pendiente'});
  document.getElementById('cajonEstado').textContent = color==='verde' ? `LalaChat le respondió a ${primer(p.nombre)}` : `LalaChat le respondió a ${primer(p.nombre)} y te dejó un ${COLORES[color][0].toLowerCase()} en el semáforo`;
  pintar();
}
function abrirCajon(){ document.getElementById('cajon').classList.add('abierto'); pintarFeed(); if (!timerVivo){ setTimeout(llegaMensaje, 2500); timerVivo = setInterval(llegaMensaje, 11000); } }
function cerrarCajon(){ document.getElementById('cajon').classList.remove('abierto'); clearInterval(timerVivo); timerVivo = null; }
document.getElementById('envivoBtn').onclick = abrirCajon;
document.getElementById('cerrarCajon').onclick = cerrarCajon;
document.getElementById('abrirConvs').onclick = () => { cerrarCajon(); ir('lalachat'); };

/* ============ eventos ============ */
document.addEventListener('click', async e => {
  const b = e.target.closest('button, [data-alerta], .fila.clic, .item-feed'); if (!b) return;
  const d = b.dataset;
  if (d.sem && actual!=='semaforo' && !d.ir){ filtroSem = d.sem; pintar(); return; }
  if (d.sem && !d.ir){ filtroSem = d.sem; pintar(); return; }
  if (d.ir){ if (d.sem) filtroSem = d.sem; ir(d.ir, d.p ? Number(d.p) : d.conv ? Number(d.conv) : undefined); return; }
  if (d.alerta){ const [v,id] = d.alerta.split(':'); if (v==='p') ir('pacientes', Number(id)); else ir(v); return; }
  if (d.espacio){ espacioSel = Number(d.espacio); pintar(); return; }
  if (d.conv){ convSel = d.conv==='juanpe' ? 'juanpe' : Number(d.conv); pintar(); return; }
  if (d.modo){ modoWa = d.modo; pintar(); document.getElementById('waInput')?.focus(); return; }
  if (d.aprobar){ aprobar(Number(d.aprobar)); return; }
  if (d.llamar){ await actualizar('mensajes', Number(d.llamar), {estado:'atendido', respuesta:'Lo atendiste por llamada.'}); toast('Marcado como atendido por llamada'); pintar(); return; }
  if (d.lead){ moverLead(Number(d.lead), d.a); return; }
  if (d.cobrar){ recordarPago(Number(d.cobrar)); return; }
  if (d.reintentar){ const f = D.pagos.find(x=>x.id===Number(d.reintentar)); await actualizar('pagos', f.id, {estado:'pagado', intentos:f.intentos+1}); await insertar('whatsapp', {paciente_id:f.paciente_id, de:'lalachat', color:'verde', texto:`¡Gracias ${primer(pac(f.paciente_id).nombre)}! Ya quedó tu pago de ${f.concepto.toLowerCase()} 🙌`}); toast('Stripe: el cobro pasó en el reintento'); pintar(); return; }
  if (d.abrirlc){ if (urlLalaChat) window.open(urlLalaChat, '_blank'); else toast('Aquí se abre esta conversación en LalaChat, con el bot en pausa'); return; }
  if (d.envivo){ abrirCajon(); return; }
  if (d.reiniciar){ reiniciarDemo(); return; }
  if (d.subirexamen){ const f = document.getElementById('archivoExamen'); f.dataset.pid = d.subirexamen; f.click(); return; }
  if (d.aprobarlectura){ aprobarLectura(); return; }
  if (d.descartarlectura){ lectura = null; pintar(); return; }
  if (d.firmocons){ const p = pac(Number(d.firmocons)); await actualizar('pacientes', p.id, {consentimiento:true, pendientes:(p.pendientes||[]).filter(x => !/consentimiento/i.test(x))}); toast(`Consentimiento de ${primer(p.nombre)} marcado como firmado`); pintar(); return; }
  if (d.pedircons){ const p = pac(Number(d.pedircons)); await insertar('whatsapp', {paciente_id:p.id, de:'lalachat', color:'verde', texto:`Hola ${primer(p.nombre)} 👋 actualizamos el consentimiento del programa para cuidar mejor tus datos. Lo firmas aquí en un minuto: https://drjuanpe.com/consentimiento`}); toast(`LalaChat le pidió el consentimiento a ${primer(p.nombre)}`); pintar(); return; }
  if (d.vercarly){ vistaCarly = !vistaCarly; actual = 'hoy'; pacienteSel = null; pintar(); window.scrollTo(0,0); return; }
  if (d.salir){ await DB.auth.signOut(); location.reload(); return; }
  if (d.portal){ window.open(location.pathname + '#portal/' + d.portal, '_blank'); return; }
  if (d.feedp){ cerrarCajon(); ir('lalachat', Number(d.feedp)); return; }
  if (d.recordarck){ const c = D.checkins.find(x=>x.id===Number(d.recordarck)); const p = pac(c.paciente_id); await insertar('whatsapp', {paciente_id:p.id, de:'lalachat', color:'verde', texto:`Hola ${primer(p.nombre)} 👋 te recuerdo tu check-in del mes, son 5 minutos: https://forms.gle/checkin`}); await actualizar('checkins', c.id, {resumen:'LalaChat le recordó otra vez hoy por WhatsApp.'}); toast(`LalaChat le recordó a ${primer(p.nombre)}`); pintar(); return; }
  if (d.viajo){ const r = await moverViaje(); toast(r.split('.')[0]); return; }
  if (d.aprobarplan){ const p = pac(Number(d.aprobarplan)); await actualizar('pacientes', p.id, {estado:'activo', plan:['Mes 1 · Sueño: 7 horas y rutina de cierre','Mes 2 · Presión: sal, potasio y caminar a diario','Mes 3 · Fuerza 3 veces por semana','Mes 4 · Re-diagnóstico y continuación']}); toast(`Plan de ${primer(p.nombre)} aprobado y enviado a su Circle`); pintar(); return; }
  if (d.chat){ abrirChat(d.chat); return; }
  if (d.chatir){ const [v,id] = d.chatir.split(':'); if (v==='p') ir('pacientes', Number(id)); else ir(v); return; }
});
document.addEventListener('change', async e => {
  if (e.target.id === 'archivoExamen' && e.target.files[0]){ leerExamen(e.target.files[0], Number(e.target.dataset.pid)); return; }
  if (e.target.id === 'miZona'){ miZona = e.target.value; try { localStorage.setItem('miZona', miZona); } catch {} pintar(); return; }
  const t = e.target; if (t.dataset.pend){ const p = pac(Number(t.dataset.pend)); const pend = (p.pendientes||[]).filter((_,i)=>i!==Number(t.dataset.i)); await actualizar('pacientes', p.id, {pendientes:pend}); toast('Pendiente cerrado'); pintar(); }
});
document.addEventListener('input', e => { if (e.target.id==='busca'){ busca = e.target.value; const pos = e.target.selectionStart; pintar(); const i = document.getElementById('busca'); i.focus(); i.setSelectionRange(pos,pos); } });
document.addEventListener('submit', e => {
  e.preventDefault();
  if (e.target.id==='waForm'){ const i = document.getElementById('waInput'); const t = i.value.trim(); if (t) enviarWa(t); i.value=''; }
  if (e.target.id==='juanpeForm'){ const i = document.getElementById('juanpeInput'); const t = i.value.trim(); if (t) preguntaJuanpe(t); i.value=''; }
  if (e.target.id==='ptForm'){ const c = document.getElementById('ptCod').value.trim(); if (c) location.hash = '#portal/' + encodeURIComponent(c); }
  if (e.target.id==='chatForm'){ const i = document.getElementById('chatInput'); preguntar(i.value); i.value=''; }
});
document.getElementById('abrirChat').onclick = () => abrirChat();
document.getElementById('cerrarChat').onclick = () => { document.getElementById('chat').classList.remove('abierto'); document.getElementById('abrirChat').style.display=''; };
document.getElementById('sugeridas').innerHTML = SUGERIDAS.map(s => `<button type="button" data-sug="${s}">${s}</button>`).join('');
document.getElementById('sugeridas').addEventListener('click', e => { const s = e.target.dataset.sug; if (s) preguntar(s); });

async function arrancar(){
  await conectar();
  if (modoPortal()) return;
  if (DB){
    const {data:{session}} = await DB.auth.getSession();
    if (!session){ document.getElementById('login').classList.add('ver'); return; }
    try { await cargarTablas(); } catch(e){ await DB.auth.signOut(); document.getElementById('login').classList.add('ver'); document.getElementById('lError').textContent = e.message || 'No se pudo cargar.'; return; }
  } else D = datosLocales();
  document.getElementById('login').classList.remove('ver');
  listo = true;
  if (!saludado){ saludado = true; burbujaChat(`Hola ${esc(primer(USUARIO.nombre))} 👋 Soy tu asistente. Pregúntame por tu día, tus pacientes, los cobros, o pídeme que te mueva la agenda.`); }
  pintar();
}
let listo = false, saludado = false;
document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault(); const u = document.getElementById('lUsuario').value.trim().toLowerCase(); const err = document.getElementById('lError'); err.textContent = '';
  const {error} = await DB.auth.signInWithPassword({email: u.includes('@') ? u : (CORREOS[u] || u + '@drjuanpe.demo'), password: document.getElementById('lClave').value});
  if (error){ err.textContent = 'Usuario o clave incorrectos.'; return; }
  document.getElementById('lClave').value = ''; arrancar();
});
document.addEventListener('click', e => { if (e.target.id==='ptSalir'){ location.hash = '#portal'; } });
arrancar();
