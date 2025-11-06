# â° VIBEMASTER: NPC CYCLES & CLOCK SYSTEMS

**Living World Simulation - Time, Urgency, and Player Control**

---

## ðŸŽ¯ EXECUTIVE SUMMARY

NPCs in your living world need a time system that balances:
- **Realism** - World feels alive and dynamic
- **Player Control** - Players don't miss important moments
- **Urgency** - Time pressure without frustration
- **Emergence** - Events happen naturally

**Recommended Solution:** Hybrid Real-Time + Cycle + Clock System

This combines:
- Dwarf Fortress (continuous simulation)
- Citizen Sleeper (strategic cycles + visible clocks)
- XCOM (pause on important moments)

---

## ðŸ“Š THREE APPROACHES COMPARED

### Option 1: Discrete Cycles (Turn-Based)

```typescript
class CycleBasedWorld {
  currentCycle: number = 0
  cyclesPerDay: number = 6  // 4-hour chunks (6 cycles = 24 hours)
  
  advanceCycle() {
    console.log(`=== CYCLE ${this.currentCycle} ===`)
    
    this.currentCycle++
    
    // Every NPC acts ONCE per cycle
    this.npcs.forEach(npc => {
      npc.evaluateNeeds()        // Check hunger, safety, etc.
      npc.selectTopGoal()        // Pick highest priority goal
      npc.executeAction()        // Do ONE action
      npc.updateRelationships()  // React to what happened
      npc.updateMemories()       // Remember important events
    })
    
    // World systems update
    this.economy.processSupplyDemand()
    this.factions.updateGoals()
    this.time.advance(4)  // 4 hours pass
    
    // Check for emergent events
    this.detectEmergentQuests()
    this.detectConflicts()
    
    // Sync to Ink
    this.syncWorldStateToInk()
    
    console.log(`=== CYCLE ${this.currentCycle} COMPLETE ===`)
  }
  
  // Player explicitly advances time
  playerEndTurn() {
    this.advanceCycle()
  }
}
```

**âœ… ADVANTAGES:**
- **Perfect player control** - Nothing happens until player ready
- **Clear cause & effect** - See exactly what changed each cycle
- **Strategic gameplay** - Plan actions like XCOM/Slay the Spire
- **Easy to debug** - Discrete states, clear logs
- **Simple Ink integration** - Variables update once per cycle
- **No missed events** - Player sees everything important

**âŒ DISADVANTAGES:**
- **Less immersive** - Feels turn-based, not "alive"
- **World waits for player** - NPCs frozen between turns
- **Can feel slow** - Player has to manually advance time
- **Artificial pacing** - Doesn't match real-time conversations

**BEST FOR:**
- Strategy games
- Puzzle-adventure games
- Games where thinking > reflexes
- Single-player focus

---

### Option 2: Real-Time Simulation (Continuous)

```typescript
class RealTimeWorld {
  private lastUpdate: number = 0
  private simulationSpeed: number = 1.0  // Can be adjusted
  
  // Called every frame
  update(deltaTime: number) {
    const adjustedDelta = deltaTime * this.simulationSpeed
    
    // Time passes continuously
    this.worldTime.advance(adjustedDelta)
    
    // NPCs act based on their schedules
    this.npcs.forEach(npc => {
      npc.updateSchedule(adjustedDelta)
      
      // NPCs act when their timer expires
      if (npc.actionTimer <= 0) {
        npc.evaluateNeeds()
        npc.updateGoals()
        npc.takeAction()
        npc.actionTimer = npc.actionSpeed  // Reset timer
      }
      
      npc.actionTimer -= adjustedDelta
      npc.updateMemories(adjustedDelta)
    })
    
    // Economy runs continuously
    this.economy.update(adjustedDelta)
    
    // Events emerge organically
    this.detectEmergentEvents(adjustedDelta)
    
    // Sync to Ink (expensive, do sparingly)
    if (this.shouldSyncToInk()) {
      this.syncWorldStateToInk()
    }
  }
  
  // Player can speed up/slow down/pause
  setSimulationSpeed(speed: number) {
    this.simulationSpeed = speed  // 0 = pause, 1 = normal, 10 = fast
  }
}
```

**âœ… ADVANTAGES:**
- **Highly immersive** - World feels truly alive
- **Realistic schedules** - NPCs have daily routines (wake, work, sleep)
- **True emergence** - Events happen whether player present or not
- **Dynamic pacing** - Speed up boring parts, slow down important parts
- **Natural flow** - Conversations happen in real-time
- **World doesn't wait** - Miss events if you're away

**âŒ DISADVANTAGES:**
- **Can miss important events** - "Wait, when did that happen?"
- **Harder to balance** - Timing everything is complex
- **Overwhelming** - Too much happening at once
- **Complex state management** - Synchronization challenges
- **Performance concerns** - Many NPCs updating every frame
- **Ink integration tricky** - When to sync? How often?

