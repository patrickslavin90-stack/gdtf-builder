const SYSTEM_PROMPT = `You are an expert GDTF 1.2 profile builder for professional entertainment lighting.

Generate ONLY raw XML. No markdown, no backticks, no explanation.
Start with: <?xml version="1.0" encoding="UTF-8" standalone="no"?>
End with: </GDTF>

CRITICAL NESTING STRUCTURE — follow this EXACTLY or MA3 rejects the file:

<GDTF DataVersion="1.2">
  <FixtureType Name="X" LongName="X" ShortName="X" Manufacturer="X" Description="" FixtureTypeID="GUID" CanHaveChildren="Yes" ThumbnailOffsetX="0" ThumbnailOffsetY="0">
    <AttributeDefinitions>
      <FeatureGroups>
        <FeatureGroup Name="Dimmer"><Feature Name="Dimmer"/></FeatureGroup>
        <FeatureGroup Name="Color"><Feature Name="Color"/><Feature Name="RGB"/></FeatureGroup>
      </FeatureGroups>
      <Attributes>
        <Attribute Name="Dimmer" Feature="Dimmer.Dimmer" Pretty="Dimmer"/>
        <Attribute Name="ColorAdd_R" Feature="Color.RGB" PhysicalUnit="ColorComponent" Pretty="Red"/>
      </Attributes>
    </AttributeDefinitions>
    <Wheels/>
    <PhysicalDescriptions>
      <ColorSpace Mode="sRGB" Name=""/>
      <AdditionalColorSpaces/><Gamuts/><Filters/><Emitters/><DMXProfiles/><CRIs/>
      <Connectors/><Properties><OperatingTemperature High="40.000000" Low="0.000000"/><Weight Value="0.000000"/><LegHeight Value="0.000000"/></Properties>
    </PhysicalDescriptions>
    <Models>
      <Model Name="Body" Primitive="Cube" Length="0.3" Width="0.3" Height="0.2" SVGOffsetX="0.000000" SVGOffsetY="0.000000" SVGFrontOffsetX="0.000000" SVGFrontOffsetY="0.000000" SVGSideOffsetX="0.000000" SVGSideOffsetY="0.000000"/>
    </Models>
    <Geometries>
      <Geometry Name="Base" Model="Body">
        <Beam Name="Beam" Model="Body" LampType="LED" BeamType="Wash" RectangleRatio="1.777700" ThrowRatio="1.000000"/>
      </Geometry>
    </Geometries>
    <DMXModes>
      <DMXMode Name="ModeName" Geometry="Base" Description="">
        <DMXChannels>
          <DMXChannel Offset="1" Geometry="Beam" InitialFunction="Beam_Dimmer.Dimmer.Dimmer 1">
            <LogicalChannel Attribute="Dimmer" Master="Grand">
              <ChannelFunction Name="Dimmer 1" Attribute="Dimmer" DMXFrom="0/1" Default="255/1" CustomName="" Max="1.000000" Min="0.000000" RealAcceleration="0.000000">
                <ChannelSet Name="Closed" DMXFrom="0/1" DMXTo="0/1"/>
                <ChannelSet Name="Open" DMXFrom="1/1" DMXTo="255/1"/>
              </ChannelFunction>
            </LogicalChannel>
          </DMXChannel>
        </DMXChannels>
      </DMXMode>
    </DMXModes>
    <Revisions><Revision Date="2026-01-01T00:00:00" ModifiedBy="LMNR GDTF Builder" Text="rev 1" UserID="0"/></Revisions>
    <FTPresets/><Protocols/>
  </FixtureType>
</GDTF>

MANDATORY RULES:

STRUCTURE:
1. <GDTF DataVersion="1.2"> — no xmlns or xsi attributes
2. Manufacturer is an ATTRIBUTE on FixtureType, NOT a child element
3. Generate a unique random GUID each time (uppercase hex): XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
4. NO RefFT attribute on FixtureType

NESTING (most critical — violations = 0 channels in MA3):
5. Each DMXChannel MUST CONTAIN a LogicalChannel as a child element — NEVER self-closing <DMXChannel/>
6. Each LogicalChannel MUST CONTAIN ChannelFunction elements DIRECTLY — no <ChannelFunctions> wrapper
7. Each ChannelFunction MUST CONTAIN ChannelSet elements DIRECTLY — no <ChannelSets> wrapper
8. DMXMode has Geometry="Base" as an ATTRIBUTE — NOT a <Geometry> child element
9. There is NO <LogicalChannels> wrapper element — LogicalChannel goes INSIDE DMXChannel

DMX VALUES:
10. All DMXFrom, DMXTo, Default values use "value/resolution" format: "0/1" for 8-bit, "0/2" for 16-bit. NEVER plain numbers like "0" or "255"
11. Every DMXChannel MUST have Offset="N" with sequential numbers (1,2,3...). 16-bit pairs: Offset="N,N+1"
12. Every DMXChannel Geometry attribute MUST match EXACTLY a Name in the Geometries tree
13. InitialFunction format: "GeoName_Attr.Attr.CFName" where GeoName matches the DMXChannel Geometry attribute
14. Every ChannelFunction: Name="CFName" CustomName="" Max="1.000000" Min="0.000000" RealAcceleration="0.000000" Default="value/1"

ATTRIBUTES:
15. Use AttributeDefinitions > FeatureGroups + Attributes (NOT bare <Features> or <Attributes> at FixtureType level)
16. Attribute Feature format: "FeatureGroupName.FeatureName" (e.g. "Dimmer.Dimmer", "Color.RGB")
17. ColorAdd_R/G/B: Feature="Color.RGB" PhysicalUnit="ColorComponent"
18. No periods (.) in ChannelSet Name attributes
19. Master="Grand" on Dimmer LogicalChannel

GEOMETRY:
20. DMXMode Geometry="Base" must reference the TOP-LEVEL geometry Name
21. Pure rotation Axis elements have NO Model attribute
22. All Beam elements: RectangleRatio="1.777700" ThrowRatio="1.000000"
23. All Model elements need all 6 SVG offset attributes set to "0.000000"

MULTI-INSTANCE / PIXEL FIXTURES:
When a fixture has repeated pixel groups (e.g. LED bar with multiple pixel zones, each with their own RGB+Dimmer channels), use GeometryReference with Break elements:

24. The template geometry is a top-level <Beam> element directly under <Geometries> (NOT inside a <Geometry> wrapper). The GeometryReference, DMXChannels, and the Beam template MUST all use the SAME Name:
    <Geometries>
      <Geometry Name="Base" Model="Body">
        <Axis Name="Head">
          <GeometryReference Geometry="Beam" Model="PixelModel" Name="Set 1">
            <Break DMXBreak="1" DMXOffset="5"/>
          </GeometryReference>
          <GeometryReference Geometry="Beam" Model="PixelModel" Name="Set 2">
            <Break DMXBreak="1" DMXOffset="15"/>
          </GeometryReference>
        </Axis>
      </Geometry>
      <Beam Name="Beam" Model="PixelModel" LampType="LED" BeamType="Wash" BeamAngle="3.500000" FieldAngle="6.000000" RectangleRatio="1.777700" ThrowRatio="1.000000"/>
    </Geometries>
    CRITICAL: GeometryReference Geometry="Beam", template <Beam Name="Beam">, and DMXChannel Geometry="Beam" — all THREE must use the exact same name.

25. In DMXChannels, define pixel channels ONCE referencing "Beam", with offsets relative to the instance (1,2,3...). Break DMXOffset in each GeometryReference gives the absolute starting position. MA3 replicates them automatically.

26. Main fixture channels (Tilt, Zoom, Shutter, Dimmer, Control) reference the Head geometry with absolute offsets as normal.

27. Every DMXChannel MUST have DMXBreak="1" on multi-instance fixtures.

Example DMXChannels for a pixel fixture:
  <DMXChannels>
    <DMXChannel DMXBreak="1" Offset="1,2" Geometry="Head" InitialFunction="Head_Tilt.Tilt.Tilt 1">...</DMXChannel>
    <DMXChannel DMXBreak="1" Offset="1" Geometry="Beam" InitialFunction="Beam_ColorAdd_R.ColorAdd_R.Red">...</DMXChannel>
    <DMXChannel DMXBreak="1" Offset="2" Geometry="Beam" InitialFunction="Beam_ColorAdd_G.ColorAdd_G.Green">...</DMXChannel>
    <DMXChannel DMXBreak="1" Offset="3" Geometry="Beam" InitialFunction="Beam_Dimmer.Dimmer.Dimmer 1">...</DMXChannel>
  </DMXChannels>`;

