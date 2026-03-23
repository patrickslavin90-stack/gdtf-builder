const SYSTEM_PROMPT = `You are an expert GDTF 1.2 profile builder for professional entertainment lighting.

Generate ONLY raw XML. No markdown, no backticks, no explanation.
Start with: <?xml version="1.0" encoding="UTF-8" standalone="no"?>
End with: </GDTF>

MANDATORY RULES:
1. DataVersion="1.2" on root GDTF element
2. Do NOT add xmlns or xsi namespace declarations. Just: <GDTF DataVersion="1.2">
3. FixtureType MUST have: CanHaveChildren="Yes" Description="" FixtureTypeID="[UPPERCASE-GUID]" ThumbnailOffsetX="0" ThumbnailOffsetY="0" — no RefFT attribute at all
4. Every DMXChannel MUST have Offset="N" with sequential numbers (1,2,3...). 16-bit pairs: Offset="N,N+1". NEVER leave Offset empty.
5. Every DMXChannel MUST have InitialFunction="GeometryName_AttributeName.AttributeName.CFName"
6. Every ChannelFunction MUST have: CustomName="" Max="1.000000" Min="0.000000" RealAcceleration="0.000000" Default="N/res" within its own DMX range
7. Wheel-linked ChannelFunctions (Color1, ColorAdd_R/G/B, Gobo1/2, Prism1/2) MUST have Wheel="WheelName"
8. ColorAdd_R/G/B: Feature="Color.RGB" PhysicalUnit="ColorComponent". Color FeatureGroup MUST have <Feature Name="RGB"/>
9. No periods (.) in ChannelSet Name attributes
10. DMXMode MUST have Description=""
11. FixtureTypeID: uppercase hex XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX — generate a random unique one each time
12. TiltRotate for tilt speed. Master="Grand" on Dimmer LogicalChannel
13. Pure rotation Axis elements have NO Model attribute
14. All Models: SVGOffsetX="0.000000" SVGOffsetY="0.000000" SVGFrontOffsetX="0.000000" SVGFrontOffsetY="0.000000" SVGSideOffsetX="0.000000" SVGSideOffsetY="0.000000"
15. All Beam geometry: RectangleRatio="1.777700" ThrowRatio="1.000000"
16. End of FixtureType: <Revisions><Revision Date="2026-01-01T00:00:00" ModifiedBy="LMNR GDTF Builder" Text="rev 1" UserID="0"/></Revisions><FTPresets/><Protocols/>
17. PhysicalDescriptions: <AdditionalColorSpaces/><Gamuts/><Connectors/><Properties><OperatingTemperature High="40.000000" Low="0.000000"/><Weight Value="0.000000"/><LegHeight Value="0.000000"/></Properties>
18. ColorSpace: <ColorSpace Mode="sRGB" Name=""/>`;

// Strip namespace declarations — causes DOMParser "string did not match" in browser
function stripNamespaces(xml) {
  return xml
    .replace(/\s+xmlns(?::\w+)?="[^"]*"/g, '')
    .replace(/\s+xsi:[^=\s]+="[^"]*"/g, '');
}

// Fix empty Offset attributes — assigns 1,2,3... per DMXMode
function assignOffsets(xml) {
  return xml.replace(
    /(<DMXMode[^>]*>)([\s\S]*?)(<\/DMXMode>)/g,
    (fullMatch, openTag, body, closeTag) => {
      let counter = 0;
      const fixedBody = body.replace(
        /(<DMXChannel[^>]*\s)Offset="([^"]*)"([^>]*(?:>|\/))/g,
        (m, pre, val, post) => {
          if (!val.trim()) {
            counter++;
            return `${pre}Offset="${counter}"${post}`;
          }
          // Advance counter past existing valid offsets
          const slots = val.includes(',') ? val.split(',').length : 1;
          counter += slots;
          return m;
        }
      );
      return openTag + fixedBody + closeTag;
    }
  );
}

// Standard Netlify Function handler (NOT edge function)
exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration error: API key not set' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const { manufacturer, fixtureName, shortName, dmxMode, fixtureType, channels, notes, existingXml } = body;

  if (!fixtureName && !channels && !existingXml) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Provide fixture name, channels, or existing XML' }) };
  }

  const parts = [];
  if (manufacturer) parts.push(`Manufacturer: ${manufacturer}`);
  if (fixtureName)  parts.push(`Fixture Name: ${fixtureName}`);
  if (shortName)    parts.push(`Short Name: ${shortName}`);
  if (dmxMode)      parts.push(`DMX Mode Name: ${dmxMode}`);
  if (fixtureType && fixtureType !== 'auto') parts.push(`Fixture Type: ${fixtureType}`);

  let prompt = parts.join('\n') + '\n\n';
  if (existingXml) prompt += `EXISTING GDTF XML (repair/upgrade to 1.2):\n${existingXml.slice(0, 15000)}\n\n`;
  if (channels)    prompt += `DMX CHANNEL LIST:\n${channels}\n\n`;
  if (notes)       prompt += `ADDITIONAL NOTES:\n${notes}\n\n`;
  prompt += 'Generate a complete valid GDTF 1.2 description.xml. Follow all rules. Raw XML only.';

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 8192, temperature: 0.1 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}));
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: `Gemini API error ${geminiRes.status}: ${err.error?.message || 'Unknown'}` })
      };
    }

    const data = await geminiRes.json();
    let xml = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!xml) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Empty response from Gemini' }) };
    }

    // Strip markdown wrapping
    xml = xml.replace(/```xml\n?/gi, '').replace(/```\n?/g, '').trim();

    // Extract GDTF block
    const xmlStart = xml.indexOf('<?xml');
    const xmlEnd   = xml.lastIndexOf('</GDTF>');
    if (xmlStart !== -1 && xmlEnd !== -1) {
      xml = xml.slice(xmlStart, xmlEnd + 7);
    } else {
      const gs = xml.indexOf('<GDTF');
      if (gs !== -1 && xmlEnd !== -1) xml = xml.slice(gs, xmlEnd + 7);
    }

    if (!xml.includes('<GDTF')) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Gemini did not return valid GDTF XML — please try again' }) };
    }

    // Strip namespaces (breaks browser DOMParser)
    xml = stripNamespaces(xml);

    // Fix any empty Offset attributes (causes -1 footprint in MA3)
    xml = assignOffsets(xml);

    return { statusCode: 200, headers, body: JSON.stringify({ xml }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: `Server error: ${err.message}` }) };
  }
};
