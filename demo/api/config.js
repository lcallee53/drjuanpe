// Le entrega al navegador la URL y la llave pública (publishable) de Supabase.
// Si no están configuradas, la app usa los datos locales de datos.js.
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    url: process.env.SUPABASE_URL || null,
    key: process.env.SUPABASE_PUBLISHABLE_KEY || null
  });
};
