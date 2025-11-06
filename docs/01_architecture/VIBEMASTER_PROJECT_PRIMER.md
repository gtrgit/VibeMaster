# ðŸŽ™ï¸ VIBEMASTER: Voice-Driven Adventure Game Builder
## The Future of Game Development in Decentraland

**Project Status:** Planning Phase  
**Created:** November 1, 2025  
**Foundation:** MidniteMansion Hackathon Learnings  
**Vision:** Speak games into existence, test with placeholders, generate art only when ready  

---

## ðŸ“‹ EXECUTIVE SUMMARY

VibeMaster is a revolutionary game development pipeline for Decentraland SDK7 that eliminates the traditional art bottleneck. Drawing from successful patterns established in the MidniteMansion hackathon, this system enables developers to:

1. **Voice-describe** game scenes and objects naturally
2. **Test gameplay** in white-box (labeled placeholders)
3. **Iterate rapidly** without art dependencies
4. **Generate visuals** via AI when mechanics are proven
5. **Ship complete games** faster than ever

**Core Philosophy:** Gameplay first. Visuals last. Ship faster.

---

## ðŸ† FOUNDATION: WHAT WE LEARNED

### MidniteMansion Hackathon Success

The MidniteMansion project proved several critical concepts:

âœ… **Billboard rendering** works beautifully for 2D sprites in Decentraland  
âœ… **AI-powered NPCs** create engaging character interactions  
âœ… **SCUMM-style interfaces** translate perfectly to 3D environments  
âœ… **Scene-based architecture** enables complex adventure games  
âœ… **Component systems** keep code maintainable and extensible  

### Technical Constraints Discovered

**Decentraland SDK7 Specifics:**
```typescript
// âœ… Y is VERTICAL (not Z!)
position: Vector3.create(x, y, z)
// x = horizontal left/right
// y = vertical up/down
// z = depth forward/back

// âœ… Use Systems (NOT setTimer)
engine.addSystem((dt: number) => {
  // Update logic
})

// âœ… Use console.log (NOT console.warn)
console.log("Message") // Works
console.warn("Warning") // Doesn't work in desktop client

// âŒ No localStorage/sessionStorage
// Must use in-memory storage or file system
```

**React ECS UI Limitations:**
- No `calc()` support in CSS
- Limited component library
- Performance issues with many UI elements
- Type definitions incomplete

**Entity Management:**
- Don't scale to Vector3.Zero() (texture limits)
- Better to destroy and recreate entities
- Texture memory is critical
- Billboard rotation for camera-facing sprites

### Architecture Patterns That Work

**Component-Based Entities:**
```typescript
interface GameObject {
  id: string
  name: string
  type: 'npc' | 'prop' | 'door' | 'hotspot'
}

interface BillboardSprite {
  spriteUrl: string
  scale: number
  color: Color4
}

// Compose entities from components
const npc = {
  ...gameObject,
  ...billboardSprite,
  ...character,
  ...interactable
}
```

**Manager Pattern:**
```typescript
class GameSceneManager {
  private currentScene: Scene
  private activeCharacter: Character
  
  loadScene(sceneId: string) { }
  spawnObjects(objects: GameObject[]) { }
  switchCharacter(charId: string) { }
}

export const gameManager = new GameSceneManager()
```

**Tiered File Organization:**
```
ðŸ”´ CORE (Load for gameplay work)
ðŸŸ¡ ACTIVE (Current sprint work)
ðŸŸ¢ STABLE (Load only when needed)
ðŸ”µ REFERENCE (Docs - rarely load)
âš« ARCHIVE (Never load)
```

---

## ðŸŽ¯ VIBEMASTER SYSTEM ARCHITECTURE

