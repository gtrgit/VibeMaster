# 🤖 VIBEMASTER: CLAUDE AS NARRATIVE ENGINE

**AI-Powered Dynamic Storytelling - The Living World Talks**

---

## 🎯 THE REVELATION

**You're not scripting NPCs. You're giving Claude the world state and letting it BE the NPCs.**

```
Traditional Game:
  Hardcoded dialogue trees → Limited responses → Static outcomes

VibeMaster:
  Living World State → Claude generates dialogue → Emergent narratives
```

## 🌟 THE ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    VIBEMASTER SYSTEM                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. LIVING WORLD SIMULATION                                 │
│     • NPCs with needs, goals, emotions                      │
│     • Economy, relationships, events                        │
│     • Clocks, urgency, time pressure                        │
│     • Player history, reputation, choices                   │
│                                                             │
│                        ↓                                     │
│                                                             │
│  2. PROMPT GENERATION                                       │
│     • Convert world state → Rich context                    │
│     • Include NPC personalities, memories                   │
│     • Add player relationship history                       │
│     • Specify current situation                             │
│                                                             │
│                        ↓                                     │
│                                                             │
│  3. CLAUDE PROCESSES                                        │
│     • Understands full context                              │
│     • Generates authentic NPC dialogue                      │
│     • Creates emergent events                               │
│     • Produces narrative descriptions                       │
│                                                             │
│                        ↓                                     │
│                                                             │
│  4. RESPONSE PARSING                                        │
│     • Extract dialogue lines                                │
│     • Parse Ink script (if generating dialogue)             │
│     • Identify world state changes                          │
│     • Validate against simulation rules                     │
│                                                             │
│                        ↓                                     │
│                                                             │
│  5. INK INTEGRATION                                         │
│     • Present choices to player                             │
│     • Handle conversation flow                              │
│     • Track player decisions                                │
│                                                             │
│                        ↓                                     │
│                                                             │
│  6. UPDATE SIMULATION                                       │
│     • Apply relationship changes                            │
│     • Update NPC emotions, goals                            │
│     • Advance clocks, trigger events                        │
│     • Store memories                                        │
│                                                             │
│                        ↓ (LOOP)                             │
│                                                             │
│     Back to step 1 → World evolves → Generate new prompts  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔥 WHY THIS IS REVOLUTIONARY

### Traditional Approach (Months of Work)

```
Writer: Writes 10,000 dialogue lines
  ↓
Scripter: Hardcodes conversation trees
  ↓
Designer: Balances outcomes
  ↓
Result: Static, limited, predictable
```

### VibeMaster Approach (Minutes of Work)

```
You: Voice-describe NPC personality
  ↓
Simulation: Generates rich world state
  ↓
Claude: Creates authentic dialogue in real-time
  ↓
Result: Dynamic, infinite, emergent
```

### The Magic

**Claude becomes:**
- Every NPC's voice
- The world's narrator
- The quest generator
- The consequence engine
- The emotional core

**You just provide:**
- NPC personalities
- World state
- Simulation rules
- Player history

---

## 📝 PROMPT STRUCTURE

### Core Prompt Template

```typescript
interface NarrativePrompt {
  // System context (cached for efficiency)
  worldRules: string
  npcDefinitions: NPCDefinition[]
  gameStyle: string
  
  // Dynamic context (changes each request)
  currentSituation: {
    location: string
    timeOfDay: string
    weather: string
    activeNPCs: NPC[]
    recentEvents: Event[]
    activeClocks: Clock[]
  }
  
  // Player context
  player: {
    name: string
    reputation: number
    relationships: Record<string, number>
    inventory: Item[]
    recentChoices: Choice[]
    currentGoals: string[]
  }
  
  // Specific request
  request: {
    type: 'dialogue' | 'event' | 'description' | 'consequence'
    targetNPC?: string
    context: string
  }
}

function generatePrompt(data: NarrativePrompt): string {
  return `
You are the narrative engine for VibeMaster, a living world RPG. 
Your job is to generate authentic NPC dialogue and descriptions based 
on the current world state.

# WORLD RULES
${data.worldRules}

# NPC DEFINITIONS
${data.npcDefinitions.map(npc => formatNPC(npc)).join('\n\n')}