**BEST FOR:**
- Simulation games (The Sims, Dwarf Fortress)
- Survival games
- Open-world exploration
- Games where realism > control

---

### Option 3: HYBRID SYSTEM (ðŸŽ¯ RECOMMENDED)

```typescript
class HybridWorldSystem {
  // Real-time simulation runs in background
  private simulation: RealTimeWorld
  
  // Cycle mode for important decisions
  private cycleMode: boolean = false
  private currentCycle: number = 0
  
  // Clock system for urgency (Citizen Sleeper style)
  private clockSystem: ClockSystem
  
  // Ink integration
  private inkBridge: InkWorldBridge
  
  // Pause triggers
  private pauseTriggers: Set<string> = new Set()
  
  update(deltaTime: number) {
    if (this.cycleMode) {
      // PAUSED - waiting for player decision
      // Only clocks decay during pause
      this.clockSystem.decayAllClocks(deltaTime * 0.1)  // Slow decay
      return
    }
    
    // === NORMAL MODE: Real-time simulation ===
    
    // World runs continuously
    this.simulation.update(deltaTime)
    
    // Clocks advance based on events and decay over time
    this.clockSystem.update(deltaTime)
    
    // Check if we should pause for player
    if (this.detectImportantMoment()) {
      this.enterCycleMode()
    }
  }
  
  detectImportantMoment(): boolean {
    // Pause when:
    return (
      this.npcWantsDialogue() ||      // NPC approaches player
      this.clockCompleted() ||         // Clock hit threshold
      this.emergentQuestTriggered() || // New quest available
      this.combatStarted() ||          // Danger!
      this.importantChoice() ||        // Moral dilemma
      this.playerEnteredBuilding()     // Entering new area
    )
  }
  
  enterCycleMode() {
    console.log('â¸ï¸  ENTERING CYCLE MODE')
    
    this.cycleMode = true
    this.currentCycle++
    
    // Pause simulation
    this.simulation.pause()
    
    // Sync world state to Ink
    this.inkBridge.pushWorldStateToInk()
    
    // Present choices to player
    this.presentPlayerChoices()
    
    // Show active clocks
    this.displayClockUI()
  }
  
  exitCycleMode(playerChoice: PlayerChoice) {
    console.log('â–¶ï¸  EXITING CYCLE MODE')
    
    // Process player's decision
    this.processPlayerChoice(playerChoice)
    
    // Pull Ink changes back to world
    this.inkBridge.pullInkToWorldState()
    
    // Resume simulation
    this.simulation.resume()
    
    this.cycleMode = false
  }
  
  // Player can manually pause anytime
  playerPause() {
    if (!this.cycleMode) {
      this.enterCycleMode()
    }
  }
  
  // Player can speed up time when nothing important happening
  fastForward() {
    if (!this.cycleMode) {
      this.simulation.setSimulationSpeed(10.0)
      
      // Auto-slow on important moment
      this.onImportantMoment(() => {
        this.simulation.setSimulationSpeed(1.0)
      })
    }
  }
}
```

**âœ… ADVANTAGES:**
- **Best of both worlds** - Immersion + Control
- **Intelligent pausing** - Only pause when it matters
- **Player agency** - Can manually pause anytime
- **Natural pacing** - Fast-forward boring parts
- **Clear decision points** - Know when choices matter
- **Ink integration perfect** - Sync only on pause
- **Clock visibility** - See time pressure clearly

**âŒ DISADVANTAGES:**
- More complex to implement
- Need good pause detection logic
- UI must be clear about mode

**PERFECT FOR:**
- VibeMaster! âœ¨
- Narrative-driven games
- Living world simulations
- Games with urgency + strategy

---

## â° CLOCK SYSTEM (CITIZEN SLEEPER STYLE)

### Clock Data Structure

