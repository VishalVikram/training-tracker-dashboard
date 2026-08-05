const { put, head } = require('@vercel/blob');

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

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    res.status(500).json({ ok: false, error: 'BLOB_READ_WRITE_TOKEN not configured' });
    return;
  }

  if (req.method === 'GET') {
    try {
      const info = await head(BLOB_PATH, { token });
      const r = await fetch(info.url, { cache: 'no-store' });
      if (!r.ok) throw new Error('blob fetch failed: ' + r.status);
      const json = await r.json();
      res.status(200).json(json);
    } catch (e) {
      // Not created yet, or transient error - hand back an empty baseline
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
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
        token,
      });
      res.status(200).json({ ok: true, updatedAt: body.updatedAt });
    } catch (e) {
      res.status(500).json({ ok: false, error: String(e && e.message || e) });
    }
    return;
  }

  res.status(405).json({ ok: false, error: 'method not allowed' });
};
