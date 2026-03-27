const SYSTEM_PROMPT = `You are an expert GDTF 1.2 profile builder for professional entertainment lighting.

Generate ONLY raw XML. No markdown, no backticks, no explanation.
Start with: <?xml version="1.0" encoding="UTF-8" standalone="no"?>
End with: </GDTF>

CRITICAL NESTING STRUCTURE — follow this EXACTLY or MA3 rejects the file:

<GDTF DataVersion="1.2">
  <FixtureType Name="X" LongName="X" ShortName="X" Manufacturer="X" Description="Built by GDTF-BUILD.COM" FixtureTypeID="GUID" CanHaveChildren="Yes" ThumbnailOffsetX="0" ThumbnailOffsetY="0">
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
      <Model Name="Base" Primitive="Cube" Length="0.300000" Width="0.300000" Height="0.150000" SVGOffsetX="0.000000" SVGOffsetY="0.000000" SVGFrontOffsetX="0.000000" SVGFrontOffsetY="0.000000" SVGSideOffsetX="0.000000" SVGSideOffsetY="0.000000"/>
      <Model Name="Yoke" Primitive="Cube" Length="0.400000" Width="0.100000" Height="0.300000" SVGOffsetX="0.000000" SVGOffsetY="0.000000" SVGFrontOffsetX="0.000000" SVGFrontOffsetY="0.000000" SVGSideOffsetX="0.000000" SVGSideOffsetY="0.000000"/>
      <Model Name="Head" Primitive="Cube" Length="0.250000" Width="0.250000" Height="0.300000" SVGOffsetX="0.000000" SVGOffsetY="0.000000" SVGFrontOffsetX="0.000000" SVGFrontOffsetY="0.000000" SVGSideOffsetX="0.000000" SVGSideOffsetY="0.000000"/>
      <Model Name="BeamModel" Primitive="Cylinder" Length="0.080000" Width="0.080000" Height="0.010000" SVGOffsetX="0.000000" SVGOffsetY="0.000000" SVGFrontOffsetX="0.000000" SVGFrontOffsetY="0.000000" SVGSideOffsetX="0.000000" SVGSideOffsetY="0.000000"/>
    </Models>
    <Geometries>
      <Geometry Name="Base" Model="Base" Position="{1.000000,0.000000,0.000000,0.000000}{0.000000,1.000000,0.000000,0.000000}{0.000000,0.000000,1.000000,0.000000}{0,0,0,1}">
        <Axis Name="Yoke" Model="Yoke" Position="{1.000000,0.000000,0.000000,0.000000}{0.000000,1.000000,0.000000,0.000000}{0.000000,0.000000,1.000000,-0.265000}{0,0,0,1}">
          <Axis Name="Head" Model="Head" Position="{1.000000,0.000000,0.000000,0.000000}{0.000000,1.000000,0.000000,0.000000}{0.000000,0.000000,1.000000,-0.100000}{0,0,0,1}">
            <Beam Name="Beam" Model="BeamModel" LampType="LED" BeamType="Wash" BeamAngle="1.000000" BeamRadius="0.025000" FieldAngle="25.000000" RectangleRatio="1.777700" ThrowRatio="1.000000" Position="{1.000000,0.000000,0.000000,0.000000}{0.000000,1.000000,0.000000,0.000000}{0.000000,0.000000,1.000000,-0.150000}{0,0,0,1}"/>
          </Axis>
        </Axis>
      </Geometry>
    </Geometries>
    <DMXModes>
      <DMXMode Name="ModeName" Geometry="Base" Description="">
        <DMXChannels>
          <DMXChannel Offset="1" Geometry="Beam" InitialFunction="Beam_Dimmer.Dimmer.Dimmer 1">
            <LogicalChannel Attribute="Dimmer" Master="Grand">
              <ChannelFunction Name="Dimmer 1" Attribute="Dimmer" DMXFrom="0/1" Default="0/1" CustomName="" Max="1.000000" Min="0.000000" RealAcceleration="0.000000">
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
15. Pan ChannelFunction MUST have PhysicalFrom="-270.000000" PhysicalTo="270.000000" (or fixture-specific range). Tilt MUST have PhysicalFrom="-135.000000" PhysicalTo="135.000000". These are REQUIRED for MA3 3D viewer pan/tilt control
16. Zoom ChannelFunction MUST have PhysicalFrom and PhysicalTo set to the beam angle range in degrees (e.g. PhysicalFrom="7.000000" PhysicalTo="55.000000"). REQUIRED for MA3 3D zoom control
17. Iris ChannelFunction MUST have PhysicalFrom="0.000000" PhysicalTo="1.000000"
18. ColorAdd_R, ColorAdd_G, ColorAdd_B, ColorAdd_W channels MUST default to full: Default="255/1". Dimmer defaults to Default="0/1" (off)
19. Use standard GDTF Feature names: Position.Pan, Position.Tilt, Beam.Zoom, Beam.Focus, Beam.Iris, Beam.Frost, Gobo.Gobo, Color.Color, Color.RGB — NOT "Movement", "Beam Shaping", etc

ATTRIBUTES:
16. Use AttributeDefinitions > FeatureGroups + Attributes (NOT bare <Features> or <Attributes> at FixtureType level)
17. Attribute Feature format: "FeatureGroupName.FeatureName" (e.g. "Dimmer.Dimmer", "Color.RGB")
18. ColorAdd_R/G/B: Feature="Color.RGB" PhysicalUnit="ColorComponent"
19. No periods (.) in ChannelSet Name attributes
20. Master="Grand" on Dimmer LogicalChannel

GEOMETRY:
21. DMXMode Geometry="Base" must reference the TOP-LEVEL geometry Name. For moving heads, geometry tree MUST be: Base (Model="Base") > Yoke (Axis, Model="Yoke") > Head (Axis, Model="Head") > Beam. Pan channels reference "Yoke", Tilt channels reference "Head". Dimmer, Shutter, Strobe, Color, Gobo, Zoom, Focus, Prism and ALL other beam-output attributes MUST reference "Beam" geometry — this is REQUIRED for MA3 3D viewer to emit light
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

// ── MA3 → GDTF attribute mapping with full metadata ──
const ATTR_DB = {
  PAN:          { gdtf: 'Pan',               pretty: 'Pan',               feature: 'Position.Pan',       physical: 'Angle',          geo: 'Yoke', physFrom: -270, physTo: 270, master: 'None' },
  TILT:         { gdtf: 'Tilt',              pretty: 'Tilt',              feature: 'Position.Tilt',      physical: 'Angle',          geo: 'Head', physFrom: -135, physTo: 135, master: 'None' },
  DIM:          { gdtf: 'Dimmer',            pretty: 'Dimmer',            feature: 'Dimmer.Dimmer',      physical: 'None',           geo: 'Beam', master: 'Grand', default0: true },
  DIMMER:       { gdtf: 'Dimmer',            pretty: 'Dimmer',            feature: 'Dimmer.Dimmer',      physical: 'None',           geo: 'Beam', master: 'Grand', default0: true },
  SHUTTER:      { gdtf: 'Shutter1',          pretty: 'Shutter',           feature: 'Shutter.Shutter',    physical: 'None',           geo: 'Beam', default255: true },
  SHUTTER2:     { gdtf: 'Shutter2',          pretty: 'Shutter 2',        feature: 'Shutter.Shutter',    physical: 'None',           geo: 'Beam', default255: true },
  COLORRGB1:    { gdtf: 'ColorAdd_R',        pretty: 'Red',              feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB2:    { gdtf: 'ColorAdd_G',        pretty: 'Green',            feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB3:    { gdtf: 'ColorAdd_B',        pretty: 'Blue',             feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB4:    { gdtf: 'ColorAdd_W',        pretty: 'White',            feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB5:    { gdtf: 'ColorAdd_W',        pretty: 'White',            feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLOR1:       { gdtf: 'Color1',            pretty: 'Color Wheel',      feature: 'Color.Color',        physical: 'None',           geo: 'Beam' },
  CTO:          { gdtf: 'CTO',              pretty: 'CTO',              feature: 'Color.Color',        physical: 'ColorTemperature', geo: 'Beam' },
  CTC:          { gdtf: 'CTO',              pretty: 'CTO',              feature: 'Color.Color',        physical: 'ColorTemperature', geo: 'Beam' },
  COLORMIXER:   { gdtf: 'ColorMixer1',       pretty: 'Color Mixer',      feature: 'Color.Color',        physical: 'None',           geo: 'Beam' },
  COLORMIXER2:  { gdtf: 'ColorMixer2',       pretty: 'Color Mixer 2',    feature: 'Color.Color',        physical: 'None',           geo: 'Beam' },
  COLORTEMPERATURE: { gdtf: 'ColorTemperature', pretty: 'Color Temp',    feature: 'Color.Color',        physical: 'ColorTemperature', geo: 'Beam' },
  GOBO1:        { gdtf: 'Gobo1',             pretty: 'Gobo 1',           feature: 'Gobo.Gobo',          physical: 'None',           geo: 'Beam' },
  GOBO1_POS:    { gdtf: 'Gobo1Pos',          pretty: 'Gobo 1 Rotate',    feature: 'Gobo.Gobo',          physical: 'Angle',          geo: 'Beam' },
  GOBO2:        { gdtf: 'Gobo2',             pretty: 'Gobo 2',           feature: 'Gobo.Gobo',          physical: 'None',           geo: 'Beam' },
  GOBO2_POS:    { gdtf: 'Gobo2Pos',          pretty: 'Gobo 2 Rotate',    feature: 'Gobo.Gobo',          physical: 'Angle',          geo: 'Beam' },
  ZOOM:         { gdtf: 'Zoom',             pretty: 'Zoom',             feature: 'Beam.Zoom',          physical: 'Angle',          geo: 'Beam', physFrom: 7, physTo: 55 },
  FOCUS:        { gdtf: 'Focus1',            pretty: 'Focus',            feature: 'Beam.Focus',         physical: 'None',           geo: 'Beam' },
  FOCUSMODE:    { gdtf: 'FocusMode',         pretty: 'Focus Mode',       feature: 'Beam.Focus',         physical: 'None',           geo: 'Beam' },
  IRIS:         { gdtf: 'Iris',              pretty: 'Iris',             feature: 'Beam.Iris',          physical: 'None',           geo: 'Beam', physFrom: 0, physTo: 1 },
  FROST:        { gdtf: 'Frost1',            pretty: 'Frost',            feature: 'Beam.Frost',         physical: 'None',           geo: 'Beam' },
  PRISM:        { gdtf: 'Prism1',            pretty: 'Prism',            feature: 'Beam.Prism',         physical: 'None',           geo: 'Beam' },
  PRISM_POS:    { gdtf: 'Prism1Pos',         pretty: 'Prism Rotate',     feature: 'Beam.Prism',         physical: 'Angle',          geo: 'Beam' },
  EFFECTWHEEL:  { gdtf: 'Effects1',          pretty: 'Effect Wheel',     feature: 'Effect.Effect',      physical: 'None',           geo: 'Beam' },
  EFFECTINDEXROTATE: { gdtf: 'Effects1Pos',  pretty: 'Effect Rotate',    feature: 'Effect.Effect',      physical: 'Angle',          geo: 'Beam' },
  ANIMATIONWHEEL: { gdtf: 'AnimationWheel1', pretty: 'Animation Wheel',  feature: 'Effect.Effect',      physical: 'None',           geo: 'Beam' },
  POSITIONMSPEED: { gdtf: 'PositionSpeed',   pretty: 'Movement Speed',   feature: 'Position.Speed',     physical: 'None',           geo: 'Head' },
  EFFECTMACROS: { gdtf: 'EffectMacros',      pretty: 'Effect Macros',    feature: 'Effect.Effect',      physical: 'None',           geo: 'Beam' },
  PWMFREQUENCY: { gdtf: 'Control1',          pretty: 'PWM Frequency',    feature: 'Control.Control',    physical: 'Frequency',      geo: 'Beam' },
  LEDENGINEEFFECTS: { gdtf: 'LEDEffect1',    pretty: 'LED Effects',      feature: 'Effect.Effect',      physical: 'None',           geo: 'Beam' },
  LEDENGINEEFFECTRATE: { gdtf: 'LEDEffect1Rate', pretty: 'LED Effect Rate', feature: 'Effect.Effect',   physical: 'None',           geo: 'Beam' },
  LEDENGINEEFFECTSTEPTIME: { gdtf: 'LEDEffect1FadeTime', pretty: 'LED Effect Step', feature: 'Effect.Effect', physical: 'None',     geo: 'Beam' },
  FIXTUREGLOBALRESET: { gdtf: 'FixtureGlobalReset', pretty: 'Reset',    feature: 'Control.Control',    physical: 'None',           geo: 'Beam' },
  MACROSELECT:  { gdtf: 'MacroSelect',       pretty: 'Macro',            feature: 'Control.Control',    physical: 'None',           geo: 'Beam' },
  // Multi-dimmer fixtures (JDC-1 beam/plate/strobe dimmers)
  DIM2:         { gdtf: 'Dimmer2',           pretty: 'Dimmer 2',         feature: 'Dimmer.Dimmer',      physical: 'None',           geo: 'Beam', master: 'Grand', default0: true },
  DIM3:         { gdtf: 'Dimmer3',           pretty: 'Dimmer 3',         feature: 'Dimmer.Dimmer',      physical: 'None',           geo: 'Beam', master: 'Grand', default0: true },
  // Strobe sub-attributes
  STROBEDURATION:  { gdtf: 'ShutterStrobePulse',     pretty: 'Strobe Pulse',      feature: 'Shutter.Shutter', physical: 'None', geo: 'Beam' },
  STROBEMODE:      { gdtf: 'ShutterStrobeMode',      pretty: 'Strobe Mode',       feature: 'Shutter.Shutter', physical: 'None', geo: 'Beam' },
  STROBEDURATION2: { gdtf: 'ShutterStrobePulse2',    pretty: 'Strobe Pulse 2',    feature: 'Shutter.Shutter', physical: 'None', geo: 'Beam' },
  STROBEMODE2:     { gdtf: 'ShutterStrobeMode2',     pretty: 'Strobe Mode 2',     feature: 'Shutter.Shutter', physical: 'None', geo: 'Beam' },
  // Global color channels (JDC-1 all-pixel color)
  REDALL:       { gdtf: 'ColorAdd_R',        pretty: 'Red All',          feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  GREENALL:     { gdtf: 'ColorAdd_G',        pretty: 'Green All',        feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  BLUEALL:      { gdtf: 'ColorAdd_B',        pretty: 'Blue All',         feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  // Color presets/cross-fade
  COLORCROSSFADE: { gdtf: 'ColorMixMode',    pretty: 'Color Cross Fade', feature: 'Color.Color',        physical: 'None',           geo: 'Beam' },
  COLORCOLOR:   { gdtf: 'ColorPreset1',      pretty: 'Color Preset 1',   feature: 'Color.Color',        physical: 'None',           geo: 'Beam' },
  COLORCOLOR2:  { gdtf: 'ColorPreset2',      pretty: 'Color Preset 2',   feature: 'Color.Color',        physical: 'None',           geo: 'Beam' },
  COLORCOLOR3:  { gdtf: 'ColorPreset3',      pretty: 'Color Preset 3',   feature: 'Color.Color',        physical: 'None',           geo: 'Beam' },
  COLORCOLOR4:  { gdtf: 'ColorPreset4',      pretty: 'Color Preset 4',   feature: 'Color.Color',        physical: 'None',           geo: 'Beam' },
  // Additional color channels (numbered variants for multi-head/pixel fixtures)
  COLORRGB13:   { gdtf: 'ColorAdd_R2',       pretty: 'Red 2',            feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB23:   { gdtf: 'ColorAdd_G2',       pretty: 'Green 2',          feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB33:   { gdtf: 'ColorAdd_B2',       pretty: 'Blue 2',           feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB53:   { gdtf: 'ColorAdd_W2',       pretty: 'White 2',          feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  // Effect macro sub-attributes
  EFFECTMACRORATE: { gdtf: 'EffectMacroRate', pretty: 'Effect Macro Rate', feature: 'Effect.Effect',     physical: 'None',           geo: 'Beam' },
  EFFECTMACROTIME: { gdtf: 'EffectMacroFade', pretty: 'Effect Macro Fade', feature: 'Effect.Effect',     physical: 'None',           geo: 'Beam' },
  EFFECTMACROS2: { gdtf: 'EffectMacros2',    pretty: 'Effect Macros 2',  feature: 'Effect.Effect',      physical: 'None',           geo: 'Beam' },
  // Mode / control channels
  MODE3:        { gdtf: 'Control2',           pretty: 'Mode Select',      feature: 'Control.Control',    physical: 'None',           geo: 'Beam' },
  COLORMIXMACROSELECT: { gdtf: 'ColorMixer1', pretty: 'Color Mix Macro', feature: 'Color.Color',        physical: 'None',           geo: 'Beam' },
  // Pixel mask / effect macros (X4 Bar)
  COLORMIXMSPEED: { gdtf: 'ColorMixMSpeed',  pretty: 'Color Mix Speed',  feature: 'Color.Color',        physical: 'None',           geo: 'Beam' },
  PIXELMASK:    { gdtf: 'Effects1',           pretty: 'Pixel Mask',       feature: 'Effect.Effect',      physical: 'None',           geo: 'Beam' },
  PIXELMASK2:   { gdtf: 'Effects2',           pretty: 'Pixel Mask 2',     feature: 'Effect.Effect',      physical: 'None',           geo: 'Beam' },
  PIXELMASKEFFECTTIME:  { gdtf: 'Effects1Rate', pretty: 'Pixel Mask Speed', feature: 'Effect.Effect',    physical: 'None',           geo: 'Beam' },
  PIXELMASKEFFECTTIME2: { gdtf: 'Effects2Rate', pretty: 'Pixel Mask Speed 2', feature: 'Effect.Effect',  physical: 'None',           geo: 'Beam' },
  INTENSITYMACROS:  { gdtf: 'IntensityMacro1', pretty: 'Intensity Macro',   feature: 'Effect.Effect',   physical: 'None',           geo: 'Beam' },
  INTENSITYMACROS2: { gdtf: 'IntensityMacro2', pretty: 'Intensity Macro 2', feature: 'Effect.Effect',   physical: 'None',           geo: 'Beam' },
};

function lookupAttr(ma3Name) {
  return ATTR_DB[ma3Name.toUpperCase()] || {
    gdtf: ma3Name, pretty: ma3Name, feature: 'Control.Control', physical: 'None', geo: 'Beam'
  };
}

function translateMA3Attr(attr) {
  const info = ATTR_DB[attr.toUpperCase()];
  return info ? `${info.gdtf} (${info.pretty})` : attr;
}

// ── Derive a short mode prefix from a mode name ──
function modePrefix(modeName) {
  const lower = modeName.toLowerCase();
  if (lower === 'standard') return 'Std';
  if (lower === 'basic') return 'Basic';
  if (lower === 'compact') return 'Comp';
  if (lower.includes('high') && lower.includes('res')) return 'Hires';
  // Default: capitalize first word, max 6 chars
  const words = modeName.split(/[\s_-]+/);
  if (words[0].length <= 6) return words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words[0].slice(0, 6).charAt(0).toUpperCase() + words[0].slice(1, 6);
}

// ── Build one geometry tree for a mode ──
function buildGeoTree(prefix, pixelModules, beamType) {
  const POS_IDENTITY = '{1.000000,0.000000,0.000000,0.000000}{0.000000,1.000000,0.000000,0.000000}{0.000000,0.000000,1.000000,0.000000}{0,0,0,1}';
  const POS_YOKE = '{1.000000,0.000000,0.000000,0.000000}{0.000000,1.000000,0.000000,0.000000}{0.000000,0.000000,1.000000,-0.265000}{0,0,0,1}';
  const POS_HEAD = '{1.000000,0.000000,0.000000,0.000000}{0.000000,1.000000,0.000000,0.000000}{0.000000,0.000000,1.000000,-0.100000}{0,0,0,1}';
  const POS_BEAM = '{1.000000,0.000000,0.000000,0.000000}{0.000000,1.000000,0.000000,0.000000}{0.000000,0.000000,1.000000,-0.150000}{0,0,0,1}';

  let xml = '';
  xml += `      <Geometry Name="${prefix} Base" Model="Base" Position="${POS_IDENTITY}">\n`;
  xml += `        <Axis Name="${prefix} Yoke" Model="Yoke" Position="${POS_YOKE}">\n`;
  xml += `          <Axis Name="${prefix} Head" Model="Head" Position="${POS_HEAD}">\n`;

  // Add GeometryReferences for pixel modules — each module gets its OWN template
  if (pixelModules && pixelModules.length > 0) {
    let totalPixels = 0;
    for (const pm of pixelModules) totalPixels += pm.patches.length;
    const barWidth = totalPixels > 6 ? 0.6 : 0.45;
    const halfWidth = barWidth / 2;

    let pixelIndex = 0;
    for (const pm of pixelModules) {
      // Each pixel module references its own template geometry (e.g. "Pixel_RGB Pixel", "Pixel_White Pixel")
      const templateName = `Pixel_${pm.name.replace(/\s+/g, '_')}`;
      for (let j = 0; j < pm.patches.length; j++) {
        const xOffset = totalPixels > 1
          ? (-halfWidth + (pixelIndex / (totalPixels - 1)) * barWidth).toFixed(6)
          : '0.000000';
        const pixelPos = `{1.000000,0.000000,0.000000,${xOffset}}{0.000000,1.000000,0.000000,0.000000}{0.000000,0.000000,1.000000,-0.150000}{0,0,0,1}`;
        xml += `            <GeometryReference Geometry="${templateName}" Model="BeamModel" Name="${prefix} ${pm.name} ${j + 1}" Position="${pixelPos}">\n`;
        xml += `              <Break DMXBreak="1" DMXOffset="${pm.patches[j]}"/>\n`;
        xml += `            </GeometryReference>\n`;
        pixelIndex++;
      }
    }
  }

  xml += `            <Beam Name="${prefix} Beam" Model="BeamModel" LampType="LED" BeamType="${beamType}" BeamAngle="1.000000" BeamRadius="0.025000" FieldAngle="25.000000" RectangleRatio="1.777700" ThrowRatio="1.000000" Position="${POS_BEAM}"/>\n`;
  xml += `          </Axis>\n`;
  xml += `        </Axis>\n`;
  xml += `      </Geometry>\n`;
  return xml;
}

// ── Build DMXChannel XML for a single channel ──
function buildDMXChannelXml(ch, geoName, resolution, offsetStr) {
  const defVal = ch.default0 ? '0' : (ch.default255 ? '255' : '0');
  const master = ch.master || 'None';
  let physAttrs = '';
  if (ch.physFrom !== undefined) physAttrs = ` PhysicalFrom="${ch.physFrom}.000000" PhysicalTo="${ch.physTo}.000000"`;

  return `          <DMXChannel DMXBreak="1" Offset="${offsetStr}" Geometry="${geoName}" InitialFunction="${geoName}_${ch.gdtf}.${ch.gdtf}.${ch.pretty} 1">
            <LogicalChannel Attribute="${ch.gdtf}" Master="${master}">
              <ChannelFunction Name="${ch.pretty} 1" Attribute="${ch.gdtf}" DMXFrom="0/${resolution}" Default="${defVal}/${resolution}"${physAttrs} CustomName="" Max="1.000000" Min="0.000000" RealAcceleration="0.000000"/>
            </LogicalChannel>
          </DMXChannel>\n`;
}

// ── Map a geometry name (Yoke, Head, Beam) to a mode-prefixed geometry name ──
function prefixGeo(prefix, geoName) {
  // Pixel template names stay as-is (shared across modes)
  if (geoName.startsWith('Pixel_')) return geoName;
  return `${prefix} ${geoName}`;
}

// ── Build one DMXMode XML block ──
// pixelModuleMap: array of { moduleName, channels[] } for each pixel module
function buildModeXml(modeName, prefix, channels, pixelModuleMap) {
  let xml = `      <DMXMode Name="${modeName}" Geometry="${prefix} Base" Description="">\n`;
  xml += `        <DMXChannels>\n`;

  // Main (non-pixel) channels first
  for (const ch of channels) {
    if (ch.isPixel) continue;
    const res = ch.fine ? '2' : '1';
    const offset = ch.fine ? `${ch.coarse},${ch.fine}` : `${ch.coarse}`;
    const geoName = prefixGeo(prefix, ch.geo);
    xml += buildDMXChannelXml(ch, geoName, res, offset);
  }

  // Pixel template channels — grouped by module, each with its own template geometry
  if (pixelModuleMap && pixelModuleMap.length > 0) {
    for (const pm of pixelModuleMap) {
      const templateName = `Pixel_${pm.moduleName.replace(/\s+/g, '_')}`;
      let pixelOffset = 1;
      for (const ch of pm.channels) {
        const res = ch.fine ? '2' : '1';
        const offset = ch.fine ? `${pixelOffset},${pixelOffset + 1}` : `${pixelOffset}`;
        xml += buildDMXChannelXml(ch, templateName, res, offset);
        pixelOffset += ch.fine ? 2 : 1;
      }
    }
  }

  xml += `        </DMXChannels>\n`;
  xml += `        <Relations/><FTMacros/>\n`;
  xml += `      </DMXMode>\n`;
  return xml;
}

// ── Deterministic GDTF builder from parsed MA3 data (no Gemini needed) ──
function buildGDTFFromParsed(parsed, { manufacturer, fixtureName, shortName, dmxMode, fixtureType }) {
  const crypto = require('crypto');
  const guid = crypto.randomUUID().toUpperCase();
  const mfr = manufacturer || 'Unknown';
  const name = fixtureName || 'Fixture';
  const short = shortName || name.slice(0, 10);
  const mode = dmxMode || 'Standard';
  const beamType = fixtureType === 'wash' ? 'Wash' : 'Spot';

  // Collect all unique attributes and features
  const attrs = new Map(); // gdtf name → attr info
  const features = new Map(); // featureGroup.feature → true
  const allChannels = []; // { attr info, coarse, fine, moduleIndex, isPixel }

  for (let i = 0; i < parsed.modules.length; i++) {
    const mod = parsed.modules[i];
    const patches = parsed.grouped[i] || [];
    const isPixel = patches.length > 1;
    for (const ch of mod.channels) {
      const info = lookupAttr(ch.attribute);
      const geo = isPixel ? 'Beam' : info.geo;
      const entry = { ...info, geo, coarse: ch.coarse, fine: ch.fine, moduleIndex: i, isPixel };
      allChannels.push(entry);
      if (!attrs.has(info.gdtf)) attrs.set(info.gdtf, info);
      features.set(info.feature, true);
    }
  }

  // Detect pixel modules
  const pixelModules = [];
  for (let i = 0; i < parsed.modules.length; i++) {
    const patches = parsed.grouped[i] || [];
    if (patches.length > 1) pixelModules.push({ moduleIndex: i, patches, name: parsed.modules[i].name });
  }
  const hasPixels = pixelModules.length > 0;

  // Check for 16-bit channels (only relevant for non-pixel fixtures)
  const has16bit = !hasPixels && allChannels.some(ch => ch.fine !== null && ch.fine !== undefined);

  // ── Determine modes to generate ──
  const primaryPrefix = modePrefix(mode);
  const modes = []; // { modeName, prefix, channels, pixelModules (or null) }

  // Primary mode — always present, all channels, all pixel instances
  modes.push({
    modeName: mode,
    prefix: primaryPrefix,
    channels: allChannels,
    pixelModules: hasPixels ? pixelModules : null,
  });

  if (hasPixels) {
    // Compact mode — main module channels only, NO pixel modules, no GeometryReferences
    const compactChannels = allChannels.filter(ch => !ch.isPixel);
    modes.push({
      modeName: 'Compact',
      prefix: 'Comp',
      channels: compactChannels,
      pixelModules: null,
    });
  } else if (has16bit) {
    // Basic mode — drop fine channels, 8-bit only
    const basicChannels = allChannels.map(ch => {
      if (ch.fine !== null && ch.fine !== undefined) {
        return { ...ch, fine: null }; // drop fine, becomes 8-bit
      }
      return ch;
    });
    modes.push({
      modeName: 'Basic',
      prefix: 'Basic',
      channels: basicChannels,
      pixelModules: null,
    });
  }

  // Build FeatureGroups
  const featureGroups = new Map();
  for (const feat of features.keys()) {
    const [group, fname] = feat.split('.');
    if (!featureGroups.has(group)) featureGroups.set(group, new Set());
    featureGroups.get(group).add(fname);
  }

  // ── Build XML document ──
  let xml = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<GDTF DataVersion="1.2">
  <FixtureType Name="${name}" LongName="${mfr} ${name}" ShortName="${short}" Manufacturer="${mfr}" Description="Built by GDTF-BUILD.COM" FixtureTypeID="${guid}" CanHaveChildren="Yes" ThumbnailOffsetX="0" ThumbnailOffsetY="0">
    <AttributeDefinitions>
      <FeatureGroups>
`;
  for (const [group, feats] of featureGroups) {
    xml += `        <FeatureGroup Name="${group}" Pretty="${group}">`;
    for (const f of feats) xml += `<Feature Name="${f}"/>`;
    xml += `</FeatureGroup>\n`;
  }
  xml += `      </FeatureGroups>
      <Attributes>\n`;
  for (const [gdtfName, info] of attrs) {
    const phys = info.physical !== 'None' ? ` PhysicalUnit="${info.physical}"` : '';
    xml += `        <Attribute Name="${gdtfName}" Feature="${info.feature}"${phys} Pretty="${info.pretty}"/>\n`;
  }
  xml += `      </Attributes>
    </AttributeDefinitions>
    <Wheels/>
    <PhysicalDescriptions>
      <ColorSpace Mode="sRGB" Name=""/>
      <AdditionalColorSpaces/><Gamuts/><Filters/><Emitters/><DMXProfiles/><CRIs/>
      <Connectors/><Properties><OperatingTemperature High="40.000000" Low="0.000000"/><Weight Value="0.000000"/><LegHeight Value="0.000000"/></Properties>
    </PhysicalDescriptions>
    <Models>
      <Model Name="Base" Primitive="Cube" Length="0.300000" Width="0.300000" Height="0.150000" SVGOffsetX="0.000000" SVGOffsetY="0.000000" SVGFrontOffsetX="0.000000" SVGFrontOffsetY="0.000000" SVGSideOffsetX="0.000000" SVGSideOffsetY="0.000000"/>
      <Model Name="Yoke" Primitive="Cube" Length="0.400000" Width="0.100000" Height="0.300000" SVGOffsetX="0.000000" SVGOffsetY="0.000000" SVGFrontOffsetX="0.000000" SVGFrontOffsetY="0.000000" SVGSideOffsetX="0.000000" SVGSideOffsetY="0.000000"/>
      <Model Name="Head" Primitive="Cube" Length="0.250000" Width="0.250000" Height="0.300000" SVGOffsetX="0.000000" SVGOffsetY="0.000000" SVGFrontOffsetX="0.000000" SVGFrontOffsetY="0.000000" SVGSideOffsetX="0.000000" SVGSideOffsetY="0.000000"/>
      <Model Name="BeamModel" Primitive="Cylinder" Length="0.080000" Width="0.080000" Height="0.010000" SVGOffsetX="0.000000" SVGOffsetY="0.000000" SVGFrontOffsetX="0.000000" SVGFrontOffsetY="0.000000" SVGSideOffsetX="0.000000" SVGSideOffsetY="0.000000"/>
    </Models>
    <Geometries>\n`;

  // Build geometry trees — one per mode
  for (const m of modes) {
    xml += buildGeoTree(m.prefix, m.pixelModules, beamType);
  }

  // Add per-module pixel beam templates (each module gets its own template)
  if (hasPixels) {
    const POS_IDENTITY = '{1.000000,0.000000,0.000000,0.000000}{0.000000,1.000000,0.000000,0.000000}{0.000000,0.000000,1.000000,0.000000}{0,0,0,1}';
    for (const pm of pixelModules) {
      const templateName = `Pixel_${pm.name.replace(/\s+/g, '_')}`;
      xml += `      <Beam Name="${templateName}" Model="BeamModel" LampType="LED" BeamType="Wash" BeamAngle="1.000000" BeamRadius="0.025000" FieldAngle="25.000000" RectangleRatio="1.777700" ThrowRatio="1.000000" Position="${POS_IDENTITY}"/>\n`;
    }
  }

  xml += `    </Geometries>\n`;

  // Build pixelModuleMap — channels grouped by module for template generation
  const pixelModuleMap = hasPixels ? pixelModules.map(pm => ({
    moduleName: pm.name,
    channels: allChannels.filter(ch => ch.moduleIndex === pm.moduleIndex && ch.isPixel),
  })) : [];

  // Build DMXModes — one per mode
  xml += `    <DMXModes>\n`;
  for (const m of modes) {
    xml += buildModeXml(m.modeName, m.prefix, m.channels, m.pixelModules ? pixelModuleMap : null);
  }
  xml += `    </DMXModes>\n`;

  xml += `    <Revisions><Revision Date="${new Date().toISOString().split('T')[0]}T00:00:00" ModifiedBy="LMNR GDTF Builder" Text="rev 1" UserID="0"/></Revisions>
    <FTPresets/><Protocols/>
  </FixtureType>
</GDTF>`;

  return xml;
}

