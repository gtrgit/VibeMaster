# Surname & Clan System - Medieval Family Identity

**Date:** November 8, 2025
**Status:** Design Specification
**Purpose:** Define surname-based clan system for medieval immersion and emergent family dynamics

---

## 🎯 Core Concept

**Surnames as Clan Identifiers:**
- Every NPC has a surname that identifies their family/clan
- NPCs with the same surname are considered family members
- Clans have collective properties: reputation, wealth, traditions, relationships
- Family bonds create emergent social dynamics and narrative tension

**Design Philosophy:**
> "In medieval society, your family name defined your social standing, occupation, and relationships. The Blackwood clan feuding with the Irons, the Smith family passing down their craft through generations - these weren't designed features, they emerged from the simple fact that family mattered."

---

## 📊 Database Schema

### NPC Schema Changes

```typescript
// /prisma/schema.prisma

model NPC {
  // Name fields (changed from single 'name')
  firstName  String        // Given name: "Marcus", "Elena"
  surname    String        // Clan identifier: "Blackwood", "Smith"
  fullName   String        // Computed: "Marcus Blackwood"

  // Clan relationship
  clanId     String?       // Optional reference to Clan
  clan       Clan?         @relation(fields: [clanId], references: [id])

  // Existing fields...
  id         String        @id @default(cuid())
  worldId    String
  world      World         @relation(fields: [worldId], references: [id])
  // ... rest of existing NPC fields

  @@index([surname])       // Fast lookups by surname
  @@index([clanId])        // Fast clan member queries
  @@index([worldId, surname]) // Compound index for world-specific clan queries
}
```

### New Clan Model

```typescript
// /prisma/schema.prisma

model Clan {
  id              String    @id @default(cuid())
  worldId         String
  world           World     @relation(fields: [worldId], references: [id])

  // Identity
  surname         String    // "Blackwood", "Ironforge", "Swift"

  // Collective properties
  reputation      Int       @default(50)  // 0-100, affects all members
  wealth          Int       @default(50)  // 0-100, clan resources
  influence       Int       @default(50)  // 0-100, political power

  // Culture & traditions
  traditions      String    @default("[]")      // JSON: ["blacksmithing", "honor"]
  clanValues      String    @default("[]")      // JSON: ["loyalty", "craftsmanship"]
  culturalPractices String  @default("{}")      // JSON: {marriageRituals, funeralRites}

  // Location
  homeLocationId  String?
  homeLocation    Location? @relation(fields: [homeLocationId], references: [id])
  originRegion    String?   // "Northern Mountains", "Coastal Plains"

  // Inter-clan relationships
  clanRelations   String    @default("{}")      // JSON: {clanId: relationshipValue}
  alliances       String    @default("[]")      // JSON: [clanId, clanId]
  feuds           String    @default("[]")      // JSON: [clanId, clanId]

  // History
  foundedYear     Int?      // Game world year
  founderName     String?   // First known member
  historicalEvents String   @default("[]")      // JSON: [{year, event, impact}]

  // Members
  members         NPC[]

  // Metadata
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([worldId, surname]) // One clan per surname per world
  @@index([worldId])
  @@index([surname])
  @@index([reputation])
}
```

---

## 🎮 Gameplay Mechanics

### 1. Family Bonding System

```typescript
// /src/systems/clan/clan-bonding.ts

interface FamilyBonuses {
  // Automatic relationship bonuses
  sameSurname: {
    baseRelationship: 30,        // Start at +30 instead of 0
    trustBonus: 20,               // Easier to build trust
    forgivenessBonus: 15,         // Recover from conflicts faster
  },

  // Clan loyalty effects
  clanDefense: {
    insultToClan: -20,            // "You insult my family!"
    harmToClanMember: -40,        // "They hurt my brother!"
    praiseClan: +10,              // "Thank you for honoring us"
  },

  // Help priority
  requestHelp: {
    clanMember: 80,               // 80% chance to help family
    ally: 50,                     // 50% for friends
    neutral: 20,                  // 20% for strangers
    rival: 5,                     // 5% for rivals
  }
}
```

