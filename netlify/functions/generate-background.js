// Background function for long-running GDTF generation (up to 15 minutes)
// Netlify automatically returns 202 to the caller; this runs asynchronously.

const { prepareRequest, callGemini, postProcess } = require('./generate.js');

exports.handler = async function(event) {
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return; }

  const { jobId } = body;
  if (!jobId) return;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return;

  try {
    const { getStore } = await import('@netlify/blobs');
    const store = getStore('gdtf-jobs');

    const { prompt, parsedMA3, maxTokens } = prepareRequest(body);
    const rawXml = await callGemini(apiKey, prompt, maxTokens);

    if (!rawXml) {
      await store.setJSON(jobId, { status: 'error', error: 'Empty Gemini response' });
      return;
    }

    const xml = postProcess(rawXml, parsedMA3);
    await store.setJSON(jobId, { status: 'complete', xml });

  } catch (err) {
    try {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('gdtf-jobs');
      await store.setJSON(jobId, { status: 'error', error: err.message });
    } catch(e) { /* can't store error */ }
  }
};