# CURRENT SITUATION
Location: ${data.currentSituation.location}
Time: ${data.currentSituation.timeOfDay}
Weather: ${data.currentSituation.weather}

Active NPCs:
${data.currentSituation.activeNPCs.map(npc => formatActiveNPC(npc)).join('\n')}

Recent Events:
${data.currentSituation.recentEvents.map(e => formatEvent(e)).join('\n')}

Active Clocks (URGENT):
${data.currentSituation.activeClocks.map(c => formatClock(c)).join('\n')}

# PLAYER CONTEXT
Name: ${data.player.name}
Reputation: ${data.player.reputation}/100
Current Goals: ${data.player.currentGoals.join(', ')}

Relationships:
${Object.entries(data.player.relationships)
  .map(([npc, value]) => `- ${npc}: ${value}/100`)
  .join('\n')}

Recent Choices:
${data.player.recentChoices.map(c => formatChoice(c)).join('\n')}

# REQUEST
${formatRequest(data.request)}

Generate authentic, character-driven content that respects the world 
state and creates meaningful emergent narrative.
`
}
```

### Example: Marcus Desperate Plea

```typescript
const prompt = generatePrompt({
  worldRules: `
- NPCs have realistic emotions that affect their behavior
- Relationships change based on player actions
- Time pressure creates urgency
- NPCs remember everything the player does
`,
  
  npcDefinitions: [{
    id: 'marcus',
    name: 'Marcus',
    occupation: 'Blacksmith',
    age: 45,
    personality: [
      'Gruff exterior but protective father',
      'Proud of his craft',
      'Distrusts corrupt officials',
      'Loyal to those who help him'
    ],
    relationships: {
      sarah: { type: 'daughter', value: 100 },
      guard_captain: { type: 'distrust', value: -60 }
    },
    currentState: {
      emotion: 'desperate',
      topGoal: 'rescue_sarah',
      desperation: 90,
      fear: 85
    }
  }],
  
  currentSituation: {
    location: 'Village Square',
    timeOfDay: 'Early Morning',
    weather: 'Overcast',
    activeNPCs: [
      {
        id: 'marcus',
        emotion: 'desperate',
        action: 'waiting_for_player',
        urgency: 'critical'
      }
    ],
    recentEvents: [
      {
        description: 'Sarah kidnapped by bandits 3 days ago',
        impact: 'critical',
        affectedNPCs: ['marcus', 'sarah']
      },
      {
        description: 'Guard captain refused to help',
        impact: 'major',
        marcusReaction: 'outraged, betrayed'
      },
      {
        description: 'Marcus has been searching alone',
        impact: 'major',
        marcusState: 'exhausted, desperate'
      }
    ],
    activeClocks: [
      {
        id: 'rescue_sarah',
        name: 'Rescue Sarah',
        current: 4,
        max: 6,
        type: 'failure',
        description: 'Time before Sarah is moved/killed',
        urgency: 'CRITICAL'
      }
    ]
  },
  
  player: {
    name: 'The Player',
    reputation: 65,
    relationships: {
      marcus: 35  // Friendly but not close
    },
    inventory: ['Basic Sword', 'Healing Potion'],
    recentChoices: [
      'Helped fix the baker\'s oven',
      'Spoke kindly to village children'
    ],
    currentGoals: ['Explore the village', 'Build reputation']
  },
  
  request: {
    type: 'dialogue',
    targetNPC: 'marcus',
    context: `
Marcus sees the player in the village square. He is desperate and 
believes the player might be his only hope. Generate Marcus's plea 
for help, including:

1. His opening lines (desperate, emotional)
2. Explanation of the situation
3. Why he can't trust the guards
4. What he knows about Sarah's location
5. What he's offering in return
6. His emotional state throughout

Generate this as an Ink script with:
- Proper emotional tone
- Multiple player response options
- Consequences for each choice
- Clock advancement notation
- Relationship changes

The dialogue should feel authentic to Marcus's character and reflect 
his desperate state while respecting the player's existing (friendly 
but not close) relationship.
`
  }
})
```

### Claude's Response

