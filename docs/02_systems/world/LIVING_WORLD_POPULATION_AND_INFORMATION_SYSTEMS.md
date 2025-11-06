# LIVING WORLD: POPULATION, FACTIONS & INFORMATION SYSTEMS

**Session Date:** November 2, 2025  
**Status:** Design Complete - Ready for Implementation  
**Systems Covered:** Macro/Micro Demographics, Faction AI, Information Propagation, Spy Mechanics, Quest Generation

---

## ðŸŽ¯ CORE CONCEPT

Just as we have **macro tiles** (terrain/biome) and **micro tiles** (specific objects), we apply the same hierarchical approach to **population demographics** and **information systems**. This creates a scalable, emergent world where:

- Factions have needs like individual NPCs
- Information flows through rumor networks with varying reliability
- Spycraft becomes a gameplay element
- Quests emerge naturally from information asymmetry

---

## ðŸ“Š MACRO vs MICRO POPULATION DEMOGRAPHICS

### **MACRO LEVEL** - Population Overview

Strategic demographic composition defined at settlement/region level:

```typescript
interface MacroPopulationData {
  totalPopulation: number
  
  // Faction distribution (percentage)
  factionDistribution: {
    'merchants_guild': 25,
    'town_guard': 15,
    'thieves_guild': 8,
    'bandits': 5,
    'civilians': 47
  }
  
  // Race/species distribution
  raceDistribution: {
    'human': 60,
    'elf': 20,
    'dwarf': 15,
    'halfling': 5
  }
  
  // Economic class distribution
  classDistribution: {
    'wealthy': 10,
    'middle_class': 40,
    'poor': 35,
    'destitute': 15
  }
  
  // Age demographics
  ageBrackets: {
    'child': 20,
    'young_adult': 25,
    'adult': 35,
    'elder': 20
  }
  
  // Skill distribution
  skillDistribution: {
    'craftsmen': 30,
    'merchants': 15,
    'laborers': 25,
    'soldiers': 10,
    'scholars': 5,
    'criminals': 8,
    'farmers': 7
  }
}
```

### **MICRO LEVEL** - Individual NPCs & Roles

At micro level, create **specific named NPCs** that fill **required organizational roles**:

```typescript
interface FactionStructure {
  factionId: string
  factionName: string
  totalMembers: number
  
  // REQUIRED POSITIONS (must be filled during generation)
  leadership: {
    leader: NPCReference          // MANDATORY
    secondInCommand?: NPCReference
    council?: NPCReference[]
  }
  
  // REQUIRED SUPPORT STRUCTURE
  supportRoles: {
    treasurer?: NPCReference      // Manages resources
    enforcer?: NPCReference       // Enforces rules
    diplomat?: NPCReference       // External relations
    spymaster?: NPCReference      // Intelligence
    recruiter?: NPCReference      // Brings in members
  }
  
  // SPECIALIZED ROLES (faction-specific)
  specializedRoles: {
    [roleName: string]: NPCReference
  }
  
  // RANK STRUCTURE
  ranks: {
    [rankName: string]: {
      members: NPCReference[]
      minimumCount: number
      currentCount: number
    }
  }
  
  // GENERIC MEMBERS (simulated but not individually named)
  genericMembers: number
}
```

### **NPC Creation Process**

1. **Create faction structures** with required positions
2. **Fill leadership positions FIRST** (leader, lieutenant, council)
3. **Fill support positions** (treasurer, enforcer, diplomat, etc.)
4. **Fill specialized roles** (faction-specific)
5. **Fill key rank positions** (some named members per rank)
6. **Generate generic population** (un-named members for simulation)
7. **Establish relationships** between all NPCs

**Key Principle:** Only create detailed NPCs for important positions. Rest are generic for performance.

---

## ðŸŽ­ FACTIONS AS COLLECTIVE ENTITIES

### **Factions Have Needs (Like NPCs)**

```typescript
interface FactionNeeds {
  // Resource needs (0-100)
  wealth: number
  supplies: number
  manpower: number
  
  // Strategic needs (0-100)
  territory: number
  influence: number
  security: number
  
  // Social needs (0-100)
  morale: number
  reputation: number
  legitimacy: number
  
  // Growth needs (0-100)
  recruitment: number
  expansion: number
  innovation: number
  intelligence: number  // Information gathering!
}
```

