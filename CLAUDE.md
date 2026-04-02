# LMNR GDTF Builder — Claude Onboarding Guide

## What This Is
A browser-based tool that generates GDTF 1.2 fixture profiles for grandMA3 lighting consoles. Live at [gdtf-build.com](https://gdtf-build.com). Built by Pat Slavin / LMNR Productions.

## Stack
- **Frontend**: Single `index.html` (vanilla HTML/JS, no framework)
- **Backend**: `netlify/functions/generate.js` (Netlify Functions, Node.js)
- **AI**: Gemini 2.5 Flash / Flash-Lite (text parsing only, NOT XML generation)
- **Database**: Supabase (feedback storage)
- **Hosting**: Netlify (paid plan, git-connected to GitHub)
- **Repo**: `github.com/patrickslavin90-stack/gdtf-builder`
- **Branch**: local `master` pushes to remote `main` via `git push origin master:main`

## Architecture — Three Input Paths, One Deterministic Output

```
.xmlp upload → parseMA3Xml() → buildGDTFFromParsed() → GDTF XML (0ms, free)

Text input → regex pre-processor → buildGDTFFromChannelList() → GDTF XML (22ms, free)
         ↓ (regex fails)
         → Gemini flash-lite JSON parse → buildGDTFFromChannelList() → GDTF XML (2-5s)

PDF/Image → Gemini flash multimodal → buildGDTFFromChannelList() → GDTF XML (15-30s)
```

**CRITICAL RULE**: Gemini NEVER generates XML. It only parses text/PDF into a JSON channel list. All XML generation is deterministic via `buildGDTFFromParsed()`.

## Key Files

### `netlify/functions/generate.js` (~1400 lines)
The entire backend. Contains:
- **ATTR_DB** (~80 entries): Maps MA3/Gemini attribute names to GDTF standard attributes with feature, geometry, physical unit, defaults
- **TYPE_TO_ATTR** (~60 entries): Maps Gemini JSON type keys to ATTR_DB keys
- **TEXT_PARSE_PROMPT**: The Gemini system prompt for JSON-only channel parsing
- **parseTextDeterministic()**: Regex pre-processor with 70+ keyword patterns — handles common channel list formats without AI
- **parseTextWithGemini()**: Calls Gemini for JSON channel extraction (text, PDF, images)
- **processChannelList()**: Deduplicates, merges fine channels, zone-suffixes duplicates
- **buildGDTFFromChannelList()**: Converts Gemini JSON to parsed format, picks largest mode
- **parseMA3Xml()**: Parses MA3 .xmlp (gzip XML) into modules/instances/channels
- **buildGDTFFromParsed()**: THE deterministic GDTF builder — generates complete valid XML
- **buildGeoTree()**: Builds geometry tree per mode with position offsets
- **buildModeXml()**: Builds DMXMode with sequential offsets
- **Post-processing functions**: fixGUID, fixMasterAttribute, fix16bitResolution, fixZoomPhysical, fixFeatureGroupPretty, fixChannelSetDMXTo, stripNamespaces, fixManufacturer, fixGeometryRefs, assignOffsets

### `index.html` (~1700 lines)
Single-page app with:
- File upload (drag/drop): .xmlp, .gdtf, .pdf, .png/.jpg, .csv, .txt
- Fixture type picker (Moving Head/Static → sub-types)
- DMX cable SVG loading animation with alternating LED blink
- 3D model selector (spot/wash/strobe/bar .3ds files)
- Validation checks (12 GDTF XSD rules)
- Feedback widget (thumbs up/down → Supabase for thumbs-down)
- `setModelFiles()`: Maps 3D models to geometry tree positions
- `applyMA3Fixes()`: Client-side XML fixes for existing GDTF files
- `downloadGDTF()`: Packages XML + .3ds models into ZIP

### `netlify/functions/generate-background.js`
Background function for long-running tasks (15 min limit). Currently handles overflow but PDF processing was moved back to sync function with 22s self-timeout.

### `test.js`
Local test runner. Usage: `node test.js "Fixture Name" "Manufacturer" "CH1 Dimmer\nCH2 Strobe" "5CH" "spot"`

## GDTF Structure Rules (MA3 Compliance)

### Geometry Tree (Moving Head)
```xml
<Geometry Name="Base" Model="Base" Position="{identity}">
  <Axis Name="Yoke" Model="Yoke" Position="{Z=-0.265}">
    <Axis Name="Head" Model="Head" Position="{Z=-0.100}">
      <Beam Name="Beam" Model="BeamModel" BeamAngle="1" FieldAngle="25" Position="{Z=-0.150}"/>
    </Axis>
  </Axis>
</Geometry>
```

### Geometry Assignments
| Geometry | Channels |
|----------|----------|
| **Yoke** | Pan |
| **Head** | Tilt, Zoom, Focus, Color, Gobo, Iris, Prism, Frost, Animation |
| **Beam** | Dimmer, Shutter (light output only) |
| **Base** | Position Speed, Control, Reset, Fan, PWM |

### Multi-Instance (Pixel Fixtures)
- Each pixel module gets its OWN template geometry (`Pixel_RGB_Pixel`, `Pixel_White_Pixel`)
- GeometryReferences with X-position offsets for 3D spacing
- Break elements with DMXOffset for each instance
- DMXChannels reference the template name with relative offsets

### Multi-Mode
- Each mode gets its own geometry tree with prefixed names (`Std Base`, `Basic Base`)
- Offsets recalculated sequentially per mode
- Pixel fixtures: Primary + Compact (no pixels)
- Non-pixel with 16-bit: Primary + Basic (fine dropped)

### Required Attributes
- `FixtureTypeID`: Valid uppercase hex GUID (never all-zeros)
- `Description="Built by GDTF-BUILD.COM"` on every fixture
- `Master="Grand"` ONLY on Dimmer, `Master="None"` on everything else
- `PhysicalFrom/PhysicalTo` on Pan (±270), Tilt (±135), Zoom (7-55), Iris (0-1)
- `Pretty=""` on every FeatureGroup
- No `DMXTo` on ChannelSet elements (not in XSD)
- No `RefFT` attribute on FixtureType
- Colors default to 255/1, Dimmer to 0/1, Shutter to 255/1

## 3D Models
Stored in `models/{type}/` (spot, wash, strobe, bar):
- `base.3ds` → Base geometry
- `yoke.3ds` → Yoke/bracket
- `head.3ds` → Head/body (elongated for bar, box for strobe)
- `setModelFiles()` maps by geometry tree position, not model name
- Beam gets `PrimitiveType="Cylinder"` (no .3ds file)

## Supabase
- Project: `mvntodsdjftfjbcrvedn` (ap-southeast-1)
- Table: `gdtf_feedback` — stores thumbs-down reports with input/output for debugging
- Anon key is in index.html (public, insert-only)

## Environment Variables
- `GEMINI_API_KEY`: In Netlify Dashboard (never in code)
- For local testing: `$env:GEMINI_API_KEY="AIza..."` (PowerShell) or `.env` file

## Known Issues / Active Work

### PDF Processing
- Complex PDFs (>4MB, multiple pages) can timeout (22s self-imposed limit, Netlify 26s hard limit)
- Multi-mode PDFs: Gemini reads columns downward as separate modes (prompt explicitly teaches this)
- Flash-lite can't handle PDFs reliably — uses regular flash (slower but accurate)
- Spiider PDF (8 pages, 10 modes, 4.2MB) is the stress test benchmark

### Attribute Mapping Gaps
- MA3 uses `EFFECTWHEEL` for both prism and effect wheels — context-dependent
- MA3 uses `COLORRGB1/2/3` for both RGB and CMY — fixture-type-dependent
- `FOCUSMODE` in MA3 maps to `Focus1Distance` in official GDTF profiles
- LED Effect channels (CH8-10) exist in MA3 but official GDTF profiles skip them

### 3D Models
- Bar fixtures need elongated head.3ds (from X4 Bar), not spot head
- Strobe fixtures need box-shaped head.3ds (from JDC-1), not bar shape
- `setModelFiles()` maps by geometry position — last axis = head.3ds

## User Preferences (Pat Slavin)
- **Deterministic-first**: Minimize Gemini usage. Only use AI as fallback.
- **Fresh UUIDs**: Always use new UUID and versioned names for test GDTF files (MA3 caches)
- **Test locally before pushing**: Use test.js with .env file
- **No unnecessary features**: Keep it focused on the core use case — "I need this fixture profile NOW"
- **Multi-mode is future premium**: Single mode + derived variant for free tier
- **Learn from failures**: Thumbs-down saves to Supabase for review
- **Branch convention**: Local `master` → remote `main` via `git push origin master:main`

## Commit Convention
Always end commit messages with:
```
Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
```

## Testing Fixtures Available
- `ayrton@mistral@standard.xmlp` — 25ch moving head spot (in Mistral test/)
- `glp@impression_x4_bar_10@high_resolution.xmlp` — 20ch LED bar with 3 pixel zones
- `glp@jdc-1@spix.xmlp` — 23ch strobe with 12 RGB + 12 White pixel instances
- `test 5 reference.xmlp` — 16ch simple LED moving head
- `Spiider test.pdf` — Complex 10-mode wash (stress test for PDF parsing)
- `Mistral test/Mistral-1.1.pdf` — 3-mode spot (Standard/Basic/Extended)
- `Mistral test/Ayrton@Mistral@V2.22_New_SVG.gdtf` — Official reference GDTF
- `correct GLP@impression X4 Bar 10@ledbar.gdtf` — Official reference bar GDTF