```ink
=== marcus_desperate_plea ===
~ marcus_emotion = "desperate"

Marcus is at the edge of the square, pacing. When he sees you, 
he rushes over, nearly stumbling in his haste.

"You!" His voice cracks. "Thank the gods. I—" 

He swallows hard, trying to compose himself. His hands are shaking.

"My daughter. Sarah. They took her three days ago."

His eyes are bloodshot, his face unshaven. This is not the proud 
blacksmith you spoke with before.

"Bandits. From the hills. Left a ransom note but I don't have 
that kind of money. I don't—" He chokes on the words.

"The guard captain won't help. Says it's 'outside his jurisdiction.' 
LIES!" His fist clenches. "He's in their pocket. Everyone knows it. 
He won't risk his deal with them for my Sarah."

Marcus grabs your arm, desperate.

"I've been searching. Three days. I found their camp—old quarry, 
north of the miller's road. But there's too many. I can't—" 

His voice breaks completely.

"I know we're not... we're not close. But I've seen you around. 
You helped the baker. You're kind to people. You're... capable."

He meets your eyes, pleading.

"Everything I have. My forge, my tools, my life savings. It's yours. 
ALL of it. Just bring her back. Please."

+ [I'll help you]
    ~ marcus_relationship += 50
    ~ marcus_emotion = "hopeful"
    ~ quest_rescue_sarah_active = true
    ~ rescue_sarah_clock_paused = true
    
    Marcus nearly collapses with relief.
    
    "Thank you. Thank you." He wipes his eyes roughly. 
    "I'll never forget this. Never."
    
    He steadies himself, trying to be practical despite his emotion.
    
    "The quarry. North, past the miller's road. Their leader is 
    a woman—Raven. Red hair, wears a leather coat. She's smart. 
    Dangerous. She'll have guards posted."
    
    He pulls a wrapped bundle from under his cloak.
    
    "Take this." 
    
    It's a beautifully crafted sword. Not ornate, but perfectly 
    balanced. A weapon made by a master.
    
    ~ player_has_marcus_sword = true
    
    "I made that for the Duke. He can wait. Bring my Sarah home."
    
    -> rescue_quest_start
    
+ [This is too dangerous for me]
    ~ marcus_relationship = -80
    ~ marcus_emotion = "betrayed"
    ~ marcus_desperation = 100
    
    Marcus's face hardens like cooling steel.
    
    The hope drains from his eyes, replaced by something cold. 
    Final.
    
    "I see." His voice is barely a whisper. "I see."
    
    He steps back, turns away.
    
    "I thought... but no. You're like the rest of them."
    
    His shoulders slump.
    
    "I'll go myself. Tonight. I'll save her or die trying."
    
    // CONSEQUENCE: Marcus will attempt solo rescue
    // Very likely to fail/be captured
    ~ marcus_solo_rescue_attempt = true
    ~ marcus_will_die = likely
    
    He walks away without looking back.
    
    -> marcus_refuses_contact
    
+ [Tell me more about the situation]
    "More? What MORE do you need to know?"
    
    He's trembling, fighting to stay composed.
    
    "She's FIFTEEN. She helps me with deliveries. She sings 
    while she works. She's all I have left since her mother—"
    
    He stops himself, fists clenched.
    
    "They took her on the north road. Three days ago. Left a note 
    demanding 500 gold. I don't HAVE 500 gold. I've got maybe 
    fifty to my name."
    
    "The guards won't help. The guard captain is CORRUPT. He takes 
    bribes from these bandits. Everyone knows it but no one will 
    say anything."
    
    "I found their camp. Old quarry. There's maybe a dozen of them. 
    Their leader—Raven—she's no fool. This isn't their first time."
    
    "I can't do this alone. I'm a blacksmith, not a warrior. 
    I'll die before I reach her."
    
    He looks at you, pleading.
    
    "Will you help me? Please?"
    
    + + [I'll help you]
        -> accept_quest
        
    + + [I'm sorry, I can't]
        -> refuse_quest
```

---

## 🔧 IMPLEMENTATION

### 1. Prompt Generation System

