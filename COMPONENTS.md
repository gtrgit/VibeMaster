# 🗺️ VibeMaster Component Map

**Cross-Reference Guide for Systems, Code, and Documentation**

This document maps the relationships between design documents, implementation files, database schemas, and GitHub issues. Use this to understand how everything connects.

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    VIBEMASTER STUDIO                    │
│                                                         │
│  ┌─────────────────┐         ┌─────────────────┐     │
│  │   WEB STUDIO    │────────▶│  GAME ENGINE    │     │
│  │  (Voice Input)  │         │   (Phaser 3)    │     │
│  └─────────────────┘         └─────────────────┘     │
│         │                            │                 │
│         ▼                            ▼                 │
│    [Database] ◀──────────────────── [Systems]          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 CORE SYSTEMS MATRIX

| System | Status | Design Docs | Implementation | Database | Issues |
|--------|--------|-------------|----------------|----------|--------|
| **NPC Needs** | ✅ Complete | [Need-Based Behavior](docs/02-SYSTEMS/npc/NEED_BASED_BEHAVIOR.md) | `need-based-behavior.ts` | `Need` model | #TBD |
| **Daily Cycle** | ✅ Complete | [NPC Cycles](docs/02-SYSTEMS/npc/VIBEMASTER_NPC_CYCLES_AND_CLOCKS.md) | `daily-cycle-system.ts` | `DailyCycleCheckpoint` | #TBD |
| **Location System** | ✅ Complete | [Daily Cycle Integration](docs/02-SYSTEMS/npc/DAILY_CYCLE_INTEGRATION.md) | `location-system.ts` | `Location` model | #TBD |
| **Resource Economy** | ✅ Complete | [Universal Resources](docs/02-SYSTEMS/economy/Universal_Resource___Production_Systems.md) | `resource-system-with-logging.ts` | `Resource` model | #TBD |
| **NPC Relationships** | ✅ Complete | [Relationship Storage](docs/02-SYSTEMS/npc/NPC_RELATIONSHIP_STORAGE_ANALYSIS.md) | Schema only | `Relationship` model | #TBD |
| **Database Integration** | 🔧 In Progress | [Phaser/Tauri/DB](docs/02-SYSTEMS/npc/PHASER_TAURI_DATABASE_INTEGRATION.md) | `database.ts` | All models | #TBD |
| **Travel System** | 📋 Designed | [Travel System](docs/02-SYSTEMS/travel/TRAVEL_SYSTEM.md) | Not yet | `Travel` model (needed) | #TBD |
| **Tech Propagation** | 📋 Designed | [Innovation & Tech](docs/02-SYSTEMS/tech/INNOVATION_AND_TECH_PROPAGATION_SYSTEM.md) | Not yet | `Technology` model (needed) | #TBD |
| **Narrative Engine** | 📋 Designed | [Narrative Architecture](docs/02-SYSTEMS/narrative/VIBEMASTER_NARRATIVE_ARCHITECTURE.md) | Not yet | Existing models | #TBD |
| **Player Character** | ⏳ Planned | Not designed | Not yet | `Player` model (needed) | #TBD |

**Legend:**  
✅ Complete | 🔧 In Progress | 📋 Designed | ⏳ Planned

---

## 🧩 SYSTEM DEEP DIVES

### 1. NPC Need-Based Behavior System

**What it does:** NPCs make decisions based on 5 core needs (Food, Safety, Wealth, Social, Rest)

**Components:**
```
Design:     docs/02-SYSTEMS/npc/NEED_BASED_BEHAVIOR.md
            docs/02-SYSTEMS/npc/NEED_BASED_BEHAVIOR_SESSION.md
            
Implementation: need-based-behavior.ts (✅ Complete)

Database:   schema.prisma
            - Need model (5 types, 0-100 values)
            - NPC.currentNeeds relationship
            
Dependencies:
            - Location System (NPCs move to satisfy needs)
            - Daily Cycle System (needs decay over time)
            - Resource System (food/wealth needs)
            
Used By:
            - Daily Cycle checkpoints
            - NPC decision-making AI
            - Security flee mechanic
```

**Key Functions:**
- `getNeedPriority()` - Determines which need is most urgent
- `calculateSatisfactionLocation()` - Finds best place to satisfy need
- `satisfyNeed()` - Performs action to fulfill need

**Database Schema:**
```prisma
model Need {
  id          Int      @id @default(autoincrement())
  npcId       Int
  type        String   // "food", "safety", "wealth", "social", "rest"
  value       Int      // 0-100
  lastUpdated DateTime @default(now())
  npc         NPC      @relation(fields: [npcId], references: [id])
}
```