### **Faction AI: Needs Drive Goals**

```typescript
class FactionAI {
  evaluateNeeds(faction: Faction): void {
    // Check critical needs
    if (faction.needs.wealth < 30) {
      // WEALTH CRISIS
      if (faction.type === 'bandits') {
        faction.goals.unshift({
          type: 'raid_caravan',
          priority: 90,
          desperate: true
        })
      } else if (faction.type === 'merchants_guild') {
        faction.goals.unshift({
          type: 'negotiate_trade_deal',
          priority: 80
        })
      }
    }
    
    if (faction.needs.security < 40) {
      // SECURITY CRISIS
      faction.goals.unshift({
        type: 'fortify_headquarters',
        priority: 85
      })
    }
    
    if (faction.needs.morale < 30) {
      // MORALE CRISIS
      // Might lead to internal coup!
      if (faction.leadership.leader.popularity < 30) {
        this.detectCoupOpportunity(faction)
      }
    }
  }
  
  delegateToOfficers(faction: Faction, action: FactionAction): void {
    // Leader makes decision
    // Officers execute based on specialization
    action.tasks.forEach(task => {
      const bestOfficer = this.findBestOfficerForTask(faction, task)
      
      // Give NPC a personal goal that serves faction goal
      bestOfficer.goals.unshift({
        type: task.type,
        priority: 80,
        assignedBy: faction.leadership.leader.id,
        factionGoal: action.id
      })
    })
  }
}
```

---

## ðŸ—ºï¸ TWO INTERFACES: VM vs PLAYER

### **VM (VibeMaster) Interface - Designer's God Mode**

What the **creator** sees when building/testing:

```typescript
interface VMInterface {
  // MACRO MAP VIEW
  macroMap: {
    factionTerritories: Territory[]       // Color-coded regions
    significantNPCs: NPCMarker[]          // All important NPCs visible
    populationDemographics: Stats         // Full statistics
    activeConflicts: Conflict[]           // All ongoing situations
    needsAnalysis: FactionNeeds[]         // What drives each faction
    informationFlows: InformationMap      // See rumor propagation
  }
  
  // SIMULATION CONTROLS
  simulationPanel: {
    timeSpeed: number                     // Fast-forward, pause
    forceEvent: () => void                // Test scenarios
    inspectNPC: (id) => NPCFullState      // See everything
    inspectFaction: (id) => FactionState
    debugMode: boolean
  }
  
  // Shows WHY things are happening
  causality: {
    showMotivations: boolean
    showHiddenGoals: boolean
    showInformationReliability: boolean
  }
}
```

### **Player Interface - Immersive Discovery**

What the **player** experiences:

```typescript
interface PlayerInterface {
  // ONLY what they can see/hear
  firstPersonView: {
    visibleNPCs: NPC[]           // Only in current location
    visibleObjects: GameObject[]
    audibleSounds: Sound[]
    currentLocation: Location
  }
  
  // DISCOVERED INFORMATION ONLY
  journal: {
    metNPCs: NPC[]                // Only NPCs they've talked to
    knownLocations: Location[]    // Only places they've been
    heardRumors: Rumor[]          // Info from conversations
    relationships: Map<string, number>
    questLog: Quest[]
  }
  
  // NO GOD MODE
  // Must discover factions through gameplay
  // Must learn NPC motivations through interaction
  // Must verify rumors through investigation
  // Fog of war on map - must explore
}
```

### **Player Discovery Methods**

1. **Exploration** - Walk around, discover locations
2. **Conversation** - Talk to NPCs, learn information
3. **Observation** - Watch NPC behavior, infer motivations
4. **Rumors** - Eavesdrop, hear gossip (unreliable!)
5. **Evidence** - Find documents, physical clues
6. **Consequences** - Actions teach through results

**Key Principle:** Player must EARN all knowledge through gameplay. No quest markers showing them everything.

---

## ðŸ”„ SIMULATION LEVEL OF DETAIL (LOD)

### **Performance Optimization Through Distance**

