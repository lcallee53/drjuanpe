// Íconos, datos y sesión, utilidades, zonas horarias y navegación.
// Los archivos de js/ se cargan en orden y comparten variables (scripts clásicos, sin empaquetador).
/* ============ íconos ============ */
const IC = {
  hoy:'<path d="M4 6h16v14H4zM4 10h16M9 3v4M15 3v4"/>',
  pac:'<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.5 3.5 0 010 7M21 20c0-2.6-1.6-4.8-4-5.6"/>',
  sem:'<rect x="8" y="2.5" width="8" height="19" rx="3"/><circle cx="12" cy="7" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="17" r="1.6"/>',
  wa:'<path d="M4 20l1.3-3.9A8 8 0 1112 20a8 8 0 01-4-1.1z"/><path d="M9 9.5c.3 1.9 1.6 3.7 3.5 4.6l1.2-1 1.8.8"/>',
  age:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  ven:'<path d="M4 19V9M10 19V5M16 19v-7M21 19H3"/>',
  cob:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h4"/>',
  lan:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 13h8M8 16h5"/>',
  env:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  cir:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/>',
  chk:'<path d="M9 4h6v3H9zM7 5.5H5v15h14v-15h-2"/><path d="M9 13l2 2 4-4"/>',
  int:'<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7.5l3 8M16 7.5l-3 8M8.5 6h7"/>'
};
const ic = k => `<svg class="ic" viewBox="0 0 24 24">${IC[k]}</svg>`;

/* ============ datos (Supabase si está configurado, si no, datos locales) ============ */
let DB = null, D = {}, fuente = 'local', urlLalaChat = null;
const TABLAS = ['pacientes','citas','sesiones','examenes','mensajes','whatsapp','recordatorios','leads','pagos','landings','checkins'];
const minAgo = m => new Date(Date.now() - m*60000).toISOString();

