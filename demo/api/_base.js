// Piezas compartidas por las funciones del servidor: quién llama y el cliente de Claude.
const Anthropic = require('@anthropic-ai/sdk');

const MODELO = 'claude-opus-5-5';

// Solo responde a quien tenga una sesión válida de Supabase (Juanpe o Carly).
async function usuario(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const url = process.env.SUPABASE_URL, llave = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!token || !url || !llave) return null;
  const r = await fetch(`${url}/auth/v1/user`, { headers: { apikey: llave, Authorization: `Bearer ${token}` } });
  return r.ok ? r.json() : null;
}

// Devuelve el cliente de Claude, o null si todavía no se configuró la llave en Vercel.
function claude() {
  return process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;
}

// Llama a Claude pidiendo JSON con un esquema fijo. Devuelve el objeto, o null si el modelo declinó.
async function pedirJSON(cliente, { sistema, contenido, esquema, esfuerzo = 'low' }) {
  const r = await cliente.beta.messages.create({
    model: MODELO,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: esfuerzo, format: { type: 'json_schema', schema: esquema } },
    system: sistema,
    messages: [{ role: 'user', content: contenido }],
  });
  if (r.stop_reason === 'refusal' || r.stop_reason === 'max_tokens') return null;
  const texto = r.content.filter(b => b.type === 'text').map(b => b.text).join('');
  try { return JSON.parse(texto); } catch { return null; }
}

// Errores de Claude traducidos a una respuesta HTTP sin filtrar detalles.
function responderError(res, error) {
  if (error instanceof Anthropic.AuthenticationError) return res.status(503).json({ error: 'La llave de Claude no es válida.' });
  if (error instanceof Anthropic.RateLimitError) return res.status(429).json({ error: 'Claude está ocupado, intenta en un momento.' });
  if (error instanceof Anthropic.APIError) return res.status(502).json({ error: `Claude respondió con un error (${error.status}).` });
  console.error(error);
  return res.status(500).json({ error: 'Algo falló leyendo la respuesta.' });
}

module.exports = { usuario, claude, pedirJSON, responderError };