### The Four-Phase Pipeline

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ PHASE 1: VOICE PROTOTYPING                          â”‚
â”‚                                                      â”‚
â”‚  ðŸŽ¤ Speak Scene â†’ ðŸ“ Transcribe â†’ ðŸ¤– Generate JSON  â”‚
â”‚  (ElevenLabs)    (Scribe API)    (Claude API)      â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                         â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ PHASE 2: WHITE-BOX TESTING                          â”‚
â”‚                                                      â”‚
â”‚  ðŸ“¦ Spawn Placeholders â†’ ðŸŽ® Test Gameplay          â”‚
â”‚  (Labeled white planes)   (Walk, interact, puzzle)  â”‚
â”‚                         â†“                            â”‚
â”‚                  ðŸŽ™ï¸ Record Changes                  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                         â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ PHASE 3: AI ART GENERATION                          â”‚
â”‚                                                      â”‚
â”‚  ðŸ“ Description â†’ ðŸŽ¨ Generate Image â†’ ðŸ’¾ Cache      â”‚
â”‚  (Style template)  (OpenArt API)     (PNG files)   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                         â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ PHASE 4: ASSET INTEGRATION                          â”‚
â”‚                                                      â”‚
â”‚  ðŸ–¼ï¸ Replace Placeholders â†’ âœ… Ship Game            â”‚
â”‚  (Auto-swap sprites)        (Gameplay unchanged)    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## ðŸ”§ TECHNICAL IMPLEMENTATION

### Core Components

#### 1. VoiceSceneBuilder
```typescript
class VoiceSceneBuilder {
  // Record voice description (browser MediaRecorder API)
  async recordDescription(): Promise<Blob> {
    const mediaRecorder = new MediaRecorder(stream)
    // ... recording logic
    return audioBlob
  }
  
  // Transcribe via ElevenLabs Scribe
  async transcribe(audio: Blob): Promise<string> {
    const formData = new FormData()
    formData.append('audio', audio)
    
    const response = await fetch('https://api.elevenlabs.io/v1/scribe', {
      method: 'POST',
      headers: { 'xi-api-key': ELEVENLABS_API_KEY },
      body: formData
    })
    
    return response.json().text
  }
  
  // Parse transcript into structured data
  async parseSceneDescription(text: string): Promise<SceneData> {
    // Send to Claude API for parsing
    const prompt = `Parse this scene description into JSON:
    ${text}
    
    Return format:
    {
      roomName: string,
      objects: Array<{id, name, type, position, description}>
    }`
    
    // ... Claude API call
    return parsedData
  }
  
  // Spawn white-box entities
  spawnPlaceholders(sceneData: SceneData): void {
    sceneData.objects.forEach(obj => {
      const entity = engine.addEntity()
      
      // White plane with text label
      MeshRenderer.setPlane(entity)
      Material.setPbrMaterial(entity, {
        albedoColor: Color4.White()
      })
      
      Transform.create(entity, {
        position: obj.position,
        scale: Vector3.create(2, 2, 1)
      })
      
      // Floating text label
      TextShape.create(entity, {
        text: obj.name,
        fontSize: 5
      })
      
      // Billboard to face camera
      Billboard.create(entity, {
        billboardMode: BillboardMode.BM_Y
      })
    })
  }
}
```

#### 2. WhiteBoxRenderer
```typescript
class WhiteBoxRenderer {
  private placeholders = new Map<string, Entity>()
  
  createPlaceholder(obj: SceneObject): Entity {
    const entity = engine.addEntity()
    
    // White plane
    MeshRenderer.setPlane(entity)
    Material.setPbrMaterial(entity, {
      albedoColor: Color4.White(),
      metallic: 0,
      roughness: 1
    })
    
    // Position and scale
    Transform.create(entity, {
      position: obj.position,
      rotation: obj.rotation || Quaternion.Identity(),
      scale: obj.scale || Vector3.create(2, 2, 1)
    })
    
    // Text label (floating above)
    const labelEntity = engine.addEntity()
    Transform.create(labelEntity, {
      position: Vector3.create(
        obj.position.x,
        obj.position.y + 1.5, // Float above
        obj.position.z
      )
    })
    
    TextShape.create(labelEntity, {
      text: obj.name,
      fontSize: 5,
      textColor: Color4.Black()
    })
    
    Billboard.create(labelEntity, {
      billboardMode: BillboardMode.BM_Y
    })
    
    this.placeholders.set(obj.id, entity)
    return entity
  }
  
  markReadyForArt(objectId: string): void {
    const entity = this.placeholders.get(objectId)
    if (!entity) return
    
    // Change to yellow to indicate "ready for art"
    Material.setPbrMaterial(entity, {
      albedoColor: Color4.Yellow()
    })
  }
  
  updatePosition(objectId: string, position: Vector3): void {
    const entity = this.placeholders.get(objectId)
    if (!entity) return
    
    const transform = Transform.getMutable(entity)
    transform.position = position
  }
}
```

