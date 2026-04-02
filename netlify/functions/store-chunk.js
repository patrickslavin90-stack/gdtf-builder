// Stores a base64 chunk of a large file in Netlify Blobs.
// Called repeatedly by the browser for PDFs > 4MB that would exceed
// Netlify's 6MB request body limit if sent in a single /api/generate call.
//
// Browser sends: { key, chunkIndex, chunkData }
// After all chunks uploaded, browser calls /api/generate with { _mediaKey: key, _totalChunks: N }

exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }; }

  const { key, chunkIndex, chunkData } = body;
  if (!key || chunkIndex === undefined || !chunkData) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing key, chunkIndex, or chunkData' }) };
  }

  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('gdtf-media');
    await store.set(`chunk_${key}_${chunkIndex}`, chunkData);
    return { statusCode: 200, headers, body: JSON.stringify({ stored: true }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Blob storage failed: ' + e.message }) };
  }
};