### 2. Living Arrangements

```typescript
// /src/systems/clan/clan-housing.ts

interface ClanHousingPreferences {
  // NPCs prefer to live near family
  proximity: {
    sameBuilding: 60,             // 60% want same building as family
    sameDistrict: 25,             // 25% nearby
    nearAlliedClan: 10,           // 10% near clan allies
    independent: 5,               // 5% live alone
  },

  // Multi-generational homes
  householdComposition: {
    nuclear: 40,                  // Parents + children
    extended: 35,                 // Include grandparents/aunts/uncles
    compound: 15,                 // Multiple related families
    single: 10,                   // Unmarried or widowed
  },

  // Inheritance
  housingInheritance: {
    onDeath: "pass_to_eldest",    // House goes to eldest child
    noHeirs: "pass_to_clan",      // If no children, clan member gets it
    homeless: "clan_provides",    // Clan helps homeless members
  }
}
```

### 3. Trait Inheritance

```typescript
// /src/systems/clan/clan-inheritance.ts

interface TraitInheritance {
  // Children inherit from parents AND clan
  personality: {
    fromParents: 60,              // 60% weight on parent average
    fromClan: 30,                 // 30% weight on clan traditions
    random: 10,                   // 10% random variation
    variance: 10,                 // ±10 points from inherited base
  },

  // Occupation inheritance
  profession: {
    sameAsParent: 50,             // 50% chance same as parent
    relatedToClan: 30,            // 30% other clan profession
    newProfession: 20,            // 20% break tradition
  },

  // Skills start higher for family craft
  skillBonus: {
    familyCraft: +20,             // +20 starting skill if family trade
    relatedSkill: +10,            // +10 for related skills
  },

  // Values inheritance
  values: {
    adoptClanValue: 70,           // 70% chance to adopt each clan value
    rejectValue: 20,              // 20% chance to rebel against value
    createNew: 10,                // 10% develop unique value
  }
}
```

### 4. Clan Reputation System

```typescript
// /src/systems/clan/clan-reputation.ts

interface ClanReputationEffects {
  // Individual actions affect whole clan
  actionImpact: {
    heroicDeed: +5,               // One member's heroism helps all
    crime: -10,                   // One member's crime shames all
    innovation: +8,               // Discovering new tech boosts clan
    betrayal: -15,                // Betraying town hurts family name
  },

  // Reputation affects opportunities
  reputationModifiers: {
    highReputation: {             // Reputation > 70
      tradePrices: 0.9,           // 10% discount
      questOffers: 1.5,           // 50% more quests
      marriageProposals: 2.0,     // 2x marriage interest
      leadershipChance: 1.8,      // More likely elected
    },
    lowReputation: {              // Reputation < 30
      tradePrices: 1.2,           // 20% markup
      questOffers: 0.5,           // Fewer quests
      guardSuspicion: 2.0,        // Guards watch closely
      banRisk: true,              // Might get exiled
    }
  },

  // Collective responsibility
  familyPride: {
    memberSucceeds: "clan_celebrates",    // Whole family proud
    memberFails: "clan_supports",         // Family helps rebuild
    memberDisgraced: "clan_intervenes",   // Elders get involved
  }
}
```

### 5. Inter-Clan Dynamics

