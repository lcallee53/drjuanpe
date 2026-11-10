// Lee un examen de laboratorio (PDF o foto) y devuelve los marcadores para que el médico los apruebe.
const { usuario, claude, pedirJSON, responderError } = require('./_base');

const SISTEMA = `Eres el lector de exámenes de laboratorio del Dr. Juanpe. Recibes un examen en PDF o en foto.
Extrae cada marcador con su valor numérico y su unidad tal como aparecen. No inventes marcadores ni valores: si algo no se lee, no lo incluyas.
Para "min" y "max" usa el rango de referencia que trae el laboratorio. Si el paciente ya tiene ese marcador en sus exámenes anteriores, usa el mismo nombre, unidad y rango que traen los anteriores, para que la gráfica continúe.
En "nota" escribe un resumen de 2 o 3 frases para el doctor: qué está fuera de rango y cómo cambió frente a los anteriores. Es un resumen para que él revise, no un diagnóstico ni una recomendación de tratamiento.
Si el archivo no es un examen de laboratorio, devuelve la lista vacía y dilo en la nota.`;

const ESQUEMA = {
  type: 'object', additionalProperties: false, required: ['marcadores', 'nota'],
  properties: {
    nota: { type: 'string' },
    marcadores: { type: 'array', items: {
      type: 'object', additionalProperties: false, required: ['marcador', 'unidad', 'valor', 'min', 'max'],
      properties: { marcador: { type: 'string' }, unidad: { type: 'string' }, valor: { type: 'number' }, min: { type: 'number' }, max: { type: 'number' } },
    } },
  },
};

const IMAGENES = ['image/png', 'image/jpeg', 'image/webp'];

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Solo POST' });
  if (!(await usuario(req))) return res.status(401).json({ error: 'Inicia sesión primero.' });
  const cliente = claude();
  if (!cliente) return res.status(503).json({ error: 'Falta la llave de Claude en Vercel.' });

  const { archivo, tipo, paciente, previos } = req.body || {};
  if (!archivo || typeof archivo !== 'string') return res.status(400).json({ error: 'Falta el archivo.' });
  const bloque = tipo === 'application/pdf'
    ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: archivo } }
    : IMAGENES.includes(tipo) ? { type: 'image', source: { type: 'base64', media_type: tipo, data: archivo } } : null;
  if (!bloque) return res.status(400).json({ error: 'Solo se aceptan PDF, PNG, JPG o WebP.' });

  const anteriores = (Array.isArray(previos) ? previos : []).slice(0, 200)
    .map(e => ({ marcador: e.marcador, unidad: e.unidad, min: e.min, max: e.max, valor: e.valor, hace_dias: -e.dia }));
  try {
    const r = await pedirJSON(cliente, {
      sistema: SISTEMA, esquema: ESQUEMA, esfuerzo: 'medium',
      contenido: [bloque, { type: 'text', text: `Paciente: ${JSON.stringify(paciente || {})}\nExámenes anteriores: ${JSON.stringify(anteriores)}\n\nLee el examen adjunto.` }],
    });
    if (!r) return res.status(502).json({ error: 'No se pudo leer el examen.' });
    return res.status(200).json(r);
  } catch (error) {
    return responderError(res, error);
  }
};
