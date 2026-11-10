// Portal del paciente y Circle.
// Los archivos de js/ se cargan en orden y comparten variables (scripts clásicos, sin empaquetador).
/* ============ PORTAL DEL PACIENTE ============ */
async function datosPortal(codigo){
  if (DB){ const {data, error} = await DB.rpc('portal', {p_codigo:codigo}); return error ? null : data; }
  if (!D.pacientes) D = datosLocales();
  const p = D.pacientes.find(x => x.codigo === codigo); if (!p) return null;
  const nuevo = p.estado === 'nuevo';
  return {paciente:{...p, puntajes: nuevo ? {} : p.puntajes, plan: nuevo ? [] : p.plan},
    citas:D.citas.filter(c=>c.paciente_id===p.id && c.dia>=0).sort((a,b)=>a.dia-b.dia||a.hora.localeCompare(b.hora)),
    sesion:D.sesiones.filter(x=>x.paciente_id===p.id).sort((a,b)=>b.dia-a.dia)[0] || null,
    examenes:D.examenes.filter(e=>e.paciente_id===p.id), pago:D.pagos.find(f=>f.paciente_id===p.id && f.estado!=='pagado') || null};
}
async function pintarPortal(){
  const codigo = location.hash.split('/')[1]; const el = document.getElementById('portal');
  const entrada = error => `<div class="pt-cab"><span class="mono">J+</span><div><b>Dr. Juanpe + Vital</b><span>Tu espacio de paciente</span></div></div>
    <div class="tarjeta pt-login"><h1 style="font-size:26px; letter-spacing:-.6px">Hola 👋</h1><p style="color:var(--gris); margin-top:6px">Escribe el código que te llegó por WhatsApp para ver tu plan, tus exámenes y tus próximas citas.</p>
    <form id="ptForm"><input id="ptCod" inputmode="numeric" maxlength="4" autocomplete="one-time-code" placeholder="····"><button class="boton" style="width:100%">Entrar</button></form>
    <p style="font-size:13px; color:var(--rojo); min-height:18px; margin-top:8px; font-weight:600">${error || ''}</p>
    <p style="font-size:12.5px; color:var(--gris); margin-top:6px">Demo: prueba con <b>4821</b> (Mariana) o <b>2915</b> (Juliana, en Madrid)</p></div>`;
  if (!codigo){ el.innerHTML = entrada(); return; }
  el.innerHTML = `<div class="pt"><div class="cargando"><i></i>Abriendo tu espacio…</div></div>`;
  const d = await datosPortal(codigo);
  if (!d){ el.innerHTML = entrada('Ese código no existe. Revísalo en tu WhatsApp.'); return; }
  const p = d.paciente, cita = d.citas[0], ult = d.sesion, ex = d.examenes, pago = d.pago; const marc = [...new Set(ex.map(e=>e.marcador))];
  const zona = p.zona || 'America/Bogota';
  const col = v => v>=70 ? 'var(--verde)' : v>=50 ? 'var(--ambar)' : 'var(--rojo)';
  const tareas = [...(ult?.tareas||[]), ...(p.pendientes||[])];
  const puntajes = Object.entries(p.puntajes||{});
  el.innerHTML = `<div class="pt-cab"><span class="mono">J+</span><div><b>Hola, ${esc(primer(p.nombre))}</b><span>Tu espacio · Dr. Juanpe + Vital</span></div><button id="ptSalir">Salir</button></div>
  <div class="pt">
    ${p.consentimiento ? '' : `<div class="aviso"><span><b>Te falta firmar el consentimiento actualizado.</b> Es un minuto y nos permite cuidar mejor tus datos.</span><a class="boton chico" style="margin-left:auto" href="#" onclick="return false">Firmar</a></div>`}
    <div class="cifras pt-cifras">
      <div class="cifra oscura"><span class="k">Tu próxima sesión</span><span class="v" style="font-size:30px">${cita ? `${nomDia(cita.dia)} ${horaEn(cita.hora, cita.dia, zona)}` : 'Por agendar'}</span><span class="d">${cita ? esc(cita.tipo) + ' · Google Meet · hora de ' + (ZONAS[zona] || zona) : 'Escríbele a LalaChat para agendar'}</span></div>
      <div class="cifra"><span class="k">Tu programa</span><span class="v" style="font-size:30px">Mes ${p.mes}</span><span class="d">${esc(p.programa)}</span></div>
      <div class="cifra"><span class="k">${pago ? 'Pago pendiente' : 'Pagos'}</span><span class="v ${pago?'ambar':'verde'}" style="font-size:30px">${pago ? usd(pago.monto) : 'Al día'}</span><span class="d">${pago ? `${esc(pago.concepto)} · <a href="#" onclick="return false">Pagar con Stripe</a>` : 'Gracias 🙌'}</span></div>
    </div>
    <div class="grilla2">
      <section class="tarjeta seccion"><div class="seccion-cab"><h2>Tu diagnóstico por áreas</h2></div>${puntajes.length ? `<div class="areas">${puntajes.map(([k,v]) => `<div class="area"><span>${k}</span><div class="barra"><i style="width:${v}%; background:${col(v)}"></i></div><b>${v}</b></div>`).join('')}</div>` : '<p class="vacio">El doctor está terminando tu diagnóstico. Lo vas a ver aquí apenas lo apruebe.</p>'}</section>
      <section class="tarjeta seccion"><div class="seccion-cab"><h2>Tu plan</h2></div>${(p.plan||[]).length ? `<div class="pasos">${p.plan.map((x,i) => `<div class="paso ${i+1<p.mes?'ok':i+1===p.mes?'ahora':''}"><i>${i+1<p.mes?'✓':i+1}</i><span>${esc(x)}</span></div>`).join('')}</div>` : '<p class="vacio">Tu plan a 4 meses aparece aquí cuando el doctor lo apruebe.</p>'}</section>
    </div>
    <section class="tarjeta seccion" style="margin-bottom:20px"><div class="seccion-cab"><h2>Tus exámenes</h2></div>${marc.length ? `<div class="graficas">${marc.map(m => grafica(ex.filter(e=>e.marcador===m))).join('')}</div>` : '<p class="vacio">Cuando subas tus exámenes los vas a ver aquí con gráficas.</p>'}</section>
    <div class="grilla2">
      <section class="tarjeta seccion"><div class="seccion-cab"><h2>Tus tareas</h2></div>${tareas.map(t => `<label class="check"><input type="checkbox">${esc(t)}</label>`).join('') || '<p class="vacio">Sin tareas por ahora.</p>'}</section>
      <section class="tarjeta seccion"><div class="seccion-cab"><h2>Tu última sesión</h2></div>${ult ? `<div class="fila"><div class="cuerpo"><div class="t">${esc(ult.titulo)}</div><div class="s">${esc(ult.resumen)}</div></div><div class="der">${fechaCorta(ult.dia)}</div></div>` : '<p class="vacio">Aún no tienes sesiones.</p>'}
        <a class="boton wa" style="margin-top:12px" href="#" onclick="return false">${ic('wa')}Escribirle a LalaChat por WhatsApp</a></section>
    </div>
    <p style="text-align:center; font-size:12.5px; color:var(--gris); margin-top:20px">Lo que ves aquí lo revisa y aprueba el Dr. Juanpe. Datos de prueba.</p>
  </div>`;
}
function modoPortal(){ const on = location.hash.startsWith('#portal'); document.body.classList.toggle('modo-portal', on); if (on){ document.getElementById('login').classList.remove('ver'); pintarPortal(); } return on; }
window.addEventListener('hashchange', () => { if (!modoPortal()){ if (listo) pintar(); else arrancar(); } });

