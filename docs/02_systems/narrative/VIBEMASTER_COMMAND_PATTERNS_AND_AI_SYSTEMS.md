// /mnt/user-data/outputs/VIBEMASTER_COMMAND_PATTERNS_AND_AI_SYSTEMS.md

# Vibemaster Command Patterns and AI Systems
## Comprehensive Design Document

**Status:** Design Phase - Core Architecture Defined
**Last Updated:** 2024
**Related Documents:** 
- `INNOVATION_AND_TECH_PROPAGATION_SYSTEM.md`
- `EFFICIENCY_DETECTION_AND_METRICS_SYSTEM.md`
- `VIBEMASTER_PROJECT_PRIMER.md`

---

## Table of Contents

1. [Overview](#overview)
2. [Section A: Vibemaster Command Patterns](#section-a-vibemaster-command-patterns)
3. [Section B: Faction AI Systems](#section-b-faction-ai-systems)
4. [Section C: Player-Controlled NPC Commands](#section-c-player-controlled-npc-commands)
5. [Section D: NPC State Calculation System](#section-d-npc-state-calculation-system)
6. [Outstanding Design Decisions](#outstanding-design-decisions)
7. [Implementation Roadmap](#implementation-roadmap)

---

## Overview

This document defines the command and control systems for Vibemaster, covering:

1. **Vibemaster (VM) Command Patterns** - Tools for world-building and simulation control
2. **Faction AI Systems** - Algorithmic behavior with optional LLM escalation
3. **Player-Controlled NPC Commands** - Natural language parsing with LLM fallback
4. **NPC State Calculation** - Real-time state from database attributes + modifiers

### Core Philosophy

**Emergence First, AI Override Second**

- 99% of gameplay runs on **programmatic algorithms** (free, instant, authentic)
- LLMs called only for **novel/complex situations** (expensive, creative, rare)
- VM can **override any behavior** for narrative control
- Player commands parsed **algorithmically when possible**, LLM for nuance

---

## Section A: Vibemaster Command Patterns

### The Dual Nature of VM Powers

#### Phase 1: World Building Mode 🏗️

**Full Godmode** - VM creates the world from scratch
```typescript
// Direct creation powers
VM.spawn.settlement("Riverside", {
  population: 150,
  resources: { wood: 500, stone: 200 }
})

VM.spawn.npc("Marcus", {
  occupation: "blacksmith",
  skills: { smithing: 75 }
})

VM.spawn.structure("water_tower", {
  location: town_center,
  capacity: 1000
})

VM.configure.world({
  climate: "temperate",
  tech_level: "medieval"
})
```

**Use Case:** Initial world setup, creating scenarios, playtesting

#### Phase 2: Living Simulation Mode 🌱

**Observation & Influence** - VM guides without direct control
```typescript
// Observation (always free)
VM.observe.faction("Merchants_Guild").efficiency_metrics()
VM.observe.threats("Riverside")
VM.observe.npc("Marcus").full_state()

// Soft influence (subtle nudges)
VM.influence.plant_idea(npc: "Marcus", idea: {
  content: "What if we could bring water closer to homes?",
  strength: 0.3
})

VM.influence.world.weather({
  type: "drought",
  severity: "moderate"
})

VM.influence.spawn.traveler({
  knowledge: ["advanced_irrigation"]
})

// Hard intervention (rare, for dramatic moments)
VM.intervene.disaster("earthquake", {
  destroys: ["granary", "well"]
})

VM.intervene.spawn.npc({
  name: "Wandering_Scholar",
  justification: "A stranger arrived in town"
})

// Time control
VM.time.fast_forward({ duration_days: 30 })
VM.time.pause()
```

### Free Mode Switching

**Key Decision:** VM can switch between world-building and simulation modes freely

**Rationale:**
- Information propagation system already handles "new knowledge appears"
- NPCs react to environmental changes organically
- Efficiency metrics recalculate automatically
- No complex continuity tracking needed

**Example:**
```typescript
// Mid-simulation, VM decides to add new settlement
VM.mode = VMMode.WORLD_BUILDING
VM.spawn.settlement("Hillcrest", { population: 70 })
VM.mode = VMMode.SIMULATION

// NPCs discover it:
// - "Travelers report settlement to the north"
// - Information spreads naturally
// - Trade routes adjust
// - World feels alive
```

### VM vs Player Capabilities

| Action | VM (World Building) | VM (Simulation) | Player |
|--------|---------------------|-----------------|---------|
| Spawn buildings | ✅ Direct | ❌ Must influence NPCs | ❌ Must hire NPCs |
| Spawn NPCs | ✅ Direct | ⚠️ Rare (with justification) | ❌ No |
| Create resources | ✅ Direct | ❌ Can adjust availability | ❌ Must gather/trade |
| Teach technology | ✅ Direct | ⚠️ Via introduced NPC | ✅ If they know it |
| See NPC thoughts | ✅ Always | ✅ Always | ❌ Must discover |
| Control NPCs | ✅ Direct | ❌ Only influence | ⚠️ Can command if trusted |
| Time control | ✅ Full | ✅ Full | ❌ No |
| See metrics | ✅ Full dashboard | ✅ Full dashboard | ❌ Experiences effects |

---

## Section B: Faction AI Systems

### Three-Tier Decision Hierarchy
```
TIER 1: PROGRAMMATIC EMERGENCE (Default - 99% of gameplay)
├─ NPCs follow need-based behavior
├─ Factions emerge from shared interests
├─ Collective behavior from aggregated needs
└─ 0 LLM calls, 0 cost, instant

TIER 2: ALGORITHMIC COORDINATION (Faction-level patterns)
├─ Detect collective needs
├─ Execute standard strategies (food shortage, trade expansion, defense)
├─ Pattern matching for common situations
└─ 0 LLM calls, 0 cost, fast

TIER 3: LLM STRATEGIC OVERRIDE (Rare - <7% of decisions)
├─ Novel situations (no algorithmic pattern)
├─ Complex diplomacy (betrayal, alliances)
├─ High-stakes decisions (war, major resource commitment)
├─ VM narrative control
└─ Expensive, creative, only when needed
```

### Faction Collective Needs

**Factions emerge organically from NPCs with shared interests**
```typescript
// Individual NPCs pursue needs
Marcus (blacksmith): needs.income = HIGH → goal: sell_tools
Sarah (trader): needs.income = HIGH → goal: establish_trade
Emma (merchant): needs.income = HIGH → goal: buy_low_sell_high

// System detects pattern
TradeNetwork.detectPattern({
  shared_occupation: "trade",
  shared_goals: ["profit"],
  cooperation_rate: 0.6
})

// Auto-creates faction
Faction.formalize({
  name: "Merchants Guild",
  members: [Marcus, Sarah, Emma, ...],
  shared_resources: true,
  leadership: "elected"
})

// NO LLM CALLS - Everything emerged naturally!
```

### Algorithmic Faction AI

**Handles 93%+ of faction decisions programmatically**
```typescript
class FactionAlgorithmicAI {
  
  makeDecision(faction: Faction): FactionAction | null {
    const needs = this.calculateFactionNeeds(faction);
    
    // Pattern matching for standard situations
    
    // PATTERN: Food shortage
    if (needs.collective_food > 0.7) {
      return this.executeFoodAcquisition(faction);
      // Buy food, increase farming, convert NPCs to farmers
    }
    
    // PATTERN: Under attack
    if (needs.collective_safety > 0.8) {
      return this.executeDefenseStrategy(faction);
    }
    
    // PATTERN: Trade opportunity
    const tradeOpp = this.detectTradeOpportunity(faction);
    if (tradeOpp && faction.resources.gold > 300) {
      return this.executeTradeExpansion(faction, tradeOpp);
      // Calculate ROI, assign traders, create route
    }
    
    // PATTERN: Territorial expansion
    if (needs.territorial_security < 0.3 && 
        faction.resources.gold > 1000) {
      return this.executeExpansion(faction);
    }
    
    // No pattern matches - return null (escalate to LLM?)
    return null;
  }
}
```

### LLM Trigger Conditions (Faction-Level)

**When to escalate from algorithm to LLM:**
```typescript
shouldTriggerLLM(faction: Faction): boolean {
  
  // Trigger 1: Novel situation
  if (threats.length > 2 && opportunities.length > 2) {
    return true; // Too many competing priorities
  }
  
  // Trigger 2: High-stakes decision
  if (this.detectImminentWar(faction)) {
    return true; // War declaration needs nuance
  }
  
  // Trigger 3: Complex diplomacy
  if (this.detectBetrayalOpportunity(faction)) {
    return true; // Ethical complexity
  }
  
  // Trigger 4: VM override requested
  if (this.vmRequestsLLM(faction)) {
    return true; // VM wants creative response
  }
  
  return false;
}
```

### Cost Comparison: Algorithmic vs LLM

**Scenario: 5 Factions, 100 Days**
```
WITHOUT Algorithmic AI (LLM for everything):
- Total decisions: 1500 (5 factions × 3/day × 100 days)
- LLM calls: 1500
- Total tokens: 750,000
- Cost: $2.25
- Time: 50 minutes of waiting

WITH Algorithmic AI (LLM only when needed):
- Total decisions: 1500
- Algorithmic handled: 1400 (93%)
- LLM needed: 100 (7%)
- Total tokens: 50,000
- Cost: $0.15 (15x cheaper!)
- Time: 3 minutes (17x faster!)
```

### MCP Tools for Faction Control

**Tools enable VM to observe and override faction behavior**
```typescript
// Observation tools (read-only)
observe_faction(faction_id, detail_level)
observe_efficiency_metrics(target, metric_type)
observe_threats(faction_id)

// Decision tools (strategic actions)
allocate_resources(goal, resource_commitment)
establish_diplomacy(target_faction, action, offer)
execute_strategy(strategy, target, parameters)

// Override tools (VM narrative control)
force_faction_action(faction_id, action, override_algorithm: true)
request_strategic_decision(faction_id) // Force LLM usage
adjust_faction_ai_weights(faction_id, new_weights)

// Example VM override:
VM.tool_call("force_faction_action", {
  faction_id: "Merchants_Guild",
  action: {
    type: "betray_ally",
    target: "Riverside",
    justification: "Dramatic twist for narrative",
    override_algorithm: true // Ignore "don't betray" logic
  }
})
```

---

## Section C: Player-Controlled NPC Commands

### Three-Tier Command Processing
```
TIER 1: SIMPLE COMMANDS (Algorithmic Parser - Free)
├─ Pattern matching: "go to X", "talk to Y", "pick up Z"
├─ Instant parsing
└─ ~40% of player commands

TIER 2: COMPLEX COMMANDS (Goal Decomposition - Free)
├─ Break into sub-goals: "buy bread" → [go to market, find baker, trade]
├─ Knowledge of world + NPC capabilities
└─ ~30% of player commands

TIER 3: CREATIVE COMMANDS (LLM Required - Expensive)
├─ Social nuance: "convince", "flirt", "manipulate"
├─ Stealth/deception: "sneak without being seen"
├─ Strategic planning: multi-step conditionals
├─ Moral decisions: "betray", "sacrifice"
└─ ~30% of player commands (but often most interesting!)
```

### Simple Command Parsing (No LLM)
```typescript
// Pattern matching for common commands
MOVEMENT_PATTERNS = [/^go to (.*)/i, /^walk to (.*)/i]
INTERACTION_PATTERNS = [/^talk to (.*)/i, /^grab (.*)/i]
ITEM_PATTERNS = [/^use (.*)/i, /^equip (.*)/i]

// Examples that parse successfully:
"Go to the market" → { action: "move", destination: "market" }
"Talk to Marcus" → { action: "interact", target: "Marcus" }
"Pick up the sword" → { action: "take_item", item: "sword" }

// Cost: $0, Time: <1ms
```

### Complex Command Decomposition (No LLM)
```typescript
// "Buy some bread"
decompose("buy some bread", npc) → {
  steps: [
    { action: "move", destination: "market" },
    { action: "find_npc", occupation: "baker" },
    { action: "check_price", item: "bread" },
    { action: "trade", give: "gold", receive: "bread" }
  ],
  can_execute: true // NPC has gold
}

// Cost: $0, Time: <10ms
```

### LLM Trigger Conditions (NPC-Level)

**When to escalate from algorithm to LLM:**
```typescript
needsLLM(input: string, npc: NPC): boolean {
  
  // Trigger 1: Social nuance
  if (input.match(/(convince|persuade|flirt|manipulate)/i)) {
    return true;
  }
  
  // Trigger 2: Stealth/deception
  if (input.match(/(sneak|hide|pretend|without being seen)/i)) {
    return true;
  }
  
  // Trigger 3: Strategic planning
  if (input.match(/(figure out|come up with|plan)/i)) {
    return true;
  }
  
  // Trigger 4: Conditional logic
  if (input.match(/(if .* then|otherwise|but if)/i)) {
    return true;
  }
  
  // Trigger 5: Moral/ethical dimension
  if (input.match(/(betray|lie to|sacrifice)/i)) {
    return true;
  }
  
  return false;
}
```

### Example: Complex Command with LLM
```typescript
Player: "Marcus, while I distract the guards, sneak into the warehouse 
         and look for documents about Sarah. If you get caught, 
         pretend you're looking for your tools."

// TIER 1: Parser fails (too complex)
// TIER 2: Decomposer fails (strategic coordination + conditional)
// TIER 3: LLM processes

LLM receives compact context:
{
  npc: {
    name: "Marcus",
    skills: { stealth: 40, deception: 30 },
    equipment: ["basic_tools"]
  },
  command: "sneak into warehouse while player distracts, conditional cover story",
  context: "Player will create distraction, guards present"
}

LLM returns plan:
{
  steps: [
    { phase: "preparation", actions: [position_near_warehouse, observe_guards] },
    { phase: "execution", condition: "when guards distracted", 
      actions: [move_stealthily, search_documents] },
    { phase: "contingency", condition: "if caught",
      actions: [act_confused, say: "Looking for my tools", leave_casually] }
  ],
  success_probability: 0.55,
  skill_checks: [
    { skill: "stealth", difficulty: 60, success_chance: 0.5 },
    { skill: "deception", difficulty: 50, success_chance: 0.4 }
  ]
}

// Cost: ~$0.01, Time: 2-3 seconds
```

### Dialogue vs Command

**Different processing for conversation:**
```typescript
// COMMAND (action-oriented) → Try algorithmic first
Player: "Marcus, go talk to Emma"
→ Parsed: { action: "move_to_npc", target: "Emma", interact: true }

// DIALOGUE (conversation) → Template or LLM
Player: "Marcus, do you know where Sarah is?"
→ Check dialogue templates first
→ If no template: Use LLM for natural response

// Dialogue templates (avoid LLM for common questions)
Templates = {
  greeting: /^(hi|hello|hey)/i,
  wellbeing: /(how are you)/i,
  location: /where (is|can I find) (.*)/i,
  knowledge: /do you know (.*)/i
}

// Template example:
Player: "Where is Sarah?"
→ Check Marcus's knowledge database
→ If knows: "Sarah is at the tavern" (Cost: $0)
→ If doesn't know: "I don't know" (Cost: $0)

// Needs LLM:
Player: "Marcus, I'm worried about Sarah. She's been acting strange lately."
→ Too nuanced for template (Cost: ~$0.01)
```

---

## Section D: NPC State Calculation System

### The Alertness Question

**When Marcus sneaks past guards, how alert are they?**

**Answer:** Database stores base attributes, code calculates current state

### Architecture: Database + Real-Time Calculation
```
Database (Persistent):
├─ Base personality traits (vigilance, distractibility, dedication)
├─ Skills (perception, awareness)
├─ Physical state components (energy, health)
└─ Recent events memory

Code (Real-Time):
├─ Apply modifiers based on context
├─ Calculate current effectiveness
└─ Return composite alertness value
```

### Example: Guard Alertness Calculation
```typescript
// Step 1: Query base attributes from database
guard = db.npcs.findUnique("guard_tom")
// Returns:
{
  personality: {
    vigilance: 75,        // Naturally alert
    distractibility: 30,  // Hard to distract
    dedication: 60
  },
  skills: {
    perception: 65,
    awareness: 55
  },
  physicalState: {
    energy: 45,           // Tired! (8 hour shift)
    health: 90
  }
}

// Step 2: Apply real-time modifiers
calculateCurrentAlertness(guard, context) {
  let alertness = guard.personality.vigilance; // 75
  
  // Energy modifier
  alertness *= calculateEnergyModifier(45); // 0.8
  // = 75 * 0.8 = 60
  
  // Time of day (11 PM)
  alertness *= 0.85; // -15%
  // = 60 * 0.85 = 51
  
  // Current activity (patrol)
  alertness *= 1.1; // +10%
  // = 51 * 1.1 = 56.1
  
  // Player distraction (intensity: 0.7)
  // Guard's distractibility: 30 (resists somewhat)
  alertness *= (1 - 0.4); // -40% (partial distraction)
  // = 56.1 * 0.6 = 33.66
  
  return 34; // Current alertness
}

// Step 3: Stealth check
Marcus stealth: 40 + darkness_bonus(14) = 54
Guard detection: 34 + perception(19.5) = 53.5
Roll: 54 + d20(12) = 66

Success: 66 > 53.5 ✓
```

### State Calculation Formula
```typescript
current_alertness = f(
  base_vigilance,        // Database: Permanent trait
  energy,                // Database: Updated hourly
  current_activity,      // Database: Updated on change
  time_of_day,          // World state: Real-time
  environment,          // World state: Light, weather
  active_distractions,  // Real-time: Player actions
  recent_events         // Database: Last N events
)
```

### Modifiers by Category

**Physical State Modifiers:**
- Energy < 20: 0.5x alertness (exhausted)
- Energy < 40: 0.7x alertness (very tired)
- Energy < 60: 0.85x alertness (tired)
- Health < 50: 0.7x alertness (distracted by pain)

**Time of Day Modifiers:**
- Night shift (10 PM - 6 AM): 0.85x alertness
- Peak hours (9 AM - 3 PM): 1.0x alertness
- Post-lunch (2 PM - 4 PM): 0.9x alertness

**Activity Modifiers:**
- Sleeping: 0.05x alertness
- Eating: 0.6x alertness
- Conversation: 0.5x alertness
- Patrol (active): 1.1x alertness
- Idle (bored): 0.9x alertness

**Distraction Modifiers:**
- Depends on distraction intensity (0-1) vs NPC distractibility (0-100)
- If distraction > resist_chance: Apply full effect
- Otherwise: Partial or no effect

**Recent Events Modifiers:**
- Saw intruder: 1.8x alertness (+80%, high alert!)
- Suspicious noise: 1.3x alertness (+30%, on edge)
- False alarm: 0.8x alertness (-20%, relaxed)

**Long-term Modifiers:**
- Shift > 6 hours: 0.7x alertness
- Days since incident > 30: 0.8x alertness (complacent)

### Database Schema
```prisma
model NPC {
  id String @id
  name String
  occupation String
  location String
  
  // Base attributes (persistent)
  personality Personality
  skills Skills
  
  // Current state (changes frequently)
  physicalState PhysicalState
  currentActivity String
  
  // Memory
  recentEvents Event[]
  
  // Shift tracking
  shiftStartTime DateTime?
  shiftDuration Int?
}

model Personality {
  npcId String @unique
  
  vigilance Int // 0-100
  distractibility Int // 0-100
  dedication Int // 0-100
  courage Int
  curiosity Int
}

model Skills {
  npcId String @unique
  
  perception Int // 0-100
  awareness Int // 0-100
  stealth Int
  combat Int
}

model PhysicalState {
  npcId String @unique
  
  energy Int // 0-100
  health Int // 0-100
  hunger Int // 0-100
  
  lastUpdated DateTime @default(now())
}

model Event {
  npcId String
  
  type String // "suspicious_noise", "saw_intruder"
  description String
  timestamp DateTime @default(now())
  location String
  alertnessModifier Float // -0.2 to +0.8
}
```

### Performance: Caching Strategy
```typescript
class NPCStateCache {
  // Cache calculations for 10 seconds
  // Invalidate on:
  // - NPC changes activity
  // - Player creates distraction
  // - New NPC enters area
  // - Environment changes
  // - Significant time passes
  
  getAlertness(npcId, context) {
    const cached = this.cache.get(cacheKey);
    if (cached && age < 10_seconds) {
      return cached;
    }
    
    // Calculate fresh
    const alertness = calculate(npc, context);
    this.cache.set(cacheKey, alertness);
    return alertness;
  }
}
```

### Complete Flow: Marcus Sneaks Past Guards
```
1. Player Command
   "Marcus, sneak past guards while I distract them"
   
2. LLM Processes (complex command)
   → Returns multi-phase plan with stealth action
   
3. System Queries Guard States
   Database → Guard Tom: vigilance=75, energy=45, perception=65
   Database → Guard Jerry: vigilance=45, energy=85, perception=40
   
4. Calculate Current Alertness
   Guard Tom: 75 * 0.8 (tired) * 0.85 (night) * 1.1 (patrol) * 0.6 (distracted) = 34
   Guard Jerry: 45 * 1.0 (rested) * 0.85 (night) * 0.9 (idle) * 0.3 (very distracted) = 10
   
5. Stealth Check
   Marcus: 40 (skill) + 14 (darkness) + 12 (roll) = 66
   vs Tom: 34 + 19.5 = 53.5 → SUCCESS
   vs Jerry: 10 + 8 = 18 → SUCCESS (easy!)
   
6. Result
   "Marcus slips past the guards unnoticed. They're too focused on the commotion nearby."
   
7. Update Database
   - Store event: "Marcus sneaked past" (in case discovered later)
   - Guards remain unaware (no knowledge entry)
```

---

## Outstanding Design Decisions

### 1. VM Resource Costs

**Question:** Should VM interventions have costs/limits?

**Options:**
- **A. No costs (Creative Mode)** - Unlimited power, pure storytelling
  - Pro: Accessible, no friction
  - Con: No strategic challenge
  
- **B. Optional costs (Difficulty Setting)** - Player chooses
  - Pro: Appeals to both audiences
  - Con: More complex to balance
  
- **C. Divine energy system** - Regenerating resource pool
  - Pro: Creates interesting decisions
  - Con: Might feel restrictive

**Current Lean:** Option B (optional costs)
- Default: Creative mode (no costs)
- Advanced: Challenge mode (resource management)
- Lets both player types enjoy the game

---

### 2. Faction AI Personality Customization

**Question:** Should AI faction personalities be preset or customizable?

**Options:**
- **A. Fixed presets** - "Aggressive", "Economic", "Diplomatic"
  - Pro: Easier to implement, balanced
  - Con: Less replayability
  
- **B. Customizable sliders** - Adjust values for each faction
  - Pro: More variety, player expression
  - Con: Balance issues, overwhelming
  
- **C. Personality templates + tweaking** - Presets with minor adjustments
  - Pro: Best of both worlds
  - Con: Medium complexity

**Current Lean:** Option C (templates + tweaking)
- Ship with 8-10 well-designed personalities
- Allow VM to adjust 2-3 key values
- Example: "Merchants Guild (Economic)" → Adjust risk_tolerance from 0.4 to 0.7

---

### 3. LLM Model Selection

**Question:** Which LLM(s) should power the AI systems?

**Options:**
- **A. Claude only** - Premium experience
  - Pro: Best quality, unified experience
  - Con: Higher cost
  
- **B. GPT-4 only** - Industry standard
  - Pro: Well-tested, reliable
  - Con: Different strengths than Claude
  
- **C. Model selection** - Let user choose
  - Pro: Cost/quality tradeoff options
  - Con: Inconsistent experience
  
- **D. Tiered approach**
  - Faction AI: GPT-4 Turbo (cheaper, good enough)
  - Player NPC: Claude Sonnet (better at nuance)
  - Pro: Optimized cost/quality per use case
  - Con: Complex to manage

**Current Lean:** Option D (tiered approach)
- Faction strategic decisions: GPT-4 Turbo ($0.01-0.02/1K tokens)
- Player NPC complex commands: Claude Sonnet 4.5 ($3/1M tokens)
- VM can override model choice per call

---

### 4. Real-time vs Turn-based for Faction AI

**Question:** When do factions make decisions?

**Options:**
- **A. Real-time continuous** - Factions think every N seconds
  - Pro: Feels alive, reactive
  - Con: Harder to optimize, debug
  
- **B. Turn-based** - Each faction gets a "turn" every game day
  - Pro: Predictable, easier to balance
  - Con: Less responsive
  
- **C. Event-driven** - Factions react to specific triggers
  - Pro: Efficient, natural
  - Con: Might miss opportunities
  
- **D. Hybrid** - Regular turns + event responses
  - Pro: Best of both worlds
  - Con: More complex

**Current Lean:** Option D (hybrid)
- Base tick: Once per game day (algorithmic scan)
- Event triggers: Immediate response (attacked, opportunity, etc.)
- VM can force immediate decision via MCP tool

---

### 5. Player Knowledge of AI Systems

**Question:** Should players know about LLM vs algorithmic decisions?

**Options:**
- **A. Fully transparent** - Show "LLM processing..." vs "Algorithmic"
  - Pro: Educational, debugging
  - Con: Breaks immersion
  
- **B. Partially transparent** - Performance stats only
  - Pro: Players can optimize costs
  - Con: Still somewhat meta
  
- **C. Fully hidden** - Seamless experience
  - Pro: Maximum immersion
  - Con: Players confused by occasional delays
  
- **D. Toggle transparency** - Debug mode option
  - Pro: Best of both worlds
  - Con: More UI complexity

**Current Lean:** Option D (toggle)
- Default: Hidden (immersive)
- Advanced settings: Show AI decision types
- Developer mode: Full transparency with reasoning logs

---

### 6. NPC State Update Frequency

**Question:** How often should energy/alertness/etc update in database?

**Options:**
- **A. Real-time** - Update every change
  - Pro: Most accurate
  - Con: Constant database writes, expensive
  
- **B. Periodic** - Update every N minutes
  - Pro: Balanced accuracy/performance
  - Con: Slight inaccuracy window
  
- **C. On-demand** - Calculate when needed, persist major changes only
  - Pro: Efficient, cache-friendly
  - Con: Complex cache invalidation
  
- **D. Hybrid** - Fast-changing (cached), slow-changing (database)
  - Pro: Optimized per attribute type
  - Con: Most complex

**Current Lean:** Option D (hybrid)
- **Fast-changing** (alertness, focus): Calculate on-demand, cache 10s
- **Medium-changing** (energy, hunger): Update database hourly
- **Slow-changing** (skills, personality): Update on significant events only
- **Events**: Write immediately (important for causality tracking)

---

### 7. Multiplayer VM Coordination

**Question:** Can multiple VMs control the same world?

**Options:**
- **A. Single VM only** - One person controls everything
  - Pro: Simple, no conflicts
  - Con: Limited scalability
  
- **B. Multiple VMs, separate territories** - Each controls a region
  - Pro: Collaborative world-building
  - Con: Boundary issues
  
- **C. Multiple VMs, different factions** - Each controls 1+ factions
  - Pro: Natural competition/cooperation
  - Con: Faction takeover complexity
  
- **D. VM + AI factions** - One human VM, rest AI-controlled
  - Pro: Human vs AI strategy game
  - Con: Balance issues

**Current Lean:** Start with Option A, plan for Option C
- V1: Single VM mode only
- V2: Add "VM controls faction" mode
- V3: Multiple VMs controlling different factions (Civ-style multiplayer)

---

### 8. Dialogue Template Coverage

**Question:** How many dialogue templates before falling back to LLM?

**Options:**
- **A. Minimal** - Only greetings, 5-10 templates
  - Pro: Easy to maintain
  - Con: Frequent LLM calls
  
- **B. Moderate** - Common interactions, 50-100 templates
  - Pro: Good cost/quality balance
  - Con: Moderate maintenance
  
- **C. Extensive** - Most conversations, 500+ templates
  - Pro: Rarely need LLM
  - Con: Feels rigid, high maintenance
  
- **D. Generated templates** - LLM creates templates for common patterns
  - Pro: Self-expanding coverage
  - Con: Complex meta-system

**Current Lean:** Option B → D (start moderate, evolve to generated)
- V1: 50 hand-crafted templates for most common interactions
- V2: Track which failed templates get LLM'd most often
- V3: Generate new templates from successful LLM responses
- Result: System learns to handle more algorithmically over time

---

### 9. State Calculation Caching Strategy

**Question:** How aggressive should caching be for performance?

**Options:**
- **A. No caching** - Always calculate fresh
  - Pro: Always accurate
  - Con: Performance issues with many NPCs
  
- **B. Time-based** - Cache for N seconds
  - Pro: Simple, predictable
  - Con: Might miss rapid changes
  
- **C. Invalidation-based** - Cache until context changes
  - Pro: Maximum efficiency + accuracy
  - Con: Complex invalidation logic
  
- **D. Probabilistic** - Use cached if "good enough"
  - Pro: Interesting tradeoff
  - Con: Hard to reason about

**Current Lean:** Option C (invalidation-based)
- Cache NPC alertness until:
  - NPC changes activity
  - Player in vicinity creates distraction
  - Another NPC enters/leaves area
  - Environment changes (light, weather)
  - Time advances significantly (>5 minutes)
- Aggressive caching for distant NPCs (player can't interact)
- Fresh calculations for nearby NPCs (player might interact)

---

### 10. MCP Tool Granularity

**Question:** How granular should VM control tools be?

**Options:**
- **A. High-level only** - "execute_strategy", "handle_threat"
  - Pro: Simple, less overwhelming
  - Con: Less control, black box
  
- **B. Low-level control** - "move_npc", "adjust_relationship +5"
  - Pro: Maximum control
  - Con: Micromanagement hell
  
- **C. Tiered tools** - Both high and low level available
  - Pro: Flexibility
  - Con: Tool sprawl, confusing
  
- **D. Natural language commands** - VM just types intent
  - Pro: Most intuitive
  - Con: Parsing complexity, ambiguity

**Current Lean:** Option C (tiered tools)
- **Tier 1 (Observation):** Always available, free
  - `observe_faction`, `observe_threats`, `observe_efficiency`
- **Tier 2 (High-level):** Strategic actions
  - `execute_strategy`, `allocate_resources`, `establish_diplomacy`
- **Tier 3 (Low-level):** Direct manipulation
  - `force_npc_action`, `adjust_relationship`, `modify_resource`
- **Tier 4 (Meta):** System control
  - `pause_simulation`, `fast_forward`, `save_state`

VM can start with Tier 1-2, graduate to Tier 3 as comfortable

---

## Implementation Roadmap

### Phase 1: Foundation (Months 1-2)

**Goal:** Get basic algorithmic systems working

- [ ] NPC state calculation system
  - Database schema for attributes
  - Real-time modifier calculations
  - Caching layer
  
- [ ] Simple command parser
  - Pattern matching for common commands
  - Goal decomposition for standard actions
  - 70% coverage target

- [ ] Basic faction AI
  - Collective needs calculation
  - 5-10 algorithmic patterns (food, trade, defense)
  - Pattern matching decision tree

**Deliverable:** NPCs react naturally, factions emerge organically, no LLM needed yet

---

### Phase 2: LLM Integration (Months 3-4)

**Goal:** Add LLM for complex situations

- [ ] MCP server setup
  - Tool definitions for faction control
  - Aggregation layer for compact context
  - LLM trigger detection

- [ ] Player NPC command LLM
  - Detect when algorithmic parsing fails
  - Build compact context for LLM
  - Parse LLM response into executable plans

- [ ] Faction LLM escalation
  - Novel situation detection
  - Strategic decision generation
  - Integration with algorithmic execution

**Deliverable:** Complex commands work, factions handle novel situations, costs optimized

---

### Phase 3: VM Tools (Months 5-6)

**Goal:** Complete VM control interface

- [ ] Observation dashboard
  - Efficiency metrics display
  - Faction status summaries
  - Threat/opportunity lists

- [ ] Influence tools
  - Plant ideas in NPCs
  - Spawn travelers/events
  - Weather/environment control

- [ ] Override tools
  - Force faction actions
  - Manual LLM trigger
  - Time control (pause, fast-forward)

**Deliverable:** VM has full creative control, can guide emergent stories

---

### Phase 4: Polish & Optimization (Months 7-8)

**Goal:** Production-ready performance

- [ ] Dialogue template system
  - 50+ common templates
  - Template matching before LLM
  - Cost reduction

- [ ] Performance optimization
  - Cache hit rate >90%
  - <100ms for state calculations
  - Batch database operations

- [ ] AI model optimization
  - A/B test different models
  - Tiered approach (cheap for routine, premium for critical)
  - Token usage monitoring

**Deliverable:** <$0.50 per hour of gameplay, smooth 60 FPS

---

### Phase 5: Advanced Features (Months 9-12)

**Goal:** Rich gameplay experience

- [ ] Faction personality system
  - 10+ personality presets
  - Customizable value sliders
  - Behavioral validation

- [ ] Learning systems
  - Template generation from LLM responses
  - Pattern library expansion
  - Cost reduction over time

- [ ] Multiplayer VM
  - Faction assignment
  - Territory control
  - Competitive/cooperative modes

**Deliverable:** Deep, replayable gameplay with emergent stories

---

## Success Metrics

### Performance Targets

**Cost Efficiency:**
- Average gameplay session (2 hours): <$0.50 in LLM costs
- Algorithmic handling rate: >85% of decisions
- LLM calls per hour: <50

**Response Time:**
- Simple commands: <50ms
- Complex commands (LLM): <3 seconds
- Faction decisions: <100ms (algorithmic), <5s (LLM)
- State calculations: <10ms per NPC

**Accuracy:**
- Command parsing accuracy: >90%
- LLM plan execution success: >80%
- Cache hit rate: >90%

### Experience Targets

**Emergence Quality:**
- Faction formation rate: 1-3 per 100 game days
- Novel situations per session: 5-10
- Player "wow moments" per hour: 2-3

**Control Feel:**
- VM satisfaction with tool granularity: >80%
- Player NPC responsiveness: >85% feel natural
- Algorithmic vs LLM transparency: Clear when desired

---

## Related Systems

### Already Designed (In Other Documents)

- **Innovation & Tech Propagation** - How technology spreads through knowledge networks
- **Efficiency Detection** - How VM sees bottlenecks and optimization opportunities  
- **Information Propagation** - How NPCs learn and spread information
- **Need-Based Behavior** - How NPCs make individual decisions
- **Daily Cycles & Clocks** - Time-based NPC behavior and consequences

### Still Needed (Future Sessions)

- **Combat System** - How conflicts resolve mechanically
- **Economy System** - Resource flow, pricing, trade mechanics
- **Reputation System** - How actions affect social standing
- **Event System** - Random and scripted occurrences
- **Victory Conditions** - What "winning" means in different modes

---

## Conclusion

This design creates a **three-layered intelligence system:**

1. **Programmatic Foundation** (99% of gameplay)
   - Fast, free, authentic emergence
   - NPCs and factions behave naturally
   - Rich simulation without AI costs

2. **LLM Strategic Layer** (1% of gameplay, highest impact moments)
   - Novel situations
   - Complex social interactions
   - Creative problem-solving
   - Narrative control

3. **VM Control Layer** (Always available)
   - Observe entire world state
   - Guide through influence
   - Override when needed for stories

**Key Innovation:** We don't replace algorithms with AI. We use algorithms for 99% of decisions, escalating to AI only when algorithmic patterns fail. This creates a scalable, cost-effective system that feels alive without breaking the bank.

**Next Steps:**
1. Review outstanding design decisions
2. Begin Phase 1 implementation (foundation)
3. Create detailed specs for each subsystem
4. Build prototype to validate architecture

---

**End of Document**