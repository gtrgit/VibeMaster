# VIBEMASTER QUICK-START GUIDE

Getting started with voice-driven game development in Decentraland

**Last Updated:** November 1, 2025  
**Estimated Time to MVP:** 8 weeks  
**Difficulty:** Intermediate  

---

## ðŸŽ¯ WHAT YOU'LL BUILD

A complete voice-to-game pipeline:

1. **Speak** scene descriptions into your microphone
2. **See** white placeholder boxes spawn instantly
3. **Walk around** and test gameplay with no art required
4. **Generate** AI art only when mechanics are proven
5. **Ship** a complete game in weeks instead of months

---

## âœ… PREREQUISITES

### Required Skills
- TypeScript/JavaScript knowledge
- Basic Decentraland SDK7 experience
- Command line comfort
- Understanding of async/await

### Required Accounts (All Free Tiers Available)
```
â˜ ElevenLabs account (free tier: attribution required)
  â†’ https://elevenlabs.io
  â†’ Get API key from Profile â†’ API Keys

â˜ OpenArt account (research pricing - TBD)
  â†’ https://openart.ai
  â†’ Get API key from settings

â˜ Anthropic/Claude API (optional, for parsing)
  â†’ https://console.anthropic.com
  â†’ Get API key from API Keys section
```

### Development Environment
```bash
# Install Node.js 18+
node --version  # Should be 18.x or higher

# Install Decentraland CLI
npm install -g decentraland

# Install TypeScript
npm install -g typescript

# Verify installations
dcl --version
tsc --version
```

---

## ðŸš€ PROJECT SETUP

### Step 1: Create New Decentraland Scene

```bash
# Create new scene
mkdir midnite-vibemaster
cd midnite-vibemaster

# Initialize Decentraland scene
dcl init

# Choose options:
# - Single scene
# - Parcel coordinates: 0,0
# - Name: VibeMaster Test Scene
```

### Step 2: Install Dependencies

```bash
# Install required packages
npm install @dcl/sdk@latest

# Install API clients
npm install node-fetch
npm install form-data

# Install TypeScript types
npm install -D @types/node
npm install -D @types/node-fetch
```

### Step 3: Configure API Keys

Create `src/config.ts`:
```typescript
// API Configuration
export const CONFIG = {
  elevenLabs: {
    apiKey: 'YOUR_ELEVENLABS_API_KEY',  // Get from elevenlabs.io
    scribeEndpoint: 'https://api.elevenlabs.io/v1/scribe',
    ttsEndpoint: 'https://api.elevenlabs.io/v1/text-to-speech'
  },
  
  openArt: {
    apiKey: 'YOUR_OPENART_API_KEY',  // Get from openart.ai
    endpoint: 'https://api.openart.ai/v1/generate'
  },
  
  claude: {
    apiKey: 'YOUR_CLAUDE_API_KEY',  // Optional - for parsing
    endpoint: 'https://api.anthropic.com/v1/messages'
  },
  
  // Local paths for caching
  paths: {
    voiceSessions: './voice_sessions/',
    whiteboxScenes: './scenes/whitebox/',
    generatedArt: './assets/generated/',
    finalScenes: './scenes/final/'
  }
}

// IMPORTANT: Add config.ts to .gitignore to protect API keys!
```

**âš ï¸ Security: Add to `.gitignore`:**
```
# .gitignore
src/config.ts
voice_sessions/
assets/generated/
```

---

## ðŸ“ IMPLEMENTATION PHASES

### PHASE 1: Voice Recording (Week 1)

**Goal:** Record voice, get transcription

**Create `src/voiceRecorder.ts`:**
```typescript
import { CONFIG } from './config'

export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null
  private audioChunks: Blob[] = []
  
  async startRecording(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    this.mediaRecorder = new MediaRecorder(stream)
    this.audioChunks = []
    
    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data)
    }
    
    this.mediaRecorder.start()
    console.log("ðŸŽ¤ Recording started...")
  }
  
  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) return
      
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' })
        console.log("ðŸŽ¤ Recording stopped")
        resolve(audioBlob)
      }
      
      this.mediaRecorder.stop()
    })
  }
  
  async transcribe(audioBlob: Blob): Promise<string> {
    const formData = new FormData()
    formData.append('audio', audioBlob)
    
    const response = await fetch(CONFIG.elevenLabs.scribeEndpoint, {
      method: 'POST',
      headers: {
        'xi-api-key': CONFIG.elevenLabs.apiKey
      },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.text
  }
}

// Usage in your scene:
const recorder = new VoiceRecorder()

// Press V to start recording
engine.addSystem((dt) => {
  if (inputSystem.isTriggered(InputAction.IA_PRIMARY, PointerEventType.PET_DOWN)) {
    recorder.startRecording()
  }
})

// Press V again to stop and transcribe
// ... (continue implementation)
```

