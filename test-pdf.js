#!/usr/bin/env node
/**
 * Local PDF test — calls Gemini directly with a PDF file and shows the parsed result.
 * Usage: node test-pdf.js [path/to/file.pdf] [--raw] [--gdtf]
 *   --raw   Print full raw Gemini JSON response
 *   --gdtf  Run buildGDTFFromChannelList and print channel summary per mode
 */

const fs = require('fs');
const path = require('path');

// Load .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"\n]+)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const { TEXT_PARSE_PROMPT, matrixToModes, buildGDTFFromChannelList } = require('./netlify/functions/generate.js');

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const pdfArg = args.find(a => !a.startsWith('--'));
const pdfPath = pdfArg ? path.resolve(pdfArg) : path.join(__dirname, 'spiider.pdf');

async function run() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: Set GEMINI_API_KEY in .env or environment');
    process.exit(1);
  }
  if (!fs.existsSync(pdfPath)) {
    console.error(`ERROR: PDF not found: ${pdfPath}`);
    process.exit(1);
  }

  const pdfBuffer = fs.readFileSync(pdfPath);
  const mediaBase64 = pdfBuffer.toString('base64');
  const sizeMB = (pdfBuffer.length / 1024 / 1024).toFixed(1);

  console.log(`\nPDF: ${path.basename(pdfPath)} (${sizeMB} MB)`);
  console.log(`Prompt length: ${TEXT_PARSE_PROMPT.length} chars`);
  console.log('Calling Gemini 2.5 Flash...\n');

  const userText = 'Extract ALL DMX modes from this fixture manual. Read each mode column fully — tables may span multiple pages, continue reading the same columns across page breaks. A new table only starts when an entirely new set of mode column headers appears. Use the mode overview (ch_counts) to self-check each mode: if your count is wrong, re-read that column.';

  const start = Date.now();
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: TEXT_PARSE_PROMPT }] },
        contents: [{ parts: [
          { inline_data: { mime_type: 'application/pdf', data: mediaBase64 } },
          { text: userText },
        ]}],
        generationConfig: { maxOutputTokens: 32768, temperature: 0.0, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } },
      }),
    }
  );

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error(`Gemini ${res.status}: ${err.error?.message || 'Unknown'}`);
    process.exit(1);
  }

  const data = await res.json();
  const finishReason = data.candidates?.[0]?.finishReason;
  const parts = data.candidates?.[0]?.content?.parts || [];
  let text = '';
  for (const part of parts) { if (!part.thought) text += (part.text || ''); }
  text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();

  console.log(`Response: ${text.length} chars, finishReason=${finishReason}, time=${elapsed}s`);

  // Always save raw response for inspection
  const rawPath = path.join(__dirname, 'test-output', 'gemini-raw.json');
  fs.mkdirSync(path.join(__dirname, 'test-output'), { recursive: true });
  fs.writeFileSync(rawPath, text);
  console.log(`Raw response saved: ${rawPath}`);

  if (flags.has('--raw')) {
    console.log('\n── RAW GEMINI RESPONSE ──');
    console.log(text.slice(0, 5000));
    if (text.length > 5000) console.log(`...(${text.length - 5000} more chars)`);
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    console.error(`\nJSON PARSE FAILED: ${e.message}`);
    console.log('First 500 chars:', text.slice(0, 500));
    console.log('Last 200 chars: ', text.slice(-200));
    process.exit(1);
  }

  // Helper: re-extract a single failing mode
  async function reExtractMode(mode) {
    const statedCount = mode.channelCount || 0;
    const reRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: TEXT_PARSE_PROMPT + `\n\nYou MUST read the actual channel number from THIS mode's column cell. The SAME function has DIFFERENT channel numbers in different modes — for example, "CTC" is ch32 in Mode 1 but ch16 in Mode 3, and "Dimmer" is ch48 in Mode 1 but ch32 in Mode 3. NEVER copy Mode 1's channel numbers to other modes.` }] },
          contents: [{ parts: [
            { inline_data: { mime_type: 'application/pdf', data: mediaBase64 } },
            { text: `Extract ONLY the channels for "${mode.name}" (${statedCount} DMX slots, ch1-${statedCount}). Read ONLY this mode's column. For 16-bit pairs, set "fine" on the coarse entry (no separate fine object). Return JSON array: [{"ch":1,"fine":2,"name":"Pan","type":"pan"},...]` },
          ]}],
          generationConfig: { maxOutputTokens: 8192, temperature: 0.0, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } },
        }),
      }
    );
    if (!reRes.ok) return null;
    const reData = await reRes.json();
    const reParts = reData.candidates?.[0]?.content?.parts || [];
    let reText = '';
    for (const p of reParts) { if (!p.thought) reText += (p.text || ''); }
    reText = reText.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
    try {
      const reParsed = JSON.parse(reText);
      const reChannels = Array.isArray(reParsed) ? reParsed : (reParsed.modes?.[0]?.channels || reParsed.channels || null);
      console.log(`    re-extracted ${reChannels?.length || 0} channels, types: ${[...new Set((reChannels||[]).map(c=>c.type))].slice(0,8).join(',')}`);
      if (reChannels && reChannels.length > 0) return reChannels;
    } catch (e) { console.log(`    JSON parse failed: ${e.message}, text: ${reText.slice(0,100)}`); }
    return null;
  }

  // Normalise to { modes: [...] }
  let result;
  if (parsed.tables && Array.isArray(parsed.tables)) {
    console.log(`\nFormat: TABLE MATRIX (${parsed.tables.length} tables)`);
    result = matrixToModes(parsed.tables);
  } else if (parsed.modes && Array.isArray(parsed.modes)) {
    console.log(`\nFormat: MODES ARRAY`);
    result = parsed;
  } else if (Array.isArray(parsed)) {
    console.log(`\nFormat: LEGACY ARRAY`);
    result = { modes: [{ name: 'Default', channelCount: parsed.length, channels: parsed }] };
  } else {
    console.error('\nUnexpected JSON format:', Object.keys(parsed));
    process.exit(1);
  }

  // Validate modes and re-extract any missing dimmer
  for (let i = 0; i < result.modes.length; i++) {
    const mode = result.modes[i];
    const types = (mode.channels || []).map(c => c.type);
    const hasDimmer = types.includes('dimmer');
    const rawSlots = (mode.channels || []).reduce((n, c) => n + (c.fine ? 2 : 1), 0);
    const statedCount = mode.channelCount || 0;
    const countWrong = statedCount > 0 && rawSlots < statedCount * 0.9; // >10% missing
    if ((!hasDimmer && (mode.channels || []).length > 10) || countWrong) {
      console.log(`\n  → Mode "${mode.name}" missing dimmer — re-extracting...`);
      const fixed = await reExtractMode(mode);
      if (fixed) {
        result.modes[i] = { ...mode, channels: fixed };
        const types = fixed.map(c=>c.type);
        console.log(`  ✓ Re-extracted ${fixed.length} logical channels, dim=${types.includes('dimmer')}, shutter=${types.includes('shutter')}, zoom=${types.includes('zoom')}`);
        fixed.slice(-4).forEach(c => console.log(`    ...ch${c.ch}${c.fine?'+'+c.fine:''} ${c.type} (${c.name})`));
      } else {
        console.log(`  ✗ Re-extraction returned nothing`);
      }
    }
  }

  // Print mode summary
  console.log(`\n── MODES (${result.modes.length} found) ──`);
  for (const mode of result.modes) {
    const chs = mode.channels || [];
    const types = chs.map(c => c.type).filter(Boolean);
    const has = t => types.includes(t) ? '✓' : '✗';
    const stated = mode.channelCount != null ? ` (stated:${mode.channelCount})` : '';
    console.log(`  ${mode.name.padEnd(28)} ${String(chs.length).padStart(3)}ch${stated}  dim=${has('dimmer')} zoom=${has('zoom')} focus=${has('focus')} shutter=${has('shutter')} pan=${has('pan')} tilt=${has('tilt')}`);
    // Show first 5 channel types for context
    if (chs.length) console.log(`    types: ${types.slice(0, 8).join(', ')}${types.length > 8 ? '...' : ''}`);
  }

  if (flags.has('--gdtf')) {
    console.log('\n── GDTF BUILD ──');
    try {
      const meta = { fixtureName: 'Spiider', manufacturer: 'Robe', shortName: 'Spiider', fixtureType: 'wash' };
      const gdtfResult = buildGDTFFromChannelList(result, meta);
      const xml = gdtfResult.xml;
      const modeNames = [...xml.matchAll(/DMXMode[^>]+Name="([^"]+)"/g)].map(m => m[1]);
      console.log(`  DMXModes in output: ${modeNames.join(', ')}`);
      const chCount = (xml.match(/<DMXChannel\s/g) || []).length;
      console.log(`  Total DMXChannels: ${chCount}`);
      // Write XML for inspection
      const outPath = path.join(__dirname, 'test-output', 'spiider-test.xml');
      fs.mkdirSync(path.join(__dirname, 'test-output'), { recursive: true });
      fs.writeFileSync(outPath, xml);
      console.log(`  XML written: ${outPath}`);
    } catch (e) {
      console.error(`  BUILD FAILED: ${e.message}`);
    }
  }
}

run().catch(e => { console.error(e); process.exit(1); });