---

### 2. Daily Cycle System

**What it does:** 24-hour simulation with 4 checkpoints/day where NPCs evaluate needs and make decisions

**Components:**
```
Design:     docs/02-SYSTEMS/npc/VIBEMASTER_NPC_CYCLES_AND_CLOCKS.md
            docs/02-SYSTEMS/npc/DAILY_CYCLE_INTEGRATION.md
            
Implementation: daily-cycle-system.ts (✅ Complete)

Database:   schema.prisma
            - DailyCycleCheckpoint model
            - NPC.checkpoints relationship
            
Dependencies:
            - Need-Based Behavior (decides actions)
            - Location System (moves NPCs)
            - World Time (global hour tracking)
            
Used By:
            - Main game loop
            - NPC AI tick
            - Event generation
```

**Key Functions:**
- `runCheckpoint()` - Evaluates all NPCs at 4 daily times
- `decayNeeds()` - Reduces need values over time
- `updateNPCState()` - Changes NPC activity/location

**Checkpoint Schedule:**
```
Morning:    Hour 6  - Wake up, plan day
Midday:     Hour 12 - Lunch, reassess
Evening:    Hour 18 - Dinner, socialize
Night:      Hour 22 - Sleep, rest
```

---

### 3. Location System

**What it does:** Manages physical spaces where NPCs live, work, and gather

**Components:**
```
Design:     docs/02-SYSTEMS/npc/DAILY_CYCLE_INTEGRATION.md
            
Implementation: location-system.ts (✅ Complete)

Database:   schema.prisma
            - Location model
            - NPC.homeId relationship
            - NPC.currentLocationId relationship
            
Dependencies:
            - None (foundational)
            
Used By:
            - Need-Based Behavior (NPCs move to locations)
            - Daily Cycle (location-based activities)
            - Resource System (production buildings)
            - Social System (shared housing)
```

**Location Types:**
```typescript
- HOME (personal dwelling)
- WORKPLACE (bakery, smithy, farm, etc.)
- SHARED (tavern, church, marketplace)
- STORAGE (warehouse, granary)
- SPECIAL (castle, harbor, etc.)
```

**Key Functions:**
- `moveNPC()` - Teleport NPC to location
- `getOccupants()` - See who's at a location
- `getNPCsAtLocation()` - Query by location type

---

### 4. Resource Production & Economy

**What it does:** NPCs produce resources at workplaces, consume them to satisfy needs

**Components:**
```
Design:     docs/02-SYSTEMS/economy/Universal_Resource___Production_Systems.md
            docs/02-SYSTEMS/economy/Transportation___Productivity.md
            
Implementation: resource-system-with-logging.ts (✅ Complete)
                resource-ui.ts (✅ Complete UI overlay)

Database:   schema.prisma
            - Resource model
            - ResourceStorage model
            - ProductionRecipe model (in code, not DB)
            
Dependencies:
            - Location System (production buildings)
            - NPC Occupations (who can make what)
            - Time System (production takes hours)
            
Used By:
            - Need satisfaction (food, wealth)
            - Trade (future)
            - Tech propagation (future)
```

**Production Chain Example:**
```
Lumberjack → Wood → Carpenter → Planks → Carpenter → Furniture
Miner → Ore → Blacksmith → Bars → Weaponsmith → Weapons
Farmer → Wheat → Baker → Bread → NPC consumption
```

**Key Functions:**
- `startProduction()` - Begin crafting
- `updateProduction()` - Check for completion
- `addToStorage()` - Store finished goods

**12 Working Occupations:**
```
✅ lumberjack, miner, blacksmith, farmer
✅ baker, tailor, healer, herbalist
✅ carpenter, weaponsmith, (+ 2 more)
```

---

### 5. NPC Relationship System

**What it does:** Tracks trust, affection, respect between NPCs; influences decisions

**Components:**
```
Design:     docs/02-SYSTEMS/npc/NPC_RELATIONSHIP_STORAGE_ANALYSIS.md
            
Implementation: Schema only (✅ Database ready)
                Need behavior code (⏳ Not yet implemented)

Database:   schema.prisma
            - Relationship model
            - trust, affection, respect (0-100)
            - NPC.relationshipsFrom / relationshipsTo
            
Dependencies:
            - NPC System (who relates to whom)
            - Event System (interactions change relationships)
            
Used By:
            - Social need satisfaction (future)
            - Dialogue generation (future)
            - Faction formation (future)
            - Teaching/learning (future)
```