**Test Checklist:**
```
â˜ Microphone permission granted
â˜ Recording starts on button press
â˜ Audio plays back correctly
â˜ Transcription returns text
â˜ Text displays in console
```

---

### PHASE 2: Parsing & White-Box (Week 2)

**Goal:** Convert transcript to entities

**Create `src/sceneParser.ts`:**
```typescript
import { CONFIG } from './config'

export interface SceneObject {
  id: string
  name: string
  type: 'prop' | 'character' | 'exit'
  position: { x: number, y: number, z: number }
  description: string
}

export class SceneParser {
  async parseTranscript(text: string): Promise<SceneObject[]> {
    // Option 1: Use Claude API (recommended)
    const prompt = `Parse this scene description into JSON array:
    "${text}"
    
    Return format:
    [
      {
        "id": "unique_id",
        "name": "Object Name",
        "type": "prop",
        "position": {"x": 0, "y": 0, "z": 5},
        "description": "detailed description"
      }
    ]`
    
    const response = await fetch(CONFIG.claude.endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': CONFIG.claude.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    })
    
    const data = await response.json()
    return JSON.parse(data.content[0].text)
    
    // Option 2: Simple keyword-based parsing (fallback)
    // ... implement simple parser if no API available
  }
}
```

**Create `src/whiteboxRenderer.ts`:**
```typescript
import { engine, Entity, Transform, MeshRenderer, Material, 
         TextShape, Billboard, BillboardMode, Vector3, Color4 } from '@dcl/sdk/ecs'

export class WhiteBoxRenderer {
  private placeholders = new Map<string, Entity>()
  
  spawnPlaceholder(obj: any): Entity {
    const entity = engine.addEntity()
    
    // White plane
    MeshRenderer.setPlane(entity)
    Material.setPbrMaterial(entity, {
      albedoColor: Color4.White()
    })
    
    // Position from parsed data
    Transform.create(entity, {
      position: Vector3.create(obj.position.x, obj.position.y, obj.position.z),
      scale: Vector3.create(2, 2, 1)
    })
    
    // Billboard to face camera
    Billboard.create(entity, {
      billboardMode: BillboardMode.BM_Y
    })
    
    // Create text label
    const labelEntity = engine.addEntity()
    Transform.create(labelEntity, {
      position: Vector3.create(obj.position.x, obj.position.y + 1.5, obj.position.z)
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
}
```

**Test Checklist:**
```
â˜ Transcript parses to JSON array
â˜ White planes spawn at positions
â˜ Text labels display correctly
â˜ Billboard faces camera
â˜ Multiple objects spawn correctly
```

---

### PHASE 3: Testing Interface (Week 3-4)

**Goal:** In-game dev UI for adjustments

**Create `src/devUI.tsx`:**
```typescript
import ReactEcs, { UiEntity, Label, Button } from '@dcl/sdk/react-ecs'

export function DevUI({ 
  objects, 
  onMarkReady, 
  onGenerateArt 
}: DevUIProps) {
  return (
    <UiEntity
      uiTransform={{
        width: 400,
        height: 600,
        position: { top: 20, right: 20 }
      }}
      uiBackground={{ color: Color4.create(0, 0, 0, 0.8) }}
    >
      <Label value="ðŸŽ¨ VibeMaster Dev Menu" fontSize={20} />
      
      {objects.map(obj => (
        <UiEntity key={obj.id}>
          <Label value={obj.name} />
          <Button 
            value={obj.readyForArt ? "âœ… Ready" : "Mark Ready"}
            onMouseDown={() => onMarkReady(obj.id)}
          />
        </UiEntity>
      ))}
      
      <Button 
        value="ðŸŽ¨ Generate All Art"
        onMouseDown={onGenerateArt}
      />
    </UiEntity>
  )
}
```

**Test Checklist:**
```
â˜ Dev menu toggles on/off
â˜ Object list displays
â˜ Mark ready changes color
â˜ Buttons respond to clicks
â˜ UI doesn't block gameplay
```

---

### PHASE 4: Art Generation (Week 5-6)

**Goal:** AI generates images, replaces placeholders

