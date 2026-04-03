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
  SHUTTER:      { gdtf: 'Shutter1',          pretty: 'Shutter',           feature: 'Shutter.Shutter',    physical: 'None',           geo: 'Beam', default0: true },
  SHUTTER2:     { gdtf: 'Shutter2',          pretty: 'Shutter 2',        feature: 'Shutter.Shutter',    physical: 'None',           geo: 'Beam', default0: true },
  COLORRGB1:    { gdtf: 'ColorAdd_R',        pretty: 'Red',              feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB2:    { gdtf: 'ColorAdd_G',        pretty: 'Green',            feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB3:    { gdtf: 'ColorAdd_B',        pretty: 'Blue',             feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB4:    { gdtf: 'ColorAdd_W',        pretty: 'White',            feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB5:    { gdtf: 'ColorAdd_W',        pretty: 'White',            feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLOR1:       { gdtf: 'Color1',            pretty: 'Color Wheel',      feature: 'Color.Color',        physical: 'None',           geo: 'Head' },
  CTO:          { gdtf: 'CTO',              pretty: 'CTO',              feature: 'Color.Color',        physical: 'ColorTemperature', geo: 'Head' },
  CTC:          { gdtf: 'CTO',              pretty: 'CTO',              feature: 'Color.Color',        physical: 'ColorTemperature', geo: 'Head' },
  CTB:          { gdtf: 'CTB',              pretty: 'CTB',              feature: 'Color.Color',        physical: 'ColorTemperature', geo: 'Head' },
  COLORMIXER:   { gdtf: 'ColorMixer1',       pretty: 'Color Mixer',      feature: 'Color.Color',        physical: 'None',           geo: 'Head' },
  COLORMIXER2:  { gdtf: 'ColorMixer2',       pretty: 'Color Mixer 2',    feature: 'Color.Color',        physical: 'None',           geo: 'Head' },
  COLORTEMPERATURE: { gdtf: 'ColorTemperature', pretty: 'Color Temp',    feature: 'Color.Color',        physical: 'ColorTemperature', geo: 'Head' },
  // CMY subtractive color (Mistral, Robin series, etc.)
  COLORSUB_C:   { gdtf: 'ColorSub_C',        pretty: 'Cyan',             feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Head' },
  COLORSUB_M:   { gdtf: 'ColorSub_M',        pretty: 'Magenta',          feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Head' },
  COLORSUB_Y:   { gdtf: 'ColorSub_Y',        pretty: 'Yellow',           feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Head' },
  // Additional color types
  COLORRGB_AMBER: { gdtf: 'ColorAdd_A',      pretty: 'Amber',            feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB_UV:  { gdtf: 'ColorAdd_UV',       pretty: 'UV',               feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  COLORRGB_LIME:{ gdtf: 'ColorAdd_Lime',     pretty: 'Lime',             feature: 'Color.RGB',          physical: 'ColorComponent', geo: 'Beam', default255: true },
  GOBO1:        { gdtf: 'Gobo1',             pretty: 'Gobo 1',           feature: 'Gobo.Gobo',          physical: 'None',           geo: 'Head' },
  GOBO1_POS:    { gdtf: 'Gobo1Pos',          pretty: 'Gobo 1 Rotate',    feature: 'Gobo.Gobo',          physical: 'Angle',          geo: 'Head' },
  GOBO2:        { gdtf: 'Gobo2',             pretty: 'Gobo 2',           feature: 'Gobo.Gobo',          physical: 'None',           geo: 'Head' },
  GOBO2_POS:    { gdtf: 'Gobo2Pos',          pretty: 'Gobo 2 Rotate',    feature: 'Gobo.Gobo',          physical: 'Angle',          geo: 'Head' },
  ZOOM:         { gdtf: 'Zoom',             pretty: 'Zoom',             feature: 'Beam.Zoom',          physical: 'Angle',          geo: 'Head', physFrom: 7, physTo: 55 },
  FOCUS:        { gdtf: 'Focus1',            pretty: 'Focus',            feature: 'Beam.Focus',         physical: 'None',           geo: 'Head' },
  FOCUSMODE:    { gdtf: 'FocusMode',         pretty: 'Focus Mode',       feature: 'Beam.Focus',         physical: 'None',           geo: 'Head' },
  FOCUSDISTANCE:{ gdtf: 'Focus1Distance',    pretty: 'Focus Distance',   feature: 'Beam.Focus',         physical: 'Length',         geo: 'Head' },
  IRIS:         { gdtf: 'Iris',              pretty: 'Iris',             feature: 'Beam.Iris',          physical: 'None',           geo: 'Head', physFrom: 0, physTo: 1 },
  FROST:        { gdtf: 'Frost1',            pretty: 'Frost',            feature: 'Beam.Frost',         physical: 'None',           geo: 'Head' },
  PRISM:        { gdtf: 'Prism1',            pretty: 'Prism',            feature: 'Beam.Prism',         physical: 'None',           geo: 'Head' },
  PRISM_POS:    { gdtf: 'Prism1Pos',         pretty: 'Prism Rotate',     feature: 'Beam.Prism',         physical: 'Angle',          geo: 'Head' },
  EFFECTWHEEL:  { gdtf: 'Effects1',          pretty: 'Effect Wheel',     feature: 'Effect.Effect',      physical: 'None',           geo: 'Head' },
  EFFECTINDEXROTATE: { gdtf: 'Effects1Pos',  pretty: 'Effect Rotate',    feature: 'Effect.Effect',      physical: 'Angle',          geo: 'Head' },
  ANIMATIONWHEEL: { gdtf: 'AnimationWheel1', pretty: 'Animation Wheel',  feature: 'Effect.Effect',      physical: 'None',           geo: 'Head' },
  POSITIONMSPEED: { gdtf: 'PositionSpeed',   pretty: 'Movement Speed',   feature: 'Position.Speed',     physical: 'None',           geo: 'Base' },
  EFFECTMACROS: { gdtf: 'EffectMacros',      pretty: 'Effect Macros',    feature: 'Effect.Effect',      physical: 'None',           geo: 'Head' },
  PWMFREQUENCY: { gdtf: 'Control1',          pretty: 'PWM Frequency',    feature: 'Control.Control',    physical: 'Frequency',      geo: 'Base' },
  // Control
  FANMODE:      { gdtf: 'FanMode',           pretty: 'Fan Mode',         feature: 'Control.Control',    physical: 'None',           geo: 'Base' },
  DIMMERCURVE:  { gdtf: 'DimmerCurve',       pretty: 'Dimmer Curve',     feature: 'Control.Control',    physical: 'None',           geo: 'Base' },
  NOFEATURE:    { gdtf: 'NoFeature',         pretty: 'Reserved',         feature: 'Control.Control',    physical: 'None',           geo: 'Beam' },
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
  // Handle zone-suffixed attributes (e.g. COLORRGB1_Z2 → look up COLORRGB1)
  const key = ma3Name.toUpperCase();
  if (ATTR_DB[key]) return ATTR_DB[key];
  const baseKey = key.replace(/_Z\d+$/, '');
  if (ATTR_DB[baseKey]) {
    const base = ATTR_DB[baseKey];
    const zoneMatch = key.match(/_Z(\d+)$/);
    const zoneNum = zoneMatch ? parseInt(zoneMatch[1]) : 0;
    if (zoneNum <= 1) return base; // first instance keeps base name (Dimmer, Shutter1, ColorAdd_R)
    // MA3 convention: strip trailing digits from base, append zone number
    // Shutter1 → Shutter2, Dimmer → Dimmer2, ColorAdd_R → ColorAdd_R2
    // Effects1 → Effects2, Zoom → Zoom2
    const gdtfBase = base.gdtf.replace(/\d+$/, ''); // Shutter1 → Shutter, Effects1 → Effects
    return { ...base, gdtf: gdtfBase + zoneNum, pretty: base.pretty + ' ' + zoneNum };
  }
  return { gdtf: ma3Name, pretty: ma3Name, feature: 'Control.Control', physical: 'None', geo: 'Beam' };
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

  // Main (non-pixel) channels — recalculate offsets sequentially
  let seqOffset = 1;
  for (const ch of channels) {
    if (ch.isPixel) continue;
    const res = ch.fine ? '2' : '1';
    const offset = ch.fine ? `${seqOffset},${seqOffset + 1}` : `${seqOffset}`;
    const geoName = prefixGeo(prefix, ch.geo);
    xml += buildDMXChannelXml(ch, geoName, res, offset);
    seqOffset += ch.fine ? 2 : 1;
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
function buildGDTFFromParsed(parsed, { manufacturer, fixtureName, shortName, dmxMode, fixtureType, _overrideModes }) {
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
  const modes = []; // { modeName, prefix, channels, pixelModules (or null) }

  if (_overrideModes && _overrideModes.length > 1) {
    // Multi-mode from Gemini: use real extracted modes, no derived Basic/Compact
    const usedPrefixes = new Set();
    for (const m of _overrideModes) {
      let pfx = modePrefix(m.name);
      // Deduplicate prefixes so geometry names don't collide
      let attempt = pfx, n = 2;
      while (usedPrefixes.has(attempt)) attempt = pfx.slice(0, 4) + n++;
      usedPrefixes.add(attempt);

      const modeChannels = m.channels.map(ch => {
        const info = lookupAttr(ch.attribute);
        if (!attrs.has(info.gdtf)) { attrs.set(info.gdtf, info); features.set(info.feature, true); }
        return { ...info, geo: info.geo, coarse: ch.coarse, fine: ch.fine, moduleIndex: 0, isPixel: false };
      });
      modes.push({ modeName: m.name, prefix: attempt, channels: modeChannels, pixelModules: null });
    }
  } else {
    // Single parsed source — standard Primary + Basic/Compact derivation
    const primaryPrefix = modePrefix(mode);
    modes.push({
      modeName: mode,
      prefix: primaryPrefix,
      channels: allChannels,
      pixelModules: hasPixels ? pixelModules : null,
    });

    if (hasPixels) {
      const compactChannels = allChannels.filter(ch => !ch.isPixel);
      modes.push({ modeName: 'Compact', prefix: 'Comp', channels: compactChannels, pixelModules: null });
    } else if (has16bit) {
      const basicSeen = new Set();
      const basicChannels = [];
      for (const ch of allChannels) {
        const entry = (ch.fine !== null && ch.fine !== undefined) ? { ...ch, fine: null } : { ...ch };
        const key = entry.gdtf + '_' + entry.geo;
        if (!basicSeen.has(key)) { basicSeen.add(key); basicChannels.push(entry); }
      }
      modes.push({ modeName: 'Basic', prefix: 'Basic', channels: basicChannels, pixelModules: null });
    }
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

// ── Gemini JSON type → ATTR_DB key mapping ──
const TYPE_TO_ATTR = {
  pan: 'PAN', tilt: 'TILT', pan_tilt_speed: 'POSITIONMSPEED',
  shutter: 'SHUTTER', shutter2: 'SHUTTER2', dimmer: 'DIMMER', dimmer2: 'DIM2', dimmer3: 'DIM3',
  zoom: 'ZOOM', focus: 'FOCUS', focus_distance: 'FOCUSDISTANCE', focus_mode: 'FOCUSMODE',
  iris: 'IRIS', frost: 'FROST', prism: 'PRISM', prism_pos: 'PRISM_POS',
  color_wheel: 'COLOR1', cyan: 'COLORSUB_C', magenta: 'COLORSUB_M', yellow: 'COLORSUB_Y',
  cto: 'CTO', ctb: 'CTB', color_mix: 'COLORMIXER', color_temperature: 'COLORTEMPERATURE',
  red: 'COLORRGB1', green: 'COLORRGB2', blue: 'COLORRGB3', white: 'COLORRGB4',
  amber: 'COLORRGB_AMBER', uv: 'COLORRGB_UV', lime: 'COLORRGB_LIME',
  gobo1: 'GOBO1', gobo1_pos: 'GOBO1_POS', gobo2: 'GOBO2', gobo2_pos: 'GOBO2_POS',
  animation_wheel: 'ANIMATIONWHEEL', effect: 'EFFECTWHEEL', effect_pos: 'EFFECTINDEXROTATE',
  macro: 'MACROSELECT', effect_macro: 'EFFECTMACROS',
  control: 'FIXTUREGLOBALRESET', reset: 'FIXTUREGLOBALRESET',
  pwm_frequency: 'PWMFREQUENCY', fan_mode: 'FANMODE', dimmer_curve: 'DIMMERCURVE',
  led_effect: 'LEDENGINEEFFECTS', led_effect_rate: 'LEDENGINEEFFECTRATE', led_effect_fade: 'LEDENGINEEFFECTSTEPTIME',
  strobe_duration: 'STROBEDURATION', strobe_mode: 'STROBEMODE',
  no_function: 'NOFEATURE', reserved: 'NOFEATURE',
  // Common Gemini variations / aliases
  effect_rate: 'LEDENGINEEFFECTRATE', effect_fade: 'LEDENGINEEFFECTSTEPTIME',
  color_macro: 'MACROSELECT', auto_program: 'EFFECTMACROS', program_speed: 'EFFECTMACRORATE',
  movement_speed: 'POSITIONMSPEED', speed: 'POSITIONMSPEED',
  strobe: 'SHUTTER', intensity: 'DIMMER',
  red_fine: 'COLORRGB1', green_fine: 'COLORRGB2', blue_fine: 'COLORRGB3', white_fine: 'COLORRGB4',
  pan_fine: 'PAN', tilt_fine: 'TILT',
  gobo_rotation: 'GOBO1_POS', gobo1_rotation: 'GOBO1_POS', gobo2_rotation: 'GOBO2_POS',
  color_wheel_fine: 'COLOR1', zoom_fine: 'ZOOM', focus_fine: 'FOCUS',
  cyan_fine: 'COLORSUB_C', magenta_fine: 'COLORSUB_M', yellow_fine: 'COLORSUB_Y',
  cto_fine: 'CTO', iris_fine: 'IRIS', prism_rotation: 'PRISM_POS',
  auto_focus: 'FOCUSDISTANCE', focus_adjust: 'FOCUSDISTANCE',
};

// ── JSON-only Gemini prompt for text/PDF channel parsing ──
const TEXT_PARSE_PROMPT = `You are a DMX channel list parser for professional lighting fixtures.

Return a JSON object with this structure:
{
  "modes": [
    {
      "name": "Mode 1",
      "channelCount": 49,
      "channels": [
        {"ch":1,"fine":2,"name":"Pan","type":"pan"},
        {"ch":3,"fine":null,"name":"Dimmer","type":"dimmer"}
      ]
    }
  ]
}

HOW TO READ DMX CHARTS:
- DMX protocol tables have NUMBERED COLUMNS for different modes
- Each column is a SEPARATE, COMPLETE mode — read each column fully from top to bottom
- Tables may span multiple pages — if the same column headers appear at the top of a new page, that is a CONTINUATION of the current table, NOT a new table. Continue reading those columns from where they left off.
- A new independent table begins only when a new SET of different mode column headers appears (e.g. modes 6-10 after modes 1-5)
- A "*" or blank in a column means that channel does NOT exist in that mode — skip it
- Channel numbers restart from 1 for each mode independently
- "Pan Fine (16 bit)" after "Pan" → set fine to the next sequential number on the Pan entry

MODE NAMES: The fixture manual usually has a mode overview table (e.g. "DMX mode overview") listing each mode's name and channel count. Use those EXACT name strings as the "name" field — never substitute generic names like "Mode 1", "Mode 2". If no overview table exists, use the column header text.

READING CHANNEL NUMBERS — CRITICAL:
Each row in the DMX table shows a function name. Each mode's column cell contains the CHANNEL NUMBER that function uses IN THAT SPECIFIC MODE, or * if absent.
The SAME function often has DIFFERENT channel numbers in different modes. Example: "CTC" might be ch32 in Mode 1 but ch16 in Mode 3. "Dimmer" might be ch48 in Mode 1 but ch27 in Mode 2 and ch32 in Mode 3.
Always read the actual number from each mode's own column cell — do not assume it matches Mode 1.

SELF-CHECK: After extracting each mode, verify your channel count equals the stated ch_count. If it does not match, re-read that column — you likely missed channels on a continuation page.

CHANNEL TYPE KEYS (use exactly one per channel):
pan, tilt, pan_tilt_speed,
shutter, shutter2, dimmer, dimmer2, dimmer3,
zoom, focus, focus_distance, focus_mode,
color_wheel, cyan, magenta, yellow, cto, ctb, color_mix, color_temperature,
red, green, blue, white, amber, uv, lime,
gobo1, gobo1_pos, gobo2, gobo2_pos,
animation_wheel, iris, prism, prism_pos, frost,
control, reset, effect, effect_pos, macro, effect_macro,
pwm_frequency, fan_mode, dimmer_curve,
led_effect, led_effect_rate, led_effect_fade,
strobe_duration, strobe_mode,
no_function, reserved

RULES:
- Extract ALL modes found in the document, each as a separate entry in the modes array
- For each mode, include ONLY channels where that mode has a number (not * or blank)
- If a channel is "fine" for another, set "fine" on the coarse entry, do NOT add a separate fine entry
- CMY (cyan/magenta/yellow) = subtractive mixing in spot/profile fixtures. RGB (red/green/blue) = additive in LED fixtures
- "16-bit" or "fine" = set the fine field to the next channel number
- "Strobe" within a shutter channel = use "shutter" type
- Flower Effect channels: Flower Effect = "effect", Flower Effect Red = "red", Flower Effect Green = "green", Flower Effect Blue = "blue", Flower Effect White = "white", Flower Effect Shutter = "shutter2", Flower Effect Dimmer = "dimmer2", Flower Effect colour macros = "macro"
- Pixel effect channels: Pixel effects = "led_effect", Pixel effects speed = "led_effect_rate", Pixel effects fade = "led_effect_fade"
- Zone-specific channels (e.g. "Red zone 1", "Red zone 2"): each zone is a SEPARATE channel with the same type
- Individual pixel channels (e.g. "Red pixel 1" through "Red pixel 19"): each pixel is a SEPARATE channel
- Power/Special functions / Control = "control"
- Virtual colour wheel = "color_wheel"
- CTC / Colour temperature correction = "cto"
- Colour Mix control = "color_mix"
- Return ONLY valid JSON, no markdown, no backticks

For PLAIN TEXT input (not PDF), return a single mode in the modes array.`;

// ── Regex pre-processor: parse common channel list formats without AI ──
// Returns channel list array or null if it can't parse deterministically
function parseTextDeterministic(text) {
  if (!text || !text.trim()) return null;
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Keyword → type mapping (case-insensitive)
  const KEYWORD_MAP = [
    [/\bpan\b.*\btilt\b.*\bspeed|pan.?tilt.?speed|movement.?speed|p.?t.?speed/i, 'pan_tilt_speed'],
    [/\bpan\b.*\bfine|pan.?fine/i, null], // skip — merged into coarse
    [/\btilt\b.*\bfine|tilt.?fine/i, null],
    [/\bpan\b/i, 'pan'],
    [/\btilt\b/i, 'tilt'],
    [/\bdimmer\b.*\bfine|dimmer.?fine/i, null],
    [/\bdimmer\b|\bintensity\b|\bdim\b/i, 'dimmer'],
    [/\bshutter\b|\bstrobe\b.*\bshutter|shutter.*\bstrobe\b/i, 'shutter'],
    [/\bcyan\b|\bred.?cyan|r.?c\b/i, 'cyan'],
    [/\bmagenta\b|\bgreen.?magenta|g.?m\b/i, 'magenta'],
    [/\byellow\b|\bblue.?yellow|b.?y\b/i, 'yellow'],
    [/\bcto\b|\bcolou?r.?temp/i, 'cto'],
    [/\bctb\b/i, 'ctb'],
    [/\bcolou?r.?wheel|colou?r.?1|virtual.?colou?r/i, 'color_wheel'],
    [/\bcolou?r.?mix/i, 'color_mix'],
    [/\bred\b/i, 'red'],
    [/\bgreen\b/i, 'green'],
    [/\bblue\b/i, 'blue'],
    [/\bwhite\b/i, 'white'],
    [/\bamber\b/i, 'amber'],
    [/\buv\b|ultra.?violet/i, 'uv'],
    [/\blime\b/i, 'lime'],
    [/\bgobo\s*1.*\brot|gobo\s*1.*\bpos|gobo\s*1.*\bspin|gobo.?1.?fine/i, 'gobo1_pos'],
    [/\bgobo\s*2.*\brot|gobo\s*2.*\bpos|gobo\s*2.*\bspin/i, 'gobo2_pos'],
    [/\bgobo\s*1\b|\bgobo\b(?!\s*2)/i, 'gobo1'],
    [/\bgobo\s*2\b/i, 'gobo2'],
    [/\banim|animation/i, 'animation_wheel'],
    [/\bzoom\b.*\bfine|zoom.?fine/i, null],
    [/\bzoom\b/i, 'zoom'],
    [/\bfocus\b.*\bdist|focus.?distance|auto.?focus/i, 'focus_distance'],
    [/\bfocus\b.*\bfine|focus.?fine/i, null],
    [/\bfocus\b.*\bmode/i, 'focus_mode'],
    [/\bfocus\b/i, 'focus'],
    [/\biris\b/i, 'iris'],
    [/\bprism\b.*\brot|prism.*\bpos|prism.*\bspin|prism.*\bindex/i, 'prism_pos'],
    [/\bprism\b/i, 'prism'],
    [/\bfrost\b/i, 'frost'],
    [/\bflower\b.*\beffect\b(?!.*\bred|.*\bgreen|.*\bblue|.*\bwhite|.*\bshutter|.*\bdimmer|.*\bcolou?r|.*\bmacro|.*\bspeed|.*\bfade)/i, 'effect'],
    [/\bflower\b.*\bred|flower.?effect.?r/i, 'red'],
    [/\bflower\b.*\bgreen|flower.?effect.?g/i, 'green'],
    [/\bflower\b.*\bblue|flower.?effect.?b/i, 'blue'],
    [/\bflower\b.*\bwhite|flower.?effect.?w/i, 'white'],
    [/\bflower\b.*\bshutter|flower.?effect.?shutter/i, 'shutter2'],
    [/\bflower\b.*\bdimmer|flower.?effect.?dim/i, 'dimmer2'],
    [/\bflower\b.*\bcolou?r.*\bmacro/i, 'macro'],
    [/\bflower\b.*\bspeed|pixel.?effect.?speed/i, 'led_effect_rate'],
    [/\bflower\b.*\bfade|pixel.?effect.?fade/i, 'led_effect_fade'],
    [/\bpixel\s*effect\b|\beffect\b.*\bpattern/i, 'effect'],
    [/\beffect\b.*\bspeed|pixel.?speed/i, 'led_effect_rate'],
    [/\beffect\b.*\bfade/i, 'led_effect_fade'],
    [/\beffect\b.*\brot|effect.*\bindex/i, 'effect_pos'],
    [/\beffect\b/i, 'effect'],
    [/\bspeed\b/i, 'pan_tilt_speed'],
    [/\breset\b|control.*reset|power.*special|special.*function/i, 'control'],
    [/\bmacro\b|auto.?prog/i, 'macro'],
    [/\bpwm\b|led.?freq/i, 'pwm_frequency'],
    [/\bfan\b/i, 'fan_mode'],
    [/\breserved\b|\bno func/i, 'no_function'],
  ];

  function matchType(name) {
    for (const [regex, type] of KEYWORD_MAP) {
      if (regex.test(name)) return type;
    }
    return null;
  }

  // Parse each line to extract channel number and name
  const rawChannels = [];
  for (const line of lines) {
    // Skip header/label lines
    if (/^(ch|channel|dmx|mode|function|value|description|type)/i.test(line) && !/\d/.test(line.slice(0, 3))) continue;
    if (/^[-=_]+$/.test(line)) continue;

    // Try various formats:
    // "CH1-2 Pan 16bit" / "CH1,2 Pan" / "CH 1 Pan"
    let m = line.match(/^ch\s*(\d+)\s*[-,]\s*(\d+)\s+(.+)/i);
    if (m) { rawChannels.push({ ch: +m[1], fine: +m[2], name: m[3].trim() }); continue; }

    // "CH1 Pan" / "CH 1 Pan"
    m = line.match(/^ch\s*(\d+)\s+(.+)/i);
    if (m) { rawChannels.push({ ch: +m[1], fine: null, name: m[2].trim() }); continue; }

    // "1  Pan Movement  8bit" / "1-2  Pan  16bit" (number-first, tab/space separated)
    m = line.match(/^(\d+)\s*[-,]\s*(\d+)\s+(.+)/);
    if (m) { rawChannels.push({ ch: +m[1], fine: +m[2], name: m[3].trim() }); continue; }

    m = line.match(/^(\d+)\s+(.+)/);
    if (m && +m[1] <= 512) { rawChannels.push({ ch: +m[1], fine: null, name: m[2].trim() }); continue; }
  }

  if (rawChannels.length < 2) return null; // too few channels, let Gemini handle it

  // Map names to types and detect fine channels
  const channels = [];
  for (let i = 0; i < rawChannels.length; i++) {
    const rc = rawChannels[i];

    // Check if this is a fine-only channel (merge into previous coarse)
    if (/\bfine\b/i.test(rc.name) && channels.length > 0) {
      const prev = channels[channels.length - 1];
      if (!prev.fine && rc.ch === prev.ch + 1) {
        prev.fine = rc.ch;
        continue;
      }
    }

    // Check if "16bit" or "16 bit" in name implies the next channel is fine
    let fine = rc.fine;
    if (!fine && /16\s*-?\s*bit/i.test(rc.name) && i + 1 < rawChannels.length) {
      const next = rawChannels[i + 1];
      if (/\bfine\b/i.test(next.name) && next.ch === rc.ch + 1) {
        fine = next.ch;
      }
    }

    const type = matchType(rc.name);
    if (type === null) continue; // skip fine-only entries (matchType returns null)

    channels.push({
      ch: rc.ch,
      fine: fine,
      name: rc.name.replace(/\s*(8|16)\s*-?\s*bit\s*/gi, '').replace(/\s*\(.*?\)\s*/g, '').trim(),
      type: type,
    });
  }

  // Validate: need at least 2 channels with recognized types
  const recognized = channels.filter(c => c.type !== 'no_function');
  if (recognized.length < 2) return null;

  return channels;
}

// ── Call Gemini for JSON-only text parsing (not XML generation) ──
async function parseTextWithGemini(apiKey, userText, mediaBase64, mediaType) {
  // Build content parts — text + optional PDF/image
  const contentParts = [];
  if (mediaBase64 && mediaType) {
    contentParts.push({ inline_data: { mime_type: mediaType, data: mediaBase64 } });
    contentParts.push({ text: 'Extract ALL DMX modes from this fixture manual. Read each mode column fully — tables may span multiple pages, continue reading the same columns across page breaks. A new table only starts when an entirely new set of mode column headers appears. Use the mode overview (ch_counts) to self-check each mode: if your count is wrong, re-read that column. ' + (userText || '') });
  } else {
    contentParts.push({ text: userText });
  }

  // PDF/image needs flash (better multimodal), text uses flash-lite (faster)
  const model = mediaBase64 ? 'gemini-2.5-flash' : 'gemini-2.5-flash-lite';
  const maxTokens = mediaBase64 ? 8192 : 4096;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: TEXT_PARSE_PROMPT }] },
        contents: [{ parts: contentParts }],
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.0, responseMimeType: 'application/json', thinkingConfig: { thinkingBudget: 0 } },
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
  // Parse JSON — strip any markdown wrapping
  text = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(text);
  // Handle all formats: matrix { tables: [...] }, multi-mode { modes: [...] }, legacy [...]
  if (parsed.tables && Array.isArray(parsed.tables)) {
    return matrixToModes(parsed.tables);
  }
  if (parsed.modes && Array.isArray(parsed.modes)) {
    return parsed;
  }
  if (Array.isArray(parsed)) {
    return { modes: [{ name: 'Default', channelCount: parsed.length, channels: parsed }] };
  }
  throw new Error('Gemini returned unexpected JSON format');
}

// ── Process a single mode's channel list: dedup, merge fine, zone-suffix ──
function processChannelList(channelList) {
  // First pass: collect all used channel numbers to detect overlaps
  const usedChannels = new Set();
  for (const ch of channelList) usedChannels.add(ch.ch);

  // Merge fine channels
  const merged = [];
  const seen = new Set();
  const usedOffsets = new Set(); // track which offsets are already assigned
  for (const ch of channelList) {
    if (ch.type && ch.type.endsWith('_fine')) continue;
    const attrKey = TYPE_TO_ATTR[ch.type] || ch.type.toUpperCase();

    // Validate fine channel: must be exactly coarse + 1
    let fine = null;
    if (ch.fine && ch.fine === ch.ch + 1) {
      fine = ch.fine; // valid 16-bit pair
    } else if (ch.fine && ch.fine !== ch.ch + 1) {
      // Gemini gave wrong fine (e.g. CH28 fine:30 skipping CH29)
      // Check if coarse+1 is a fine entry in the list
      const nextCh = channelList.find(f => f.ch === ch.ch + 1 && f !== ch &&
        (f.name && f.name.toLowerCase().includes('fine')));
      fine = nextCh ? ch.ch + 1 : null; // only use if next is explicitly fine
    } else {
      // No fine specified — check if next channel is a fine for this one
      const fineEntry = channelList.find(f =>
        f.ch === ch.ch + 1 && f !== ch &&
        (f.type === ch.type || f.type === ch.type + '_fine' || (f.name && f.name.toLowerCase().includes('fine')))
      );
      if (fineEntry) fine = fineEntry.ch;
    }

    // Skip if this channel number is already used as a fine for another channel
    if (usedOffsets.has(ch.ch)) continue;

    const key = attrKey + '_' + ch.ch;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push({ attribute: attrKey, coarse: ch.ch, fine });
      usedOffsets.add(ch.ch);
      if (fine) usedOffsets.add(fine);
    }
  }
  // Zone-suffix duplicates
  const attrCount = {};
  for (const ch of merged) attrCount[ch.attribute] = (attrCount[ch.attribute] || 0) + 1;
  const attrIndex = {};
  return merged.map(ch => {
    if (attrCount[ch.attribute] > 1) {
      attrIndex[ch.attribute] = (attrIndex[ch.attribute] || 0) + 1;
      return { ...ch, attribute: ch.attribute + '_Z' + attrIndex[ch.attribute] };
    }
    return ch;
  });
}

// ── Convert TABLE MATRIX format { tables: [...] } to standard { modes: [...] } ──
// Each row in table.rows is an array of type-key strings (or null) — one per mode column.
// Fine channels use the "_fine" suffix convention and are kept as flat entries;
// processChannelList() handles fine merging via type matching.
function matrixToModes(tables) {
  const allModes = [];
  for (const table of tables) {
    const modeCount = table.modes.length;
    for (let i = 0; i < modeCount; i++) {
      const modeMeta = table.modes[i];
      const channels = [];
      let counter = 1;
      for (const row of table.rows) {
        if (!Array.isArray(row)) continue;
        const cellType = row[i];
        if (!cellType || cellType === '*') continue;
        channels.push({ ch: counter++, name: cellType, type: cellType });
      }
      allModes.push({ name: modeMeta.name, channelCount: modeMeta.ch_count || channels.length, channels });
    }
  }
  return { modes: allModes };
}

// ── Convert Gemini JSON (single or multi-mode) to GDTF ──
function buildGDTFFromChannelList(geminiResult, meta) {
  const modes = geminiResult.modes || [{ name: 'Default', channels: geminiResult }];

  // LED fixtures (wash, bar, strobe) use RGB additive — remap CMY types to RGB.
  // Robe/Ayrton PDFs label channels "Red/Cyan" which Gemini reads as cyan.
  const isAdditive = /wash|bar|strobe|led|par|pixel/i.test(meta.fixtureType || '');
  if (isAdditive) {
    const cmyToRgb = { cyan: 'red', magenta: 'green', yellow: 'blue', cyan_fine: 'red_fine', magenta_fine: 'green_fine', yellow_fine: 'blue_fine' };
    for (const mode of modes) {
      if (!mode.channels) continue;
      for (const ch of mode.channels) {
        if (cmyToRgb[ch.type]) ch.type = cmyToRgb[ch.type];
      }
    }
  }

  // Process all modes (not just the largest)
  const processedModes = modes
    .filter(m => m.channels && m.channels.length > 0)
    .map(m => ({ name: m.name || 'Default', channels: processChannelList(m.channels) }));

  if (!processedModes.length) throw new Error('No channels found in parsed result');

  // Build parsed structure using union of all channels (ensures AttributeDefinitions is complete)
  const unionSeen = new Set();
  const unionChannels = [];
  for (const m of processedModes) {
    for (const ch of m.channels) {
      const key = ch.attribute + '_' + ch.coarse;
      if (!unionSeen.has(key)) { unionSeen.add(key); unionChannels.push(ch); }
    }
  }

  const parsed = {
    modules: [{ name: 'Main Module', class: 'Headmover', channels: unionChannels }],
    instances: [{ moduleIndex: 0, patch: 1 }],
    grouped: { 0: [1] },
  };

  // Set mode name from largest mode if not specified
  if (!meta.dmxMode) {
    const largest = [...processedModes].sort((a, b) => b.channels.length - a.channels.length)[0];
    let slots = 0;
    for (const ch of largest.channels) slots += ch.fine ? 2 : 1;
    meta.dmxMode = largest.name || (slots + 'CH');
  }

  // When Gemini returned multiple real modes, pass them through for multi-mode GDTF output
  if (processedModes.length > 1) {
    meta._overrideModes = processedModes;
  }

  const xml = buildGDTFFromParsed(parsed, meta);
  return { xml, detectedModes: modes.map(m => ({ name: m.name, channelCount: m.channelCount || m.channels?.length || 0 })) };
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
exports.parseTextDeterministic = parseTextDeterministic;
exports.buildGDTFFromParsed = buildGDTFFromParsed;
exports.buildGDTFFromChannelList = buildGDTFFromChannelList;
exports.matrixToModes = matrixToModes;
exports.TEXT_PARSE_PROMPT = TEXT_PARSE_PROMPT;

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

  // Large PDF from Supabase Storage — Gemini takes 30-60s, route to background (15-min limit)
  if (body._pdfStoragePath) {
    try {
      const jobId = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      const siteUrl = process.env.URL || 'https://gdtf-build.com';
      await fetch(`${siteUrl}/.netlify/functions/generate-background`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, ...body }),
      });
      return { statusCode: 200, headers, body: JSON.stringify({ jobId, status: 'processing' }) };
    } catch(e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to start background processing: ' + e.message }) };
    }
  }

  // If client is polling for a job result, read from Supabase gdtf_jobs table
  if (body.jobId && body.poll) {
    try {
      const supabaseUrl = 'https://mvntodsdjftfjbcrvedn.supabase.co';
      const supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bnRvZHNkamZ0ZmpiY3J2ZWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NTYwMDQsImV4cCI6MjA4OTQzMjAwNH0.4oKeQh4E45O9Kf5MklRUmKW_5t5NvzU3cVf3VGHEIsg';
      const pollRes = await fetch(
        `${supabaseUrl}/rest/v1/gdtf_jobs?job_id=eq.${encodeURIComponent(body.jobId)}&select=status,xml,error_msg&limit=1`,
        { headers: { 'apikey': supabaseAnon, 'Authorization': `Bearer ${supabaseAnon}` } }
      );
      const rows = await pollRes.json();
      if (!rows.length) return { statusCode: 200, headers, body: JSON.stringify({ status: 'processing' }) };
      const row = rows[0];
      // Clean up job row after reading
      fetch(`${supabaseUrl}/rest/v1/gdtf_jobs?job_id=eq.${encodeURIComponent(body.jobId)}`, {
        method: 'DELETE',
        headers: { 'apikey': supabaseAnon, 'Authorization': `Bearer ${supabaseAnon}` },
      }).catch(() => {});
      if (row.status === 'error') return { statusCode: 200, headers, body: JSON.stringify({ status: 'error', error: row.error_msg }) };
      return { statusCode: 200, headers, body: JSON.stringify({ status: 'complete', xml: row.xml }) };
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
      // Text/PDF input — two-step: Gemini parses text to JSON, then deterministic build
      const userText = [
        body.channels || '',
        body.existingXml ? 'EXISTING XML:\n' + body.existingXml.slice(0, 10000) : '',
        body.notes || '',
      ].filter(Boolean).join('\n\n');

      // Determine if we have a PDF or image upload
      let mediaBase64 = null, mediaType = null;
      if (body.pdfBase64) { mediaBase64 = body.pdfBase64; mediaType = 'application/pdf'; }
      else if (body.imageBase64) { mediaBase64 = body.imageBase64; mediaType = 'image/jpeg'; }

      if (!userText.trim() && !mediaBase64) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'No channel data provided' }) };
      }

      // PDF/image uploads: process with Gemini (with self-imposed timeout)
      if (mediaBase64) {
        try {
          // Race Gemini against a 22s timeout (Netlify kills sync functions at ~26s)
          const timeoutMs = 22000;
          const geminiPromise = parseTextWithGemini(apiKey, userText || 'Extract all DMX channels from this document', mediaBase64, mediaType);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs)
          );
          const channelList = await Promise.race([geminiPromise, timeoutPromise]);
          const meta = { ...body, ...extractedMeta };
          const result = buildGDTFFromChannelList(channelList, meta);
          xml = result.xml;
        } catch(e) {
          if (e.message === 'TIMEOUT') {
            return { statusCode: 200, headers, body: JSON.stringify({
              error: 'PDF processing timed out (large document). Try typing the channel list from the DMX chart — it generates instantly and is more reliable.',
            })};
          }
          return { statusCode: 200, headers, body: JSON.stringify({
            error: 'PDF processing failed: ' + e.message,
          })};
        }
      }

      // Try deterministic regex parsing first (free, instant, reliable)
      let channelList = null;
      if (!mediaBase64 && userText.trim()) {
        const regexResult = parseTextDeterministic(userText);
        if (regexResult) {
          channelList = { modes: [{ name: 'Default', channelCount: regexResult.length, channels: regexResult }] };
        }
      }

      // Fall back to Gemini for PDFs, images, or text that regex couldn't parse
      if (!channelList) {
        channelList = await parseTextWithGemini(apiKey, userText || 'Extract all DMX channels from this document', mediaBase64, mediaType);
      }
      const meta = { ...body, ...extractedMeta };
      const result = buildGDTFFromChannelList(channelList, meta);
      xml = result.xml;
      // Pass detected modes info to frontend
      if (result.detectedModes && result.detectedModes.length > 1) {
        // Store for response
        body._detectedModes = result.detectedModes;
      }
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