// Legacy translate function for prompt building
function translateMA3Attr(attr) {
  const info = ATTR_DB[attr.toUpperCase()];
  return info ? `${info.gdtf} (${info.pretty})` : attr;
}

// Build instance info string for the Gemini prompt
function buildInstancePrompt(parsed) {
  if (!parsed) return '';
  const hasPixels = Object.values(parsed.grouped).some(g => g.length > 1);
  const lines = ['\nMULTI-INSTANCE STRUCTURE (from MA3 patch data):'];
  for (let i = 0; i < parsed.modules.length; i++) {
    const mod = parsed.modules[i];
    const patches = parsed.grouped[i] || [];
    const chList = mod.channels.map(c => {
      const name = translateMA3Attr(c.attribute);
      return c.fine ? `${name}(CH${c.coarse},${c.fine} 16bit)` : `${name}(CH${c.coarse})`;
    }).join(', ');
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

// ── Core generation logic (shared between sync and background) ──
function prepareRequest(body) {
  let { manufacturer, fixtureName, shortName, dmxMode, fixtureType, channels, notes, existingXml, ma3Xml, ma3XmlpBase64 } = body;

  if (ma3XmlpBase64 && !ma3Xml) {
    const zlib = require('zlib');
    const buf = Buffer.from(ma3XmlpBase64, 'base64');
    const decompressed = zlib.gunzipSync(buf).toString('utf8');
    const xmlStart = decompressed.indexOf('<?xml');
    ma3Xml = xmlStart !== -1 ? decompressed.slice(xmlStart) : decompressed;
    if (!fixtureName) { const m = ma3Xml.match(/FixtureType\s+name="([^"]+)"/); if (m) fixtureName = m[1]; }
    if (!manufacturer) { const m = ma3Xml.match(/<manufacturer>([^<]+)<\/manufacturer>/); if (m) manufacturer = m[1]; }
    if (!dmxMode) { const m = ma3Xml.match(/FixtureType[^>]+mode="([^"]+)"/); if (m) dmxMode = m[1]; }
  }

  const parsedMA3 = parseMA3Xml(ma3Xml || existingXml || channels || '');
  const promptParts = [];
  if (manufacturer) promptParts.push(`Manufacturer: ${manufacturer}`);
  if (fixtureName)  promptParts.push(`Fixture Name: ${fixtureName}`);
  if (shortName)    promptParts.push(`Short Name: ${shortName}`);
  if (dmxMode)      promptParts.push(`DMX Mode Name: ${dmxMode}`);
  if (fixtureType && fixtureType !== 'auto') promptParts.push(`Fixture Type: ${fixtureType}`);

  // Count expected DMX footprint and DMXChannels from input
  let expectedFootprint = 0;
  let expectedChannels = 0;
  if (parsedMA3) {
    // From parsed MA3 XML — count total DMX slots across all modules/instances
    for (let i = 0; i < parsedMA3.modules.length; i++) {
      const mod = parsedMA3.modules[i];
      const patches = parsedMA3.grouped[i] || [];
      let modSlots = 0;
      let modChannels = 0;
      for (const ch of mod.channels) {
        modSlots += ch.fine ? 2 : 1;
        modChannels++;
      }
      if (patches.length <= 1) {
        expectedFootprint += modSlots;
        expectedChannels += modChannels;
      } else {
        // Pixel module — channels defined once, replicated per instance
        expectedFootprint += modSlots * patches.length;
        expectedChannels += modChannels; // only one set in DMXChannels
      }
    }
  } else if (channels) {
    // From text channel list — count "CH" entries
    // Count unique channel numbers
    const nums = new Set();
    for (const line of channels.split('\n')) {
      const m = line.match(/CH\s*(\d+)(?:\s*[-,]\s*(\d+))?/i);
      if (m) {
        const start = parseInt(m[1]);
        const end = m[2] ? parseInt(m[2]) : start;
        for (let n = start; n <= end; n++) nums.add(n);
      }
    }
    expectedFootprint = nums.size;
    // Count DMXChannels (16-bit pairs = 1 channel)
    expectedChannels = 0;
    for (const line of channels.split('\n')) {
      if (/CH\s*\d+/i.test(line)) {
        const m = line.match(/CH\s*(\d+)[-,]\s*(\d+)/i);
        if (m && (parseInt(m[2]) - parseInt(m[1]) === 1) && /16.?bit|fine/i.test(line)) {
          expectedChannels++; // 16-bit pair = 1 DMXChannel
        } else if (m && (parseInt(m[2]) - parseInt(m[1]) > 1)) {
          // Range like CH17-20 = multiple channels
          expectedChannels += parseInt(m[2]) - parseInt(m[1]) + 1;
        } else {
          expectedChannels++;
        }
      }
    }
  }

  let prompt = promptParts.join('\n') + '\n\n';
  if (existingXml) prompt += `EXISTING GDTF XML (repair/upgrade):\n${existingXml.slice(0, 15000)}\n\n`;
  if (channels)    prompt += `DMX CHANNEL LIST:\n${channels}\n\n`;
  if (notes)       prompt += `ADDITIONAL NOTES:\n${notes}\n\n`;
  const instancePrompt = buildInstancePrompt(parsedMA3);
  if (instancePrompt) prompt += instancePrompt + '\n';

  // Tell Gemini the exact expected counts
  if (expectedFootprint > 0) {
    prompt += `\nCRITICAL: This fixture uses exactly ${expectedFootprint} DMX slots (addresses). `;
    prompt += `Generate exactly ${expectedChannels} DMXChannel elements (16-bit pairs count as 1 DMXChannel with Offset="N,N+1"). `;
    prompt += `Every channel from the input MUST appear in the output. Do NOT skip or merge channels.\n\n`;
  }

  prompt += 'Generate complete valid GDTF 1.2. Follow all rules exactly. Raw XML only.';

  return { prompt, parsedMA3, expectedFootprint, expectedChannels, extractedMeta: { manufacturer, fixtureName, shortName, dmxMode, fixtureType } };
}

async function callGemini(apiKey, prompt, complex = false) {
  // Use flash-lite for simple fixtures (cheap+fast), regular flash for complex (reliable)
  const model = complex ? 'gemini-2.5-flash' : 'gemini-2.5-flash-lite';
  const maxTokens = complex ? 16384 : 8192;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.1, thinkingConfig: { thinkingBudget: 0 } },
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini ${res.status}: ${err.error?.message || 'Unknown'}`);
  }
  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  let xml = '';
  for (const part of parts) { if (!part.thought) xml += (part.text || ''); }
  if (!xml && parts.length) xml = parts[parts.length - 1]?.text || '';
  return xml;
}

function postProcess(xml, parsedMA3) {
  xml = xml.replace(/```xml\n?/gi, '').replace(/```\n?/g, '').trim();
  const xs = xml.indexOf('<?xml'), xe = xml.lastIndexOf('</GDTF>');
  if (xs !== -1 && xe !== -1) xml = xml.slice(xs, xe + 7);
  else { const gs = xml.indexOf('<GDTF'); if (gs !== -1 && xe !== -1) xml = xml.slice(gs, xe + 7); }
  if (!xml.includes('<GDTF')) throw new Error('No valid GDTF XML in response — try again');
  xml = stripNamespaces(xml);
  xml = fixManufacturer(xml);
  xml = fixGeometryRefs(xml);
  xml = assignOffsets(xml);
  xml = injectInstances(xml, parsedMA3);
  xml = fixGUID(xml);
  xml = fixMasterAttribute(xml);
  xml = fix16bitResolution(xml);
  xml = fixZoomPhysical(xml);
  xml = fixFeatureGroupPretty(xml);
  xml = fixChannelSetDMXTo(xml);
  return xml;
}

// Ensure Zoom ChannelFunction has PhysicalFrom/PhysicalTo for 3D beam control
function fixZoomPhysical(xml) {
  return xml.replace(
    /(<ChannelFunction[^>]*Attribute="Zoom"[^>]*)(>)/g,
    (m, pre, close) => {
      if (pre.includes('PhysicalFrom')) return m; // already has it
      return `${pre} PhysicalFrom="7.000000" PhysicalTo="55.000000"${close}`;
    }
  );
}

// Add Pretty="" to FeatureGroups that are missing it (required by XSD)
function fixFeatureGroupPretty(xml) {
  return xml.replace(/<FeatureGroup\s([^>]*?)>/g, (m, attrs) => {
    if (attrs.includes('Pretty=')) return m;
    const nameMatch = attrs.match(/Name="([^"]+)"/);
    const pretty = nameMatch ? nameMatch[1] : '';
    return `<FeatureGroup ${attrs} Pretty="${pretty}">`;
  });
}

// Remove invalid DMXTo attribute from ChannelSet elements (not in GDTF XSD)
function fixChannelSetDMXTo(xml) {
  return xml.replace(/(<ChannelSet\s[^>]*?)\s*DMXTo="[^"]*"/g, '$1');
}

// Fix all-zeros or invalid GUIDs
function fixGUID(xml) {
  const crypto = require('crypto');
  return xml.replace(/FixtureTypeID="([^"]*)"/, (m, guid) => {
    if (!guid || guid === '00000000-0000-0000-0000-000000000000' || !/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(guid)) {
      return `FixtureTypeID="${crypto.randomUUID().toUpperCase()}"`;
    }
    return m;
  });
}

// Only Dimmer should have Master="Grand", everything else Master="None"
function fixMasterAttribute(xml) {
  // First set all to None
  xml = xml.replace(/(<LogicalChannel\s[^>]*)Master="Grand"/g, (m, pre) => {
    if (/Attribute="Dimmer"/.test(pre)) return m; // keep Dimmer as Grand
    return `${pre}Master="None"`;
  });
  return xml;
}

// Fix 16-bit channels: if Offset has comma (e.g. "1,2"), resolution should be /2 not /1
function fix16bitResolution(xml) {
  return xml.replace(
    /(<DMXChannel[^>]*Offset="(\d+,\d+)"[^>]*>)([\s\S]*?)(<\/DMXChannel>)/g,
    (m, open, offset, body, close) => {
      // Replace /1 with /2 in DMXFrom, DMXTo, Default within this channel
      const fixed = body.replace(/(\b(?:DMXFrom|DMXTo|Default)=")(\d+)\/1"/g, '$1$2/2"');
      return open + fixed + close;
    }
  );
}

// Export for background function and test.js
exports.SYSTEM_PROMPT = SYSTEM_PROMPT;
exports.prepareRequest = prepareRequest;
exports.callGemini = callGemini;
exports.postProcess = postProcess;

// Standard Netlify Function — tries sync, falls back to async for complex fixtures
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

  // If client is polling for a job result, handle that
  if (body.jobId && body.poll) {
    try {
      const { getStore } = await import('@netlify/blobs');
      const store = getStore({ name: 'gdtf-jobs', consistency: 'strong' });
      const result = await store.get(body.jobId, { type: 'json' });
      if (!result) return { statusCode: 200, headers, body: JSON.stringify({ status: 'processing' }) };
      await store.delete(body.jobId); // clean up
      return { statusCode: 200, headers, body: JSON.stringify(result) };
    } catch(e) {
      return { statusCode: 200, headers, body: JSON.stringify({ status: 'processing' }) };
    }
  }

  try {
    const { prompt, parsedMA3, expectedFootprint, expectedChannels, extractedMeta } = prepareRequest(body);

    let xml;

    // For .xmlp uploads with parsed MA3 data: build GDTF deterministically (no Gemini needed)
    if (parsedMA3 && (body.ma3XmlpBase64 || body.ma3Xml)) {
      xml = buildGDTFFromParsed(parsedMA3, { ...body, ...extractedMeta });
    } else {
      // Text input — use Gemini
      const isComplex = (expectedChannels || 0) > 15;
      const rawXml = await callGemini(apiKey, prompt, isComplex);
      if (!rawXml) return { statusCode: 502, headers, body: JSON.stringify({ error: 'Empty Gemini response' }) };
      xml = postProcess(rawXml, parsedMA3);
    }

    // Validate channel count — count only channels in the first DMXMode (primary mode)
    const warnings = [];
    const firstModeMatch = xml.match(/<DMXMode[^>]*>([\s\S]*?)<\/DMXMode>/);
    const firstModeBody = firstModeMatch ? firstModeMatch[1] : xml;
    const actualChannels = (firstModeBody.match(/<DMXChannel[\s>]/g) || []).length;
    if (expectedChannels && actualChannels !== expectedChannels) {
      warnings.push(`Expected ${expectedChannels} DMXChannels but generated ${actualChannels}`);
    }
    // Skip slot count check for multi-instance fixtures (pixel channels use relative offsets)
    const hasGeoRef = xml.includes('<GeometryReference');
    if (expectedFootprint && !hasGeoRef) {
      const offsets = [...firstModeBody.matchAll(/Offset="([^"]+)"/g)].map(m => m[1]);
      let actualSlots = 0;
      for (const o of offsets) actualSlots += o.includes(',') ? o.split(',').length : 1;
      if (actualSlots !== expectedFootprint) {
        warnings.push(`Expected ${expectedFootprint} DMX slots but generated ${actualSlots}`);
      }
    }

    const result = { xml };
    if (warnings.length) result.warnings = warnings;
    return { statusCode: 200, headers, body: JSON.stringify(result) };

  } catch (err) {
    // If it looks like a timeout or complex fixture, try background generation
    if (err.message && (err.message.includes('timeout') || err.message.includes('aborted'))) {
      try {
        const jobId = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        const siteUrl = process.env.URL || 'https://gdtf.netlify.app';
        await fetch(`${siteUrl}/.netlify/functions/generate-background`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId, ...body }),
        });
        return { statusCode: 200, headers, body: JSON.stringify({ jobId, status: 'processing' }) };
      } catch(e) { /* fall through to error */ }
    }
    return { statusCode: 500, headers, body: JSON.stringify({ error: `Server error: ${err.message}` }) };
  }
};