```typescript
interface Clock {
  id: string
  name: string
  description: string
  
  // Progress
  segments: number        // Total segments (usually 4-8)
  currentSegment: number  // Current progress (0 to segments)
  
  // Visual
  type: 'success' | 'failure' | 'neutral'  // Color coding
  icon: string
  
  // Behavior
  decayRate: number       // Auto-decrease per second (passive pressure)
  onComplete: () => void  // Callback when full
  onFail: () => void      // Callback when empty (if decaying)
  
  // Conditions
  pauseDecayInCombat?: boolean
  pauseDecayInDialogue?: boolean
  hidden?: boolean        // Hidden until revealed
}

class ClockSystem {
  private clocks: Map<string, Clock> = new Map()
  private completedClocks: Set<string> = new Set()
  
  // Create new clock
  createClock(config: Partial<Clock>): Clock {
    const clock: Clock = {
      id: config.id || `clock_${Date.now()}`,
      name: config.name || 'Unnamed Clock',
      description: config.description || '',
      segments: config.segments || 6,
      currentSegment: config.currentSegment || 0,
      type: config.type || 'neutral',
      icon: config.icon || 'â°',
      decayRate: config.decayRate || 0,
      onComplete: config.onComplete || (() => {}),
      onFail: config.onFail || (() => {}),
      ...config
    }
    
    this.clocks.set(clock.id, clock)
    return clock
  }
  
  // Advance clock (player action)
  advance(clockId: string, amount: number = 1) {
    const clock = this.clocks.get(clockId)
    if (!clock) return
    
    clock.currentSegment = Math.min(
      clock.currentSegment + amount,
      clock.segments
    )
    
    if (clock.currentSegment >= clock.segments) {
      this.completeClock(clock)
    }
  }
  
  // Decay clock (time pressure)
  decay(clockId: string, amount: number = 1) {
    const clock = this.clocks.get(clockId)
    if (!clock) return
    
    clock.currentSegment = Math.max(
      clock.currentSegment - amount,
      0
    )
    
    if (clock.currentSegment <= 0) {
      this.failClock(clock)
    }
  }
  
  // Update all clocks (called every frame)
  update(deltaTime: number) {
    this.clocks.forEach(clock => {
      if (clock.decayRate > 0) {
        // Check pause conditions
        if (clock.pauseDecayInCombat && this.isInCombat()) return
        if (clock.pauseDecayInDialogue && this.isInDialogue()) return
        
        // Passive decay
        this.decay(clock.id, clock.decayRate * deltaTime)
      }
    })
  }
  
  private completeClock(clock: Clock) {
    console.log(`âœ… Clock completed: ${clock.name}`)
    
    clock.onComplete()
    this.completedClocks.add(clock.id)
    this.clocks.delete(clock.id)
    
    // Trigger world event
    this.triggerEvent('clock_completed', { clockId: clock.id })
  }
  
  private failClock(clock: Clock) {
    console.log(`âŒ Clock failed: ${clock.name}`)
    
    clock.onFail()
    this.clocks.delete(clock.id)
    
    // Trigger world event
    this.triggerEvent('clock_failed', { clockId: clock.id })
  }
  
  // Get all active clocks (for UI)
  getActiveClocks(): Clock[] {
    return Array.from(this.clocks.values())
  }
  
  // Get clock progress (0.0 to 1.0)
  getProgress(clockId: string): number {
    const clock = this.clocks.get(clockId)
    if (!clock) return 0
    return clock.currentSegment / clock.segments
  }
}
```

---

## ðŸŽ® PRACTICAL EXAMPLES

### Example 1: Marcus's Daughter Rescue Quest

```typescript
class RescueSarahQuest {
  private rescueClock: Clock
  private investigationClock: Clock
  
  start(clockSystem: ClockSystem) {
    // Main quest clock - TIME LIMIT
    this.rescueClock = clockSystem.createClock({
      id: 'rescue_sarah',
      name: 'Rescue Sarah',
      description: 'Find Sarah before it\'s too late',
      segments: 6,
      currentSegment: 0,
      type: 'failure',  // Red - bad if it fills
      icon: 'ðŸ”´',
      decayRate: 0.3,   // Loses 0.3 segments per game cycle
      pauseDecayInDialogue: true,  // Don't punish player in cutscenes
      onFail: () => this.sarahMoved(),
      onComplete: () => this.timeExpired()
    })
    
    // Investigation clock - PROGRESS TRACKER
    this.investigationClock = clockSystem.createClock({
      id: 'investigation',
      name: 'Investigation',
      description: 'Find clues to Sarah\'s location',
      segments: 4,
      currentSegment: 0,
      type: 'success',  // Green - good when it fills
      icon: 'ðŸŸ¢',
      decayRate: 0,     // Doesn't decay - only advances on actions
      onComplete: () => this.foundLocation()
    })
  }
  
  // Player investigates warehouse
  investigateWarehouse() {
    // Advances investigation
    clockSystem.advance('investigation', 1)
    
    // But also advances time (costs a cycle)
    clockSystem.advance('rescue_sarah', 1)
    
    // Sync to Ink
    inkBridge.setVariable('investigation_progress', 
      clockSystem.getProgress('investigation'))
    inkBridge.setVariable('rescue_time_left', 
      this.rescueClock.segments - this.rescueClock.currentSegment)
  }
  
  // Success: Found location before time ran out
  foundLocation() {
    console.log('ðŸŽ¯ Location found!')
    
    // Remove time pressure clock
    clockSystem.deleteClock('rescue_sarah')
    
    // Trigger rescue scene
    inkBridge.triggerKnot('rescue_scene_prepared')
    
    // Better outcome - player was thorough
    inkBridge.setVariable('rescue_prepared', true)
  }
  
  // Failure: Time ran out
  timeExpired() {
    console.log('â° Too late!')
    
    // Bad outcome
    inkBridge.setVariable('sarah_status', 'moved')
    inkBridge.triggerKnot('sarah_moved_scene')
    
    // Marcus becomes desperate
    world.getNPC('marcus').desperation = 100
  }
  
  // Player rushes ahead without investigating
  rushToRescue() {
    // Remove both clocks
    clockSystem.deleteClock('rescue_sarah')
    clockSystem.deleteClock('investigation')
    
    // Unprepared rescue - harder fight, worse outcome
    inkBridge.setVariable('rescue_prepared', false)
    inkBridge.triggerKnot('rescue_scene_unprepared')
  }
}
```