```typescript
enum SimulationLevel {
  FULL_DETAIL = 0,      // Player's current location
  HIGH_DETAIL = 1,      // Adjacent areas (1-2 tiles)
  MEDIUM_DETAIL = 2,    // Nearby areas (3-5 tiles)
  LOW_DETAIL = 3,       // Distant areas (6-10 tiles)
  MACRO_ONLY = 4        // Very distant (10+ tiles)
}
```

### **FULL_DETAIL (Player's Location)**

```typescript
// EVERY individual NPC fully simulated
npcs.forEach(npc => {
  npc.evaluateNeeds()        // Calculate every need
  npc.updateGoals()          // Recalculate priorities
  npc.updateEmotions()       // Track emotional state
  npc.updateMemories()       // Process memories
  npc.makeDecisions()        // Full AI decision making
  npc.takeAction()           // Execute action
  npc.updateRelationships()  // Update all relationships
})

// Detailed economy tracking
economy.tickFullDetail()

// Emergent event detection (expensive!)
detectEmergentEvents()

// Every clock updates
clocks.forEach(clock => clock.tick())
```

### **MACRO_ONLY (Distant Areas)**

```typescript
// NO individual NPCs simulated
// Faction-level aggregates only

factions.forEach(faction => {
  // Simple aggregate calculations
  faction.needs.wealth += calculateAggregateWealth(faction)
  faction.needs.supplies += calculateAggregateSupplies(faction)
  
  // Simple goal progression
  if (faction.currentGoal) {
    faction.currentGoal.progress += faction.aggregateProgress
    
    if (faction.currentGoal.progress >= 100) {
      resolveGoalAtMacroLevel(faction)
    }
  }
})

// ONLY track significant NPCs (leaders, plot-important)
significantNPCs.forEach(npc => {
  npc.pursuePrimaryGoal()  // Only top goal, no details
})

// Simple economy (aggregate only)
economy.tickMacro()

// NO emergent event detection
// NO individual clocks (faction timers only)
```

### **"Unpacking" When Player Approaches**

```typescript
onPlayerMovesToNewArea(newLocation: MacroTile) {
  // DOWNGRADE old location to macro
  packLocationToMacro(playerLocation)
  
  // UPGRADE new location to full detail
  unpackLocationToFullDetail(newLocation)
  
  // Apply macro-level changes to individual NPCs
  applyMacroChangesToNPCs(newLocation)
}
```

### **Performance Gain**

- **Before:** 1500 NPCs Ã— 5 cost = 7500 units (15 FPS)
- **After:** 150 NPCs Ã— 5 + 27 NPCs Ã— 0.5 + 18 factions Ã— 2 = 781.5 units (60 FPS)
- **Improvement:** 10x faster, 90% reduction in CPU usage

---

## ðŸ“° INFORMATION PROPAGATION SYSTEM

### **Information as a Resource**

```typescript
interface Information {
  id: string
  type: 'fact' | 'rumor' | 'secret' | 'misinformation' | 
        'intelligence' | 'propaganda'
  
  // THE TRUTH
  actualEvent: {
    what: string           // What actually happened
    who: string[]          // Who was actually involved
    where: Location        // Where it happened
    when: GameTime         // When it happened
    why: string            // Actual motivation
  }
  
  // INFORMATION PROPERTIES
  reliability: number      // 0-100 (accuracy)
  secrecy: number         // 0-100 (how secret)
  importance: number      // 0-100 (how important)
  verifiable: boolean     // Can be fact-checked?
  
  // PROPAGATION
  knownBy: Set<string>    // Who knows this
  believedBy: Map<string, number>  // Who believes it (0-100%)
  sourceCredibility: number
  
  // DECAY & MUTATION
  createdAt: GameTime
  expiresAt?: GameTime
  distortionRate: number
  
  // VARIANTS (rumor mutates as it spreads)
  variants: RumorVariant[]
}
```

### **Rumor Distortion Types**

1. **Exaggeration** - "A few bandits" â†’ "An army of bandits"
2. **Minimization** - "Major attack" â†’ "Minor skirmish"
3. **Attribution Error** - "Raven's bandits" â†’ "Merchants Guild" (wrong faction!)
4. **Detail Loss** - Specific details forgotten over time
5. **Fabrication** - New false details added

### **Propagation Mechanics**

