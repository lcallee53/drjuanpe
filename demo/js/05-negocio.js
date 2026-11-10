// Entradas (del pago a la app) y cobros.
// Los archivos de js/ se cargan en orden y comparten variables (scripts clásicos, sin empaquetador).
/* ============ ENTRADAS (del pago a la app) ============ */
// El pipeline de ventas, las landings y los formularios siguen en GoHighLevel. Aquí empieza el Sistema: cuando alguien paga.
const PASOS_ENTRADA = [['Pagó o firmó', p => true], ['Ficha y expediente creados', p => true], ['Onboarding lleno', p => !(p.pendientes||[]).some(x=>/onboarding/i.test(x))],
  ['Consentimiento firmado', p => !!p.consentimiento], ['Exámenes recibidos', p => !(p.pendientes||[]).some(x=>/exámenes/i.test(x))], ['Diagnóstico y plan aprobados', p => p.estado !== 'nuevo']];
const NOMBRES_PRUEBA = ['Natalia Gómez','Esteban Cárdenas','Carolina Montoya','Mateo Sierra','Laura Toro'];
function vEntradas(){
  const nuevos = D.pacientes.filter(p => p.mes === 1).sort((a,b) => b.id - a.id);
  return cab('Entradas', 'GoHighLevel sigue manejando todo lo de antes del pago: pipeline, landings, formularios y newsletters. Cuando alguien paga o firma allá o en Stripe, aquí se crean solos su ficha, su expediente y su checklist de entrada.',
    `<button class="boton" data-entrada="1">Simular un pago en GoHighLevel</button>`) + `
    ${nuevos.map(p => { const hechos = PASOS_ENTRADA.filter(([,f]) => f(p)).length; return `<section class="tarjeta seccion" style="margin-bottom:14px">
      <div class="seccion-cab"><h2 style="display:flex; gap:10px; align-items:center">${bolita(p,34)}${esc(p.nombre)} <span class="pastilla ${hechos===PASOS_ENTRADA.length?'verde':'azul'}">${hechos} de ${PASOS_ENTRADA.length}</span></h2><button data-ir="pacientes" data-p="${p.id}">Abrir expediente →</button></div>
      <div class="pasos" style="display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:10px 16px">${PASOS_ENTRADA.map(([t,f]) => `<div class="paso ${f(p)?'ok':''}"><i>${f(p)?'✓':'·'}</i><span>${t}</span></div>`).join('')}</div></section>`; }).join('') || '<p class="vacio">No hay pacientes entrando este mes.</p>'}`;
}
async function simularEntrada(){
  const nombre = NOMBRES_PRUEBA.find(n => !D.pacientes.some(p => p.nombre === n)) || 'Paciente de prueba';
  const nuevo = await insertar('pacientes', {nombre, edad:35, telefono:'+57 300 555 0199', pais:'Colombia', zona:'America/Bogota', consentimiento:false, codigo:String(1000 + Math.floor(Math.random()*9000)), programa:'Inicial 4 meses', mes:1, estado:'nuevo', color:'#0b7a8a', motivo:'Pendiente: llega con el onboarding de Google Forms.', tener_presente:'Paciente nuevo. Pagó hoy en GoHighLevel. Ya tiene ficha, expediente y checklist de entrada.', puntajes:{}, plan:['Borrador · después del onboarding'], pendientes:['Llenar el onboarding','Subir exámenes de sangre','Firmar consentimiento actualizado']});
  await insertar('pagos', {paciente_id:nuevo.id, concepto:'Programa inicial · 50%', monto:1000, estado:'pagado', dia:0, intentos:1});
  await insertar('whatsapp', {paciente_id:nuevo.id, de:'lalachat', color:'verde', texto:`¡Hola ${primer(nombre)}, qué alegría tenerte en el programa del Dr. Juanpe! 🙌 Ya quedó tu pago. Aquí está tu formulario de inicio: https://forms.gle/onboarding y en un momento te llega la invitación a Circle.`});
  toast(`${primer(nombre)} pagó en GoHighLevel: ficha, expediente y checklist creados solos`); pintar();
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

