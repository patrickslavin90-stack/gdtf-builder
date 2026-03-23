const SYSTEM_PROMPT = `You are an expert GDTF 1.2 profile builder for professional entertainment lighting.

Generate ONLY raw XML. No markdown, no backticks, no explanation.
Start with: <?xml version="1.0" encoding="UTF-8" standalone="no"?>
End with: </GDTF>

MANDATORY RULES:
1. DataVersion="1.2" on root GDTF element
2. FixtureType MUST have: CanHaveChildren="Yes" Description="" FixtureTypeID="[UPPERCASE-GUID]" ThumbnailOffsetX="0" ThumbnailOffsetY="0" — do NOT include RefFT
3. Every DMXChannel MUST have InitialFunction="GeometryName_AttributeName.AttributeName.CFName"
4. Every ChannelFunction MUST have: CustomName="" Max="1.000000" Min="0.000000" RealAcceleration="0.000000" Default="N/res" where N is within its own DMX range
5. Wheel-linked ChannelFunctions MUST have Wheel="WheelName"
6. ColorAdd_R/G/B: Feature="Color.RGB" PhysicalUnit="ColorComponent". Color FeatureGroup MUST have <Feature Name="RGB"/>
7. No periods (.) in ChannelSet Name attributes
8. DMXMode MUST have Description=""
9. FixtureTypeID must be uppercase: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
10. TiltRotate for tilt speed. Master="Grand" on Dimmer LogicalChannel
11. Pure rotation Axis elements have NO Model attribute
12. All Models: SVGOffsetX="0.000000" SVGOffsetY="0.000000" SVGFrontOffsetX="0.000000" SVGFrontOffsetY="0.000000" SVGSideOffsetX="0.000000" SVGSideOffsetY="0.000000"
13. All Beam geometry: RectangleRatio="1.777700" ThrowRatio="1.000000"
14. End of FixtureType MUST include: <Revisions><Revision Date="2026-01-01T00:00:00" ModifiedBy="LMNR GDTF Builder" Text="rev 1" UserID="0"/></Revisions><FTPresets/><Protocols/>
15. PhysicalDescriptions MUST include: <AdditionalColorSpaces/><Gamuts/><Connectors/><Properties><OperatingTemperature High="40.000000" Low="0.000000"/><Weight Value="0.000000"/><LegHeight Value="0.000000"/></Properties>
16. ColorSpace MUST have Name="": <ColorSpace Mode="sRGB" Name=""/>`;

export default async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500, headers });

  let body;
  try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400, headers }); }

  const { manufacturer, fixtureName, shortName, dmxMode, fixtureType, channels, notes, existingXml } = body;
  if (!fixtureName && !channels && !existingXml) return new Response(JSON.stringify({ error: 'Provide fixture name, channels, or existing XML' }), { status: 400, headers });

  const parts = [];
  if (manufacturer) parts.push(`Manufacturer: ${manufacturer}`);
  if (fixtureName)  parts.push(`Fixture Name: ${fixtureName}`);
  if (shortName)    parts.push(`Short Name: ${shortName}`);
  if (dmxMode)      parts.push(`DMX Mode Name: ${dmxMode}`);
  if (fixtureType)  parts.push(`Fixture Type: ${fixtureType}`);

  let prompt = parts.join('\n') + '\n\n';
  if (existingXml) prompt += `EXISTING GDTF XML (repair/upgrade):\n${existingXml.slice(0, 15000)}\n\n`;
  if (channels)    prompt += `DMX CHANNEL LIST:\n${channels}\n\n`;
  if (notes)       prompt += `ADDITIONAL NOTES:\n${notes}\n\n`;
  prompt += 'Generate a complete, valid GDTF 1.2 description.xml.';

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
      return new Response(JSON.stringify({ error: `Gemini API error ${geminiRes.status}: ${err.error?.message || 'Unknown'}` }), { status: 502, headers });
    }

    const data = await geminiRes.json();
    let xml = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!xml) return new Response(JSON.stringify({ error: 'Empty response from Gemini' }), { status: 502, headers });

    xml = xml.replace(/```xml\n?/gi, '').replace(/```\n?/g, '').trim();
    const start = xml.indexOf('<?xml');
    const end   = xml.lastIndexOf('</GDTF>');
    if (start !== -1 && end !== -1) xml = xml.slice(start, end + 7);
    else { const gs = xml.indexOf('<GDTF'); if (gs !== -1 && end !== -1) xml = xml.slice(gs, end + 7); }

    if (!xml.includes('<GDTF')) return new Response(JSON.stringify({ error: 'No valid GDTF XML in response' }), { status: 502, headers });

    return new Response(JSON.stringify({ xml }), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: `Server error: ${err.message}` }), { status: 500, headers });
  }
};

export const config = { path: '/api/generate' };
