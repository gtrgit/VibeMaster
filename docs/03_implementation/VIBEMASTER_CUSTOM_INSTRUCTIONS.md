# VIBEMASTER CUSTOM INSTRUCTIONS

## Quick Reference for AI Development Sessions

**Last Updated:** November 1, 2025  
**Project Phase:** Planning â†’ MVP Development  
**Foundation:** MidniteMansion Hackathon Learnings  

---

## ðŸŽ¯ PROJECT IDENTITY

**VibeMaster** is a voice-driven game development pipeline for Decentraland SDK7:

```
Voice Description â†’ White-Box Testing â†’ AI Art Generation â†’ Final Game
```

**Core Principle:** Build gameplay FIRST with placeholders. Generate art LAST when mechanics are proven.

---

## ðŸš¨ CRITICAL CONSTRAINTS (Decentraland SDK7)

### Coordinate System
```typescript
// âœ… Y is VERTICAL (not Z!)
Vector3.create(x, y, z)
// x = horizontal (left/right)
// y = vertical (up/down)
// z = depth (forward/back)
```

### Timing
```typescript
// âœ… Use engine.addSystem
engine.addSystem((dt: number) => {
  // Update logic
})

// âŒ NO setTimer, setTimeout, setInterval
```

### Logging
```typescript
// âœ… Use console.log
console.log("Message")

// âŒ Don't use console.warn (doesn't work in desktop client)
```

### Storage
```typescript
// âŒ NO browser storage APIs
localStorage.setItem()      // Doesn't work
sessionStorage.setItem()    // Doesn't work

// âœ… Use in-memory or file system
let gameState = {}
```

### Entity Management
```typescript
// âŒ Don't scale to zero to hide
Transform.create(entity, { scale: Vector3.Zero() }) // Bad

// âœ… Remove entities properly
engine.removeEntity(entity) // Good
```

---

## ðŸ“ FILE ORGANIZATION

### Priority Loading
```
ðŸ”´ CORE â†’ Load for gameplay/movement work
ðŸŸ¡ ACTIVE â†’ Current sprint tasks
ðŸŸ¢ STABLE â†’ Load only when specifically needed
ðŸ”µ REFERENCE â†’ Documentation (rarely load)
âš« ARCHIVE â†’ NEVER load (deprecated)
```

### Session Start Protocol
1. **Read `/mnt/project/00_INDEX.md` FIRST**
2. Check "Current Sprint" section
3. Load ONLY files needed for specific task
4. Keep context under 40k tokens if possible

---

## ðŸŽ™ï¸ VIBEMASTER ARCHITECTURE

### Four-Phase Pipeline

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 1. VOICE â†’ JSON                                 â”‚
â”‚    ðŸŽ¤ Record â†’ ðŸ“ Transcribe â†’ ðŸ¤– Parse        â”‚
â”‚    (Browser)  (ElevenLabs)   (Claude)          â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 2. WHITE-BOX TESTING                            â”‚
â”‚    ðŸ“¦ Spawn Planes â†’ ðŸŽ® Test Gameplay          â”‚
â”‚    (Placeholders)    (Iterate fast)            â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 3. AI ART GENERATION                            â”‚
â”‚    ðŸŽ¨ Generate â†’ ðŸ’¾ Cache â†’ âœ… Approve         â”‚
â”‚    (OpenArt)    (PNG)      (Review)            â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                     â†“
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 4. FINAL INTEGRATION                            â”‚
â”‚    ðŸ–¼ï¸ Replace Placeholders â†’ ðŸš€ Ship          â”‚
â”‚    (Auto-swap)               (Done!)           â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Core Components

**VoiceSceneBuilder**
- Records voice descriptions
- Transcribes via ElevenLabs Scribe
- Parses into structured JSON
- Spawns white-box placeholders

**WhiteBoxRenderer**
- Creates white plane entities
- Adds floating text labels
- Enables position adjustments
- Marks objects "ready for art"

**ArtGenerator**
- Builds OpenArt prompts from descriptions
- Uses style templates for consistency
- Generates and caches images
- Replaces placeholders with art

