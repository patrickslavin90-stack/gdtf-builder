// Background function for long-running GDTF generation (up to 15 minutes)
// Netlify automatically returns 202 to the caller; this runs asynchronously.
// Used for: large PDF uploads via Supabase Storage.
//
// Job results are stored in the Supabase gdtf_jobs table (not Blobs — Blobs
// is unavailable in the sync function context needed for polling).

const SUPABASE_URL = 'https://mvntodsdjftfjbcrvedn.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bnRvZHNkamZ0ZmpiY3J2ZWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTYwMDQsImV4cCI6MjA4OTQzMjAwNH0.4oKeQh4E45O9Kf5MklRUmKW_5t5NvzU3cVf3VGHEIsg';

async function saveJob(jobId, data) {
  await fetch(`${SUPABASE_URL}/rest/v1/gdtf_jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ job_id: jobId, ...data }),
  });
}

exports.handler = async function(event) {
  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return; }

  const { jobId } = body;
  if (!jobId) return;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return;

  try {
    const { prepareRequest, buildGDTFFromParsed, buildGDTFFromChannelList, TEXT_PARSE_PROMPT } = require('./generate.js');
    const { parsedMA3, extractedMeta } = prepareRequest(body);
    let xml;

    if (parsedMA3 && (body.ma3XmlpBase64 || body.ma3Xml)) {
      xml = buildGDTFFromParsed(parsedMA3, { ...body, ...extractedMeta });
    } else {
      const userText = [
        body.channels || '',
        body.existingXml ? 'EXISTING XML:\n' + body.existingXml.slice(0, 10000) : '',
        body.notes || '',
      ].filter(Boolean).join('\n\n');

      let mediaBase64 = null, mediaType = null;
      if (body._pdfStoragePath) {
        // Fetch PDF from Supabase Storage (uploaded directly from browser)
        const pdfUrl = `${SUPABASE_URL}/storage/v1/object/public/pdfs/${body._pdfStoragePath}`;
        const pdfRes = await fetch(pdfUrl);
        if (!pdfRes.ok) throw new Error(`Failed to fetch PDF from storage: ${pdfRes.status}`);
        const pdfBuffer = await pdfRes.arrayBuffer();
        mediaBase64 = Buffer.from(pdfBuffer).toString('base64');
        mediaType = 'application/pdf';
      } else if (body.pdfBase64) { mediaBase64 = body.pdfBase64; mediaType = 'application/pdf'; }
      else if (body.imageBase64) { mediaBase64 = body.imageBase64; mediaType = 'image/jpeg'; }

      const contentParts = [];
      if (mediaBase64 && mediaType) {
        contentParts.push({ inline_data: { mime_type: mediaType, data: mediaBase64 } });
        contentParts.push({ text: 'Extract DMX channels from the DMX protocol/chart table. ONLY extract channel number and function name — IGNORE colour wheel filter lists, DMX value ranges. If table has numbered mode columns, read each DOWNWARD as a separate mode. * means skip. Keep JSON compact. ' + (userText || '') });
      } else {
        contentParts.push({ text: userText });
      }

      const model = mediaBase64 ? 'gemini-2.5-flash' : 'gemini-2.5-flash-lite';
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: TEXT_PARSE_PROMPT }] },
            contents: [{ parts: contentParts }],
            generationConfig: { maxOutputTokens: 8192, temperature: 0.0, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } },
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(`Gemini ${res.status}: ${err.error?.message || 'Unknown'}`);
      }

      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      let text = '';
      for (const part of parts) { if (!part.thought) text += (part.text || ''); }
      if (!text) throw new Error('Empty Gemini response');
      text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(text);

      let channelList;
      if (parsed.modes && Array.isArray(parsed.modes)) {
        channelList = parsed;
      } else if (Array.isArray(parsed)) {
        channelList = { modes: [{ name: 'Default', channelCount: parsed.length, channels: parsed }] };
      } else {
        throw new Error('Unexpected JSON format from Gemini');
      }

      const meta = { ...body, ...extractedMeta };
      const result = buildGDTFFromChannelList(channelList, meta);
      xml = result.xml;
    }

    if (!xml) throw new Error('No XML generated');
    await saveJob(jobId, { status: 'complete', xml });

  } catch (err) {
    await saveJob(jobId, { status: 'error', error_msg: err.message }).catch(() => {});
  }
};