// ── Parse MA3 patch XML to extract Module/Instance structure ──
function parseMA3Xml(xml) {
  if (!xml || !xml.includes('<Module') || !xml.includes('<Instance')) return null;

  const modules = [];
  const moduleRegex = /<Module\s+name="([^"]+)"\s+class="([^"]+)"[^>]*>([\s\S]*?)<\/Module>/g;
  let mm;
  while ((mm = moduleRegex.exec(xml)) !== null) {
    const channels = [];
    const chRegex = /<ChannelType\s+attribute="([^"]+)"[^>]*coarse="(\d+)"[^>]*/g;
    let cm;
    const modBody = mm[3];
    while ((cm = chRegex.exec(modBody)) !== null) {
      const fineMatch = cm[0].match(/fine="(\d+)"/);
      channels.push({
        attribute: cm[1],
        coarse: parseInt(cm[2]),
        fine: fineMatch ? parseInt(fineMatch[1]) : null,
      });
    }
    modules.push({ name: mm[1], class: mm[2], channels });
  }

  const instances = [];
  const instRegex = /<Instance\s+module_index="(\d+)"[^>]*patch="(\d+)"[^>]*/g;
  let im;
  while ((im = instRegex.exec(xml)) !== null) {
    instances.push({ moduleIndex: parseInt(im[1]), patch: parseInt(im[2]) });
  }

  if (!modules.length || !instances.length) return null;

  // Group instances by module
  const grouped = {};
  for (const inst of instances) {
    if (!grouped[inst.moduleIndex]) grouped[inst.moduleIndex] = [];
    grouped[inst.moduleIndex].push(inst.patch);
  }

  return { modules, instances, grouped };
}