**Database Schema:**
```prisma
model Relationship {
  id         Int  @id @default(autoincrement())
  npcFromId  Int
  npcToId    Int
  trust      Int  @default(50)  // 0-100
  affection  Int  @default(50)  // 0-100
  respect    Int  @default(50)  // 0-100
  
  npcFrom NPC @relation("RelationshipsFrom", fields: [npcFromId], references: [id])
  npcTo   NPC @relation("RelationshipsTo", fields: [npcToId], references: [id])
}
```

---

### 6. World Simulation & Time

**What it does:** Global clock, day/night cycle, world state management

**Components:**
```
Design:     docs/02-SYSTEMS/world/living_world_simulation_foundation.md
            
Implementation: WorldSimulation (in main.ts, partial)
                get-world-state.ts (query utilities)

Database:   schema.prisma
            - WorldState model
            - currentDay, currentHour
            
Dependencies:
            - None (foundational)
            
Used By:
            - Daily Cycle System (triggered by time)
            - All systems (time-based logic)
            - Event generation
```

**Time Structure:**
```
1 Day = 24 Hours
1 Hour = Real-time seconds (configurable)
Checkpoints at: 6, 12, 18, 22
```

---

### 7. Database Layer (Prisma + SQLite)

**What it does:** Persistent storage, ORM, migrations

**Components:**
```
Design:     docs/02-SYSTEMS/npc/PHASER_TAURI_DATABASE_INTEGRATION.md
            docs/02-SYSTEMS/npc/NPC_DATABASE_OPTIMIZATION.md
            docs/04-PROGRESS/SCHEMA_README.md
            
Implementation: database.ts (🔧 In Progress)
                schema.prisma (✅ Complete)
                migration.sql (✅ Complete)

Database:   prisma/schema.prisma (master schema)
            
Dependencies:
            - Tauri (file system access)
            - Prisma Client
            
Used By:
            - ALL systems (data persistence)
```

**Core Models:**
```
NPC               - Character data
Need              - Current need values
Goal              - NPC objectives
Memory            - Event recollection
Relationship      - Social graph
Location          - Physical spaces
Resource          - Economy items
WorldState        - Global state
```

**Connection Status:**
- ✅ Schema designed
- ✅ Migrations written
- 🔧 Tauri integration in progress
- ⏳ CRUD operations testing needed

---

### 8. Narrative Generation System

**What it does:** Claude generates dynamic dialogue, quest text, event descriptions

**Components:**
```
Design:     docs/02-SYSTEMS/narrative/VIBEMASTER_NARRATIVE_ARCHITECTURE.md
            docs/02-SYSTEMS/narrative/VIBEMASTER_CLAUDE_NARRATIVE_ENGINE.md
            docs/02-SYSTEMS/narrative/VIBEMASTER_INK_INTEGRATION.md
            
Implementation: Not yet (📋 Designed, ready to build)

Database:   Uses existing NPC, Memory, Relationship, Event models
            
Dependencies:
            - Claude API
            - World state
            - NPC memories
            - Relationship graph
            
Used By:
            - Dialogue system
            - Quest generation
            - Event narration
```

**Narrative Flow:**
```
1. Player triggers conversation
2. System gathers NPC state + recent memories
3. Claude generates contextual dialogue
4. Dialogue runs through Ink engine
5. Player choices update world state
6. Consequences ripple through simulation
```

---

### 9. Technology Propagation System

**What it does:** NPCs discover, learn, and spread innovations; simulation accelerates

**Components:**
```
Design:     docs/02-SYSTEMS/tech/INNOVATION_AND_TECH_PROPAGATION_SYSTEM.md
            docs/02-SYSTEMS/tech/EFFICIENCY_DETECTION_AND_METRICS_SYSTEM.md
            (60+ pages of detailed design)
            
Implementation: Not yet (📋 Designed, ready to build)

Database:   Needs new models:
            - Technology
            - TechKnowledge (who knows what)
            - Blueprint (written knowledge)
            
Dependencies:
            - NPC Attributes (intelligence, skills)
            - Relationship System (teaching/learning)
            - Literacy (reading/writing)
            - Resource System (efficiency gains)
            
Used By:
            - Economic simulation
            - Efficiency metrics
            - Historical progression
```

**Example Tech Chain:**
```
Basic Tools (starting tech)
  ↓
Better Axes (doubles wood production)
  ↓
Sawmills (quadruples wood production)
  ↓
Mass Production (unlocks factories)
```

---