**Create `src/artGenerator.ts`:**
```typescript
import { CONFIG } from './config'

export interface StyleTemplate {
  id: string
  basePrompt: string
  artStyle: string
}

export const STYLE_TEMPLATES: Record<string, StyleTemplate> = {
  scumm_classic: {
    id: "scumm_classic",
    basePrompt: "LucasArts adventure game style from 1990s",
    artStyle: "pixel art, 256 colors, VGA era, dithered shadows"
  },
  // Add more templates...
}

export class ArtGenerator {
  buildPrompt(obj: any, template: StyleTemplate): string {
    return `${template.basePrompt}
    
Object: ${obj.description}

Style: ${template.artStyle}
Camera: 3/4 isometric view
Transparent background`
  }
  
  async generateImage(prompt: string): Promise<string> {
    const response = await fetch(CONFIG.openArt.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.openArt.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: prompt,
        width: 512,
        height: 512,
        steps: 30
      })
    })
    
    const data = await response.json()
    return data.imageUrl
  }
  
  applyArt(entity: Entity, imageUrl: string): void {
    Material.setBasicMaterial(entity, {
      texture: Material.Texture.Common({
        src: imageUrl
      })
    })
  }
}
```

**Test Checklist:**
```
â˜ Prompt generates correctly
â˜ API returns image URL
â˜ Image downloads successfully
â˜ Texture applies to entity
â˜ Placeholder replaced with art
```

---

### PHASE 5: Integration (Week 7-8)

**Goal:** Full pipeline working end-to-end

**Create `src/index.ts` (Main Scene):**
```typescript
import { engine } from '@dcl/sdk/ecs'
import { VoiceRecorder } from './voiceRecorder'
import { SceneParser } from './sceneParser'
import { WhiteBoxRenderer } from './whiteboxRenderer'
import { ArtGenerator, STYLE_TEMPLATES } from './artGenerator'
import { setupUI } from './ui'

// Initialize systems
const voiceRecorder = new VoiceRecorder()
const sceneParser = new SceneParser()
const whiteBoxRenderer = new WhiteBoxRenderer()
const artGenerator = new ArtGenerator()

// Scene data
let sceneObjects: any[] = []
let isRecording = false

// Full workflow
async function voiceToGameWorkflow() {
  console.log("ðŸŽ™ï¸ Starting VibeMaster workflow...")
  
  // 1. Record voice
  await voiceRecorder.startRecording()
  console.log("ðŸŽ¤ Recording... (speak now)")
  
  // Wait for user to stop (press button again)
  // ... (implement stop logic)
  
  const audioBlob = await voiceRecorder.stopRecording()
  
  // 2. Transcribe
  console.log("ðŸ“ Transcribing...")
  const transcript = await voiceRecorder.transcribe(audioBlob)
  console.log("Transcript:", transcript)
  
  // 3. Parse
  console.log("ðŸ¤– Parsing scene...")
  sceneObjects = await sceneParser.parseTranscript(transcript)
  console.log("Parsed objects:", sceneObjects.length)
  
  // 4. Spawn white-box
  console.log("ðŸ“¦ Spawning placeholders...")
  sceneObjects.forEach(obj => {
    whiteBoxRenderer.spawnPlaceholder(obj)
  })
  
  console.log("âœ… White-box scene ready! Test gameplay...")
}

// UI setup
setupUI({
  onVoiceRecord: voiceToGameWorkflow,
  onMarkReady: (id) => {
    const obj = sceneObjects.find(o => o.id === id)
    if (obj) obj.readyForArt = true
  },
  onGenerateAllArt: async () => {
    console.log("ðŸŽ¨ Generating art for all ready objects...")
    
    const readyObjects = sceneObjects.filter(o => o.readyForArt)
    
    for (const obj of readyObjects) {
      const template = STYLE_TEMPLATES.scumm_classic
      const prompt = artGenerator.buildPrompt(obj, template)
      const imageUrl = await artGenerator.generateImage(prompt)
      
      obj.generatedImageURL = imageUrl
      
      // Apply to entity
      const entity = whiteBoxRenderer.placeholders.get(obj.id)
      if (entity) {
        artGenerator.applyArt(entity, imageUrl)
      }
      
      console.log(`âœ… Generated art for: ${obj.name}`)
    }
    
    console.log("ðŸŽ‰ All art generated and applied!")
  }
})

// Add input system
engine.addSystem((dt) => {
  // Implement keyboard shortcuts
  // V = voice record
  // E = mark ready
  // G = generate art
})
```

**Test Checklist:**
```
â˜ Full workflow completes without errors
â˜ Voice â†’ White-box works
â˜ White-box â†’ Art generation works
â˜ Gameplay remains unchanged after art applied
â˜ Multiple scenes can be created
```