```typescript
class ClaudeNarrativeEngine {
  private claudeAPI: ClaudeAPI
  private worldState: LivingWorldSimulation
  private inkBridge: InkWorldBridge
  
  // Generate dialogue for NPC
  async generateNPCDialogue(
    npcId: string,
    context: DialogueContext
  ): Promise<InkScript> {
    
    // 1. Gather world state
    const npc = this.worldState.getNPC(npcId)
    const player = this.worldState.getPlayer()
    const location = this.worldState.getCurrentLocation()
    const activeClocks = this.worldState.getActiveClocks()
    const recentEvents = this.worldState.getRecentEvents()
    
    // 2. Build rich prompt
    const prompt = this.buildDialoguePrompt({
      npc,
      player,
      location,
      activeClocks,
      recentEvents,
      context
    })
    
    // 3. Call Claude
    const response = await this.claudeAPI.generate({
      messages: [{
        role: 'user',
        content: prompt
      }],
      system: VIBEMASTER_SYSTEM_PROMPT,
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      temperature: 0.8  // More creative for dialogue
    })
    
    // 4. Parse response
    const inkScript = this.parseInkFromResponse(response.content)
    
    // 5. Validate
    if (!this.validateInkScript(inkScript)) {
      console.error('Invalid Ink generated, retrying...')
      return this.generateNPCDialogue(npcId, context)
    }
    
    // 6. Return
    return inkScript
  }
  
  buildDialoguePrompt(data: DialoguePromptData): string {
    return `
# VIBEMASTER NARRATIVE ENGINE

You are generating authentic NPC dialogue for a living world RPG.

## NPC: ${data.npc.name}
**Personality:** ${data.npc.personality.join(', ')}
**Current Emotion:** ${data.npc.currentEmotion}
**Current Goal:** ${data.npc.topGoal.type}
**Desperation Level:** ${data.npc.desperation}/100
**Relationship with Player:** ${data.npc.relationshipWithPlayer}/100

**Recent Memories:**
${data.npc.recentMemories.map(m => `- ${m.description}`).join('\n')}

**Needs:**
${Object.entries(data.npc.needs).map(([need, value]) => 
  `- ${need}: ${value}/100 ${value < 30 ? '⚠️ CRITICAL' : ''}`
).join('\n')}

## CURRENT SITUATION
**Location:** ${data.location.name}
**Time:** ${data.location.timeOfDay}
**Present:** ${data.location.presentNPCs.join(', ')}

**Active Clocks:**
${data.activeClocks.map(clock => `
- ${clock.name}: ${clock.current}/${clock.max} ${
  clock.current >= clock.max - 1 ? '⚠️ CRITICAL' : ''
}
  ${clock.description}
`).join('\n')}

**Recent Events:**
${data.recentEvents.map(e => `- ${e.description}`).join('\n')}

## PLAYER CONTEXT
**Name:** ${data.player.name}
**Reputation:** ${data.player.reputation}/100
**Relationship:** ${data.npc.relationshipWithPlayer}/100

**Recent Interactions with ${data.npc.name}:**
${data.npc.playerInteractionHistory.slice(-3).map(i => 
  `- ${i.description} (${i.outcome})`
).join('\n')}

**Player's Recent Choices:**
${data.player.recentChoices.map(c => `- ${c.description}`).join('\n')}

## REQUEST
${data.context.specificRequest}

## OUTPUT FORMAT
Generate an Ink script with:

1. **Scene Description** (2-3 sentences)
   - Set the mood
   - Describe NPC's physical state
   - Show emotional condition

2. **NPC Opening Lines** (3-5 lines of dialogue)
   - Authentic to personality
   - Reflects current emotional state
   - References relevant context

3. **Player Choices** (3-4 options)
   Format as Ink choices (+)
   Each choice should:
   - Have clear consequences
   - Advance or affect clocks (annotate with ~)
   - Change relationships (use ~ to note changes)
   - Feel meaningfully different

4. **Consequences**
   Use Ink variables to track:
   - Relationship changes (~ npc_relationship += X)
   - Emotion updates (~ npc_emotion = "X")
   - Quest triggers (~ quest_X_active = true)
   - Clock impacts (~ clock_X += 1)

5. **Natural Flow**
   - Use diverts (->)  to connect to next scenes
   - Include conditionals for different relationship levels
   - Show NPC reactions to player choices