// Build instance info string for the Gemini prompt
function buildInstancePrompt(parsed) {
  if (!parsed) return '';
  const hasPixels = Object.values(parsed.grouped).some(g => g.length > 1);
  const lines = ['\nMULTI-INSTANCE STRUCTURE (from MA3 patch data):'];
  for (let i = 0; i < parsed.modules.length; i++) {
    const mod = parsed.modules[i];
    const patches = parsed.grouped[i] || [];
    const chList = mod.channels.map(c =>
      c.fine ? `${c.attribute}(${c.coarse},${c.fine})` : `${c.attribute}(${c.coarse})`
    ).join(', ');
    if (patches.length <= 1) {
      lines.push(`Main Module "${mod.name}" [${mod.class}]: ${mod.channels.length}ch — ${chList}`);
      lines.push(`  Single instance at DMX offset ${patches[0] || 1}`);
    } else {
      lines.push(`Pixel Module "${mod.name}" [${mod.class}]: ${mod.channels.length}ch — ${chList}`);
      lines.push(`  ${patches.length} instances at DMX offsets: ${patches.join(', ')}`);
      lines.push(`  Use GeometryReference+Break for these instances.`);
    }
  }

  if (hasPixels) {
  }

  return lines.join('\n') + '\n';
}

// Post-process: inject GeometryReferences + Breaks into Gemini's XML based on parsed MA3 data
function injectInstances(xml, parsed) {
  if (!parsed) return xml;

  // Find pixel modules (more than 1 instance)
  const pixelModules = [];
  for (let i = 0; i < parsed.modules.length; i++) {
    const patches = parsed.grouped[i] || [];
    if (patches.length > 1) {
      pixelModules.push({ module: parsed.modules[i], moduleIndex: i, patches });
    }
  }
  if (!pixelModules.length) return xml;

  // Check if GeometryReferences already exist (Gemini may have generated them)
  if (xml.includes('<GeometryReference')) return xml;

  // Build GeometryReference blocks and Beam templates
  const geoRefs = [];
  const beamTemplates = [];
  for (const pm of pixelModules) {
    const safeName = pm.module.name.replace(/\s+/g, '');
    const templateName = safeName + 'Beam';
    beamTemplates.push(
      `      <Beam Name="${templateName}" Model="Body" LampType="LED" BeamType="Wash" ` +
      `BeamAngle="3.500000" FieldAngle="6.000000" RectangleRatio="1.777700" ThrowRatio="1.000000"/>`
    );
    for (let j = 0; j < pm.patches.length; j++) {
      geoRefs.push(
        `          <GeometryReference Geometry="${templateName}" Model="Body" Name="${pm.module.name} ${j + 1}">\n` +
        `            <Break DMXBreak="1" DMXOffset="${pm.patches[j]}"/>\n` +
        `          </GeometryReference>`
      );
    }
  }

  // Inject GeometryReferences into the geometry tree (inside the first Axis or Geometry child)
  const axisClosePattern = /(<\/Axis>[\s\S]*?<\/Geometry>[\s\S]*?<\/Geometries>)/;
  const axisMatch = xml.match(axisClosePattern);
  if (axisMatch) {
    // Insert GeometryReferences before closing Axis
    xml = xml.replace(/<\/Axis>([\s\S]*?)<\/Geometry>([\s\S]*?)<\/Geometries>/,
      geoRefs.join('\n') + '\n        </Axis>$1</Geometry>\n' +
      beamTemplates.join('\n') + '\n    </Geometries>'
    );
  }

  // Add DMXBreak="1" to all DMXChannels if not present
  xml = xml.replace(/<DMXChannel\s+(?!DMXBreak)/g, '<DMXChannel DMXBreak="1" ');

  return xml;
}