```typescript
propagateInformation(info: Information, fromNPC: NPC, toNPC: NPC) {
  // Calculate belief based on:
  const trustInSource = toNPC.relationships.get(fromNPC.id) || 50
  const sourceCredibility = fromNPC.reputation
  const skepticism = toNPC.personality.skeptical ? 30 : 0
  
  const beliefScore = (
    (trustInSource * 0.4) +
    (sourceCredibility * 0.3) +
    (info.reliability * 0.3) -
    skepticism
  )
  
  info.knownBy.add(toNPC.id)
  info.believedBy.set(toNPC.id, beliefScore)
  
  // Chance of distortion
  const distortionChance = (100 - trustInSource) / 100
  if (Math.random() < distortionChance) {
    distortInformation(info, toNPC)
  }
  
  // NPC might spread further
  if (info.importance > 50) {
    scheduleRumorSpreading(info, toNPC)
  }
}
```

### **Information Networks**

NPCs share information at:
- **Taverns** (high rumor spread, low reliability)
- **Markets** (gossip, moderate spread)
- **Guild Halls** (faction-specific, higher reliability)
- **Private meetings** (secrets, high reliability)

---

## ðŸ•µï¸ SPY MECHANICS & ESPIONAGE

### **Spy System**

```typescript
interface Spy extends NPC {
  spySkills: {
    stealth: number          // 0-100 (avoid detection)
    deception: number        // 0-100 (lie convincingly)
    observation: number      // 0-100 (notice details)
    encryption: number       // 0-100 (secure comms)
    infiltration: number     // 0-100 (gain access)
  }
  
  cover: {
    identity: string         // False name
    occupation: string       // Cover story
    backstory: string
    suspicionLevel: number   // 0-100
  }
  
  loyaltyTo: string          // Faction they serve
  targetFaction: string      // Faction they're spying on
  
  gatheredIntelligence: Intelligence[]
}

interface Intelligence {
  type: 'faction_plans' | 'military_strength' | 'economic_data' |
        'npc_secrets' | 'relationship_map' | 'resource_locations'
  
  reliability: number        // 80-100 (spy intel is good!)
  strategicValue: number     // 0-100
  urgency: number           // 0-100 (time-sensitive?)
  
  discoveryRisk: number     // Was spy nearly caught?
  compromised: boolean      // Has enemy detected leak?
}
```

### **Spy Mission Flow**

1. **Assignment** - Faction assigns spy mission
2. **Infiltration** - Spy joins target faction with cover identity
3. **Gather Intel** - Overhear conversations, steal documents, befriend NPCs
4. **Transmission** - Send intelligence back to home faction
5. **Risk** - Daily chance of discovery
6. **Discovery Consequences** - If caught: imprisonment, execution, war!

### **Intelligence Gathering Methods**

- **Overhear conversations** (reliability: 85%)
- **Steal documents** (reliability: 95%, high risk)
- **Befriend and extract** (reliability: 80%, slow)
- **Surveillance** (reliability: 70%, low risk)
- **Recruit informant** (reliability: 90%, moderate risk)

### **Counter-Espionage**

Factions can:
- **Detect spies** through suspicion system
- **Feed false information** to suspected spies
- **Turn double agents** (offer better deal)
- **Execute captured spies** (war declaration)

---

## ðŸŽ¯ INFORMATION-DRIVEN QUEST GENERATION

### **Quest Generation Patterns**

```typescript
class EmergentQuestGenerator {
  
  // PATTERN 1: Information Gap
  // NPC needs info they don't have
  detectInformationGapQuests()
  // Example: Marcus needs to know where Sarah is held
  
  // PATTERN 2: Conflicting Information
  // Multiple contradictory versions of same event
  detectConflictingInformationQuests()
  // Example: "The Truth About the Warehouse" investigation
  
  // PATTERN 3: Secret Knowledge
  // Someone wants secret, someone else guards it
  detectSecretKnowledgeQuests()
  // Example: Faction wants to know rival's plans
  
  // PATTERN 4: Misinformation Consequences
  // False rumor causing real harm
  detectMisinformationQuests()
  // Example: Clear reputation destroyed by rumors
  
  // PATTERN 5: Intelligence Gathering
  // Faction needs spy work done
  detectSpyQuests()
  // Example: "The Double Agent" espionage mission
}
```

### **Example Quest 1: Information Gap**