---

## ðŸŽ® USAGE EXAMPLE

### Creating Your First Scene

**1. Start the scene:**
```bash
npm run start
```

**2. Press V and speak:**
```
"This is a spooky library. Against the back wall is a tall bookshelf 
full of dusty old books. In the center is a wooden desk with a brass 
oil lamp. To the left is a large window with tattered curtains. On 
the right wall hangs a creepy portrait of a Victorian lady."
```

**3. Watch it build:**
```
ðŸŽ¤ Recording...
ðŸ“ Transcribing...
ðŸ¤– Parsing scene...
ðŸ“¦ Spawning placeholders...
âœ… White-box scene ready!
```

**4. Walk around and test:**
- Move character with WASD
- Click objects to interact
- Adjust positions if needed
- Press E to mark objects ready

**5. Generate art:**
```
Press G to generate all art...
ðŸŽ¨ Generating art for: Bookshelf
ðŸŽ¨ Generating art for: Desk
ðŸŽ¨ Generating art for: Lamp
ðŸŽ¨ Generating art for: Window
ðŸŽ¨ Generating art for: Portrait
ðŸŽ‰ All art generated and applied!
```

**6. Ship it!**
```bash
npm run deploy
```

---

## ðŸ’¡ TIPS & BEST PRACTICES

### Voice Descriptions
```
âœ… Good:
"A Victorian mahogany desk with ornate carvings and brass handles"

âŒ Too vague:
"A desk"
```

### Positioning Objects
```
// Use consistent spacing
objects = [
  { position: { x: -5, y: 0, z: 5 } },  // Left wall
  { position: { x: 0, y: 0, z: 0 } },   // Center
  { position: { x: 5, y: 0, z: 5 } }    // Right wall
]
```

### Style Templates
```typescript
// Create variations for different object types
const TEMPLATES = {
  props_realistic: { /* ... */ },
  props_pixel: { /* ... */ },
  characters_cartoon: { /* ... */ },
  backgrounds_painted: { /* ... */ }
}
```

### Performance
```
- Limit to 20-30 objects per room
- Use texture atlas for final build
- Pool entities for reuse
- Cache generated images locally
```

---

## ðŸ› TROUBLESHOOTING

### Common Issues

**Issue: "Microphone permission denied"**
```
Solution: Enable microphone in browser settings
Chrome: chrome://settings/content/microphone
```

**Issue: "Transcription returns empty"**
```
Check:
1. Audio file has content (play it back)
2. API key is valid
3. Network request succeeds
4. Audio format is supported (WAV/MP3)
```

**Issue: "Entities don't spawn"**
```
Check:
1. Position values are valid numbers
2. Engine is initialized
3. Console for errors
4. Transform component created
```

**Issue: "Art generation fails"**
```
Check:
1. API key is valid
2. Prompt is well-formed
3. API rate limits not exceeded
4. Response contains imageUrl field
```

**Issue: "Y is vertical" confusion**
```
Remember in Decentraland:
Vector3.create(x, y, z)
         left/right â†‘  forward/back
         up/down â”€â”€â”€â”˜
```

---

## ðŸ“š FURTHER READING

**Official Documentation:**
- Decentraland SDK7: https://docs.decentraland.org
- ElevenLabs API: https://elevenlabs.io/docs
- OpenArt API: https://openart.ai/docs (TBD)

**Community Resources:**
- Decentraland Discord: https://dcl.gg/discord
- Decentraland Forum: https://forum.decentraland.org
- GitHub Discussions: (create repo)

**Learning Paths:**
1. Complete Decentraland tutorial: https://docs.decentraland.org/creator/tutorials/
2. Read MidniteMansion learnings document
3. Study VibeMaster architecture diagrams
4. Build your first voice-driven scene!

---

## ðŸŽ‰ YOU'RE READY!

You now have everything you need to start building voice-driven games in Decentraland.

**Next Steps:**
1. Set up accounts (ElevenLabs, OpenArt)
2. Get API keys
3. Clone starter project
4. Follow Week 1 implementation
5. Join community for support

**Remember:**
- Start small (single room)
- Test in white-box first
- Generate art only when ready
- Iterate quickly
- Have fun! ðŸš€

---

**Questions? Issues? Ideas?**
- Check troubleshooting section
- Read full documentation
- Ask in community Discord
- Open GitHub issue

**Ready to build the future of game development? Let's go! ðŸŽ®**

---

**Version:** 1.0  
**Last Updated:** November 1, 2025  
**License:** MIT (TBD)
