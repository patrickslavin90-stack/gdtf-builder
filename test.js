#!/usr/bin/env node
/**
 * Local test script for the GDTF builder function.
 * Usage:
 *   $env:GEMINI_API_KEY="AIzaSyBzyb10AaHWQbCHmMdnCMojDgMYdQZ09uc"
 *   node test.js
 *   node test.js "My Fixture" "My Mfr" "CH1 Dimmer\nCH2 Strobe" "5CH"
 *
 * Flags:
 *   --raw    Show raw Gemini response structure (for debugging)
 *   --xml    Print full XML to console
 */

const { handler } = require('./netlify/functions/generate.js');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const positional = args.filter(a => !a.startsWith('--'));

const fixtureName  = positional[0] || 'Test Strobe 8ch';
const manufacturer = positional[1] || 'ELS';
const channels     = positional[2] || `CH1 Dimmer 0-255
CH2 Strobe (0-15 off, 16-255 slow to fast)
CH3 Red 0-255
CH4 Green 0-255
CH5 Blue 0-255
CH6 White 0-255
CH7 Programs (0-31 off, 32-255 auto programs)
CH8 Speed 0-255`;
const dmxMode      = positional[3] || '8CH';

async function run() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: Set GEMINI_API_KEY environment variable');
    console.error('  PowerShell:  $env:GEMINI_API_KEY="AIza..."');
    console.error('  Bash:        export GEMINI_API_KEY=AIza...');
    process.exit(1);
  }

  console.log(`\nGenerating GDTF for: ${manufacturer} / ${fixtureName} / ${dmxMode}`);
  console.log('─'.repeat(60));

  const fakeEvent = {
    httpMethod: 'POST',
    body: JSON.stringify({ manufacturer, fixtureName, shortName: fixtureName, dmxMode, channels }),
    headers: { 'content-type': 'application/json' },
  };

  const start = Date.now();
  let result;
  try {
    result = await handler(fakeEvent, {});
  } catch (err) {
    console.error('Handler threw:', err.message);
    process.exit(1);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`Status: ${result.statusCode} (${elapsed}s)`);

  if (result.statusCode !== 200) {
    const body = JSON.parse(result.body);
    console.error('ERROR:', body.error);
    process.exit(1);
  }

  const { xml } = JSON.parse(result.body);

  // ── Quick validation
  const checks = {
    'Has GDTF root':          xml.includes('<GDTF '),
    'DataVersion 1.2':        xml.includes('DataVersion="1.2"'),
    'Has FixtureType':        xml.includes('<FixtureType '),
    'Manufacturer attr':      /FixtureType[^>]*Manufacturer="[^"]+"/.test(xml),
    'LongName attr':          /FixtureType[^>]*LongName="[^"]+"/.test(xml),
    'No xmlns namespace':     !xml.includes('xmlns='),
    'Has DMXMode':            xml.includes('<DMXMode '),
    'Has DMXChannels':        xml.includes('<DMXChannel '),
    'No empty Offsets':       !xml.includes('Offset=""'),
    'Has Revisions':          xml.includes('<Revisions>'),
    'No Manufacturer element':!/<Manufacturer\s+Name=/.test(xml),
    'GUID uppercase':         /FixtureTypeID="[0-9A-F-]+"/.test(xml),
  };

  const chCount = (xml.match(/<DMXChannel\s/g) || []).length;
  const cfCount = (xml.match(/<ChannelFunction\s/g) || []).length;
  const modeMatch = xml.match(/DMXMode[^>]+Name="([^"]+)"/);

  // Name check
  const ftNameMatch = xml.match(/FixtureType[^>]*\sName="([^"]+)"/);
  const ftMfrMatch = xml.match(/FixtureType[^>]*Manufacturer="([^"]+)"/);
  checks['FixtureType Name matches'] = ftNameMatch && ftNameMatch[1] === fixtureName;

  // Geometry cross-ref check (include GeometryReference targets)
  const geoUsed = [...xml.matchAll(/DMXChannel[^>]+Geometry="([^"]+)"/g)].map(m => m[1]);
  const geoDefined = new Set([...xml.matchAll(/(?:Geometry|Axis|Beam|GeometryReference)\s[^>]*Name="([^"]+)"/g)].map(m => m[1]));
  const missingGeos = [...new Set(geoUsed)].filter(g => !geoDefined.has(g));
  checks[`All geometry refs valid`] = missingGeos.length === 0;

  // Offset check — with GeometryReference, pixel channels use relative offsets so count won't match
  const hasGeoRef = xml.includes('<GeometryReference');
  const offsets = [...xml.matchAll(/<DMXChannel\s[^>]*Offset="([^"]+)"/g)].map(m => m[1]).filter(v => v);
  checks[`Offsets present (${offsets.length})`] = offsets.length === chCount;
  if (hasGeoRef) {
    const geoRefs = (xml.match(/<GeometryReference/g) || []).length;
    checks[`GeometryReference instances`] = geoRefs > 0;
  }

  console.log(`\n── FIXTURE ──`);
  console.log(`  Name:         ${ftNameMatch?.[1] || '(missing)'}`);
  console.log(`  Manufacturer: ${ftMfrMatch?.[1] || '(missing)'}`);
  console.log(`  DMXChannels:  ${chCount}`);
  console.log(`  Functions:    ${cfCount}`);
  console.log(`  Mode:         ${modeMatch?.[1] || '(missing)'}`);
  if (geoUsed.length) console.log(`  Geometries:   ${[...new Set(geoUsed)].join(', ')}`);
  if (missingGeos.length) console.log(`  Missing geos: ${missingGeos.join(', ')}`);

  console.log('\n── VALIDATION ──');
  let allOk = true;
  for (const [k, v] of Object.entries(checks)) {
    console.log(`  ${v ? '✓' : '✗'} ${k}`);
    if (!v) allOk = false;
  }

  // Print XML if requested or if checks failed
  if (flags.has('--xml') || !allOk) {
    console.log('\n── XML PREVIEW (first 3000 chars) ──');
    console.log(xml.slice(0, 3000));
    if (xml.length > 3000) console.log('  ...(truncated)');
  }

  // Write output files
  const outDir = path.join(__dirname, 'test-output');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const xmlPath = path.join(outDir, 'description.xml');
  fs.writeFileSync(xmlPath, xml);

  // Package as .gdtf using built-in zlib (no external zip needed)
  const safeName = `${manufacturer}_${fixtureName}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  const gdtfPath = path.join(outDir, `${safeName}.gdtf`);

  try {
    // Use Node's zlib to create a minimal ZIP containing description.xml
    const zipBuffer = createMinimalZip('description.xml', Buffer.from(xml, 'utf8'));
    fs.writeFileSync(gdtfPath, zipBuffer);
    console.log(`\n── OUTPUT ──`);
    console.log(`  XML:  ${xmlPath}`);
    console.log(`  GDTF: ${gdtfPath}`);
    console.log(`  Size: ${(fs.statSync(gdtfPath).size / 1024).toFixed(1)} KB`);
  } catch (e) {
    console.log(`\n  XML written to: ${xmlPath}`);
    console.log(`  (ZIP packaging failed: ${e.message})`);
  }

  console.log(`\n${allOk ? '✅ ALL CHECKS PASSED' : '⚠️  SOME CHECKS FAILED'}`);
  process.exit(allOk ? 0 : 1);
}

// Minimal ZIP creator using only Node built-ins (STORE, no compression)
function createMinimalZip(filename, data) {
  const fnBuf = Buffer.from(filename, 'utf8');
  const now = new Date();
  const time = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xFFFF;
  const date = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xFFFF;

  // CRC32
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    crcTable[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) crc = crcTable[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  crc = (crc ^ 0xFFFFFFFF) >>> 0;

  // Local file header (30 + filename)
  const lfh = Buffer.alloc(30 + fnBuf.length);
  lfh.writeUInt32LE(0x04034b50, 0);  // signature
  lfh.writeUInt16LE(20, 4);           // version needed
  lfh.writeUInt16LE(0, 6);            // flags
  lfh.writeUInt16LE(0, 8);            // compression: STORE
  lfh.writeUInt16LE(time, 10);
  lfh.writeUInt16LE(date, 12);
  lfh.writeUInt32LE(crc, 14);
  lfh.writeUInt32LE(data.length, 18); // compressed size
  lfh.writeUInt32LE(data.length, 22); // uncompressed size
  lfh.writeUInt16LE(fnBuf.length, 26);
  lfh.writeUInt16LE(0, 28);           // extra field length
  fnBuf.copy(lfh, 30);

  // Central directory entry (46 + filename)
  const cdOffset = lfh.length + data.length;
  const cd = Buffer.alloc(46 + fnBuf.length);
  cd.writeUInt32LE(0x02014b50, 0);    // signature
  cd.writeUInt16LE(20, 4);             // version made by
  cd.writeUInt16LE(20, 6);             // version needed
  cd.writeUInt16LE(0, 8);              // flags
  cd.writeUInt16LE(0, 10);             // compression: STORE
  cd.writeUInt16LE(time, 12);
  cd.writeUInt16LE(date, 14);
  cd.writeUInt32LE(crc, 16);
  cd.writeUInt32LE(data.length, 20);
  cd.writeUInt32LE(data.length, 24);
  cd.writeUInt16LE(fnBuf.length, 28);
  cd.writeUInt16LE(0, 30);             // extra field length
  cd.writeUInt16LE(0, 32);             // comment length
  cd.writeUInt16LE(0, 34);             // disk number
  cd.writeUInt16LE(0, 36);             // internal attrs
  cd.writeUInt32LE(0, 38);             // external attrs
  cd.writeUInt32LE(0, 42);             // local header offset
  fnBuf.copy(cd, 46);

  // End of central directory (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);            // disk number
  eocd.writeUInt16LE(0, 6);            // disk with CD
  eocd.writeUInt16LE(1, 8);            // entries on disk
  eocd.writeUInt16LE(1, 10);           // total entries
  eocd.writeUInt32LE(cd.length, 12);   // CD size
  eocd.writeUInt32LE(cdOffset, 16);    // CD offset
  eocd.writeUInt16LE(0, 20);           // comment length

  return Buffer.concat([lfh, data, cd, eocd]);
}

run();
