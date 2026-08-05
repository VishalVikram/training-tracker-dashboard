const { put, get } = require('@vercel/blob');
const BLOB_PATH = 'training-tracker-state.json';
const EMPTY_STATE = {
  main: {}, mdm: {}, addedMain: {}, addedMdm: {},
  empStatus: {}, addedEmployees: {}, managerOverride: {},
  updatedAt: 0,
};
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method === 'GET') {
    try {
      const result = await get(BLOB_PATH, { access: 'private' });
      if (!result) { res.status(200).json(EMPTY_STATE); return; }
      const text = await new Response(result.stream).text();
      res.status(200).json(JSON.parse(text));
    } catch (e) {
      res.status(200).json(EMPTY_STATE);
    }
    return;
  }
  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      if (!body || typeof body !== 'object') throw new Error('invalid body');
      body.updatedAt = Date.now();
      await put(BLOB_PATH, JSON.stringify(body), {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      });
      res.status(200).json({ ok: true, updatedAt: body.updatedAt });
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e && e.message || e) });
    }
    return;
  }
  res.status(405).json({ ok: false, error: 'method not allowed' });
};