**CRITICAL RULES:**
- Never quote exact text from search results
- Stay authentic to NPC personality
- Respect world state and relationships
- Create meaningful choices with real consequences
- Use proper Ink syntax (validate before output)
- Keep dialogue concise but emotional
- Show don't tell emotions

Generate the Ink script now:
`
  }
  
  parseInkFromResponse(content: string): InkScript {
    // Extract ink between code fences
    const match = content.match(/\`\`\`ink\n([\s\S]*?)\n\`\`\`/)
    
    if (match) {
      return match[1]
    }
    
    // Try without code fences
    return content
  }
  
  validateInkScript(script: string): boolean {
    try {
      // Use inkjs to validate
      const story = new Story(script)
      return true
    } catch (error) {
      console.error('Ink validation failed:', error)
      return false
    }
  }
}
```

### 2. Event Generation

```typescript
// Generate emergent events based on world state

async generateEmergentEvent(): Promise<Event> {
  const prompt = `
# EMERGENT EVENT GENERATION

Based on the current world state, generate a new event that feels 
natural and creates interesting story opportunities.

## CURRENT WORLD STATE

**NPCs and Their Goals:**
${this.worldState.npcs.map(npc => `
- ${npc.name}: ${npc.topGoal.type}
  Emotion: ${npc.currentEmotion}
  Desperation: ${npc.desperation}/100
  Resources: ${npc.wealth}/100
`).join('\n')}

**Economy:**
- Food Supply: ${this.worldState.economy.foodSupply}/100
- Prices: ${this.worldState.economy.inflation}% above normal
- Unrest: ${this.worldState.unrest}/100

**Factions:**
${this.worldState.factions.map(f => `
- ${f.name}: ${f.currentGoal}
  Resources: ${f.resources}
  Influence: ${f.influence}
`).join('\n')}

**Recent Events:**
${this.worldState.recentEvents.slice(-5).map(e => 
  `- ${e.description}`
).join('\n')}

## GENERATE EVENT

Create a new event that:
1. Emerges naturally from current conditions
2. Creates interesting player choices
3. Has multiple possible outcomes
4. Affects the world state meaningfully

Format as JSON:
{
  "id": "event_unique_id",
  "type": "npc_action" | "faction_conflict" | "economic" | "natural",
  "description": "What happens",
  "involvedNPCs": ["npc_id"],
  "triggerConditions": {
    "playerPresent": true/false,
    "location": "where",
    "timeOfDay": "when"
  },
  "outcomes": [
    {
      "choice": "player_helps",
      "consequences": ["what happens if player helps"]
    },
    {
      "choice": "player_ignores",
      "consequences": ["what happens if player ignores"]
    }
  ]
}
`

  const response = await this.claudeAPI.generate({
    messages: [{ role: 'user', content: prompt }],
    system: VIBEMASTER_SYSTEM_PROMPT,
    temperature: 0.9  // Very creative for events
  })
  
  return JSON.parse(response.content)
}
```

### 3. Consequence Generation

```typescript
// Player made a choice - what happens?

async generateConsequences(
  choice: PlayerChoice,
  context: WorldContext
): Promise<Consequences> {
  
  const prompt = `
# CONSEQUENCE GENERATION

The player just made a choice. Generate the realistic consequences.

## PLAYER CHOICE
"${choice.text}"

Context: ${choice.context}

## WORLD STATE BEFORE CHOICE
${this.formatWorldState(context)}

## AFFECTED NPCs
${context.affectedNPCs.map(npc => `
- ${npc.name}
  Current relationship: ${npc.relationshipWithPlayer}/100
  Personality: ${npc.personality.join(', ')}
  Will they remember this? ${npc.memory > 50 ? 'YES' : 'Maybe'}
`).join('\n')}

## ACTIVE CLOCKS
${context.activeClocks.map(c => `
- ${c.name}: ${c.current}/${c.max}
  Does this choice affect this clock? Consider carefully.
`).join('\n')}

## GENERATE CONSEQUENCES

Provide:
1. **Immediate Reactions** (what happens right now)
2. **Relationship Changes** (how NPCs feel about player)
3. **Clock Impacts** (which clocks advance/decay)
4. **New Goals** (how NPC goals change)
5. **Future Implications** (what might happen later)