### Example 2: Village Food Crisis Clock

```typescript
class FoodCrisisQuest {
  private foodClock: Clock
  
  start(clockSystem: ClockSystem, world: LivingWorld) {
    // Triggered when food supply drops below threshold
    if (world.economy.foodSupply < 30) {
      this.foodClock = clockSystem.createClock({
        id: 'food_crisis',
        name: 'Food Crisis',
        description: 'Village running out of food',
        segments: 5,
        currentSegment: 0,
        type: 'failure',
        icon: 'ðŸž',
        decayRate: 0.5,  // Crisis worsens over time
        onComplete: () => this.riotBreaksOut()
      })
    }
  }
  
  // Player helps baker fix oven
  helpBaker() {
    // Reduces crisis pressure
    clockSystem.decay('food_crisis', -2)  // Negative decay = progress back
    
    world.economy.foodSupply += 20
    
    // If crisis averted completely
    if (clockSystem.getProgress('food_crisis') <= 0) {
      this.crisisAverted()
    }
  }
  
  // Player brings food from another village
  importFood() {
    // Solves crisis immediately
    clockSystem.deleteClock('food_crisis')
    world.economy.foodSupply += 50
    
    inkBridge.triggerKnot('crisis_solved_import')
  }
  
  // Clock completes - riot!
  riotBreaksOut() {
    console.log('ðŸ’¥ RIOT!')
    
    // Major world state change
    world.villageUnrest = 100
    world.economy.inChaos = true
    
    // Multiple NPCs react
    world.npcs.forEach(npc => {
      if (npc.personality.includes('angry')) {
        npc.joinRiot()
      }
    })
    
    // Trigger riot event in Ink
    inkBridge.triggerKnot('village_riot')
  }
  
  crisisAverted() {
    console.log('âœ… Crisis averted!')
    
    // Positive reputation
    world.player.reputation += 20
    
    // NPCs remember
    world.npcs.forEach(npc => {
      npc.memories.push({
        event: 'player_saved_village',
        importance: 0.8
      })
    })
  }
}
```

### Example 3: Multiple Simultaneous Clocks

```typescript
class MultipleClockExample {
  setupComplexSituation(clockSystem: ClockSystem) {
    // CLOCK 1: Rescue Sarah (urgent, decaying)
    clockSystem.createClock({
      id: 'rescue_sarah',
      name: 'Rescue Sarah',
      segments: 6,
      decayRate: 0.3,
      type: 'failure',
      onComplete: () => this.sarahDies()
    })
    
    // CLOCK 2: Food Crisis (urgent, decaying)
    clockSystem.createClock({
      id: 'food_crisis',
      name: 'Food Shortage',
      segments: 5,
      decayRate: 0.5,
      type: 'failure',
      onComplete: () => this.riot()
    })
    
    // CLOCK 3: Marcus's Trust (positive, building)
    clockSystem.createClock({
      id: 'marcus_trust',
      name: 'Marcus\'s Trust',
      segments: 10,
      decayRate: 0,  // Doesn't decay
      type: 'success',
      onComplete: () => this.marcusLoyalForever()
    })
    
    // CLOCK 4: Guard Captain Corruption (hidden)
    clockSystem.createClock({
      id: 'corruption',
      name: 'Corruption Spreads',
      segments: 8,
      decayRate: 0.2,
      type: 'failure',
      hidden: true,  // Player doesn't see this
      onComplete: () => this.corruptionTakesOver()
    })
  }
  
  // Player must CHOOSE which crisis to handle
  playerMustPrioritize() {
    // Can't do everything!
    // Each action advances some clocks, neglects others
    
    // Option 1: Help Marcus â†’ Sarah clock improves, Food clock worsens
    // Option 2: Help village â†’ Food clock improves, Sarah clock worsens
    // Option 3: Try both â†’ Both clocks advance some, neither solved perfectly
    
    // This creates MEANINGFUL CHOICES
  }
}
```

---

## ðŸ”— INK INTEGRATION

### Syncing Clocks to Ink Variables

```typescript
class InkClockBridge {
  syncClocksToInk(clockSystem: ClockSystem, inkStory: Story) {
    const clocks = clockSystem.getActiveClocks()
    
    clocks.forEach(clock => {
      // Current progress
      inkStory.variablesState[`${clock.id}_current`] = 
        clock.currentSegment
      
      // Max segments
      inkStory.variablesState[`${clock.id}_max`] = 
        clock.segments
      
      // Progress as percentage (0-100)
      inkStory.variablesState[`${clock.id}_progress`] = 
        Math.floor((clock.currentSegment / clock.segments) * 100)
      
      // Time left (inverted for decay clocks)
      if (clock.decayRate > 0) {
        inkStory.variablesState[`${clock.id}_time_left`] = 
          clock.segments - clock.currentSegment
      }
      
      // Boolean flags
      inkStory.variablesState[`${clock.id}_critical`] = 
        clock.currentSegment >= clock.segments - 1
      
      inkStory.variablesState[`${clock.id}_active`] = true
    })
  }
}
```