### 10. Travel & Transportation

**What it does:** NPCs travel between settlements; transportation methods affect time/capacity

**Components:**
```
Design:     docs/02-SYSTEMS/travel/TRAVEL_SYSTEM.md
            docs/02-SYSTEMS/economy/Transportation___Productivity.md
            
Implementation: Not yet (📋 Designed, ready to build)

Database:   Needs new models:
            - TravelRoute
            - Vehicle
            - RoadNetwork
            
Dependencies:
            - Location System (origin/destination)
            - Time System (travel duration)
            - Resource System (carry capacity)
            
Used By:
            - Inter-settlement trade
            - Migration
            - Player exploration
```

**Transportation Methods:**
```
Walking:     1x speed, low capacity
Horse:       3x speed, medium capacity
Cart:        1.5x speed, HIGH capacity
Ship:        2x speed, VERY HIGH capacity
```

---

## 🔗 FILE TO DOCUMENTATION MAP

### Implementation Files → Design Docs

| Implementation File | Primary Design Doc | Secondary Docs |
|--------------------|--------------------|----------------|
| `need-based-behavior.ts` | [Need-Based Behavior](docs/02-SYSTEMS/npc/NEED_BASED_BEHAVIOR.md) | [Daily Cycle Integration](docs/02-SYSTEMS/npc/DAILY_CYCLE_INTEGRATION.md) |
| `daily-cycle-system.ts` | [NPC Cycles and Clocks](docs/02-SYSTEMS/npc/VIBEMASTER_NPC_CYCLES_AND_CLOCKS.md) | [Need-Based Behavior](docs/02-SYSTEMS/npc/NEED_BASED_BEHAVIOR.md) |
| `location-system.ts` | [Daily Cycle Integration](docs/02-SYSTEMS/npc/DAILY_CYCLE_INTEGRATION.md) | - |
| `resource-system-with-logging.ts` | [Universal Resources](docs/02-SYSTEMS/economy/Universal_Resource___Production_Systems.md) | [Transportation](docs/02-SYSTEMS/economy/Transportation___Productivity.md) |
| `resource-ui.ts` | [Universal Resources](docs/02-SYSTEMS/economy/Universal_Resource___Production_Systems.md) | - |
| `database.ts` | [Phaser/Tauri/DB Integration](docs/02-SYSTEMS/npc/PHASER_TAURI_DATABASE_INTEGRATION.md) | [DB Optimization](docs/02-SYSTEMS/npc/NPC_DATABASE_OPTIMIZATION.md) |
| `schema.prisma` | [Schema README](docs/04-PROGRESS/SCHEMA_README.md) | [Current State](docs/00-START-HERE/VIBEMASTER_CURRENT_STATE_DOCUMENTATION.md) |
| `main.ts` | [Project Primer](docs/01-ARCHITECTURE/VIBEMASTER_PROJECT_PRIMER.md) | [Quick Reference](docs/00-START-HERE/VIBEMASTER_QUICK_REFERENCE.md) |
| `WorldSimulation` (class) | [Living World Foundation](docs/02-SYSTEMS/world/living_world_simulation_foundation.md) | - |
| `NPC.ts` | [Living World Foundation](docs/02-SYSTEMS/world/living_world_simulation_foundation.md) | [NPC Attributes](docs/02-SYSTEMS/npc/NPC_ATTRIBUTE_SYSTEM.md) |

---

## 📦 RELATED SYSTEMS

### Dependencies Graph

```
World Time System
    ├── Daily Cycle System
    │   ├── Need-Based Behavior
    │   │   ├── Location System
    │   │   │   └── Resource System
    │   │   │       └── Occupation System
    │   │   └── Relationship System
    │   └── Event Generation
    │
    └── Resource Production
        └── Storage System

Database Layer (underlying everything)
    └── Prisma ORM
        └── SQLite
```

### Cross-System Interactions

| System A | Interacts With | Via | Purpose |
|----------|----------------|-----|---------|
| Need-Based Behavior | Location System | `moveNPC()` | Satisfy needs |
| Daily Cycle | Need-Based Behavior | `runCheckpoint()` | Trigger decisions |
| Resource System | Location System | `getProductionBuilding()` | Find workplace |
| NPC Occupations | Resource System | `getRecipe()` | What can I make? |
| Relationship | Narrative | `getRelationship()` | Dialogue tone |
| Travel | Location | `calculateDistance()` | Journey time |
| Tech Propagation | Efficiency | `detectBottleneck()` | Innovation triggers |

---

