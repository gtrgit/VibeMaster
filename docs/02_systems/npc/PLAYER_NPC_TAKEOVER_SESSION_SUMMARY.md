# Player NPC Takeover System - Session Summary

**Date:** November 4, 2025  
**Status:** Concept Discussion  
**Related Systems:** NPC Behavior, Need-Based AI, Daily Cycles, Factions

---

## ðŸŽ® Core Concept

**Players don't create a new character - they take over existing NPCs in the living world.**

### Starting the Game:
1. Player chooses a starting location (town/region)
2. Views available NPCs in that location with their current state
3. Selects an NPC to "take over" and inherit their life

### Gameplay Loop:
- Player controls that NPC, making decisions and living their life
- As they travel and meet new NPCs, they can **switch control** to those NPCs
- Each NPC has their own responsibilities, relationships, and opportunities
- Goal: **Improve each NPC's life** - not just play them, but guide them to better futures

---

## ðŸ”„ Switching Mechanics

### Current Decision (For Testing):
**Make switching EASY initially**
- Simple mechanism (e.g., press TAB, select NPC)
- Instant switch for rapid testing
- Refinement comes later after playtesting

### Future Considerations:
- Should switching be restricted? (only during sleep, at specific locations, etc.)
- Cooldown periods?
- Resource costs?
- **Decision deferred until we see how easy switching feels in practice**

---

## ðŸ“‹ Responsibility & Obligation System

### Key Principle: **Social Responsibility**
**You cannot abandon an NPC's duties without consequences**

### Types of Obligations:
```typescript
- work_shift: Must complete workday or face reputation loss
- customer_order: Unfinished orders cause complaints
- faction_duty: Faction assignments must be honored
- family_commitment: Social obligations to other NPCs
```

### Consequences for Abandonment:
- **Immediate:** NPC gains negative traits ("Unreliable")
- **Social:** Reputation loss with relevant factions/NPCs
- **Economic:** Lost income, refund demands, damaged relationships
- **Persistent:** When you return to that NPC, people remember

### Clean Handoffs (No Penalties):
- Complete current work shift
- Reach a "safe" transition point (home, sleep)
- Properly set up long-term plans (education enrollment)

---

## ðŸ“š NPC Growth & Investment System

### Philosophy: **Guardian Spirit**
Players act as guides helping NPCs reach their potential, not just using them as vessels.

### Growth Mechanics:

#### Enrollment System:
```
Example: Marcus the Apprentice Blacksmith
Player Action: 
  - Save 500 gold
  - Get recommendation from Master Smith Guild
  - Enroll Marcus in Journeyman training (3 months)
  
Player switches away â†’ Marcus studies for 3 months
Player returns â†’ Marcus is now Journeyman Blacksmith with new abilities
```

#### Growth Paths Include:
- **Education:** School enrollment, skill training
- **Apprenticeships:** Learn from master craftspeople
- **Social climbing:** Build reputation, join factions
- **Career changes:** Transition between occupations

### Benefits of Growth:
- New abilities and crafting recipes
- Increased efficiency (work speed, resource yield)
- Reputation boosts with factions
- Access to new locations/opportunities
- Changed social standing

---

## ðŸŽ¯ Design Philosophy

### Natural Tutorial System:
Each NPC type teaches different game systems:
- **Farmer:** Food production, agriculture
- **Blacksmith:** Crafting, resource chains
- **Merchant:** Trade routes, economics
- **Guard Captain:** Faction systems, security

### Emergent Storytelling:
When you take over an NPC, you inherit:
- âœ… Current needs (hungry, tired, stressed)
- âœ… Active relationships (friends, rivals, family)
- âœ… Pending responsibilities (unfinished work, promises made)
- âœ… Local knowledge (places visited, NPCs met)
- âœ… Faction standing (reputation, rank, obligations)

### Investment Creates Stories:
- Help a struggling farmer become prosperous â†’ Changes town economy
- Train a guard to become captain â†’ Shifts faction power
- Educate a child â†’ Years later, they're a skilled craftsperson
- Build merchant connections â†’ Enables new trade routes

---

## ðŸ”§ Technical Integration Points

### Existing Systems This Builds On:
- âœ… **NPC Behavior System** (`need-based-behavior.ts`) - NPCs already have needs, activities
- âœ… **Daily Cycles** - NPCs already make decisions at checkpoints
- âœ… **Occupations** - 10+ working occupations with production recipes
- âœ… **Faction System** - NPCs belong to factions with ranks and roles
- âœ… **Resource Economy** - Production chains and resource management

### New Systems Required:

#### 1. NPC Control Manager
```typescript
interface NPCGuidance {
  npcId: string
  takenOverAt: GameState
  accomplishments: string[]
  relationshipsChanged: Map<string, number>
  enrolledIn?: EducationProgram
}
```

#### 2. Obligation Tracker
```typescript
interface ActiveObligation {
  type: string
  description: string
  dueBy: number
  consequences: { abandon, fail, complete }
}
```

#### 3. Growth Path Definitions
```typescript
interface NPCGrowthPath {
  currentLevel: string
  nextLevel: string
  requirements: { gold?, months?, skillChecks?, relationships? }
  benefits: string[]
}
```

---

## ðŸš€ Next Steps (Proposed)

### Phase 1: Basic Switching (Testing)
- [ ] Simple NPC selection UI
- [ ] Instant switch mechanic (no restrictions)
- [ ] Camera follows active NPC
- [ ] Basic "you are now X" notification

### Phase 2: Obligation System
- [ ] Track NPC responsibilities when taking over
- [ ] Warning UI when abandoning obligations
- [ ] Consequence implementation (reputation changes)
- [ ] "Clean handoff" detection

### Phase 3: Growth Paths
- [ ] Define growth paths for key occupations
- [ ] Education/training enrollment system
- [ ] Time-skip mechanics (NPC studies while you're away)
- [ ] Benefit application when returning

### Phase 4: Refinement
- [ ] Playtesting feedback on switch frequency
- [ ] Balance social consequences
- [ ] Add restrictions if needed
- [ ] Polish UX and narrative elements

---

## ðŸ’­ Open Questions

1. **Memory & Knowledge:**
   - Does player retain knowledge from all NPCs they've played?
   - Do NPCs "remember" what you did while controlling them?

2. **Multiple Active Characters:**
   - Can you maintain a "roster" of NPCs you regularly control?
   - Or is it one-at-a-time, fully commit?

3. **NPC AI When Not Controlled:**
   - Do they continue normal AI behavior?
   - Are they "frozen" until you return?
   - Can they improve on their own?

4. **End Goal:**
   - Is there a win condition?
   - Or is it sandbox "improve the world"?
   - Town prosperity metrics?

5. **Player Identity:**
   - Are you a specific entity (spirit, god, magic)?
   - Or abstract game mechanic?
   - Does the world acknowledge your "possession" ability?

---

## ðŸ“Ž Related Documentation

- `NPC_OCCUPATIONS_REFERENCE.md` - Working occupations and production chains
- `need-based-behavior.ts` - NPC decision-making system
- `NEED_BASED_DAILY_CYCLE.md` - How NPCs evaluate needs
- `LIVING_WORLD_POPULATION_AND_INFORMATION_SYSTEMS.md` - Faction structures
- `DAILY_CYCLE_INTEGRATION.md` - Time-based mechanics

---

## ðŸŽ¨ Core Vision

**"You are not the hero - you are the invisible hand guiding ordinary people to extraordinary lives."**

Players experience the world through many eyes, helping each person overcome their struggles and reach their potential. The game becomes about community improvement, interconnected stories, and the satisfaction of watching people thrive after you've helped them grow.