### Using Clocks in Ink Scripts

```ink
// Variables synced from clock system
VAR rescue_sarah_current = 0
VAR rescue_sarah_max = 6
VAR rescue_sarah_time_left = 6
VAR rescue_sarah_critical = false
VAR rescue_sarah_active = false

VAR investigation_current = 0
VAR investigation_max = 4

=== rescue_quest_hub ===

{ rescue_sarah_active:
    { rescue_sarah_critical:
        âš ï¸ CRITICAL: Sarah will be moved soon!
    - rescue_sarah_time_left <= 2:
        âš ï¸ Time is running out! Only {rescue_sarah_time_left} cycles left.
    - else:
        Time remaining: {rescue_sarah_time_left} cycles
    }
    
    Investigation progress: {investigation_current}/{investigation_max}
    
    { investigation_current >= investigation_max:
        âœ… You know exactly where Sarah is being held!
        
        + [Launch the rescue]
            -> rescue_scene_prepared
    - else:
        You need more clues before you can rescue her.
    }
}

+ {rescue_sarah_time_left > 1} [Investigate the warehouse] â†’ -1 time
    You spend time searching the abandoned warehouse.
    
    // Player action advances investigation clock
    // (handled in TypeScript)
    
    -> found_clue
    
+ {rescue_sarah_time_left > 2} [Question the tavern keeper] â†’ -1 time
    "I might have seen something..."
    
    -> tavern_clue
    
+ [Rush to rescue Sarah NOW] â†’ Risky!
    { investigation_current < 2:
        You don't have enough information. This is dangerous.
        
        + + [Do it anyway]
            -> rescue_scene_unprepared
        + + [Keep investigating]
            -> rescue_quest_hub
    - else:
        -> rescue_scene_partial
    }

=== found_clue ===
~ investigation_current += 1

{ investigation_current:
    - 1:
        You find a piece of torn fabric - matches Sarah's dress.
    - 2:
        Fresh wagon tracks leading north. They went this way.
    - 3:
        A dropped coin - bandit insignia. You know their camp.
    - 4:
        You've found everything. Time to move!
        -> rescue_quest_hub
}

// Time advances automatically in TypeScript
~ rescue_sarah_time_left -= 1

-> rescue_quest_hub

=== rescue_scene_prepared ===
You approach the bandit camp with a solid plan.

Your preparation pays off - you know the guard positions,
the best entry point, and exactly where Sarah is held.

-> successful_rescue

=== rescue_scene_unprepared ===
You rush in blindly. This is going to be rough.

-> difficult_rescue
```

---

## ðŸŽ¨ UI/UX DESIGN

### Clock Display (Citizen Sleeper Style)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  ACTIVE SITUATIONS                                          â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                                             â”‚
â”‚  ðŸ”´ RESCUE SARAH                                           â”‚
â”‚  â”â”â”â”â”â”â”â”â—‹â—‹â—‹â—‹  (4/6 segments)                             â”‚
â”‚  Time running out! Marcus is desperate.                     â”‚
â”‚  âš ï¸  CRITICAL: Will be moved in 2 cycles                   â”‚
â”‚                                                             â”‚
â”‚  ðŸŸ¢ INVESTIGATION                                           â”‚
â”‚  â”â”â”â”â”â”â—‹â—‹  (3/4 clues)                                    â”‚
â”‚  You're close to finding her location.                      â”‚
â”‚  Next: Question the tavern keeper                          â”‚
â”‚                                                             â”‚
â”‚  ðŸŸ¡ FOOD CRISIS                                             â”‚
â”‚  â”â”â”â”â”â—‹â—‹â—‹â—‹  (2/5 segments)                                â”‚
â”‚  Village food supply critical.                              â”‚
â”‚  Baker's oven still broken.                                â”‚
â”‚                                                             â”‚
â”‚  ðŸŸ¢ MARCUS'S TRUST                                          â”‚
â”‚  â”â”â”â”â”â”â”â”â”â”â”â”  (10/10 - COMPLETE!)                        â”‚
â”‚  Marcus trusts you completely.                              â”‚
â”‚  "You're like family to me."                               â”‚
â”‚                                                             â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

Current Mode: CYCLE MODE (Paused for your decision)
Current Cycle: 15
Time of Day: Afternoon (2 PM)