#### 3. ArtGenerator
```typescript
interface StyleTemplate {
  id: string
  name: string
  basePrompt: string
  artStyle: string
  colorPalette: string
  lighting: string
  cameraAngle: string
  additionalTags: string[]
}

class ArtGenerator {
  private styleTemplates = new Map<string, StyleTemplate>()
  
  constructor() {
    // Load default style templates
    this.loadDefaultTemplates()
  }
  
  buildPrompt(obj: SceneObject, template: StyleTemplate): string {
    const parts = [
      template.basePrompt,
      obj.voiceDescription,
      `Art style: ${template.artStyle}`,
      `Colors: ${template.colorPalette}`,
      `Lighting: ${template.lighting}`,
      `Camera: ${template.cameraAngle}`,
      `Tags: ${template.additionalTags.join(', ')}`
    ]
    
    return parts.join('\n')
  }
  
  async generateImage(objectId: string, prompt: string): Promise<string> {
    // Call OpenArt API (or similar image generation API)
    const response = await fetch('https://api.openart.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENART_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        width: 512,
        height: 512,
        steps: 30,
        guidance_scale: 7.5
      })
    })
    
    const data = await response.json()
    return data.imageUrl
  }
  
  async downloadAndCache(imageUrl: string, objectId: string): Promise<string> {
    // Download image
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    
    // Save to project assets
    const filename = `generated_${objectId}.png`
    const localPath = `assets/generated/${filename}`
    
    // In a real implementation, save to file system
    // For now, return the URL for direct use
    return imageUrl
  }
  
  applyArt(entity: Entity, imageUrl: string): void {
    // Replace white plane material with generated image
    Material.setBasicMaterial(entity, {
      texture: Material.Texture.Common({
        src: imageUrl
      })
    })
  }
}
```

#### 4. VibeMasterDevUI
```typescript
class VibeMasterDevUI {
  private isVisible = false
  
  toggleMenu(): void {
    this.isVisible = !this.isVisible
    // Show/hide UI
  }
  
  listPlaceholders(): PlaceholderInfo[] {
    return Array.from(whiteBoxRenderer.placeholders.entries()).map(
      ([id, entity]) => ({
        id,
        entity,
        readyForArt: this.isMarkedReady(id),
        hasGeneratedArt: this.hasArt(id)
      })
    )
  }
  
  async markAllReady(): Promise<void> {
    const placeholders = this.listPlaceholders()
    placeholders.forEach(p => {
      whiteBoxRenderer.markReadyForArt(p.id)
    })
  }
  
  async generateAllArt(): Promise<void> {
    const placeholders = this.listPlaceholders()
      .filter(p => p.readyForArt && !p.hasGeneratedArt)
    
    for (const p of placeholders) {
      const obj = sceneData.objects.find(o => o.id === p.id)
      if (!obj) continue
      
      const template = artGenerator.styleTemplates.get(obj.styleTemplate)
      const prompt = artGenerator.buildPrompt(obj, template)
      const imageUrl = await artGenerator.generateImage(p.id, prompt)
      
      // Cache locally
      const localUrl = await artGenerator.downloadAndCache(imageUrl, p.id)
      
      // Store reference
      obj.generatedImageURL = localUrl
    }
  }
  
  replaceAllPlaceholders(): void {
    const placeholders = this.listPlaceholders()
      .filter(p => p.hasGeneratedArt)
    
    placeholders.forEach(p => {
      const obj = sceneData.objects.find(o => o.id === p.id)
      if (!obj || !obj.generatedImageURL) return
      
      artGenerator.applyArt(p.entity, obj.generatedImageURL)
    })
  }
  
  exportScene(): string {
    // Export final scene data as JSON
    return JSON.stringify(sceneData, null, 2)
  }
}
```

---

## ðŸ“‹ DATA STRUCTURES