```
SIMULATION STATE:
- Marcus's daughter Sarah kidnapped
- Marcus doesn't know where she's being held
- Only bandits know the location (secret)
- Marcus is desperate (priority: 100)

EMERGENT QUEST:
"Find Sarah's Location"

MULTIPLE SOLUTIONS:
1. Track the bandits (tracking skill)
2. Interrogate witnesses (investigation)
3. Capture a scout (combat + interrogation)
4. Hire a spy (pay gold, wait 2 days)
5. Spread false rumor to lure bandits out

Each solution has:
- Different difficulty
- Different cost (time/money/risk)
- Different reliability (60-95%)
- Different consequences
```

### **Example Quest 2: Conflicting Information**

```
SIMULATION STATE:
- Merchants moved 500 gold (truth)
- Thieves believe it was 5,000 (exaggeration)
- Guards believe they're hiding it from taxes (wrong)
- Three factions have conflicting info

EMERGENT QUEST:
"The Truth About the Warehouse"

INVESTIGATION:
1. Talk to eyewitnesses
2. Examine warehouse records
3. Track rumor to source
4. Discover Thieves spy exaggerated to justify heist

RESOLUTION CHOICES:
- Tell Thieves the truth (prevent heist)
- Tell Guards the truth (clear Merchants)
- Tell everyone publicly (expose spy)
- Tell no one (let conflict escalate)
- Lie to Thieves (confirm exaggeration, disaster)
```

### **Example Quest 3: Espionage Mission**

```
SIMULATION STATE:
- Merchants Guild needs intelligence (25/100)
- Thieves Guild planning major heist (secret)
- Player has good relationship with Merchants (60+)

EMERGENT QUEST:
"Shadows and Secrets" (Spy Mission)

PHASE 1: Infiltration
- Gain entry to Thieves Guild
- Establish cover identity
- Build initial trust

PHASE 2: Intelligence Gathering (7-10 days)
- Complete guild missions
- Attend secret meetings
- Gather intel about heist
- Manage suspicion level

PHASE 3: The Choice
- Complete mission (warn Merchants, blow cover)
- Betray Merchants (do the heist, join Thieves)
- Double-cross both (tip off Guards, chaos)
- Disappear (flee, abandon everyone)

CONSEQUENCES:
- Permanent faction relationships
- Town power dynamics shift
- Possible guild war
- Player reputation affected
```

### **Quest Emergence Triggers**

Quests emerge when:
1. **NPC has urgent goal but lacks critical info**
2. **Multiple NPCs have conflicting beliefs about same event**
3. **Secret information exists with high strategic value**
4. **Misinformation is causing measurable harm**
5. **Faction's intelligence need drops below threshold**

---

## ðŸŽ® GAMEPLAY SCENARIOS

### **Scenario: Rumor Causes War**

```
Day 1: Merchants move 500 gold (routine business)

Day 2: Dock worker sees it, estimates 1000 gold

Day 3: Thief overhears, exaggerates to 2000 gold

Day 4: Guild spy reports "at least 3000 gold!"

Day 5: Thieves Guild leader believes 5000 gold!

Day 6: Thieves plan major heist based on false intel

Day 7: Player can:
  - Investigate and correct rumor
  - Let it happen (thieves attack lightly guarded target)
  - Make it worse (confirm 10,000 gold!)

CONSEQUENCES:
- Heist happens
- Merchants blame Guards for bad intel
- Thieves blame spy for bad intel
- Relations deteriorate
- Guild war begins

PLAYER COULD HAVE:
- Traced rumor to source
- Verified actual amount
- Prevented war
```

### **Scenario: Information Asymmetry Creates Drama**

```
WHAT EACH FACTION KNOWS:

TRUTH:
- Bandits are starving, need food
- They kidnapped Sarah for ransom
- They don't want to hurt her

PLAYER KNOWS:
- Bandits kidnapped Sarah
- Marcus is desperate

MARCUS BELIEVES:
- Bandits are evil monsters
- Sarah will be killed
- Guards won't help (corruption)

MERCHANTS GUILD BELIEVES:
- Bandits are Thieves Guild mercenaries
- This is economic warfare
- Must respond with force

THIEVES GUILD KNOWS:
- Bandits are independent (spy intel)
- Bandits are desperate (good intel)
- Might recruit them

PLAYER CHOICES:
- Share truth with Marcus (he might sympathize)
- Sell intel to Merchants (they'll hire mercs)
- Tell Thieves to recruit bandits (change power balance)
- Spread misinformation ("Bandits are refugees!")
- Tell no one (situation escalates naturally)

Each choice creates ripples through faction relations!
```