[Continue] [Fast Forward] [View Map] [Character Info]
```

### In-Game Clock Widget (Always Visible)

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚  URGENT:         â”‚
â”‚  ðŸ”´ Sarah (2/6)  â”‚
â”‚  ðŸŸ¡ Food  (2/5)  â”‚
â”‚  ðŸŸ¢ Trust (10/10)â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### Cycle Mode Transition Screen

```
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
        â¸ï¸  IMPORTANT MOMENT
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

Marcus approaches you urgently!

Recent events:
â€¢ Sarah has been missing for 3 days
â€¢ Food crisis worsening in village
â€¢ Bandits spotted near the old quarry

Active Clocks:
â€¢ ðŸ”´ Rescue Sarah: 4/6 (URGENT)
â€¢ ðŸŸ¡ Food Crisis: 2/5

What do you do?

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
```

---

## ðŸ”„ COMPLETE SYSTEM FLOW

### Full Integration Example

```typescript
// ========================================
// MAIN GAME LOOP
// ========================================

class VibeMasterGame {
  private simulation: RealTimeWorld
  private clockSystem: ClockSystem
  private cycleSystem: HybridCycleSystem
  private inkBridge: InkWorldBridge
  
  private gameMode: 'realtime' | 'cycle' = 'realtime'
  private currentCycle: number = 0
  
  // Main update loop (called every frame)
  update(deltaTime: number) {
    if (this.gameMode === 'cycle') {
      // CYCLE MODE: Paused for player decision
      this.updateCycleMode(deltaTime)
    } else {
      // REALTIME MODE: Simulation running
      this.updateRealtimeMode(deltaTime)
    }
  }
  
  updateRealtimeMode(deltaTime: number) {
    // 1. Update continuous simulation
    this.simulation.update(deltaTime)
    
    // 2. Update all clocks
    this.clockSystem.update(deltaTime)
    
    // 3. Check for pause triggers
    const trigger = this.detectPauseTrigger()
    
    if (trigger) {
      this.enterCycleMode(trigger)
    }
  }
  
  updateCycleMode(deltaTime: number) {
    // Clocks decay slowly during pause
    this.clockSystem.update(deltaTime * 0.1)
    
    // Wait for player decision
    // (UI handles input)
  }
  
  detectPauseTrigger(): PauseTrigger | null {
    // Check all pause conditions
    
    // 1. NPC wants to talk
    const talkingNPC = this.simulation.getNPCWantingDialogue()
    if (talkingNPC) {
      return { type: 'dialogue', data: { npc: talkingNPC } }
    }
    
    // 2. Clock completed or failed
    const completedClock = this.clockSystem.getRecentlyCompleted()
    if (completedClock) {
      return { type: 'clock', data: { clock: completedClock } }
    }
    
    // 3. Quest triggered
    const newQuest = this.simulation.getEmergentQuest()
    if (newQuest) {
      return { type: 'quest', data: { quest: newQuest } }
    }
    
    // 4. Combat started
    if (this.simulation.combatActive) {
      return { type: 'combat', data: {} }
    }
    
    // 5. Important location entered
    if (this.simulation.playerEnteredImportantLocation()) {
      return { type: 'location', data: { location: this.simulation.currentLocation } }
    }
    
    return null
  }
  
  enterCycleMode(trigger: PauseTrigger) {
    console.log('â¸ï¸  PAUSING: ', trigger.type)
    
    this.gameMode = 'cycle'
    this.currentCycle++
    
    // Pause simulation
    this.simulation.pause()
    
    // Sync everything to Ink
    this.syncToInk()
    
    // Present choices based on trigger
    this.presentChoices(trigger)
    
    // Show clock UI
    this.showClockUI()
  }
  
  exitCycleMode(playerChoice: PlayerChoice) {
    console.log('â–¶ï¸  RESUMING')
    
    // Process player choice
    this.processChoice(playerChoice)
    
    // Sync Ink changes back to world
    this.syncFromInk()
    
    // Resume simulation
    this.simulation.resume()
    
    this.gameMode = 'realtime'
  }
  
  syncToInk() {
    // Sync world state
    this.inkBridge.pushWorldStateToInk()
    
    // Sync clocks
    const clocks = this.clockSystem.getActiveClocks()
    clocks.forEach(clock => {
      this.inkBridge.inkStory.variablesState[`${clock.id}_current`] = 
        clock.currentSegment
      this.inkBridge.inkStory.variablesState[`${clock.id}_max`] = 
        clock.segments
      this.inkBridge.inkStory.variablesState[`${clock.id}_active`] = true
    })
    
    // Sync cycle count
    this.inkBridge.inkStory.variablesState['current_cycle'] = 
      this.currentCycle
  }
  
  syncFromInk() {
    // Pull NPC relationship changes
    this.inkBridge.pullInkToWorldState()
    
    // Check if clocks were advanced by player actions
    const clocks = this.clockSystem.getActiveClocks()
    clocks.forEach(clock => {
      const inkValue = 
        this.inkBridge.inkStory.variablesState[`${clock.id}_advance`]
      
      if (inkValue && inkValue > 0) {
        this.clockSystem.advance(clock.id, inkValue)
        
        // Reset the advance variable
        this.inkBridge.inkStory.variablesState[`${clock.id}_advance`] = 0
      }
    })
  }
  