## 🎯 INTEGRATION PRIORITIES

### Phase 1: Core Integration (Current Focus)

**Goal:** Get living world visually working

```
Tasks:
1. ✅ Complete database.ts connection
2. ✅ Test Prisma in Tauri context
3. ✅ Render NPCs in Phaser
4. ✅ Show daily cycle visually
5. ✅ Display resource production
6. ✅ Implement player character
```

**Files Involved:**
- `database.ts` (🔧 finish)
- `main.ts` (🔧 integrate)
- `daily-cycle-system.ts` (✅ done)
- `need-based-behavior.ts` (✅ done)
- `resource-system-with-logging.ts` (✅ done)

---

### Phase 2: Player Interaction

**Goal:** Player can interact with living world

```
Tasks:
1. ⏳ Conversation system
2. ⏳ Natural language queries
3. ⏳ Quest generation
4. ⏳ Observation commands
```

**New Files Needed:**
- `conversation-system.ts`
- `query-parser.ts`
- `quest-generator.ts`

**Dependencies:**
- Narrative Architecture docs
- Claude API integration
- Ink dialogue engine

---

### Phase 3: Advanced Systems

**Goal:** Complete designed systems

```
Tasks:
1. ⏳ Tech propagation
2. ⏳ Travel system
3. ⏳ Faction formation
4. ⏳ Efficiency metrics
```

**New Files Needed:**
- `tech-propagation.ts`
- `travel-system.ts`
- `faction-manager.ts`
- `efficiency-metrics.ts`

---

## 🐛 DEBUGGING GUIDE

### "Where is X implemented?"

1. Check this COMPONENTS.md
2. Search in `src/systems/` folder
3. Check `schema.prisma` for database models
4. Search documentation in `docs/02-SYSTEMS/`

### "What depends on X?"

1. Find X in Dependencies Graph above
2. Check "Used By" in system deep dive
3. Search codebase for imports of X

### "Is X complete?"

1. Check Status in Core Systems Matrix
2. Review Current State doc: `docs/00-START-HERE/VIBEMASTER_CURRENT_STATE_DOCUMENTATION.md`
3. Look for GitHub issues

---

## 📚 QUICK REFERENCE

### Documentation Hierarchy

```
00-START-HERE/          ← New users start here
  ├── Quick Reference   (5 min read)
  ├── Project Status    (15 min read)
  └── Current State     (complete inventory)

01-ARCHITECTURE/        ← Understanding the vision
  ├── Project Primer    (complete philosophy)
  ├── Diagrams          (visual architecture)
  └── Technical Decisions (why we built it this way)

02-SYSTEMS/            ← Deep dives into each system
  ├── npc/             (NPC behavior, needs, attributes)
  ├── world/           (simulation, population, world state)
  ├── economy/         (resources, trade, transportation)
  ├── narrative/       (dialogue, quests, storytelling)
  ├── travel/          (movement, distance, vehicles)
  └── tech/            (innovation, propagation, efficiency)

03-IMPLEMENTATION/     ← How to build it
  ├── Quickstart Guide
  ├── Setup Instructions
  └── Custom Instructions (AI assistant guide)

04-PROGRESS/           ← Current status
  ├── Studio Progress Report
  ├── Database Schema README
  └── (future progress logs)
```

### Key Entry Points

| I want to... | Read this... |
|-------------|-------------|
| Understand the big picture | [Project Primer](docs/01-ARCHITECTURE/VIBEMASTER_PROJECT_PRIMER.md) |
| See what's working now | [Current State](docs/00-START-HERE/VIBEMASTER_CURRENT_STATE_DOCUMENTATION.md) |
| Start developing | [Setup Instructions](docs/03-IMPLEMENTATION/SETUP_INSTRUCTIONS_EXISTING_PROJECT.md) |
| Understand one system | Find it in `docs/02-SYSTEMS/` |
| Find code for a feature | Use this COMPONENTS.md file |
| See the roadmap | [ROADMAP.md](ROADMAP.md) |

---

## 🔄 KEEPING THIS UPDATED

When you:
- **Add a new system**: Update Core Systems Matrix
- **Create a file**: Add to File To Documentation Map
- **Complete a feature**: Change status symbols (⏳→📋→🔧→✅)
- **Create GitHub issue**: Link in Core Systems Matrix
- **Change architecture**: Update Dependencies Graph

---

**Last Updated**: November 7, 2025  
**Maintained By**: Project maintainers  
**Review Frequency**: Weekly during active development

---

*This is a living document. Keep it synchronized with actual implementation.*
