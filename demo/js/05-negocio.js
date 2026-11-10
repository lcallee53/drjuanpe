// Ventas y cobros.
// Los archivos de js/ se cargan en orden y comparten variables (scripts clásicos, sin empaquetador).
/* ============ VENTAS ============ */
const ETAPAS = [['nuevo','Llegó por la landing (GoDaddy)'], ['llamada','Llamada de valoración'], ['propuesta','Link de pago enviado'], ['pagado','Pagó · ya es paciente']];
function vVentas(){
  return cab('Ventas', 'Tu pipeline desde que alguien llena tu landing de GoDaddy hasta que paga por Stripe. Cuando paga, la ficha, el expediente y la invitación a Circle se crean solos.') + `
    <div class="tablero">${ETAPAS.map(([e,t],i) => { const ls = D.leads.filter(l=>l.etapa===e); return `<div class="columna"><h3>${t}<span class="c">${ls.length}</span></h3>
      ${ls.map(l => `<div class="tarea ${e}"><div class="t">${esc(l.nombre)}</div><div class="s">${esc(l.fuente)} · ${usd(l.valor)}</div><div class="s">${esc(l.nota)}</div>
        ${e!=='pagado' ? `<div class="mover">${i>0?`<button data-lead="${l.id}" data-a="${ETAPAS[i-1][0]}">← Atrás</button>`:''}<button data-lead="${l.id}" data-a="${ETAPAS[i+1][0]}">${i===2?'Marcar pagado ✓':'Avanzar →'}</button></div>` : ''}</div>`).join('')}</div>`; }).join('')}</div>`;
}
async function moverLead(id, etapa){
  const l = D.leads.find(x=>x.id===id);
  if (etapa==='pagado'){
    const nuevo = await insertar('pacientes', {nombre:l.nombre, edad:35, telefono:'+57 300 555 0199', programa:'Inicial 4 meses', mes:1, estado:'nuevo', color:'#0b7a8a', motivo:'Pendiente: llega con el onboarding de Google Forms.', tener_presente:'Paciente nuevo. Pagó hoy por Stripe. LalaChat le mandó la bienvenida y el onboarding.', puntajes:{Energía:0,Sueño:0,Nutrición:0,Estrés:0,Movimiento:0,Metabólico:0}, plan:['Borrador · después del onboarding'], pendientes:['Llenar el onboarding','Subir exámenes de sangre','Firmar consentimiento']});
    await insertar('whatsapp', {paciente_id:nuevo.id, de:'lalachat', color:'verde', texto:`¡Hola ${primer(l.nombre)}, bienvenida al programa del Dr. Juanpe! 🙌 Ya quedó tu pago. Aquí está tu formulario de inicio: https://forms.gle/onboarding y en un momento te llega la invitación a Circle.`});
    await actualizar('leads', id, {etapa, nota:'Pagó. Ficha, expediente y bienvenida por WhatsApp creados solos.'});
    toast(`${primer(l.nombre)} ya es paciente: expediente creado y LalaChat le dio la bienvenida`);
  } else await actualizar('leads', id, {etapa});
  pintar();
}

/* ============ COBROS ============ */
function vCobros(){
  const total = D.pagos.filter(p=>p.estado==='pagado').reduce((a,p)=>a+Number(p.monto),0);
  const pend = D.pagos.filter(p=>p.estado!=='pagado');
  return cab('Cobros · Stripe', 'Pagos fallidos, renovaciones y recordatorios. LalaChat hace el seguimiento por WhatsApp para que tú no tengas que perseguir a nadie.') + `
    <div class="cifras">
      <div class="cifra oscura"><span class="k">Cobrado este mes</span><span class="v">${usd(total)}</span><span class="d">Por Stripe</span></div>
      <div class="cifra"><span class="k">Pagos fallidos</span><span class="v rojo">${D.pagos.filter(p=>p.estado==='fallido').length}</span><span class="d">LalaChat ya está haciendo seguimiento</span></div>
      <div class="cifra"><span class="k">Por cobrar</span><span class="v ambar">${pend.length}</span><span class="d">${usd(pend.reduce((a,p)=>a+Number(p.monto),0))}</span></div>
      <div class="cifra"><span class="k">Renovaciones cerca</span><span class="v">${D.pacientes.filter(p=>p.estado==='ultimo_mes').length}</span><span class="d">Último mes del programa</span></div>
    </div>
    <div class="aviso ok" style="margin-bottom:16px">● Stripe conectado · el asistente puede crear links de pago, reintentar cobros y decirte quién debe. Pruébalo: “cóbrale la semestral a Andrés”.</div>
    <section class="tarjeta"><div class="tabla"><table><thead><tr><th>Paciente</th><th>Concepto</th><th class="r">Monto</th><th>Fecha</th><th>Estado</th><th></th></tr></thead><tbody>
      ${D.pagos.slice().sort((a,b)=>({fallido:0,pendiente:1,pagado:2}[a.estado]-{fallido:0,pendiente:1,pagado:2}[b.estado])).map(f => { const p = pac(f.paciente_id); return `<tr><td><b>${esc(p.nombre)}</b></td><td>${esc(f.concepto)}</td><td class="r">${usd(f.monto)}</td><td>${f.dia>=0?'Vence ':''}${fechaCorta(f.dia)}</td>
        <td><span class="pastilla ${f.estado==='pagado'?'verde':f.estado==='fallido'?'roja':'ambar'}">${f.estado==='pagado'?'Pagado':f.estado==='fallido'?`Fallido · ${f.intentos} intentos`:'Pendiente'}</span></td>
        <td class="r" style="white-space:nowrap">${f.estado==='fallido'?`<button class="boton sec chico" data-reintentar="${f.id}">Reintentar en Stripe</button> `:''}${f.estado!=='pagado'?`<button class="boton wa chico" data-cobrar="${f.id}">Mandar link por WhatsApp</button>`:''}</td></tr>`; }).join('')}
    </tbody></table></div></section>`;
}
async function recordarPago(id){
  const f = D.pagos.find(x=>x.id===id); const p = pac(f.paciente_id);
  await insertar('whatsapp', {paciente_id:p.id, de:'lalachat', color:'verde', texto:`Hola ${primer(p.nombre)}, te escribo por tu ${f.concepto.toLowerCase()} (${usd(f.monto)}). Puedes pagarlo aquí en un minuto: https://pagos.drjuanpe.com/${primer(p.nombre).toLowerCase()} 🙏`});
  await insertar('recordatorios', {paciente_id:p.id, tipo:'Pago', texto:`Recordatorio de ${f.concepto.toLowerCase()}`, dia:0, hora:new Date().toTimeString().slice(0,5), estado:'enviado'});
  toast(`LalaChat le escribió a ${primer(p.nombre)} por WhatsApp`); pintar();
}