### Scene Object Definition
```typescript
interface SceneObject {
  id: string
  name: string
  type: 'prop' | 'character' | 'exit' | 'hotspot'
  
  // Positioning
  position: Vector3
  rotation: Quaternion
  scale: Vector3
  
  // Voice-driven data
  voiceDescription: string      // What you said
  voiceRecordingURL?: string    // Audio file URL
  transcription: string         // Scribe output
  
  // White-box phase
  isPlaceholder: boolean        // true = white plane
  textLabel: string             // Floating text label
  
  // Art generation
  readyForArt: boolean          // User marked ready
  artPrompt?: string            // Generated prompt
  styleTemplate: string         // "scumm_classic", etc.
  generatedImageURL?: string    // OpenArt result
  
  // Gameplay (inherited from MidniteMansion)
  interactions: Interaction[]
  dialogueScriptID?: string
  
  // Character-specific
  PersonScale?: number          // Scale for movement/visuals
  walkSpeed?: number
  voiceID?: string             // ElevenLabs voice
}

interface Interaction {
  verb: Verb                    // "Look", "Use", "Pick Up", etc.
  response: string              // Text response
  scriptID?: string             // SCUMM script to run
  conditions?: Condition[]      // Requirements to enable
}

interface VoiceSession {
  sessionID: string
  timestamp: Date
  audioFileURL: string
  transcription: string
  parsedData: SceneData
  status: 'recorded' | 'transcribed' | 'parsed' | 'spawned'
}

interface SceneData {
  roomName: string
  background?: string
  objects: SceneObject[]
  characters: Character[]
  exits: Exit[]
  notes: string[]
}
```

### Style Templates
```typescript
const STYLE_TEMPLATES: Record<string, StyleTemplate> = {
  scumm_classic: {
    id: "scumm_classic",
    name: "LucasArts SCUMM Style",
    basePrompt: "LucasArts adventure game style from 1990s",
    artStyle: "pixel art, 256 colors, VGA era, dithered shadows",
    colorPalette: "limited palette, bold colors, high contrast",
    lighting: "dramatic side lighting, defined shadows",
    cameraAngle: "3/4 isometric view, slight top-down angle",
    additionalTags: ["adventure game", "point-and-click", "retro"]
  },
  
  mansion_gothic: {
    id: "mansion_gothic",
    name: "Victorian Gothic Mansion",
    basePrompt: "Victorian Gothic architecture, haunted mansion interior",
    artStyle: "detailed illustration, ornate carved details, realistic",
    colorPalette: "dark wood tones, deep reds, muted gold, shadows",
    lighting: "moody candlelight, mysterious shadows, atmospheric",
    cameraAngle: "3/4 view, eye level, dramatic perspective",
    additionalTags: ["Victorian", "ornate", "creepy", "detailed"]
  },
  
  character_cartoon: {
    id: "character_cartoon",
    name: "Cartoon Character Sprite",
    basePrompt: "cartoon character for adventure game",
    artStyle: "stylized proportions, expressive features, clean lines",
    colorPalette: "vibrant colors, cel-shaded, high saturation",
    lighting: "flat lighting with rim light, no harsh shadows",
    cameraAngle: "3/4 front view, standing neutral pose",
    additionalTags: ["character design", "game sprite", "cartoon"]
  }
}
```

---

## ðŸŽ® USAGE WORKFLOW

### Example: Creating a Mansion Room

**Step 1: Voice Recording**
```
Developer: "This is the library. There's a large bookshelf against the 
back wall, full of old leather-bound books. In the center of the room 
is a mahogany desk with a brass lamp on it. The lamp flickers slightly. 
To the left is a tall window with heavy velvet curtains. There's a 
mysterious painting of a woman above the fireplace on the right wall. 
The door to the hallway is at the bottom of the screen."
```

**Step 2: Transcription & Parsing**
```typescript
// ElevenLabs Scribe transcribes
const transcript = await voiceBuilder.transcribe(audioBlob)

// Claude API parses into structured data
const sceneData = await voiceBuilder.parseSceneDescription(transcript)

// Result:
{
  roomName: "Library",
  objects: [
    {
      id: "lib_bookshelf_01",
      name: "Bookshelf",
      type: "prop",
      position: { x: 0, y: 0, z: 5 },
      voiceDescription: "large bookshelf full of old leather-bound books",
      isPlaceholder: true,
      readyForArt: false
    },
    {
      id: "lib_desk_01",
      name: "Mahogany Desk",
      type: "prop",
      position: { x: 0, y: 0, z: 0 },
      voiceDescription: "mahogany desk with brass lamp that flickers",
      isPlaceholder: true,
      readyForArt: false
    },
    // ... more objects
  ]
}
```

**Step 3: White-Box Spawn**
```typescript
// Spawn placeholders
voiceBuilder.spawnPlaceholders(sceneData)

// Walk around, test positions
// Press E key to mark object ready for art
// Press V key to adjust voice descriptions
```

