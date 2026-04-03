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
    const { prepareRequest, buildGDTFFromParsed, buildGDTFFromChannelList, matrixToModes, TEXT_PARSE_PROMPT } = require('./generate.js');
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
        contentParts.push({ text: 'Extract ALL DMX modes from this fixture manual. Read each mode column fully — tables may span multiple pages, continue reading the same columns across page breaks. A new table only starts when an entirely new set of mode column headers appears. Use the mode overview (ch_counts) to self-check each mode: if your count is wrong, re-read that column. ' + (userText || '') });
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
            generationConfig: { maxOutputTokens: 32768, temperature: 0.0, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } },
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
      const finishReason = data.candidates?.[0]?.finishReason;
      text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        throw new Error(`JSON parse failed (${e.message}) finishReason=${finishReason} len=${text.length} preview=${text.slice(0, 300)}`);
      }

      let channelList;
      if (parsed.tables && Array.isArray(parsed.tables)) {
        channelList = matrixToModes(parsed.tables);
      } else if (parsed.modes && Array.isArray(parsed.modes)) {
        channelList = parsed;
      } else if (Array.isArray(parsed)) {
        channelList = { modes: [{ name: 'Default', channelCount: parsed.length, channels: parsed }] };
      } else {
        throw new Error('Unexpected JSON format from Gemini');
      }

      // Re-extract any mode that is missing dimmer (critical attribute) or has wrong channel count.
      // A focused single-mode call is far more reliable than reading 10 columns simultaneously.
      if (mediaBase64 && mediaType && channelList.modes && channelList.modes.length > 1) {
        for (let i = 0; i < channelList.modes.length; i++) {
          const mode = channelList.modes[i];
          const types = (mode.channels || []).map(c => c.type);
          const hasDimmer = types.includes('dimmer');
          const rawSlots = (mode.channels || []).reduce((n, c) => n + (c.fine ? 2 : 1), 0);
          const statedCount = mode.channelCount || 0;
          const countWrong = statedCount > 0 && rawSlots < statedCount * 0.9; // >10% missing
          if ((!hasDimmer && (mode.channels || []).length > 10) || countWrong) {
            // Targeted re-extraction for this mode only
            const reRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  system_instruction: { parts: [{ text: TEXT_PARSE_PROMPT + `\n\nYou MUST read the actual channel number from THIS mode's column cell. The SAME function has DIFFERENT channel numbers in different modes — for example, "CTC" is ch32 in Mode 1 but ch16 in Mode 3, and "Dimmer" is ch48 in Mode 1 but ch32 in Mode 3. NEVER copy Mode 1's channel numbers to other modes.` }] },
                  contents: [{ parts: [
                    { inline_data: { mime_type: mediaType, data: mediaBase64 } },
                    { text: `Extract ONLY the channels for "${mode.name}" (${statedCount} DMX slots, ch1-${statedCount}). Read ONLY this mode's column. For 16-bit pairs, set "fine" on the coarse entry (no separate fine object). Return JSON array: [{"ch":1,"fine":2,"name":"Pan","type":"pan"},...]` },
                  ]}],
                  generationConfig: { maxOutputTokens: 8192, temperature: 0.0, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } },
                }),
              }
            );
            if (reRes.ok) {
              const reData = await reRes.json();
              const reParts = reData.candidates?.[0]?.content?.parts || [];
              let reText = '';
              for (const p of reParts) { if (!p.thought) reText += (p.text || ''); }
              reText = reText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
              try {
                const reParsed = JSON.parse(reText);
                const reChannels = Array.isArray(reParsed) ? reParsed : (reParsed.modes?.[0]?.channels || reParsed.channels || null);
                if (reChannels && reChannels.length > 0) {
                  channelList.modes[i] = { ...mode, channels: reChannels };
                }
              } catch (_) { /* keep original if re-extraction fails */ }
            }
          }
        }
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