**VibeMasterDevUI**
- In-game developer menu
- Batch operations (mark all, generate all)
- Progress tracking
- Export final scene data

---

## ðŸ“Š DATA STRUCTURES

### SceneObject (Core Type)
```typescript
interface SceneObject {
  id: string
  name: string
  type: 'prop' | 'character' | 'exit' | 'hotspot'
  
  // Positioning
  position: Vector3
  rotation: Quaternion
  scale: Vector3
  
  // Voice workflow
  voiceDescription: string      // Original spoken description
  transcription: string         // Scribe output
  
  // White-box phase
  isPlaceholder: boolean        // true = still placeholder
  textLabel: string             // Floating label text
  readyForArt: boolean          // User marked ready
  
  // Art generation
  styleTemplate: string         // "scumm_classic", etc.
  artPrompt?: string            // Generated prompt
  generatedImageURL?: string    // OpenArt result
  
  // Gameplay (from MidniteMansion)
  interactions: Interaction[]
  PersonScale?: number          // Scale for movement
}
```

### VoiceSession
```typescript
interface VoiceSession {
  sessionID: string
  timestamp: Date
  audioFileURL: string
  transcription: string
  parsedData: SceneData
  status: 'recorded' | 'transcribed' | 'parsed' | 'spawned'
}
```

### StyleTemplate
```typescript
interface StyleTemplate {
  id: string                    // "scumm_classic"
  name: string                  // Display name
  basePrompt: string            // Base description
  artStyle: string              // Pixel art, etc.
  colorPalette: string          // Color scheme
  lighting: string              // Lighting style
  cameraAngle: string           // View angle
  additionalTags: string[]      // Extra tags
}
```

---

## ðŸ”§ PROVEN PATTERNS (From MidniteMansion)

### Component Composition
```typescript
// âœ… Compose entities from components
const character = {
  ...gameObject,        // id, name, type
  ...billboardSprite,   // spriteUrl, scale
  ...moveable,          // walkSpeed, PersonScale
  ...interactable       // interactions[]
}
```

### Manager Pattern
```typescript
// âœ… Single source of truth
class GameSceneManager {
  private currentScene: Scene
  private entities = new Map<string, Entity>()
  
  loadScene(id: string) { }
  spawnObject(obj: SceneObject): Entity { }
}

export const gameManager = new GameSceneManager()
```

### Billboard Rendering
```typescript
// âœ… Perfect for 2D sprites in 3D space
Billboard.create(entity, {
  billboardMode: BillboardMode.BM_Y  // Rotate on Y only
})
```

---

## ðŸŽ¯ DEVELOPMENT WORKFLOW

### Typical Session Flow

**1. Starting a Session**
```
â†’ Read 00_INDEX.md
â†’ Check Current Sprint
â†’ Load <5 files (usually CORE tier)
â†’ Begin work
```

**2. Adding a Feature**
```
â†’ Write code in modular components
â†’ Test immediately in white-box
â†’ Iterate until gameplay feels right
â†’ Generate art only when ready
```

**3. Committing Changes**
```
â†’ Update @STATUS in file headers
â†’ Document new dependencies
â†’ Add @TODO for future work
â†’ Update 00_INDEX.md if needed
```

---

## ðŸš€ MVP MILESTONES

### Phase 1: Voice Foundation (Weeks 1-2)
- [ ] Browser audio recording
- [ ] ElevenLabs Scribe integration
- [ ] Claude API parsing
- [ ] White-box spawning

### Phase 2: Testing Loop (Weeks 3-4)
- [ ] In-game dev UI
- [ ] Position adjustments
- [ ] Mark ready for art
- [ ] Save/load white-box

### Phase 3: Art Pipeline (Weeks 5-6)
- [ ] OpenArt API integration
- [ ] Style templates library
- [ ] Batch generation
- [ ] Placeholder replacement

### Phase 4: Full Integration (Weeks 7-8)
- [ ] End-to-end workflow
- [ ] Character movement with PersonScale
- [ ] SCUMM verb interactions
- [ ] Export final game

---