// Strip namespace declarations — breaks browser DOMParser
function stripNamespaces(xml) {
  return xml
    .replace(/\s+xmlns(?::\w+)?="[^"]*"/g, '')
    .replace(/\s+xsi:[^=\s]+="[^"]*"/g, '');
}

// Fix empty/missing Offset attributes — assigns sequential numbers per mode
function assignOffsets(xml) {
  return xml.replace(
    /(<DMXMode[^>]*>)([\s\S]*?)(<\/DMXMode>)/g,
    (_, openTag, body, closeTag) => {
      let counter = 0;
      const fixed = body.replace(
        /(<DMXChannel[^>]*\s)Offset="([^"]*)"([^>]*(?:\/?>))/g,
        (m, pre, val, post) => {
          if (!val.trim()) {
            counter++;
            return `${pre}Offset="${counter}"${post}`;
          }
          counter += val.includes(',') ? val.split(',').length : 1;
          return m;
        }
      );
      return openTag + fixed + closeTag;
    }
  );
}

// Fix Manufacturer child element -> attribute (Gemini sometimes generates it wrong)
function fixManufacturer(xml) {
  // Move <Manufacturer Name="x"/> into FixtureType as Manufacturer="x" attribute
  const mfrMatch = xml.match(/<Manufacturer\s+Name="([^"]+)"\s*\/>/);
  if (!mfrMatch) return xml;
  const mfrValue = mfrMatch[1];
  // Add to FixtureType if missing
  let fixed = xml.replace(/<Manufacturer\s+Name="[^"]+"\s*\/>\s*/g, '');
  if (!fixed.includes('Manufacturer="')) {
    fixed = fixed.replace(/<FixtureType\s/, `<FixtureType Manufacturer="${mfrValue}" `);
  }
  return fixed;
}

// Fix geometry references in DMXChannels that don't exist in Geometries tree
function fixGeometryRefs(xml) {
  // Extract all defined geometry names
  const defined = new Set();
  for (const m of xml.matchAll(/(?:Geometry|Axis|Beam)\s[^>]*Name="([^"]+)"/g)) {
    defined.add(m[1]);
  }
  // Find the top-level geometry (first one in <Geometries>)
  const topGeoMatch = xml.match(/<Geometries>\s*<(?:Geometry|Axis)\s[^>]*Name="([^"]+)"/);
  const fallback = topGeoMatch ? topGeoMatch[1] : null;

  if (!fallback) return xml;

  // Fix DMXChannel Geometry refs that don't exist
  return xml.replace(/(<DMXChannel[^>]*\s)Geometry="([^"]+)"([^>]*>)/g, (m, pre, geo, post) => {
    if (defined.has(geo)) return m;
    // Try to find closest match — strip underscore suffixes (InitialFunction confusion)
    const stripped = geo.split('_')[0];
    const match = [...defined].find(d => d === stripped || d.includes(stripped));
    const replacement = match || fallback;
    return `${pre}Geometry="${replacement}"${post}`;
  });
}