```typescript
// /src/systems/clan/clan-relations.ts

interface ClanRelationshipTypes {
  // Relationship states
  allied: {
    relationValue: 60,            // +60 to +100
    effects: {
      memberBonus: +10,           // Members like each other
      tradeBonus: 0.85,           // 15% better trade
      marriageCommon: true,       // Families intermarry
      sharedDefense: true,        // Defend each other
    }
  },

  friendly: {
    relationValue: 30,            // +30 to +59
    effects: {
      memberBonus: +5,
      tradeBonus: 0.95,
      cooperation: "occasional",
    }
  },

  neutral: {
    relationValue: 0,             // -29 to +29
    effects: {
      memberBonus: 0,
      tradeBonus: 1.0,
      cooperation: "transactional",
    }
  },

  rival: {
    relationValue: -30,           // -30 to -59
    effects: {
      memberBonus: -15,
      tradeBonus: 1.2,            // 20% markup
      competition: "active",
      insultCommon: true,
    }
  },

  feud: {
    relationValue: -60,           // -60 to -100
    effects: {
      memberBonus: -40,
      tradeBan: true,             // Won't trade
      violence: "likely",         // Physical conflicts
      generational: true,         // Children inherit hatred
    }
  }
}

interface FeudMechanics {
  // Blood feuds create dramatic stories
  feudTriggers: {
    murder: -80,                  // Killing clan member
    theft: -30,                   // Stealing from clan
    betrayal: -50,                // Breaking alliance
    insult: -10,                  // Public dishonor
  },

  // Feuds escalate over time
  escalation: {
    insult: "argument",
    argument: "brawl",
    brawl: "vendetta",
    vendetta: "blood_feud",
  },

  // Resolution paths
  resolution: {
    publicApology: +20,           // Humble apology
    compensation: +30,            // Pay weregild
    marriage: +50,                // Unite families
    exile: +15,                   // Remove offender
    time: +1,                     // +1 per year (slow)
  }
}
```

---

## 🏰 Surname Generation

### Medieval Surname Categories

```typescript
// /src/systems/clan/surname-generator.ts

const SURNAME_CATEGORIES = {
  // 1. OCCUPATION-BASED (40% of surnames)
  craft: [
    "Smith", "Fletcher", "Cooper", "Tanner",
    "Wright", "Mason", "Brewer", "Weaver",
    "Miller", "Baker", "Butcher", "Chandler",
    "Thatcher", "Sawyer", "Dyer", "Fuller"
  ],

  // 2. LOCATION-BASED (30% of surnames)
  geography: [
    "Wood", "Hill", "Brook", "Stone",
    "Ford", "Dale", "Field", "Marsh",
    "River", "Lake", "Glen", "Ridge",
    "Vale", "Cliff", "Bridge", "Shore"
  ],

  // 3. PATRONYMIC (15% of surnames)
  // Father's name + son/daughter
  patronymic: {
    pattern: "{FatherName}son",
    examples: ["Johnson", "Richardson", "Thompson", "Wilson"]
  },

  // 4. DESCRIPTIVE (10% of surnames)
  traits: [
    "Strong", "Swift", "Wise", "Brave",
    "Long", "Short", "Fair", "Dark",
    "Young", "Elder", "Bold", "Kind"
  ],

  // 5. COMPOUND/FANTASY (5% of surnames)
  // Medieval-fantasy feel
  compound: [
    "Blackwood", "Ironforge", "Stoneheart", "Goldleaf",
    "Wolfsbane", "Ravenshaw", "Stormwind", "Brightwater",
    "Deepwater", "Highhill", "Fairweather", "Strongarm"
  ]
}

// Generation logic
function generateClanSurname(
  occupation?: string,
  region?: string,
  founderName?: string
): string {
  // Weight by category
  const category = weightedRandom({
    craft: 0.40,
    geography: 0.30,
    patronymic: 0.15,
    traits: 0.10,
    compound: 0.05
  })

  // Match to NPC context
  if (occupation && category === 'craft') {
    // "Smith" family are smiths
    return occupationToSurname(occupation)
  }

  if (region && category === 'geography') {
    // "Hill" family from Hillside
    return regionToSurname(region)
  }

  if (founderName && category === 'patronymic') {
    // "Richardson" from founder Richard
    return founderName + "son"
  }

  // Otherwise random from category
  return randomFromCategory(category)
}
```

### Regional Variations