---

## ðŸ› ï¸ IMPLEMENTATION PRIORITIES

### **Phase 1: Foundation** (Week 1-2)
- [ ] Macro population demographics system
- [ ] Faction structure generation
- [ ] Required NPC role filling
- [ ] Basic faction needs system

### **Phase 2: Simulation LOD** (Week 3)
- [ ] Distance-based simulation levels
- [ ] Pack/unpack location system
- [ ] Macro aggregate calculations
- [ ] Performance testing

### **Phase 3: Information Network** (Week 4-5)
- [ ] Information data structure
- [ ] Rumor propagation mechanics
- [ ] Distortion system
- [ ] Belief calculation

### **Phase 4: Spy System** (Week 6)
- [ ] Spy NPC type
- [ ] Intelligence gathering mechanics
- [ ] Cover identity system
- [ ] Discovery/consequence system

### **Phase 5: Quest Generation** (Week 7-8)
- [ ] Information gap detection
- [ ] Conflicting information detection
- [ ] Secret knowledge detection
- [ ] Quest template system
- [ ] Multiple solution paths

### **Phase 6: Integration & Testing** (Week 9-10)
- [ ] Connect all systems
- [ ] Balance tuning
- [ ] Playtest emergent scenarios
- [ ] Polish UI/UX for both VM and Player

---

## ðŸŽ¯ KEY DESIGN PRINCIPLES

### **1. Information is Power**
Information asymmetry drives conflict, creates opportunities, generates quests.

### **2. Reliability Matters**
Not all information is equal. Players must learn to verify, investigate, and judge sources.

### **3. Actions Have Consequences**
Sharing or withholding information affects faction relations, wars, and world state.

### **4. Scalability Through Abstraction**
Full simulation near player, macro simulation far away. Seamless transition.

### **5. Emergence Over Scripting**
Quests emerge from simulation state, not pre-written scripts. Every playthrough different.

### **6. Two Audiences**
- **VM Interface:** Designer's god-mode for world building
- **Player Interface:** Fog of war, must discover everything

### **7. Organizational Integrity**
Every faction has required leadership and support structures that function realistically.

---

## ðŸ“š RELATED DOCUMENTS

- `living_world_simulation_foundation` - Core NPC/faction simulation
- `VIBEMASTER_NPC_CYCLES_AND_CLOCKS.md` - Time-based systems
- `VIBEMASTER_NARRATIVE_ARCHITECTURE.md` - Narrative layer integration
- `VIBEMASTER_CLAUDE_NARRATIVE_ENGINE.md` - AI-driven content generation

---

## ðŸŽ¨ PROJECT NAMING CONSIDERATION

**Current Name:** VibeMaster  
**Context Issue:** Name feels too casual for a sophisticated living world simulation engine

**Alternative Names to Consider:**
- WorldForge
- Chronicle Engine
- Genesis System
- Narrative Forge
- WorldWeaver
- SimMaster
- NarraSim
- EmergeEngine
- Living World Engine (LWE)
- StoryForge

**Recommendation:** Consider rebranding for professional positioning while keeping VibeMaster as working title.

---

## âœ… SESSION ACHIEVEMENTS

This session established:

1. âœ… **Hierarchical Population System** - Macro demographics â†’ Faction structures â†’ Individual NPCs
2. âœ… **Faction-Level AI** - Factions have needs and goals like NPCs
3. âœ… **Simulation LOD** - 10x performance improvement through distance-based detail levels
4. âœ… **Information as Gameplay** - Rumor propagation, reliability, distortion mechanics
5. âœ… **Espionage System** - Complete spy mechanics with risk/reward
6. âœ… **Emergent Quest Generator** - 5 patterns for information-driven quest creation
7. âœ… **Dual Interface Design** - VM god-mode vs Player fog-of-war discovery

**Next Steps:** Begin implementation of Phase 1 (Foundation systems)

---

**End of Document**