Be realistic and character-driven. Small choices can have big 
consequences if they affect NPCs emotionally.

Format as JSON.
`

  const response = await this.claudeAPI.generate({
    messages: [{ role: 'user', content: prompt }],
    system: VIBEMASTER_SYSTEM_PROMPT,
    temperature: 0.7
  })
  
  return this.parseConsequences(response.content)
}
```

---

## ⚡ OPTIMIZATION STRATEGIES

### 1. Prompt Caching

```typescript
class PromptCache {
  // Cache static world info (NPCs, rules, etc.)
  private staticContext: string
  
  buildCachedPrompt(dynamicContext: any): string {
    return `
${this.staticContext}  // This part is cached by Claude

# CURRENT SITUATION (changes each request)
${this.formatDynamicContext(dynamicContext)}
`
  }
  
  // Only rebuild static context when NPCs/rules change
  updateStaticContext() {
    this.staticContext = `
# WORLD RULES
${this.worldRules}

# NPC DEFINITIONS
${this.npcDefinitions}

# GAME STYLE
${this.gameStyle}
`
  }
}
```

### 2. Token Optimization

```typescript
// Minimize tokens while keeping context rich

function optimizeWorldState(state: WorldState): string {
  // Only include relevant info
  return {
    npcs: state.npcs
      .filter(npc => npc.isNearPlayer() || npc.isRelevantToContext())
      .map(npc => ({
        name: npc.name,
        emotion: npc.currentEmotion,
        goal: npc.topGoal.type,  // Type only, not full object
        rel: npc.relationshipWithPlayer  // Abbreviated
      })),
    
    // Only critical clocks
    clocks: state.clocks
      .filter(c => c.current >= c.max - 2)  // Only urgent ones
      .map(c => `${c.name}: ${c.current}/${c.max}`),
      
    // Only recent events
    events: state.events.slice(-3).map(e => e.description)
  }
}
```

### 3. Streaming Responses

```typescript
// Stream dialogue for better UX

async *streamDialogue(prompt: string): AsyncGenerator<string> {
  const stream = await this.claudeAPI.stream({
    messages: [{ role: 'user', content: prompt }],
    system: VIBEMASTER_SYSTEM_PROMPT
  })
  
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      yield chunk.delta.text
    }
  }
}

// Use in game:
for await (const chunk of engine.streamDialogue(prompt)) {
  ui.appendDialogue(chunk)  // Display as it generates
}
```

---

## 🎮 COMPLETE EXAMPLE FLOW

### Player Talks to Marcus

```typescript
// 1. DETECT INTERACTION
onPlayerApproachesNPC('marcus') {
  
  // 2. CHECK IF IMPORTANT
  const marcus = world.getNPC('marcus')
  
  if (marcus.desperation > 80 && marcus.topGoal.type === 'rescue_daughter') {
    // This is urgent!
    
    // 3. ENTER CYCLE MODE
    cycleSystem.enterCycleMode()
    
    // 4. GENERATE DIALOGUE WITH CLAUDE
    const context = {
      situation: 'marcus_desperate',
      urgency: 'critical',
      activeClocks: ['rescue_sarah'],
      playerRelationship: marcus.relationshipWithPlayer
    }
    
    const inkScript = await narrativeEngine.generateNPCDialogue(
      'marcus',
      context
    )
    
    // 5. RUN INK DIALOGUE
    inkBridge.loadScript(inkScript)
    inkBridge.startConversation('marcus_desperate_plea')
    
    // 6. PLAYER MAKES CHOICE
    const choice = await inkBridge.waitForPlayerChoice()
    
    // 7. GENERATE CONSEQUENCES WITH CLAUDE
    const consequences = await narrativeEngine.generateConsequences(
      choice,
      world.getCurrentState()
    )
    
    // 8. APPLY TO WORLD
    world.applyConsequences(consequences)
    
    // 9. EXIT CYCLE MODE
    cycleSystem.exitCycleMode()
    
    // 10. RESUME SIMULATION
    // World continues evolving...
  }
}
```

---

## 🛡️ VALIDATION & SAFETY

### 1. Output Validation