```typescript
// Different cultures = different naming patterns
const REGIONAL_SURNAME_STYLES = {
  northern: {
    // Harsh consonants, winter themes
    patterns: ["Frost", "Ice", "North", "Winter"],
    compounds: ["Frostbeard", "Iceheart", "Winterborn"]
  },

  coastal: {
    // Sea-related names
    patterns: ["Fisher", "Sailor", "Anchor", "Wave"],
    compounds: ["Deepwater", "Saltwind", "Tidecaller"]
  },

  mountain: {
    // Stone and height references
    patterns: ["Stone", "Peak", "Cliff", "Height"],
    compounds: ["Stonefist", "Highpeak", "Cliffdweller"]
  },

  forest: {
    // Nature and wood themes
    patterns: ["Wood", "Green", "Leaf", "Branch"],
    compounds: ["Blackwood", "Greenleaf", "Oakenshield"]
  }
}
```

---

## 📖 Narrative Examples

### Example 1: The Romeo & Juliet Dynamic

```typescript
// Two clans in blood feud
const scenario1 = {
  setup: {
    blackwoods: {
      surname: "Blackwood",
      occupation: "Woodcutters",
      reputation: 65,
      relation_to_ironforge: -70  // Blood feud
    },
    ironforges: {
      surname: "Ironforge",
      occupation: "Smiths",
      reputation: 70,
      relation_to_blackwood: -70   // Blood feud
    },
    historicalEvent: {
      year: -20,
      event: "Blackwood accused Ironforge of stealing timber",
      result: "Escalated to blood feud"
    }
  },

  emergentStory: {
    year: 0,
    marcus_blackwood: {
      age: 22,
      occupation: "Woodcutter",
      personality: { openness: 75 },  // Open-minded
    },
    elena_ironforge: {
      age: 20,
      occupation: "Apprentice Smith",
      personality: { openness: 80 },
    },

    // They meet at market
    meetCute: "Both reach for same apple",

    // System creates tension automatically
    obstacles: {
      family_disapproval: -50,      // Families forbid it
      clan_pressure: -30,           // "You shame us!"
      social_cost: "ostracism",     // Other Blackwoods avoid Marcus

      // But love persists
      relationship_growth: +5,      // Per interaction
      secret_meetings: true,        // Hide from families
    },

    // Potential outcomes
    resolutions: [
      "elopement",                  // Run away together
      "family_reconciliation",      // Love ends feud
      "tragedy",                    // Families prevent it
      "secret_marriage",            // Marry in secret
    ]
  }
}
```

### Example 2: Family Business Legacy

```typescript
const scenario2 = {
  // Smith clan = generations of blacksmiths
  smithClan: {
    surname: "Smith",
    founded: -150,                  // 150 years ago
    founder: "Harald Smith",
    traditions: ["blacksmithing", "metalwork", "quality_over_speed"],
    clanValues: ["craftsmanship", "honesty", "hard_work"],
    reputation: 80,                 // Excellent reputation

    // Family tree
    generations: {
      generation1: "Harald Smith (founder)",
      generation2: "Erik Smith (Harald's son)",
      generation3: "Thomas Smith (Erik's son)",
      generation4: "Young Marcus Smith (Thomas's son, age 16)",
    }
  },

  inheritance: {
    // Marcus inherits:
    startingSkills: {
      blacksmithing: 25,            // +20 family bonus +5 training
      metalworking: 20,
      strength: 60,                 // Parents were strong
    },

    personality: {
      conscientiousness: 70,        // Inherited work ethic
      openness: 40,                 // Traditional family
    },

    socialPosition: {
      reputation: 80,               // Inherits family reputation
      relationships: {
        "other_smiths": +20,        // Respected by peers
        "customers": +15,           // "Good family name"
        "merchants": +10,           // "Smiths are honest"
      }
    },

    expectations: {
      occupation: "blacksmith",     // 80% chance
      alternativePaths: {
        weaponsmith: 15,            // Specialized smith
        merchant: 3,                // Rebel - sell not make
        other: 2,                   // Complete break
      }
    }
  },

  // Story hook
  conflict: {
    situation: "Marcus wants to be a bard, not a smith",
    familyReaction: {
      father: "disappointed",       // "You shame our craft"
      mother: "supportive",         // "Follow your heart"
      grandfather: "furious",       // "You break tradition!"
      clan: "confused",             // "No Smith is a bard"
    },

    stakes: {
      acceptance: "Be true to self, lose family support",
      tradition: "Be miserable, keep family honor",
      compromise: "Smith by day, music by night",
    }
  }
}
```

