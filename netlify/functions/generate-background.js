// Background function for long-running GDTF generation (up to 15 minutes)
// Netlify automatically returns 202 to the caller; this runs asynchronously.
// Used for: PDF uploads, image uploads, and complex text fixtures.

const { prepareRequest } = require('./generate.js');

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

    const { parsedMA3, extractedMeta } = prepareRequest(body);
    let xml;

    if (parsedMA3 && (body.ma3XmlpBase64 || body.ma3Xml)) {
      // .xmlp path (shouldn't normally reach background, but handle it)
      const { buildGDTFFromParsed } = require('./generate.js');
      xml = buildGDTFFromParsed(parsedMA3, { ...body, ...extractedMeta });
    } else {
      // Text/PDF/Image path — use the two-step approach
      const userText = [
        body.channels || '',
        body.existingXml ? 'EXISTING XML:\n' + body.existingXml.slice(0, 10000) : '',
        body.notes || '',
      ].filter(Boolean).join('\n\n');

      let mediaBase64 = null, mediaType = null;
      if (body._pdfStoragePath) {
        // Fetch PDF from Supabase Storage (uploaded directly from browser)
        const pdfUrl = `https://mvntodsdjftfjbcrvedn.supabase.co/storage/v1/object/public/pdfs/${body._pdfStoragePath}`;
        const pdfRes = await fetch(pdfUrl);
        if (!pdfRes.ok) throw new Error(`Failed to fetch PDF from storage: ${pdfRes.status}`);
        const pdfBuffer = await pdfRes.arrayBuffer();
        mediaBase64 = Buffer.from(pdfBuffer).toString('base64');
        mediaType = 'application/pdf';
      } else if (body.pdfBase64) { mediaBase64 = body.pdfBase64; mediaType = 'application/pdf'; }
      else if (body.imageBase64) { mediaBase64 = body.imageBase64; mediaType = 'image/jpeg'; }

      // Import the functions we need
      const gen = require('./generate.js');

      // Try regex first for text
      let channelList = null;
      if (!mediaBase64 && userText.trim()) {
        const regexResult = gen.parseTextDeterministic(userText);
        if (regexResult) {
          channelList = { modes: [{ name: 'Default', channelCount: regexResult.length, channels: regexResult }] };
        }
      }

      // Fall back to Gemini
      if (!channelList) {
        // Dynamic import of parseTextWithGemini — it's not exported, so call Gemini directly
        const TEXT_PARSE_PROMPT = gen.TEXT_PARSE_PROMPT;

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

        if (parsed.modes && Array.isArray(parsed.modes)) {
          channelList = parsed;
        } else if (Array.isArray(parsed)) {
          channelList = { modes: [{ name: 'Default', channelCount: parsed.length, channels: parsed }] };
        } else {
          throw new Error('Unexpected JSON format from Gemini');
        }
      }

      // Build GDTF from channel list
      const { buildGDTFFromChannelList } = require('./generate.js');
      const meta = { ...body, ...extractedMeta };
      const result = buildGDTFFromChannelList(channelList, meta);
      xml = result.xml;
    }

    if (!xml) {
      await store.setJSON(jobId, { status: 'error', error: 'No XML generated' });
      return;
    }

    await store.setJSON(jobId, { status: 'complete', xml });

  } catch (err) {
    try {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore('gdtf-jobs');
      await store.setJSON(jobId, { status: 'error', error: err.message });
    } catch(e) { /* can't store error */ }
  }
};