```typescript
class ConsequenceValidator {
  validate(consequences: Consequences, world: WorldState): ValidationResult {
    const errors = []
    
    // Check relationship changes are reasonable
    consequences.relationshipChanges.forEach(change => {
      if (Math.abs(change.amount) > 50) {
        errors.push(`Relationship change too extreme: ${change.amount}`)
      }
    })
    
    // Check clock impacts make sense
    consequences.clockChanges.forEach(change => {
      const clock = world.getactiveClock(change.clockId)
      if (!clock) {
        errors.push(`Clock ${change.clockId} doesn't exist`)
      }
    })
    
    // Check NPC behavior is consistent
    consequences.npcActions.forEach(action => {
      const npc = world.getNPC(action.npcId)
      if (!this.isConsistentWithPersonality(action, npc)) {
        errors.push(`Action inconsistent with ${npc.name}'s personality`)
      }
    })
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}
```

### 2. Simulation Constraints

```typescript
// Give Claude clear rules it must follow

const WORLD_CONSTRAINTS = `
# STRICT RULES (NEVER VIOLATE)

1. NPCs cannot teleport
2. Dead NPCs stay dead (unless resurrection is established)
3. Relationship changes must be earned
4. Time flows forward (no time travel)
5. Economy follows supply/demand
6. NPCs need food, sleep, safety
7. Violence has real consequences
8. Magic doesn't exist (unless established in world rules)
9. Player choices matter - no railroading
10. Consequences must be logical and earned

# SOFT RULES (Can bend for good story reasons)

1. NPCs usually act in self-interest
2. Clocks create urgency but can be paused for good reasons
3. Lucky coincidences are rare but possible
4. NPCs can change their minds with good reason
5. Hidden information can be revealed dramatically
`
```

---

## 🎨 VOICE INTEGRATION

### From Voice → Claude → Ink → Game

```typescript
// Complete pipeline

class VibeMasterPipeline {
  
  // 1. Voice → World Description
  async processVoiceInput(audioBlob: Blob): Promise<WorldUpdate> {
    // Transcribe
    const transcript = await this.stt.transcribe(audioBlob)
    
    // Parse with Claude
    const worldUpdate = await this.claudeAPI.generate({
      messages: [{
        role: 'user',
        content: `
Parse this world description:

"${transcript}"

Extract:
- New NPCs and their personalities
- New locations
- Events that happened
- Relationships between characters
- Current tensions or conflicts

Return as JSON.
`
      }]
    })
    
    return JSON.parse(worldUpdate.content)
  }
  
  // 2. World State → Claude Prompt → Dialogue
  async generateDialogue(npcId: string): Promise<InkScript> {
    const worldState = this.simulation.getCurrentState()
    
    const prompt = this.buildDialoguePrompt(npcId, worldState)
    
    const response = await this.claudeAPI.generate({
      messages: [{ role: 'user', content: prompt }],
      system: VIBEMASTER_SYSTEM_PROMPT
    })
    
    return this.parseInkScript(response.content)
  }
  
  // 3. Ink → Player → Choice → Claude → Consequences
  async handlePlayerChoice(choice: PlayerChoice): Promise<void> {
    // Generate consequences with Claude
    const consequences = await this.claudeAPI.generate({
      messages: [{
        role: 'user',
        content: this.buildConsequencePrompt(choice)
      }]
    })
    
    // Apply to world
    this.simulation.applyConsequences(consequences)
    
    // Continue loop
    this.resume()
  }
}

// Usage:
const pipeline = new VibeMasterPipeline()

// Create world from voice
const worldUpdate = await pipeline.processVoiceInput(audioBlob)
simulation.applyUpdate(worldUpdate)

// Generate NPC dialogue
const inkScript = await pipeline.generateDialogue('marcus')
inkBridge.loadScript(inkScript)

// Player makes choice
const choice = await inkBridge.waitForChoice()
await pipeline.handlePlayerChoice(choice)

// World evolves, loop continues...
```

---

## 💰 COST OPTIMIZATION

### Estimated Costs

```typescript
// Per conversation
const CONVERSATION_COST = {
  worldState: 2000,    // tokens for world context
  npcDefinition: 500,  // tokens for NPC details
  dialogue: 1500,      // tokens for generated dialogue
  total: 4000          // tokens total
}