**Step 4: Art Generation**
```typescript
// Mark all objects ready
devUI.markAllReady()

// Generate all art
await devUI.generateAllArt()
// â†’ Calls OpenArt API for each object
// â†’ Downloads and caches PNG files

// Replace placeholders with art
devUI.replaceAllPlaceholders()
// â†’ Swaps white planes with generated sprites
```

**Step 5: Export & Ship**
```typescript
// Export final scene
const finalScene = devUI.exportScene()
// â†’ JSON file with all data

// Scene is now playable with full art!
```

---

## ðŸš€ IMPLEMENTATION ROADMAP

### Phase 1: MVP Foundation (Weeks 1-2)

**Week 1: Voice Recording & Transcription**
- [ ] Browser MediaRecorder integration
- [ ] ElevenLabs Scribe API integration
- [ ] Audio file upload/storage
- [ ] Transcription display UI
- [ ] Edit transcription before parsing

**Week 2: Scene Parsing & White-Box**
- [ ] Claude API integration for parsing
- [ ] JSON schema validation
- [ ] White plane spawning system
- [ ] Text label rendering
- [ ] Basic dev UI (toggle menu)

### Phase 2: Testing & Iteration (Weeks 3-4)

**Week 3: White-Box Refinement**
- [ ] In-game position adjustment
- [ ] Scale/rotation controls
- [ ] Mark objects "ready for art"
- [ ] Save/load white-box scenes
- [ ] Multi-room support

**Week 4: Gameplay Integration**
- [ ] Character controller integration
- [ ] Click-to-move with placeholders
- [ ] Interaction system with white-box
- [ ] SCUMM verb interface
- [ ] Test full game loop

### Phase 3: Art Generation (Weeks 5-6)

**Week 5: API Integration**
- [ ] OpenArt API setup
- [ ] Style template library
- [ ] Prompt generation system
- [ ] Single object test generation
- [ ] Image caching system

**Week 6: Batch Operations**
- [ ] Generate art for all ready objects
- [ ] Progress tracking UI
- [ ] Error handling & retry logic
- [ ] Art preview before applying
- [ ] Manual prompt editing

### Phase 4: Full Pipeline (Weeks 7-8)

**Week 7: Auto-Replacement**
- [ ] Swap placeholders with art
- [ ] Maintain entity references
- [ ] Update game data structures
- [ ] Verify gameplay still works
- [ ] Export final scene

**Week 8: Polish & Documentation**
- [ ] UI improvements
- [ ] Error messages
- [ ] User documentation
- [ ] Video tutorial
- [ ] Example scenes

### Phase 5: Advanced Features (Weeks 9-10)

**Week 9: Real-Time Commands**
- [ ] Voice commands during testing
- [ ] "Move this left", "Make it bigger"
- [ ] Live position adjustments
- [ ] Undo/redo system

**Week 10: Collaborative Mode**
- [ ] Multi-user voice sessions
- [ ] Real-time white-box updates
- [ ] Shared art generation queue
- [ ] Export multi-room games

---

## ðŸ’° COST ANALYSIS

### ElevenLabs Scribe (Speech-to-Text)
- **Free Tier:** Attribution required
- **Paid Tier:** $0.40/hour of audio
- **Estimate:** $5-10/month for active development

### ElevenLabs TTS (Text-to-Speech)
- **Free Tier:** 10,000 characters/month
- **Paid Tier:** $5/month for 30,000 characters
- **Estimate:** $5-10/month for dialogue testing

### OpenArt API (Image Generation)
- **Pricing:** TBD (need to research)
- **Alternatives:** Stable Diffusion API, Midjourney API
- **Estimate:** $20-50/month for active dev

### Claude API (Parsing)
- **Pricing:** $3 per million input tokens
- **Usage:** ~1000 tokens per scene description
- **Estimate:** $5-10/month

**Total Estimated Cost:** $35-80/month during active development  
**Production Cost:** Minimal (only generate art for final game)

---

## ðŸŽ¯ SUCCESS METRICS

### Development Velocity
- **Prototype to White-Box:** < 1 hour
- **White-Box to Final Art:** < 1 day
- **Complete Room:** 2-3 days (vs weeks traditionally)

### Quality Targets
- **Transcription Accuracy:** > 95%
- **Parsing Success Rate:** > 90%
- **Art Generation Success:** > 80% usable first try
- **Performance:** 60 FPS with 50+ objects

### Adoption Metrics
- **Users:** 50+ developers in first 3 months
- **Games Created:** 20+ published games in