// Standard Netlify Function
exports.handler = async function(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { statusCode: 500, headers, body: JSON.stringify({ error: 'GEMINI_API_KEY not set' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) }; }

  let { manufacturer, fixtureName, shortName, dmxMode, fixtureType, channels, notes, existingXml, ma3Xml, ma3XmlpBase64 } = body;

  // Decompress base64 gzip .xmlp on the server
  if (ma3XmlpBase64 && !ma3Xml) {
    try {
      const zlib = require('zlib');
      const buf = Buffer.from(ma3XmlpBase64, 'base64');
      const decompressed = zlib.gunzipSync(buf).toString('utf8');
      const xmlStart = decompressed.indexOf('<?xml');
      ma3Xml = xmlStart !== -1 ? decompressed.slice(xmlStart) : decompressed;

      // Auto-extract fixture info if not provided
      if (!fixtureName) { const m = ma3Xml.match(/FixtureType\s+name="([^"]+)"/); if (m) fixtureName = m[1]; }
      if (!manufacturer) { const m = ma3Xml.match(/<manufacturer>([^<]+)<\/manufacturer>/); if (m) manufacturer = m[1]; }
      if (!dmxMode) { const m = ma3Xml.match(/FixtureType[^>]+mode="([^"]+)"/); if (m) dmxMode = m[1]; }
    } catch(e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Failed to decompress .xmlp: ' + e.message }) };
    }
  }

  if (!fixtureName && !channels && !existingXml && !ma3Xml) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Provide fixture name, channels, or existing XML' }) };
  }

  // Parse MA3 patch XML if provided
  const parsedMA3 = parseMA3Xml(ma3Xml || existingXml || channels || '');

  const promptParts = [];
  if (manufacturer) promptParts.push(`Manufacturer: ${manufacturer}`);
  if (fixtureName)  promptParts.push(`Fixture Name: ${fixtureName}`);
  if (shortName)    promptParts.push(`Short Name: ${shortName}`);
  if (dmxMode)      promptParts.push(`DMX Mode Name: ${dmxMode}`);
  if (fixtureType && fixtureType !== 'auto') promptParts.push(`Fixture Type: ${fixtureType}`);

  let prompt = promptParts.join('\n') + '\n\n';
  if (existingXml) prompt += `EXISTING GDTF XML (repair/upgrade):\n${existingXml.slice(0, 15000)}\n\n`;
  if (channels)    prompt += `DMX CHANNEL LIST:\n${channels}\n\n`;
  if (notes)       prompt += `ADDITIONAL NOTES:\n${notes}\n\n`;

  // Add parsed MA3 instance structure to prompt
  const instancePrompt = buildInstancePrompt(parsedMA3);
  if (instancePrompt) prompt += instancePrompt + '\n';

  prompt += 'Generate complete valid GDTF 1.2. Follow all rules exactly. Raw XML only.';

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 32768, temperature: 0.1 },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { statusCode: 502, headers, body: JSON.stringify({ error: `Gemini ${res.status}: ${err.error?.message || 'Unknown'}` }) };
    }

    const data = await res.json();

    // Gemini 2.5 Flash returns thinking + response as separate parts
    // parts[0] is often { thought: true, text: "reasoning..." }
    // The actual XML is in the non-thought part(s)
    const parts = data.candidates?.[0]?.content?.parts || [];
    let xml = '';
    for (const part of parts) {
      if (!part.thought) xml += (part.text || '');
    }
    // Fallback: if all parts were thought parts, use the last one
    if (!xml && parts.length) xml = parts[parts.length - 1]?.text || '';

    if (!xml) return { statusCode: 502, headers, body: JSON.stringify({ error: 'Empty Gemini response' }) };

    // Clean up
    xml = xml.replace(/```xml\n?/gi, '').replace(/```\n?/g, '').trim();
    const xs = xml.indexOf('<?xml'), xe = xml.lastIndexOf('</GDTF>');
    if (xs !== -1 && xe !== -1) xml = xml.slice(xs, xe + 7);
    else { const gs = xml.indexOf('<GDTF'); if (gs !== -1 && xe !== -1) xml = xml.slice(gs, xe + 7); }
    if (!xml.includes('<GDTF')) return { statusCode: 502, headers, body: JSON.stringify({ error: 'No valid GDTF XML in response — try again' }) };

    // Post-process fixes
    xml = stripNamespaces(xml);
    xml = fixManufacturer(xml);
    xml = fixGeometryRefs(xml);
    xml = assignOffsets(xml);
    xml = injectInstances(xml, parsedMA3);

    return { statusCode: 200, headers, body: JSON.stringify({ xml }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: `Server error: ${err.message}` }) };
  }
};