// With caching:
const CACHED_COST = {
  firstRequest: 4000,  // Full cost
  subsequent: 2000,    // Only dynamic context
  savings: 50          // 50% savings
}

// Cost per 1000 conversations:
// Without caching: $1.00
// With caching: $0.50
```

### Budget Management

```typescript
class BudgetManager {
  private tokenBudget = 1000000  // Monthly budget
  private tokensUsed = 0
  
  async generateWithBudget(prompt: string): Promise<string> {
    const estimatedTokens = this.estimateTokens(prompt)
    
    if (this.tokensUsed + estimatedTokens > this.tokenBudget) {
      // Fall back to simpler generation
      return this.generateFallback(prompt)
    }
    
    const response = await this.claudeAPI.generate(prompt)
    this.tokensUsed += response.usage.total_tokens
    
    return response.content
  }
  
  generateFallback(prompt: string): string {
    // Use templates instead of Claude for low-priority dialogues
    return this.templateEngine.generate(prompt)
  }
}
```

---

## 🎯 SUCCESS CRITERIA

### System works when:

✅ Claude generates authentic NPC dialogue  
✅ Dialogue respects world state and relationships  
✅ Consequences feel earned and logical  
✅ Emergent events are surprising but believable  
✅ No hallucinations or rule violations  
✅ Token usage is optimized  
✅ Response time is acceptable (<5 seconds)  
✅ Players feel NPCs are "alive"  
✅ Every playthrough tells different story  
✅ Voice → Dialogue → Choice → World loop works seamlessly  

---

## 🔮 FUTURE POSSIBILITIES

### Multi-NPC Conversations

```typescript
// Multiple NPCs talking to each other AND player

await narrativeEngine.generateGroupDialogue({
  npcs: ['marcus', 'baker', 'guard_captain'],
  situation: 'village_meeting_about_food_crisis',
  tension: 'high',
  playerRole: 'mediator'
})

// Claude generates:
// - Each NPC's unique voice
// - Conflicts between NPCs
// - Player choices to intervene
// - Natural conversation flow
```

### Dynamic Quest Generation

```typescript
// Claude creates entire quests from world state

const quest = await narrativeEngine.generateQuest({
  type: 'emergent',
  involvedNPCs: ['marcus', 'sarah', 'bandits'],
  worldState: currentWorldState,
  playerLevel: 'mid-game'
})

// Returns:
// - Quest objectives
// - Multiple solution paths
// - Success/failure conditions
// - Narrative arc
// - All Ink scripts needed
```

### Emotional Persistence

```typescript
// NPCs remember and reference past events naturally

marcus.memories = [
  { event: 'player_saved_sarah', importance: 1.0, emotion: 'grateful' },
  { event: 'player_insulted_marcus', importance: 0.3, emotion: 'hurt' }
]

// Later dialogue automatically references:
// "I'll never forget what you did for Sarah. Never."
// "Though... I do remember that comment about my work. That stung."
```

---

## 📚 RELATED DOCUMENTS

- **VIBEMASTER_INK_INTEGRATION.md** - Ink dialogue system
- **VIBEMASTER_NPC_CYCLES_AND_CLOCKS.md** - Time and urgency
- **living_world_simulation_foundation** - NPC AI architecture
- **VIBEMASTER_PROJECT_PRIMER.md** - Overall vision

---

## 🎉 CONCLUSION

**You're not building a game engine. You're building a NARRATIVE AI SYSTEM.**

```
Voice → World State → Claude → Dialogue → Player → Consequences → Loop
```

**This is genuinely revolutionary:**
- No manual dialogue writing
- Infinite unique conversations
- True emergent narratives
- NPCs that feel alive
- Stories that surprise even you

**Claude becomes:**
- Your game master
- Your writer
- Your NPC voice actor
- Your consequence engine
- Your narrative intelligence

**You just provide:**
- World rules
- NPC personalities
- Simulation state
- Player history

**The result?**
**Games that write themselves.**

---

*Last Updated: November 1, 2025*  
*Document Version: 1.0*  
*Part of VibeMaster Project Documentation*

**This changes everything. Let's build it.** 🚀