/* ============ CIRCLE ============ */
let espacioSel = null;
function vCircle(){
  const conAct = D.pacientes.map(p => ({p, msjs:D.mensajes.filter(m=>m.canal==='Circle' && m.paciente_id===p.id), ses:D.sesiones.filter(x=>x.paciente_id===p.id)}));
  if (!espacioSel) espacioSel = (conAct.find(x => x.msjs.some(m=>m.estado==='pendiente')) || conAct[0]).p.id;
  const e = conAct.find(x => x.p.id === espacioSel); const p = e.p;
  const feed = [...e.msjs.map(m => ({t:new Date(m.creado).getTime(), m})), ...e.ses.map(x => ({t:instante('18:00', x.dia), ses:x}))].sort((a,b)=>b.t-a.t);
  return cab('Circle', 'El espacio privado de cada paciente. El asistente publica el resumen de cada sesión, lee lo que escriben y responde con el mismo semáforo que en WhatsApp.') + `
    <div class="espacios">
      <section class="tarjeta convs">${conAct.map(x => { const pend = x.msjs.filter(m=>m.estado==='pendiente').length; return `<button class="conv ${x.p.id===espacioSel?'act':''}" data-espacio="${x.p.id}">${bolita(x.p)}<div class="txt" style="min-width:0; flex:1"><b>${esc(x.p.nombre)}</b><span>${x.msjs.length} mensaje${x.msjs.length===1?'':'s'} · ${x.ses.length} resumen${x.ses.length===1?'':'es'}</span></div>${pend ? `<span class="pastilla ambar">${pend}</span>` : ''}</button>`; }).join('')}</section>
      <div>
        <div class="tarjeta seccion" style="margin-bottom:12px; display:flex; gap:12px; align-items:center; padding-bottom:22px">${bolita(p,46)}<div><b style="font-size:16px">Espacio de ${esc(p.nombre)}</b><div class="s" style="font-size:13.5px; color:var(--gris)">${esc(p.programa)} · mes ${p.mes}</div></div><button class="boton sec chico" style="margin-left:auto" data-ir="pacientes" data-p="${p.id}">Expediente</button></div>
        ${feed.map(f => f.ses ? `<article class="tarjeta post"><div class="quien"><span class="ini" style="background:var(--navy); width:30px; height:30px; font-size:11px">JP</span><b>Resumen de la sesión</b><span class="pastilla verde">Publicado solo</span><small>${fechaCorta(f.ses.dia)}</small></div>
            <p><b>${esc(f.ses.titulo)}.</b> ${esc(f.ses.resumen)}</p><p style="margin-top:6px"><b>Tus tareas:</b> ${(f.ses.tareas||[]).map(esc).join(' · ')}</p></article>`
          : `<article class="tarjeta post"><div class="quien">${bolita(p,30)}<b>${esc(primer(p.nombre))}</b>${pastillaColor(f.m.color)}<small>${hace(f.m.creado)}</small></div><p>“${esc(f.m.texto)}”</p>
            ${f.m.estado==='pendiente' ? `<div class="resp"><b>Borrador esperando tu visto bueno.</b> <button data-ir="semaforo" data-sem="${f.m.color}" style="color:var(--azul); font-weight:700">Revisar en el semáforo →</button></div>` : `<div class="resp"><b>${f.m.color==='verde' ? 'El asistente respondió' : 'Respondiste'}:</b> ${esc(f.m.respuesta)}</div>`}</article>`).join('') || '<p class="vacio">Todavía no hay actividad en este espacio.</p>'}
      </div>
    </div>`;
}