  // Player can manually pause anytime
  playerPause() {
    if (this.gameMode === 'realtime') {
      this.enterCycleMode({ type: 'manual', data: {} })
    }
  }
  
  // Player can speed up time
  playerFastForward() {
    if (this.gameMode === 'realtime') {
      this.simulation.setSpeed(10.0)
      
      // Auto-slow on important moment
      this.onNextPauseTrigger(() => {
        this.simulation.setSpeed(1.0)
      })
    }
  }
}

// ========================================
// QUEST EXAMPLE: RESCUE SARAH
// ========================================

class RescueSarahQuestComplete {
  private game: VibeMasterGame
  private rescueClock: Clock
  private investigationClock: Clock
  
  // Day 1: Sarah gets kidnapped (emergent event)
  onSarahKidnapped() {
    console.log('ðŸ’” SARAH KIDNAPPED')
    
    // Update world state
    this.game.simulation.getNPC('sarah').status = 'kidnapped'
    this.game.simulation.getNPC('marcus').emotion = 'desperate'
    this.game.simulation.getNPC('marcus').topGoal = {
      type: 'rescue_daughter',
      priority: 100,
      target: 'sarah'
    }
    
    // DON'T pause yet - let player discover naturally
  }
  
  // Day 2: Player talks to Marcus
  onPlayerTalksMarcus() {
    // This triggers cycle mode automatically
    // (detected by simulation)
    
    // Ink dialogue shows Marcus's desperate plea
    this.game.inkBridge.triggerKnot('marcus_desperate_plea')
  }
  
  // Player accepts quest
  onQuestAccepted() {
    console.log('âœ… QUEST ACCEPTED')
    
    // Create rescue clock (time pressure)
    this.rescueClock = this.game.clockSystem.createClock({
      id: 'rescue_sarah',
      name: 'Rescue Sarah',
      segments: 6,
      decayRate: 0.3,  // Loses 0.3 per game cycle
      type: 'failure',
      icon: 'ðŸ”´',
      pauseDecayInDialogue: true,
      onComplete: () => this.onTimeExpired(),
      onFail: () => this.onTimeExpired()
    })
    
    // Create investigation clock (progress tracker)
    this.investigationClock = this.game.clockSystem.createClock({
      id: 'investigation',
      name: 'Find Sarah',
      segments: 4,
      decayRate: 0,
      type: 'success',
      icon: 'ðŸŸ¢',
      onComplete: () => this.onLocationFound()
    })
    
    // Sync to Ink
    this.game.inkBridge.inkStory.variablesState['quest_rescue_sarah_active'] = true
  }
  
  // Player investigates (costs time)
  onPlayerInvestigates() {
    // Advance investigation
    this.game.clockSystem.advance('investigation', 1)
    
    // But time passes
    this.game.clockSystem.advance('rescue_sarah', 1)
    
    // Exit cycle mode, resume simulation
    this.game.exitCycleMode({ type: 'investigate' })
  }
  
  // Found Sarah's location!
  onLocationFound() {
    console.log('ðŸŽ¯ LOCATION FOUND')
    
    // Remove time pressure (player succeeded)
    this.game.clockSystem.deleteClock('rescue_sarah')
    
    // Trigger final rescue scene
    this.game.inkBridge.triggerKnot('rescue_scene_prepared')
    
    // Pause for rescue sequence
    this.game.enterCycleMode({ 
      type: 'quest', 
      data: { quest: 'rescue_final' } 
    })
  }
  
  // Time ran out
  onTimeExpired() {
    console.log('â° TOO LATE')
    
    // Bad outcome
    this.game.simulation.getNPC('sarah').status = 'moved'
    this.game.simulation.getNPC('marcus').emotion = 'devastated'
    
    // Remove all clocks
    this.game.clockSystem.deleteClock('rescue_sarah')
    this.game.clockSystem.deleteClock('investigation')
    
    // Trigger failure scene
    this.game.inkBridge.triggerKnot('rescue_failed_time')
    
    // Marcus attempts solo rescue (emergent consequence)
    this.game.simulation.getNPC('marcus').addGoal({
      type: 'solo_rescue',
      priority: 100,
      target: 'sarah'
    })
  }
  