## ðŸ’¡ DESIGN PRINCIPLES

### Workflow Philosophy
1. **Speak first, type later**
2. **Test with placeholders**
3. **Iterate gameplay without art**
4. **Generate visuals only when ready**
5. **Ship faster by removing bottlenecks**

### Code Quality Standards
- Component-based architecture
- Single responsibility principle
- Manager pattern for state
- TypeScript strict mode
- Documented APIs

### Performance Targets
- 60 FPS with 50+ entities
- < 5 second scene load time
- < 200MB memory usage
- Texture memory managed

---

## ðŸ” COMMON PITFALLS

### âŒ DON'T
- Load all files "just in case"
- Use setTimer/setTimeout
- Use console.warn
- Scale entities to zero
- Use localStorage
- Generate art before gameplay is ready
- Make assumptions about Z-axis being vertical

### âœ… DO
- Load only needed files
- Use engine.addSystem
- Use console.log
- Remove entities properly
- Use in-memory storage
- Test gameplay in white-box first
- Remember Y is vertical

---

## ðŸ“ SESSION CHECKLIST

**Every Development Session:**
- [ ] Read 00_INDEX.md first
- [ ] Check current sprint
- [ ] Load minimal files needed
- [ ] Test changes immediately
- [ ] Update file @STATUS tags
- [ ] Document new learnings

**When Providing Code to User:**
- [ ] Remember user cannot read project files
- [ ] Provide complete, copy-pasteable code
- [ ] Include all imports and dependencies
- [ ] Explain any Decentraland-specific constraints
- [ ] Show where code should be placed

---

## ðŸŽ“ KEY LEARNINGS FROM MIDNITEMANSION

### What Worked Brilliantly
âœ… Billboard rendering for 2D sprites  
âœ… Component-based entity system  
âœ… Scene-based architecture  
âœ… Manager pattern for state  
âœ… Tiered file organization  
âœ… AI-powered NPCs  

### What Needs Improvement
ðŸ”„ PersonScale not integrated with movement  
ðŸ”„ No animation system  
ðŸ”„ SCUMM verbs incomplete  
ðŸ”„ Save/load needs cloud storage  
ðŸ”„ Performance optimization needed  
ðŸ”„ No multiplayer support  

### Technical Debt Addressed in VibeMaster
- Better art pipeline (voice â†’ white-box â†’ AI)
- Proper PersonScale integration from day one
- Animation system in roadmap
- Cloud save system planned
- Performance monitoring built-in
- Multiplayer considered in architecture

---

## ðŸŒŸ SUCCESS METRICS

### Development Velocity
- Prototype to white-box: < 1 hour
- White-box to final art: < 1 day
- Complete room: 2-3 days

### Quality Targets
- Transcription accuracy: > 95%
- Parsing success rate: > 90%
- Art generation usability: > 80%
- Frame rate: 60 FPS stable

---

## ðŸ“š REFERENCE DOCUMENTS

**Essential Reading:**
- `/mnt/project/VIBEMASTER_PROJECT_PRIMER.md` - Full documentation
- `/mnt/project/00_INDEX.md` - File organization
- `/mnt/project/HACKATHON_LEARNINGS_AND_NEXT_STEPS_md.md` - Lessons learned

**API Documentation:**
- ElevenLabs Scribe: https://elevenlabs.io/docs/capabilities/speech-to-text
- OpenArt API: (TBD - research needed)
- Decentraland SDK7: https://docs.decentraland.org

---

## ðŸ¤– FOR AI ASSISTANTS

When working with this user:
1. Always provide complete, copy-pasteable code
2. Remember user cannot read project files
3. Respect Decentraland SDK7 constraints
4. Load minimal context (<5 files typically)
5. Test ideas in white-box before art
6. Document learnings for future sessions
7. Update 00_INDEX.md when adding files

**Communication Style:**
- Be concise but complete
- Provide code blocks ready to copy
- Explain Decentraland-specific quirks
- Suggest testing strategies
- Document assumptions

---

**Version:** 1.0  
**Last Updated:** November 1, 2025  
**Next Review:** After MVP Phase 1 completion