### Example 3: Clan War

```typescript
const scenario3 = {
  // Economic competition turns violent
  conflict: {
    clans: ["Fletcher", "Bowyer"],  // Both make arrows/bows

    trigger: {
      year: 0,
      event: "Fletcher clan invents superior arrow design",
      impact: "Bowyer clan loses customers",
    },

    escalation: [
      {
        year: 0,
        action: "Bowyer accuses Fletcher of copying",
        clanRelation: -20,
      },
      {
        year: 1,
        action: "Fletcher member insults Bowyer quality",
        clanRelation: -35,
        publicEvent: "Tavern brawl",
      },
      {
        year: 2,
        action: "Bowyer sabotages Fletcher workshop",
        clanRelation: -60,
        consequence: "Fire destroys tools",
      },
      {
        year: 3,
        action: "Fletcher member wounds Bowyer in revenge",
        clanRelation: -85,
        consequence: "Blood feud declared",
      }
    ],

    // Town must intervene
    townResponse: {
      mayorAction: "Call town meeting",
      demand: "End the violence or face exile",

      possibleOutcomes: {
        peaceCouncil: {
          action: "Mediated negotiation",
          result: "Divide market 60/40",
          clanRelation: -20,  // Still rivals but no violence
        },
        exile: {
          action: "Exile Bowyer clan",
          result: "Fletchers dominate, reputation -20 for cruelty",
        },
        integration: {
          action: "Forced marriage between heirs",
          result: "Clans merge over time, new surname 'Fletcher-Bowyer'",
        }
      }
    }
  }
}
```

---

## 🔄 Migration Strategy

### Migrating Existing NPCs

```typescript
// /src/migrations/add-clan-system.ts

async function migrateExistingNPCsToClans(worldId: string) {
  const npcs = await prisma.nPC.findMany({
    where: { worldId },
    include: { location: true }
  })

  // Step 1: Generate surnames for existing NPCs
  for (const npc of npcs) {
    const currentName = npc.name  // "Marcus" or "Marcus Smith"
    const parts = currentName.split(' ')

    let firstName: string
    let surname: string

    if (parts.length >= 2) {
      // Already has surname
      firstName = parts[0]
      surname = parts.slice(1).join(' ')
    } else {
      // Generate surname based on occupation
      firstName = parts[0]
      surname = generateClanSurname(
        npc.occupation,
        npc.location?.name,
        firstName
      )
    }

    // Find or create clan
    let clan = await prisma.clan.findUnique({
      where: {
        worldId_surname: {
          worldId,
          surname
        }
      }
    })

    if (!clan) {
      clan = await prisma.clan.create({
        data: {
          worldId,
          surname,
          reputation: 50,
          wealth: 50,
          influence: 50,
          homeLocationId: npc.locationId,
        }
      })
    }

    // Update NPC
    await prisma.nPC.update({
      where: { id: npc.id },
      data: {
        firstName,
        surname,
        fullName: `${firstName} ${surname}`,
        clanId: clan.id
      }
    })
  }

  // Step 2: Establish clan relationships
  await establishClanRelationships(worldId)

  // Step 3: Set clan traditions based on members
  await generateClanTraditions(worldId)
}

async function establishClanRelationships(worldId: string) {
  const clans = await prisma.clan.findMany({
    where: { worldId },
    include: { members: true }
  })

  for (const clanA of clans) {
    const relations: Record<string, number> = {}

    for (const clanB of clans) {
      if (clanA.id === clanB.id) continue

      // Calculate initial relationship based on:
      // 1. Occupation overlap (competition)
      // 2. Location proximity (neighbors)
      // 3. Random historical events

      const occupationOverlap = calculateOccupationOverlap(
        clanA.members,
        clanB.members
      )

      const proximity = calculateProximity(
        clanA.homeLocationId,
        clanB.homeLocationId
      )

      let relation = 0

      // Competition reduces relationship
      relation -= occupationOverlap * 20

      // Proximity helps (neighbors are friends)
      relation += proximity * 10

      // Random historical event
      const historicalEvent = Math.random()
      if (historicalEvent > 0.9) {
        relation -= 40  // Old feud
      } else if (historicalEvent < 0.1) {
        relation += 40  // Alliance
      }

      relations[clanB.id] = Math.max(-100, Math.min(100, relation))
    }

    await prisma.clan.update({
      where: { id: clanA.id },
      data: {
        clanRelations: JSON.stringify(relations)
      }
    })
  }
}
```