  // Player rushes to rescue without investigating
  onPlayerRushes() {
    console.log('ðŸƒ RUSHING TO RESCUE')
    
    // Remove clocks
    this.game.clockSystem.deleteClock('rescue_sarah')
    this.game.clockSystem.deleteClock('investigation')
    
    // Unprepared rescue - harder, worse outcome possible
    this.game.inkBridge.inkStory.variablesState['rescue_prepared'] = false
    this.game.inkBridge.triggerKnot('rescue_scene_unprepared')
  }
}
```

---

## ðŸ“‹ IMPLEMENTATION CHECKLIST

### Phase 1: Core Clock System (Week 1)
- [ ] Create Clock interface and ClockSystem class
- [ ] Implement advance/decay methods
- [ ] Add completion/failure callbacks
- [ ] Test basic clock behavior
- [ ] Create clock UI component

### Phase 2: Cycle System (Week 2)
- [ ] Implement HybridWorldSystem
- [ ] Add pause detection logic
- [ ] Create mode transition system
- [ ] Add manual pause/fast-forward
- [ ] Test real-time â†” cycle switching

### Phase 3: Ink Integration (Week 3)
- [ ] Create InkClockBridge
- [ ] Sync clocks to Ink variables
- [ ] Test Ink conditional logic with clocks
- [ ] Add clock advancement from Ink choices
- [ ] Create example Ink scripts

### Phase 4: Quest Implementation (Week 4)
- [ ] Build RescueSarahQuest example
- [ ] Add multiple simultaneous clocks
- [ ] Test emergent consequences
- [ ] Polish UI/UX
- [ ] Balance clock timing

---

## ðŸŽ¯ SUCCESS CRITERIA

### System works when:

âœ… World feels alive (real-time simulation)  
âœ… Player never misses important moments (auto-pause)  
âœ… Time pressure is visible (clock UI)  
âœ… Choices have time costs (advance clocks)  
âœ… Multiple urgent situations can overlap  
âœ… Players can manage time (pause, fast-forward)  
âœ… Ink dialogue reflects clock states  
âœ… Emergent consequences feel natural  
âœ… UI clearly shows active clocks  
âœ… Performance is smooth (60 FPS)  

---

## ðŸ’¡ DESIGN INSIGHTS

### Why This System Works

1. **Player Agency**
   - Can pause anytime
   - Can see time pressure
   - Can prioritize tasks
   - Never feels unfair

2. **Emergent Narrative**
   - Clocks create urgency
   - Multiple clocks = tough choices
   - Time pressure drives story
   - Consequences feel earned

3. **Clear Communication**
   - Always know what's urgent
   - See exactly how much time
   - Understand trade-offs
   - No hidden timers

4. **Balanced Pacing**
   - Fast-forward boring parts
   - Pause for important decisions
   - Real-time for immersion
   - Perfect flow

---

## ðŸ”® ADVANCED FEATURES (FUTURE)

### Clock Relationships

```typescript
// Clocks that affect each other
class LinkedClocks {
  // When one completes, another starts
  chainClocks(clockA: string, clockB: string) {
    this.onClockComplete(clockA, () => {
      this.createClock(clockB)
    })
  }
  
  // When one fails, another accelerates
  linkFailure(clockA: string, clockB: string) {
    this.onClockFail(clockA, () => {
      const clock = this.getClock(clockB)
      clock.decayRate *= 2  // Double decay rate
    })
  }
}
```

### Hidden Clocks

```typescript
// Clocks player doesn't see until revealed
const hiddenClock = clockSystem.createClock({
  id: 'corruption',
  name: 'Corruption Spreads',
  segments: 10,
  hidden: true,  // Not shown in UI
  onComplete: () => {
    // Surprise reveal!
    ui.showMessage('The corruption has spread too far!')
  }
})

// Reveal when player discovers it
onPlayerInvestigates() {
  hiddenClock.hidden = false
  ui.showClock('corruption')
}
```

### Clock Modifiers

```typescript
// NPCs can affect clocks
class MarcusHelps {
  // Marcus helps investigate - speeds up clock
  onMarcusJoinsParty() {
    const clock = clockSystem.getClock('investigation')
    clock.advanceMultiplier = 1.5  // 50% faster progress
  }
}
```

---

## ðŸ“š RELATED DOCUMENTS

- **VIBEMASTER_INK_INTEGRATION.md** - Ink dialogue system
- **living_world_simulation_foundation** - NPC AI & emergence
- **VIBEMASTER_PROJECT_PRIMER.md** - Overall architecture
- **VIBEMASTER_CUSTOM_INSTRUCTIONS.md** - Decentraland constraints

---

## ðŸŽ‰ CONCLUSION

**The Hybrid System gives you:**

- âœ… Immersion (real-time background simulation)
- âœ… Control (intelligent auto-pause)
- âœ… Urgency (visible clocks with time pressure)
- âœ… Strategy (prioritize multiple crises)
- âœ… Clarity (see exactly what's urgent)
- âœ… Flexibility (manual pause, fast-forward)
- âœ… Perfect Ink integration (sync on pause)

**This is the best of:**
- Dwarf Fortress (living world)
- Citizen Sleeper (clocks + cycles)
- XCOM (pause for tactics)
- Disco Elysium (narrative-driven)

**Start with simple clocks, add complexity later.**

---

*Last Updated: November 1, 2025*  
*Document Version: 1.0*  
*Part of VibeMaster Project Documentation*
