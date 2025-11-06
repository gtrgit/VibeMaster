# VibeMaster Database Schema Documentation

## Overview

This Prisma schema defines the database structure for VibeMaster, a living world simulation with autonomous NPCs, dynamic relationships, emergent events, and narrative generation. The schema is designed to support a rich, believable world where NPCs have personalities, needs, emotions, goals, and memories.

**Database:** SQLite (easily migrated to PostgreSQL)  
**Last Updated:** November 2, 2025  
**ORM:** Prisma

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Models Overview](#models-overview)
3. [Model Details](#model-details)
4. [Relationships Diagram](#relationships-diagram)
5. [Usage Examples](#usage-examples)
6. [Data Ranges & Conventions](#data-ranges--conventions)
7. [Setup & Migration](#setup--migration)

---

## Core Concepts

### The Living World Philosophy

This schema is built around several key principles:

- **NPCs as First-Class Citizens**: Every NPC has a rich internal state including personality traits, emotions, needs, memories, and goals
- **Emergent Behavior**: Complex behaviors emerge from simple rules about needs, emotions, and relationships
- **Dynamic Relationships**: Relationships between NPCs change over time based on events and interactions
- **Memory-Driven Narrative**: NPCs remember events and use those memories to inform future decisions
- **Goal-Oriented AI**: NPCs pursue goals based on their personality, needs, and current emotional state

---

## Models Overview

| Model | Purpose | Key Features |
|-------|---------|--------------|
| **World** | Global world state | Tracks current time (day/hour), contains all other entities |
| **NPC** | Autonomous characters | Personality, emotions, needs, speech patterns, state |
| **Goal** | NPC motivations | Type, priority, urgency, deadlines, plans, obstacles |
| **Relationship** | Inter-NPC dynamics | Trust, affection, respect, grudge, fear values |
| **Memory** | NPC recollections | Event descriptions, emotional impact, involved NPCs |
| **Event** | World occurrences | Type, participants, consequences, dramatic value |
| **Location** | Physical places | Resources, danger levels, type |
| **Schedule** | Daily routines | Hour-by-hour activities and locations |
| **Faction** | Group dynamics | Members, leaders, wealth, power, influence, goals |
| **Player** | Player state | Reputation, relationships, quest tracking |

---

## Model Details

### ðŸŒ World

The world container that holds all simulation state.

```prisma
model World {
  id          String   @id @default(cuid())
  name        String
  currentDay  Int      @default(0)
  currentHour Int      @default(8)  // 24-hour format
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  npcs      NPC[]
  locations Location[]
  events    Event[]
  factions  Faction[]
}
```

**Time System:**
- `currentDay`: Days since world creation (starts at 0)
- `currentHour`: Hour of the day (0-23, starts at 8am)

---

### ðŸ‘¤ NPC (Non-Player Character)

The heart of the simulation. NPCs are complex entities with personalities, emotions, needs, and memories.

#### Identity
```typescript
name: string        // "Sarah Johnson"
age: number         // 34
occupation: string  // "Blacksmith"
state: string       // "alive" | "injured" | "kidnapped" | "dead"
```

#### Big Five Personality Traits (0-100)
```typescript
openness: number           // Open to new experiences vs. traditional
conscientiousness: number  // Organized vs. spontaneous
extraversion: number       // Outgoing vs. reserved
agreeableness: number      // Compassionate vs. analytical
neuroticism: number        // Anxious vs. confident
```

**What These Mean:**
- **High Openness**: Creative, curious, adventurous
- **High Conscientiousness**: Reliable, organized, disciplined
- **High Extraversion**: Talkative, assertive, energetic
- **High Agreeableness**: Trusting, helpful, empathetic
- **High Neuroticism**: Anxious, moody, emotionally reactive

#### Values & Fears (JSON Arrays)
```typescript
values: string  // ["honesty", "family", "wealth", "power"]
fears: string   // ["death", "poverty", "abandonment", "failure"]
```

Common values: honesty, family, wealth, power, freedom, knowledge, justice, tradition, creativity, loyalty

Common fears: death, poverty, abandonment, failure, loss, betrayal, humiliation, violence

#### Speech Pattern (0-100)
```typescript
formality: number            // Casual vs. formal speech
verbosity: number            // Brief vs. elaborate
emotionalExpression: number  // Reserved vs. expressive
dialect: string              // "southern", "noble", "street"
speechQuirks: string         // ["uses metaphors", "stutters when nervous"]
```

#### Needs (0-100)
```typescript
needFood: number     // Hunger level (100 = well-fed, 0 = starving)
needSafety: number   // Sense of security
needWealth: number   // Financial security
needSocial: number   // Social connection
needPurpose: number  // Meaning and fulfillment
```

**Needs Decay:** Needs naturally decrease over time and must be replenished through actions.

#### Emotions (0-100)
```typescript
// Primary emotions
emotionHappiness: number     // Joy, contentment
emotionAnger: number         // Frustration, rage
emotionFear: number          // Anxiety, terror
emotionSadness: number       // Grief, melancholy
emotionTrust: number         // Confidence in others
emotionAnticipation: number  // Excitement, expectation

// Derived emotions (calculated from primary + context)
emotionLove: number          // happiness + trust
emotionDesperation: number   // fear + sadness + low needs
emotionGrief: number         // sadness + low social
```

#### Relations
- **goals**: Array of Goal objects
- **memories**: Array of Memory objects
- **relationships**: Bidirectional relationships with other NPCs
- **events**: Events they participated in or were targeted by
- **scheduleEntries**: Their daily routine

---

### ðŸŽ¯ Goal

What NPCs want and how they plan to achieve it.

```prisma
model Goal {
  type: string       // survival, rescue, revenge, romance, wealth, power, knowledge, escape
  target: string     // NPC id, location id, or item name
  priority: number   // 0-100 (how important)
  urgent: boolean    // Time-sensitive
  desperate: boolean // Will take extreme measures
  deadline: number?  // Day number when goal expires
  completed: boolean
  failed: boolean
  
  plan: string       // JSON array of planned actions
  obstacles: string  // JSON array of blocking factors
}
```

**Goal Types:**
- **survival**: Stay alive, avoid danger
- **rescue**: Save someone in danger
- **revenge**: Get back at someone who wronged them
- **romance**: Pursue romantic relationship
- **wealth**: Acquire money or resources
- **power**: Gain influence or control
- **knowledge**: Learn something important
- **escape**: Leave a dangerous situation

**Priority Levels:**
- 0-30: Low priority (nice to have)
- 31-60: Medium priority (important)
- 61-90: High priority (critical)
- 91-100: Desperate (will override other concerns)

---

### ðŸ’• Relationship

How NPCs feel about each other. Relationships are **directional** (Aâ†’B may differ from Bâ†’A).

```prisma
model Relationship {
  value: number     // Overall relationship (-100 to 100)
  trust: number     // Can I rely on them?
  affection: number // Do I like them?
  respect: number   // Do I admire them?
  grudge: number    // Do I resent them?
  fear: number      // Am I afraid of them?
}
```

**Value Ranges (all -100 to 100):**
- **100**: Deeply connected
- **50**: Positive relationship
- **0**: Neutral
- **-50**: Negative relationship
- **-100**: Hatred/Terror

**How Relationships Affect Behavior:**
- High trust â†’ More likely to cooperate, share information
- High affection â†’ Want to spend time together, help each other
- High respect â†’ Defer to their judgment, seek their approval
- High grudge â†’ Hold past wrongs against them, seek opportunities for revenge
- High fear â†’ Avoid them, comply with demands, flee if necessary

---

### ðŸ§  Memory

NPCs remember significant events. Memories inform decision-making and dialogue.

```prisma
model Memory {
  day: number              // When it happened
  event: string            // "John helped me escape the fire"
  emotion: string          // "grateful", "terrified", "betrayed"
  emotionalImpact: number  // 0-100 (how significant)
  involvedNpcs: string     // JSON array of NPC ids
}
```

**Memory Formation:**
- High emotional impact events are more likely to be remembered
- Memories can strengthen or weaken relationships
- NPCs may reference memories in dialogue
- Similar memories can create patterns that influence future behavior

**Emotional Impact Guidelines:**
- 0-20: Minor event, may be forgotten
- 21-50: Moderate impact, remembered if relevant
- 51-80: Significant event, strong influence on behavior
- 81-100: Life-changing event, permanent influence

---

### ðŸ“… Event

Things that happen in the world. Events drive the narrative.

```prisma
model Event {
  day: number
  hour: number
  type: string            // kidnapping, murder, theft, discovery, conversation, etc.
  description: string     // Human-readable description
  locationId: string      // Where it happened
  
  participants: NPC[]     // NPCs involved
  target: NPC?            // Specific target (if applicable)
  
  resolved: boolean       // Has the event been dealt with?
  consequences: string    // JSON array of outcomes
  dramaticValue: number   // 0-100 (narrative importance)
}
```

**Common Event Types:**
- **kidnapping**: Someone is taken against their will
- **murder**: An NPC is killed
- **theft**: Something valuable is stolen
- **discovery**: Important information is revealed
- **conversation**: Meaningful dialogue occurs
- **rescue**: Someone is saved
- **betrayal**: Trust is broken
- **romance**: Romantic development
- **conflict**: Physical or verbal confrontation

**Dramatic Value:**
- Determines which events are highlighted in narrative
- High dramatic value events should be featured in story summaries
- Used to prioritize event processing

---

### ðŸ“ Location

Physical places in the world.

```prisma
model Location {
  name: string
  description: string
  type: string          // building, outdoor, dungeon, wilderness, urban
  
  hasFood: boolean      // Can NPCs get food here?
  hasShelter: boolean   // Safe from weather?
  isPublic: boolean     // Anyone can enter?
  isDangerous: boolean  // Risk of harm?
  dangerLevel: number   // 0-100 (how dangerous)
}
```

**Location Types:**
- **building**: Shops, homes, taverns
- **outdoor**: Streets, parks, forests
- **dungeon**: Dangerous underground areas
- **wilderness**: Remote, untamed areas
- **urban**: City streets and districts

---

### ðŸ“‹ Schedule

NPC daily routines. Defines where NPCs should be and what they should be doing.

```prisma
model Schedule {
  npcId: string
  hour: number        // 0-23
  activity: string    // work, sleep, eat, socialize, patrol
  locationId: string  // Where they should be
}
```

**Common Activities:**
- **work**: Performing their occupation
- **sleep**: Resting (typically 22:00-6:00)
- **eat**: Meals (typically 7:00, 12:00, 18:00)
- **socialize**: Interacting with others
- **patrol**: Guards/law enforcement
- **pray**: Religious observance
- **relax**: Recreation, hobbies
- **travel**: Moving between locations

---

### âš”ï¸ Faction

Groups with shared goals and interests.

```prisma
model Faction {
  name: string
  type: string         // guild, government, criminal, religious, military
  memberIds: string    // JSON array of NPC ids
  leaderIds: string    // JSON array of NPC ids
  
  wealth: number       // 0-100
  power: number        // 0-100
  influence: number    // 0-100
  
  relationships: string // JSON object {factionId: value}
  goals: string        // JSON array of faction goals
}
```

**Faction Types:**
- **guild**: Trade organization (blacksmiths, merchants)
- **government**: Official authority (city guard, council)
- **criminal**: Underground organization (thieves' guild)
- **religious**: Faith-based group (temple, cult)
- **military**: Armed force (army, mercenaries)

---

### ðŸŽ® Player

Tracks player state and progress.

```prisma
model Player {
  name: string
  reputation: number        // 0-100
  relationships: string     // JSON object {npcId: value}
  activeQuests: string      // JSON array
  completedQuests: string   // JSON array
  failedQuests: string      // JSON array
  recentChoices: string     // JSON array of choice objects
}
```

---

## Relationships Diagram

```
World (1) â”€â”€â”€â”€â”¬â”€â”€â”€â”€ (âˆž) NPC
              â”œâ”€â”€â”€â”€ (âˆž) Location
              â”œâ”€â”€â”€â”€ (âˆž) Event
              â””â”€â”€â”€â”€ (âˆž) Faction

NPC (1) â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€ (âˆž) Goal
              â”œâ”€â”€â”€â”€ (âˆž) Memory
              â”œâ”€â”€â”€â”€ (âˆž) Relationship (from)
              â”œâ”€â”€â”€â”€ (âˆž) Relationship (to)
              â”œâ”€â”€â”€â”€ (âˆž) Schedule
              â”œâ”€â”€â”€â”€ (âˆž) Event (as participant)
              â”œâ”€â”€â”€â”€ (âˆž) Event (as target)
              â””â”€â”€â”€â”€ (1) Location

Faction (âˆž) â”€â”€â”€â”€ (âˆž) NPC (via memberIds JSON)
```

**Key Relationships:**
- Each NPC belongs to exactly one World and one Location
- NPCs can have multiple Goals, Memories, and Schedule entries
- Relationships are bidirectional but asymmetric (Aâ†’B â‰  Bâ†’A)
- Events can have multiple participants but only one target
- Factions track members via JSON arrays for flexibility

---

## Usage Examples

### Creating a New World

```typescript
const world = await prisma.world.create({
  data: {
    name: "Medieval Town of Ashbrook",
    currentDay: 0,
    currentHour: 8
  }
});
```

### Creating an NPC with Personality

```typescript
const npc = await prisma.nPC.create({
  data: {
    worldId: world.id,
    name: "Marcus the Blacksmith",
    age: 45,
    occupation: "Blacksmith",
    locationId: forge.id,
    
    // Personality: Introverted, conscientious craftsman
    openness: 60,
    conscientiousness: 85,
    extraversion: 30,
    agreeableness: 70,
    neuroticism: 40,
    
    values: JSON.stringify(["craftsmanship", "honesty", "tradition"]),
    fears: JSON.stringify(["poverty", "failure"]),
    
    // Speech: Formal, brief, reserved
    formality: 70,
    verbosity: 30,
    emotionalExpression: 40,
    dialect: "rural",
    
    // Starting needs (all satisfied)
    needFood: 80,
    needSafety: 90,
    needWealth: 60,
    needSocial: 40,
    needPurpose: 75,
    
    // Emotions (content but worried about business)
    emotionHappiness: 60,
    emotionAnticipation: 45,
    emotionFear: 20
  }
});
```

### Creating a Goal

```typescript
const goal = await prisma.goal.create({
  data: {
    npcId: marcus.id,
    type: "wealth",
    target: "1000 gold pieces",
    priority: 70,
    urgent: false,
    desperate: false,
    deadline: 90,  // 90 days from now
    plan: JSON.stringify([
      "work extra hours",
      "take on custom orders",
      "reduce personal expenses"
    ]),
    obstacles: JSON.stringify([
      "competition from new smith in town",
      "rising material costs"
    ])
  }
});
```

### Recording a Relationship

```typescript
// Marcus meets the new apprentice, Sarah
const relationship = await prisma.relationship.create({
  data: {
    fromNpcId: marcus.id,
    toNpcId: sarah.id,
    value: 35,          // Cautiously positive
    trust: 20,          // Still building trust
    affection: 40,      // Finds her likeable
    respect: 50,        // Respects her eagerness
    grudge: 0,
    fear: 0
  }
});
```

### Creating a Memory

```typescript
const memory = await prisma.memory.create({
  data: {
    npcId: marcus.id,
    day: world.currentDay,
    event: "Sarah helped me complete the Duke's order ahead of schedule",
    emotion: "grateful",
    emotionalImpact: 65,
    involvedNpcs: JSON.stringify([sarah.id])
  }
});

// This memory would increase Marcus's trust and affection for Sarah
```

### Recording an Event

```typescript
const event = await prisma.event.create({
  data: {
    worldId: world.id,
    day: world.currentDay,
    hour: world.currentHour,
    type: "theft",
    description: "Someone broke into Marcus's forge and stole valuable tools",
    locationId: forge.id,
    targetId: marcus.id,
    resolved: false,
    consequences: JSON.stringify([
      "Marcus's wealth need decreased by 20",
      "Marcus's fear increased by 30",
      "Marcus suspects rival smith"
    ]),
    dramaticValue: 75
  }
});
```

### Setting Up a Daily Schedule

```typescript
// Marcus's typical day
const schedule = [
  { hour: 6, activity: "wake up", locationId: home.id },
  { hour: 7, activity: "eat", locationId: home.id },
  { hour: 8, activity: "work", locationId: forge.id },
  { hour: 12, activity: "eat", locationId: tavern.id },
  { hour: 13, activity: "work", locationId: forge.id },
  { hour: 18, activity: "eat", locationId: home.id },
  { hour: 19, activity: "socialize", locationId: tavern.id },
  { hour: 21, activity: "relax", locationId: home.id },
  { hour: 22, activity: "sleep", locationId: home.id }
];

for (const entry of schedule) {
  await prisma.schedule.create({
    data: {
      npcId: marcus.id,
      ...entry
    }
  });
}
```

### Querying Complex Data

```typescript
// Get all NPCs with desperate goals
const desperateNpcs = await prisma.nPC.findMany({
  where: {
    goals: {
      some: {
        desperate: true,
        completed: false,
        failed: false
      }
    }
  },
  include: {
    goals: {
      where: { desperate: true }
    },
    location: true
  }
});

// Get all events at a location on a specific day
const eventsToday = await prisma.event.findMany({
  where: {
    worldId: world.id,
    day: world.currentDay,
    locationId: forge.id
  },
  include: {
    participants: true,
    target: true
  },
  orderBy: {
    hour: 'asc'
  }
});

// Find NPCs with strong negative relationships
const conflicts = await prisma.relationship.findMany({
  where: {
    value: {
      lt: -50  // Less than -50
    }
  },
  include: {
    fromNpc: true,
    toNpc: true
  }
});

// Get an NPC's most important memories
const significantMemories = await prisma.memory.findMany({
  where: {
    npcId: marcus.id,
    emotionalImpact: {
      gte: 70  // Greater than or equal to 70
    }
  },
  orderBy: {
    day: 'desc'
  },
  take: 10
});
```

---

## Data Ranges & Conventions

### Numeric Scales

| Field | Range | Meaning |
|-------|-------|---------|
| Personality traits | 0-100 | Low to high expression of trait |
| Speech patterns | 0-100 | One extreme to another |
| Needs | 0-100 | Empty to fully satisfied |
| Emotions | 0-100 | Not present to overwhelming |
| Relationships | -100 to 100 | Hatred to love |
| Priority | 0-100 | Ignorable to critical |
| Danger level | 0-100 | Safe to lethal |
| Dramatic value | 0-100 | Mundane to epic |

### Time System

- **Day**: Integer counter starting at 0
- **Hour**: 0-23 (24-hour format)
- Days progress automatically via simulation
- Each hour tick can process NPC actions and needs decay

### JSON Field Conventions

Many fields store JSON data for flexibility. Standard formats:

```typescript
// Arrays
values: string          // ["value1", "value2", "value3"]
goals: string           // [{type: "wealth", target: "1000 gold"}]

// Objects
relationships: string   // {"factionId1": 50, "factionId2": -30}
```

**Parsing Example:**
```typescript
const values = JSON.parse(npc.values) as string[];
const plans = JSON.parse(goal.plan) as string[];
const factionRels = JSON.parse(faction.relationships) as Record<string, number>;
```

---

## Setup & Migration

### Initial Setup

1. **Install Prisma:**
```bash
npm install prisma @prisma/client
```

2. **Set up environment:**
```bash
# .env
DATABASE_URL="file:./vibemaster.db"
```

3. **Generate Prisma Client:**
```bash
npx prisma generate
```

4. **Create database:**
```bash
npx prisma db push
```

### Running Migrations

```bash
# Create a migration
npx prisma migrate dev --name add_new_feature

# Apply migrations in production
npx prisma migrate deploy

# Reset database (âš ï¸ DELETES ALL DATA)
npx prisma migrate reset
```

### Seeding the Database

Create a seed script to populate initial data:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const world = await prisma.world.create({
    data: { name: "Ashbrook", currentDay: 0, currentHour: 8 }
  });

  const forge = await prisma.location.create({
    data: {
      worldId: world.id,
      name: "The Iron Hearth",
      description: "A smoky forge where the rhythmic clang of hammer on anvil echoes",
      type: "building",
      hasFood: false,
      hasShelter: true,
      isPublic: true
    }
  });

  // Add more seed data...
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seeding:
```bash
npx prisma db seed
```

### Database Inspection

```bash
# Open Prisma Studio (GUI)
npx prisma studio

# View database schema
npx prisma db pull
```

---

## Best Practices

### Performance Optimization

1. **Use indexes wisely**: The schema includes indexes on frequently queried fields
2. **Batch operations**: Use `createMany()` for bulk inserts
3. **Select only needed fields**: Use `select` to reduce data transfer
4. **Paginate large queries**: Use `take` and `skip` for pagination

```typescript
// Good: Select only needed fields
const names = await prisma.nPC.findMany({
  select: { name: true, occupation: true }
});

// Good: Paginate
const page = await prisma.event.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { day: 'desc' }
});
```

### Data Integrity

1. **Use transactions** for related changes:
```typescript
await prisma.$transaction([
  prisma.nPC.update({ where: { id: npcId }, data: { needFood: 100 } }),
  prisma.memory.create({ data: { /* food memory */ } }),
  prisma.event.create({ data: { /* eating event */ } })
]);
```

2. **Validate JSON data** before storing:
```typescript
const values = ["honesty", "family"];
const validatedValues = JSON.stringify(values);
```

3. **Check constraints** in application logic:
```typescript
if (emotion < 0 || emotion > 100) {
  throw new Error("Emotion must be between 0 and 100");
}
```

### Simulation Tips

1. **Needs decay over time**: Decrease needs each hour
2. **Emotions normalize**: Gradually return emotions toward baseline
3. **Goals expire**: Check deadlines and mark goals as failed
4. **Memories fade**: Reduce emotional impact of old memories
5. **Relationships evolve**: Update based on interactions

---

## Migration to PostgreSQL

To migrate from SQLite to PostgreSQL:

1. Update `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Update `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/vibemaster"
```

3. Create new migration:
```bash
npx prisma migrate dev
```

---

## Further Reading

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Big Five Personality Traits](https://en.wikipedia.org/wiki/Big_Five_personality_traits)
- [Plutchik's Wheel of Emotions](https://en.wikipedia.org/wiki/Robert_Plutchik#Plutchik's_wheel_of_emotions)
- [Goal-Oriented Action Planning](https://en.wikipedia.org/wiki/Goal-oriented_action_planning)

---

## Support

For questions about this schema or the VibeMaster project, please refer to:
- `VIBEMASTER_PROJECT_PRIMER.md` - Project overview
- `VIBEMASTER_QUICKSTART_GUIDE.md` - Getting started
- `START_HERE.md` - Initial setup instructions

---

**Last Updated:** November 3, 2025  
**Schema Version:** 1.0  
**Maintainer:** VibeMaster Development Team