function datosLocales(){
  const S = JSON.parse(JSON.stringify(window.SEED));
  let eid = 1;
  S.examenes = S.examenes.flatMap(e => e.valores.map(([dia,valor]) => ({id:eid++, paciente_id:e.paciente_id, marcador:e.marcador, unidad:e.unidad, min:e.min, max:e.max, dia, valor})));
  S.mensajes.forEach(m => { m.creado = minAgo(m.min); delete m.min; });
  S.whatsapp = S.whatsapp.map((w,i) => ({id:i+1, paciente_id:w.paciente_id, de:w.de, texto:w.texto, color:w.color||null, creado:minAgo(w.min)}));
  S.landings = []; delete S.envivo;
  S.checkins = S.checkins || [];
  return S;
}
let ROL = 'medico', USUARIO = {nombre:'Juan Pedro Montoya'}, vistaCarly = false;
const esCarly = () => ROL === 'asistente' || vistaCarly;
const CLINICAS = ['examenes','sesiones','checkins','mensajes'];
const CORREOS = {juanpe:'juanpe@drjuanpe.demo', carly:'carly@drjuanpe.demo'};
async function conectar(){
  let cfg = {};
  try { cfg = await (await fetch('/api/config', {cache:'no-store'})).json(); } catch {}
  urlLalaChat = cfg.lalachat || null;
  if (!(cfg.url && cfg.key)) return;
  try {
    await new Promise((ok, mal) => { const s=document.createElement('script'); s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js'; s.onload=ok; s.onerror=mal; document.head.appendChild(s); });
    DB = window.supabase.createClient(cfg.url, cfg.key);
  } catch(e){ console.warn('No se pudo cargar Supabase, uso datos locales', e); DB = null; }
}
async function cargarTablas(){
  const {data:{user}} = await DB.auth.getUser();
  const {data:yo} = await DB.from('usuarios').select('nombre,rol').eq('id', user.id).maybeSingle();
  if (!yo) throw new Error('Tu usuario no tiene permiso para entrar.');
  ROL = yo.rol; USUARIO = yo;
  const res = await Promise.all(TABLAS.map(t => DB.from(t).select('*').order('id')));
  res.forEach((r,i) => { if (r.error) throw r.error; D[TABLAS[i]] = r.data; });
  fuente = 'supabase';
}
async function tokenSesion(){ if (!DB) return null; const {data:{session}} = await DB.auth.getSession(); return session?.access_token || null; }
async function reiniciarDemo(){
  if (!confirm('¿Dejar el demo como nuevo? Se borra todo lo que se probó.')) return;
  toast('Reiniciando el demo…');
  if (DB){ const {error} = await DB.rpc('reiniciar_demo'); if (error){ toast('No se pudo reiniciar: ' + error.message); return; } await cargarTablas(); }
  else D = datosLocales();
  chatJuanpe = []; colaVivo = (window.SEED.envivo || []).slice(); lectura = null; pacienteSel = null; convSel = null; espacioSel = null; actual = 'hoy';
  pintar(); toast('Listo, el demo quedó como nuevo');
}
function pintarPie(){
  const n = USUARIO?.nombre || ''; document.getElementById('pieNombre').textContent = n;
  document.getElementById('pieAvatar').textContent = iniciales(n || 'JP');
  document.getElementById('pieRol').textContent = ROL === 'medico' ? 'Médico · ve todo' : 'Asistente · sin lo clínico';
  document.getElementById('pieAcc').innerHTML = (ROL === 'medico' ? `<button data-vercarly="1">${ic('pac')}${vistaCarly ? 'Volver a mi vista' : 'Ver como Carly'}</button>` : '') +
    `<button data-reiniciar="1">${ic('age')}Reiniciar demo</button>` + (DB ? `<button data-salir="1">${ic('env')}Salir</button>` : '');
}
async function actualizar(tabla, id, cambios){
  const f = D[tabla].find(x => x.id === id); Object.assign(f, cambios);
  if (DB){ const {error} = await DB.from(tabla).update(cambios).eq('id', id); if (error) toast('No se pudo guardar: '+error.message); }
}
async function insertar(tabla, fila){
  if (DB){
    const {data, error} = await DB.from(tabla).insert(fila).select().single();
    if (!error){ D[tabla].push(data); return data; }
    toast('No se pudo guardar: '+error.message);
  }
  const nueva = {id: Math.max(0, ...D[tabla].map(x=>x.id)) + 1, creado: new Date().toISOString(), ...fila};
  D[tabla].push(nueva); return nueva;
}

/* ============ utilidades ============ */
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const pac = id => D.pacientes.find(p => p.id === id) || {nombre:'Paciente', color:'#999'};
const iniciales = n => n.split(' ').slice(0,2).map(x=>x[0]).join('');
const bolita = (p, t=40) => `<span class="ini" style="background:${p.color}; width:${t}px; height:${t}px">${iniciales(p.nombre)}</span>`;
const primer = n => n.split(' ')[0];
const slug = n => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const fechaDia = d => { const f = new Date(); f.setDate(f.getDate()+d); return f; };
const nomDia = d => d===0 ? 'Hoy' : d===1 ? 'Mañana' : d===-1 ? 'Ayer' : fechaDia(d).toLocaleDateString('es-CO',{weekday:'long', day:'numeric', month:'short'});
const fechaCorta = d => fechaDia(d).toLocaleDateString('es-CO',{day:'numeric', month:'short'});
const hace = iso => { const m = Math.round((Date.now() - new Date(iso))/60000); if (m < 1) return 'ahora'; if (m < 60) return `hace ${m} min`; const h = Math.round(m/60); if (h < 24) return `hace ${h} h`; return `hace ${Math.round(h/24)} d`; };
const horaDe = iso => new Date(iso).toLocaleTimeString('es-CO',{hour:'numeric', minute:'2-digit'});
const usd = n => 'US$' + Number(n).toLocaleString('es-CO');
const ESTADOS = { activo:['Activo','verde'], nuevo:['Nuevo','azul'], enfriandose:['Se está enfriando','ambar'], ultimo_mes:['Último mes','lima'] };
const estadoP = p => { const [t,c] = ESTADOS[p.estado] || ['—','']; return `<span class="pastilla ${c}">${t}</span>`; };
const COLORES = { verde:['Verde','verde','Se responde solo'], amarillo:['Amarillo','ambar','Borrador para tu aprobación'], rojo:['Rojo','roja','Lo atiendes tú'] };
const pastillaColor = c => c ? `<span class="pastilla ${COLORES[c][1]}"><span class="punto ${c}"></span>${COLORES[c][0]}</span>` : '';
function toast(t){ const el = document.getElementById('toast'); el.innerHTML = t; el.classList.add('ver'); clearTimeout(toast.t); toast.t = setTimeout(()=>el.classList.remove('ver'), 2800); }

/* ============ zonas horarias ============ */
// Las citas se guardan en hora de Bogotá (UTC-5, sin cambio de horario). Aquí se muestran en la zona donde esté Juanpe y en la del paciente.
const ZONAS = {'America/Bogota':'Bogotá', 'America/New_York':'Miami', 'America/Mexico_City':'Ciudad de México', 'Europe/Madrid':'Madrid', 'Asia/Makassar':'Bali'};
let miZona = 'America/Bogota'; try { miZona = localStorage.getItem('miZona') || miZona; } catch {}
function instante(hora, dia, menosMin = 0){
  const [h, m] = hora.split(':').map(Number);
  const hoy = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Bogota', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date()).split('-').map(Number);
  return Date.UTC(hoy[0], hoy[1]-1, hoy[2] + dia, h + 5, m - menosMin);
}
const horaEn = (hora, dia, zona = miZona, menosMin = 0) => new Intl.DateTimeFormat('en-GB', {timeZone:zona, hour:'2-digit', minute:'2-digit', hour12:false}).format(new Date(instante(hora, dia, menosMin)));
const hc = c => horaEn(c.hora, c.dia);
// Día de la cita visto desde la zona donde está Juanpe (0 = hoy allá), y las citas de ese día en orden.
const fechaZona = (ms, zona) => new Intl.DateTimeFormat('en-CA', {timeZone:zona, year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date(ms));
const diaLocal = c => Math.round((Date.parse(fechaZona(instante(c.hora, c.dia), miZona)) - Date.parse(fechaZona(Date.now(), miZona))) / 864e5);
const citasDia = d => D.citas.filter(c => diaLocal(c) === d).sort((a,b) => instante(a.hora, a.dia) - instante(b.hora, b.dia));
const fechaLocal = d => new Date(Date.parse(fechaZona(Date.now(), miZona)) + d*864e5);
const diaSemana = d => d===0 ? 'Hoy' : d===1 ? 'Mañana' : fechaLocal(d).toLocaleDateString('es-CO', {weekday:'long', timeZone:'UTC'});
const fechaMes = d => fechaLocal(d).toLocaleDateString('es-CO', {day:'numeric', month:'short', timeZone:'UTC'});
const horaPac = (c, p) => p.zona && p.zona !== miZona ? ` · ${horaEn(c.hora, c.dia, p.zona)} en ${ZONAS[p.zona] || p.pais}` : '';
const pastillaCons = p => p.consentimiento ? '<span class="pastilla verde">Consentimiento firmado</span>' : '<span class="pastilla roja">Falta consentimiento</span>';

/* ============ navegación ============ */
let actual = 'hoy', pacienteSel = null, convSel = null, filtroSem = 'amarillo', modoWa = 'paciente';
const MENU = [
  ['Tu día', [['hoy','Reporte de hoy','hoy'], ['agenda','Agenda','age']]],
  ['Pacientes', [['pacientes','Expedientes','pac'], ['semaforo','Semáforo médico','sem'], ['lalachat','LalaChat · WhatsApp','wa'], ['circle','Circle','cir'], ['checkins','Check-ins del mes','chk']]],
  ['Negocio', [['ventas','Entradas','ven'], ['cobros','Cobros · Stripe','cob'], ['integraciones','Conexiones','int']]]
];
function pintarMenu(){
  const amar = D.mensajes.filter(m=>m.color==='amarillo' && m.estado==='pendiente').length;
  const rojos = D.mensajes.filter(m=>m.color==='rojo' && m.estado==='pendiente').length;
  const num = { semaforo: (amar+rojos) ? `<span class="num ${rojos?'r':''}">${amar+rojos}</span>` : '', lalachat: `<span class="num">${D.whatsapp.length}</span>` };
  const oculto = esCarly() ? ['semaforo','checkins','circle'] : [];
  document.getElementById('menu').innerHTML = MENU.map(([g, items]) => `<div class="grupo">${g}</div>` + items.filter(([id]) => !oculto.includes(id)).map(([id,t,i]) =>
    `<button class="enl ${actual===id?'act':''}" data-ir="${id}">${ic(i)}${t}${num[id]||''}</button>`).join('')).join('');
  // Barra de abajo en celular: lo de todos los días a un toque, y "Más" abre el menú completo.
  const fijos = esCarly() ? [['hoy','Hoy','hoy'],['agenda','Agenda','age'],['pacientes','Pacientes','pac'],['lalachat','LalaChat','wa']] : [['hoy','Hoy','hoy'],['pacientes','Pacientes','pac'],['semaforo','Semáforo','sem'],['lalachat','LalaChat','wa']];
  document.getElementById('tabbar').innerHTML = fijos.map(([id,t,i]) => `<button class="${actual===id?'act':''}" data-ir="${id}">${ic(i)}<span>${t}</span>${id==='semaforo' && (amar+rojos) ? `<em>${amar+rojos}</em>` : ''}</button>`).join('') +
    `<button class="${fijos.some(f=>f[0]===actual)?'':'act'}" data-masmenu="1">${ic('int')}<span>Más</span></button>`;
}
function ir(v, extra){ document.body.classList.remove('menu-abierto'); actual = v; if (v==='pacientes') pacienteSel = extra ?? null; if (v==='lalachat' && extra) convSel = extra; pintar(); window.scrollTo(0,0); }
function pintar(){
  if (!listo) return;
  if (esCarly() && ['semaforo','checkins','circle'].includes(actual)) actual = 'hoy';
  pintarMenu(); pintarPie();
  const V = { hoy:vHoy, agenda:vAgenda, pacientes:vPacientes, semaforo:vSemaforo, lalachat:vLalaChat, ventas:vEntradas, cobros:vCobros, checkins:vCheckins, integraciones:vIntegraciones, circle:vCircle };
  document.getElementById('vista').innerHTML = avisoFuente() + V[actual]();
  if (actual==='lalachat'){ const m = document.getElementById('waMsjs'); if (m) m.scrollTop = m.scrollHeight; }
  pintarFeed();
}
const avisoFuente = () => vistaCarly ? `<div class="aviso carly"><span>Estás viendo la app como la ve Carly: agenda, cobros y pendientes, sin nada clínico.</span><button data-vercarly="1">Volver a mi vista</button></div>` : '';
const cab = (t, p, acc='') => `<div class="cabecera"><div><h1 class="titulo">${t}</h1><p>${p}</p></div><div class="acciones">${acc}</div></div>`;