---

## 🎨 UI/UX Considerations

### Displaying Clan Information

```typescript
// Clan badge/indicator in NPC UI
interface ClanDisplay {
  // NPC card shows:
  name: "Marcus Blackwood",        // Full name prominent
  clanBadge: {
    surname: "Blackwood",
    color: "#2C3E50",              // Clan color
    icon: "tree",                  // Clan symbol
    reputation: 65,                // Shows on hover
  },

  // Relationship context
  relationshipTooltip: {
    base: 20,
    clanBonus: +30,                // "Same clan"
    clanReputation: +10,           // "Respected family"
    total: 60,
  }
}

// Clan panel (new UI screen)
interface ClanPanel {
  header: {
    surname: "Blackwood",
    motto: "Strong as oak, deep as roots",
    founded: "Year 850",
    memberCount: 24,
  },

  stats: {
    reputation: 65,
    wealth: 45,
    influence: 55,
  },

  members: [
    // Family tree view
    // Occupation distribution
    // Notable members
  ],

  relationships: [
    // Allied clans (green)
    // Rival clans (yellow)
    // Enemy clans (red)
  ],

  history: [
    // Timeline of major events
  ]
}
```

---

## 🚀 Implementation Phases

### Phase 1: Core Infrastructure (VM-028)
- Add `firstName`, `surname`, `fullName` to NPC model
- Create `Clan` model with basic fields
- Migration script for existing NPCs
- Basic clan relationship system

### Phase 2: Family Bonding (VM-029)
- Implement surname-based relationship bonuses
- Add clan loyalty mechanics
- Housing preference system
- Help/cooperation priority based on clan

### Phase 3: Inheritance & Traditions (VM-030)
- Trait inheritance from parents + clan
- Occupation inheritance system
- Clan values and traditions
- Skill bonuses for family crafts

### Phase 4: Clan Dynamics (VM-031)
- Inter-clan relationship system
- Alliance and feud mechanics
- Reputation propagation (individual → clan)
- Clan-based quest generation

### Phase 5: Advanced Features (VM-032)
- Clan UI panel and visualization
- Historical event tracking
- Marriage between clans
- Clan succession and elder system

---

## 📚 References

**Related Systems:**
- `NPC_ATTRIBUTE_SYSTEM.md` - Inherited attributes
- `NPC_RELATIONSHIP_STORAGE_ANALYSIS.md` - Relationship mechanics
- `NPC_OCCUPATIONS_REFERENCE.md` - Occupation inheritance
- `living_world_simulation_foundation.md` - Emergent dynamics

**Implementation Files:**
- `/prisma/schema.prisma` - Database models
- `/src/systems/npc/NPC.ts` - NPC core logic
- `/src/systems/clan/` (new folder) - Clan system logic

**External Inspiration:**
- Medieval naming conventions
- Crusader Kings family dynamics
- Dwarf Fortress clan relationships
- Historical family structure research
