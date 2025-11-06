# NPC Attribute System - Complete Reference

**Date:** November 4, 2025  
**Status:** Design Specification  
**Purpose:** Define all NPC attributes from body to mind, and how they interact

---

## ðŸŽ¯ Attribute Philosophy

**Attributes vs Skills:**
- **Attributes** = Natural aptitudes and physical traits (hard to change)
- **Skills** = Learned abilities (improve through practice)
- **Personality** = Behavioral tendencies (very slow to change)

**Key Principle:** Attributes affect skill learning speed and effectiveness

---

## ðŸ’ª BODY ATTRIBUTES (10-100)

### Physical Attributes

```typescript
interface BodyAttributes {
  // RAW PHYSICAL POWER
  strength: number        // 10-100
  // Affects: Melee damage, carrying capacity, physical labor efficiency
  // Need Impact: High strength = +20% food consumption
  // Skill Impact: Affects combat.offense, fabrication (hammering, forging)
  
  // STAMINA & RESILIENCE  
  endurance: number       // 10-100
  // Affects: Health pool, fatigue resistance, work duration
  // Need Impact: High endurance = -20% rest need decay
  // Skill Impact: Affects physical skills, sustained activities
  
  // SPEED & COORDINATION
  agility: number         // 10-100
  // Affects: Movement speed, dodge chance, fine motor skills
  // Need Impact: Low agility = slower travel, more rest needed
  // Skill Impact: Affects combat.defense, physical.stealth, crafting precision
  
  // AWARENESS & SENSES
  perception: number      // 10-100
  // Affects: Spotting danger, noticing details, range attacks
  // Need Impact: High perception = detect food/danger earlier
  // Skill Impact: Affects ranged combat, foraging, investigation
}
```

### Mental Attributes

```typescript
interface MentalAttributes {
  // LEARNING & PROBLEM SOLVING
  intelligence: number    // 10-100
  // Affects: Skill learning speed, complex task success
  // Need Impact: High intelligence = learns tech 50% faster
  // Skill Impact: CRITICAL - affects ALL skill gain rates
  
  // JUDGMENT & INSIGHT
  wisdom: number          // 10-100
  // Affects: Decision quality, reading situations, intuition
  // Need Impact: High wisdom = better need management decisions
  // Skill Impact: Affects social.persuasion, knowledge.analysis
  
  // SOCIAL INFLUENCE
  charisma: number        // 10-100
  // Affects: First impressions, leadership, negotiations
  // Need Impact: High charisma = better prices, easier socializing
  // Skill Impact: Affects ALL social skills learning and effectiveness
}
```

### Derived Attributes

```typescript
interface DerivedAttributes {
  // CALCULATED FROM BODY ATTRIBUTES
  
  health: number
  // Formula: (endurance * 2) + (strength * 0.5)
  // Range: 25-250 HP
  // Example: 50 END, 60 STR = 130 HP
  
  carryWeight: number
  // Formula: strength * 2 + endurance * 0.5
  // Range: 25-225 lbs
  // Example: 70 STR, 50 END = 165 lbs capacity
  
  movementSpeed: number
  // Formula: (agility * 0.6) + (endurance * 0.4)
  // Range: 10-100
  // Affects: Travel time, combat initiative
  
  fatigueResistance: number
  // Formula: endurance * 0.7 + strength * 0.3
  // Affects: How long before needing rest
  
  learningRate: number
  // Formula: intelligence * 0.8 + wisdom * 0.2
  // Multiplier: 0.1x to 1.0x (20 INT = 0.2x, 100 INT = 1.0x)
  // Affects: ALL skill gain speeds
}
```

---

## ðŸ“š SKILL SYSTEM (0-100)

### How Attributes Affect Skills

```typescript
interface SkillLearning {
  baseGainRate: number        // How much XP per practice
  attributeMultiplier: number // Based on relevant attributes
  personalityModifier: number // Based on conscientiousness, openness
  
  // Formula for skill gain:
  // XP_gained = baseGainRate * attributeMultiplier * personalityModifier * timeSpent
}
```

### Skill Categories & Governing Attributes

```typescript
// COMBAT SKILLS
combat: {
  offense: {
    governingAttributes: ['strength', 'agility'],
    formula: 'strength * 0.6 + agility * 0.4',
    learningRate: 'intelligence * 0.5 + agility * 0.5'
  },
  defense: {
    governingAttributes: ['agility', 'perception'],
    formula: 'agility * 0.7 + perception * 0.3',
    learningRate: 'intelligence * 0.5 + agility * 0.5'
  },
  tactics: {
    governingAttributes: ['intelligence', 'wisdom'],
    formula: 'intelligence * 0.6 + wisdom * 0.4',
    learningRate: 'intelligence * 0.8 + wisdom * 0.2'
  }
}

// FABRICATION SKILLS
fabrication: {
  simple_crafting: {
    governingAttributes: ['strength', 'agility'],
    formula: 'agility * 0.6 + strength * 0.4',
    learningRate: 'intelligence * 0.6 + agility * 0.4'
  },
  complex_crafting: {
    governingAttributes: ['intelligence', 'agility', 'perception'],
    formula: 'intelligence * 0.4 + agility * 0.4 + perception * 0.2',
    learningRate: 'intelligence * 0.8 + wisdom * 0.2'
  },
  repair: {
    governingAttributes: ['intelligence', 'perception'],
    formula: 'perception * 0.6 + intelligence * 0.4',
    learningRate: 'intelligence * 0.7 + wisdom * 0.3'
  }
}

// SOCIAL SKILLS
social: {
  persuasion: {
    governingAttributes: ['charisma', 'wisdom'],
    formula: 'charisma * 0.7 + wisdom * 0.3',
    learningRate: 'intelligence * 0.4 + charisma * 0.6'
  },
  deception: {
    governingAttributes: ['charisma', 'intelligence'],
    formula: 'charisma * 0.6 + intelligence * 0.4',
    learningRate: 'intelligence * 0.6 + charisma * 0.4'
  },
  leadership: {
    governingAttributes: ['charisma', 'wisdom', 'intelligence'],
    formula: 'charisma * 0.5 + wisdom * 0.3 + intelligence * 0.2',
    learningRate: 'wisdom * 0.5 + intelligence * 0.5'
  }
}

// KNOWLEDGE SKILLS
knowledge: {
  analysis: {
    governingAttributes: ['intelligence', 'perception'],
    formula: 'intelligence * 0.7 + perception * 0.3',
    learningRate: 'intelligence * 0.9 + wisdom * 0.1'
  },
  research: {
    governingAttributes: ['intelligence', 'wisdom'],
    formula: 'intelligence * 0.8 + wisdom * 0.2',
    learningRate: 'intelligence * 0.95 + conscientiousness * 0.05'
  },
  application: {
    governingAttributes: ['intelligence', 'agility'],
    formula: 'intelligence * 0.6 + agility * 0.4',
    learningRate: 'intelligence * 0.7 + wisdom * 0.3'
  }
}

// PHYSICAL SKILLS
physical: {
  athletics: {
    governingAttributes: ['strength', 'endurance', 'agility'],
    formula: 'strength * 0.4 + endurance * 0.3 + agility * 0.3',
    learningRate: 'intelligence * 0.3 + endurance * 0.4 + agility * 0.3'
  },
  stealth: {
    governingAttributes: ['agility', 'perception'],
    formula: 'agility * 0.7 + perception * 0.3',
    learningRate: 'intelligence * 0.4 + agility * 0.6'
  },
  survival: {
    governingAttributes: ['endurance', 'wisdom', 'perception'],
    formula: 'wisdom * 0.4 + endurance * 0.3 + perception * 0.3',
    learningRate: 'intelligence * 0.5 + wisdom * 0.5'
  }
}
```

---

## ðŸŽ“ LEARNING SYSTEM

### Skill Gain Formula

```typescript
function calculateSkillGain(
  npc: NPC,
  skill: SkillType,
  hoursSpent: number,
  teacher?: NPC
): number {
  
  const skillDef = SKILL_DEFINITIONS[skill]
  
  // 1. BASE RATE (depends on current skill level)
  const baseRate = calculateBaseRate(npc.skills[skill])
  // Low skill (0-30): 2.0 XP/hour (fast early gains)
  // Medium (31-60): 1.0 XP/hour (normal)
  // High (61-80): 0.5 XP/hour (slows down)
  // Master (81-100): 0.2 XP/hour (very slow)
  
  // 2. ATTRIBUTE MULTIPLIER
  const attrMultiplier = calculateAttributeMultiplier(npc, skillDef)
  // Formula: Average of governing attributes / 100
  // Example: offense uses STR 70, AGI 60 = (70*0.6 + 60*0.4)/100 = 0.66x
  
  // 3. INTELLIGENCE MULTIPLIER (affects ALL skills)
  const intMultiplier = npc.attributes.intelligence / 100
  // 30 INT = 0.3x (learns very slowly)
  // 60 INT = 0.6x (average)
  // 90 INT = 0.9x (learns quickly)
  
  // 4. PERSONALITY MULTIPLIER
  const personalityMult = calculatePersonalityMultiplier(npc, skill)
  // High conscientiousness (+20% for all skills)
  // High openness (+30% for knowledge skills)
  // High neuroticism (-10% for combat skills)
  
  // 5. TEACHER BONUS (if applicable)
  let teacherBonus = 1.0
  if (teacher) {
    const teacherSkillLevel = teacher.skills[skill]
    const teacherInt = teacher.attributes.intelligence
    const teacherCha = teacher.attributes.charisma
    
    // Teacher effectiveness: 1.0x to 3.0x
    teacherBonus = 1.0 + (teacherSkillLevel / 50) + (teacherInt / 200) + (teacherCha / 200)
    // Max bonus: skill 100, int 100, cha 100 = 1 + 2 + 0.5 + 0.5 = 4x
  }
  
  // 6. FINAL CALCULATION
  const xpGained = baseRate * 
                   attrMultiplier * 
                   intMultiplier * 
                   personalityMult * 
                   teacherBonus * 
                   hoursSpent
  
  return xpGained
}

function calculateBaseRate(currentSkill: number): number {
  if (currentSkill < 30) return 2.0      // Beginner gains
  if (currentSkill < 60) return 1.0      // Normal gains
  if (currentSkill < 80) return 0.5      // Slow gains
  return 0.2                              // Master level (very slow)
}

function calculateAttributeMultiplier(npc: NPC, skillDef: SkillDefinition): number {
  let total = 0
  let weights = 0
  
  for (const [attr, weight] of Object.entries(skillDef.attributeWeights)) {
    total += npc.attributes[attr] * weight
    weights += weight
  }
  
  return total / weights / 100
}

function calculatePersonalityMultiplier(npc: NPC, skill: SkillType): number {
  let multiplier = 1.0
  
  // Conscientiousness helps ALL skills
  multiplier += (npc.personality.traits.conscientiousness - 50) / 250
  // 50 = 1.0x, 75 = 1.1x, 100 = 1.2x
  
  // Openness helps knowledge/creative skills
  if (skill.startsWith('knowledge') || skill.startsWith('fabrication')) {
    multiplier += (npc.personality.traits.openness - 50) / 200
  }
  
  // Neuroticism hurts combat/high-stress skills
  if (skill.startsWith('combat') || skill === 'leadership') {
    multiplier -= (npc.personality.traits.neuroticism - 50) / 300
  }
  
  return Math.max(0.5, multiplier) // Min 0.5x (never stops learning completely)
}
```

### Learning Time Examples

```typescript
// EXAMPLE 1: Marcus learns weaponsmithing (complex_crafting)
// Marcus: STR 70, AGI 60, INT 50, Conscientiousness 80
// Current skill: 30 (beginner)
// No teacher

const baseRate = 2.0  // Beginner level
const attrMult = (50 * 0.4 + 60 * 0.4 + 60 * 0.2) / 100 = 0.56
const intMult = 50 / 100 = 0.5
const persMult = 1.0 + (80-50)/250 = 1.12

XP per hour = 2.0 * 0.56 * 0.5 * 1.12 = 0.63 XP/hour

To reach skill 60 (needs 30 skill points):
Time = 30 / 0.63 = 48 hours (6 working days)

// EXAMPLE 2: Same scenario but with teacher
// Master Smith teaches Marcus (teacher skill 85, INT 70, CHA 60)

const teacherBonus = 1.0 + (85/50) + (70/200) + (60/200) = 3.35

XP per hour = 2.0 * 0.56 * 0.5 * 1.12 * 3.35 = 2.11 XP/hour

To reach skill 60:
Time = 30 / 2.11 = 14 hours (< 2 working days!)

// EXAMPLE 3: Low intelligence learner
// Sarah: STR 40, AGI 70, INT 30, learning stealth
// Current skill: 20

const baseRate = 2.0
const attrMult = (70 * 0.7 + 60 * 0.3) / 100 = 0.67
const intMult = 30 / 100 = 0.3  // OUCH! Very slow
const persMult = 1.0

XP per hour = 2.0 * 0.67 * 0.3 * 1.0 = 0.40 XP/hour

To reach skill 50 (needs 30 points):
Time = 30 / 0.40 = 75 hours (9+ days)
// Low intelligence REALLY hurts learning!
```

---

## ðŸ– ATTRIBUTE EFFECTS ON NEEDS

### Need Consumption Rates

```typescript
interface NeedModifiers {
  // FOOD NEED (affected by body mass/activity)
  foodDecayRate: number
  // Base: -8 per checkpoint
  // High strength (+70): -10 per checkpoint (needs more calories)
  // High endurance (+70): -9 per checkpoint
  // Low strength (<40): -6 per checkpoint (needs less)
  // Formula: -8 * (1 + (strength - 50)/200)
  
  // REST NEED (affected by stamina)
  restDecayRate: number
  // Base: -10 per checkpoint
  // High endurance (+70): -7 per checkpoint (tires slower)
  // Low endurance (<40): -13 per checkpoint (tires faster)
  // Formula: -10 * (1 - (endurance - 50)/200)
  
  // SOCIAL NEED (affected by personality/charisma)
  socialDecayRate: number
  // Base: -6 per checkpoint
  // High charisma & extraversion: -8 (needs more socializing)
  // Low charisma & introversion: -4 (needs less)
  // Formula: -6 * (1 + (charisma + extraversion - 100)/300)
  
  // WEALTH NEED (affected by personality)
  wealthDecayRate: number
  // Base: -5 per checkpoint
  // High neuroticism: -7 (anxious about money)
  // Values include "wealth": -8
  // Low neuroticism: -4
  
  // SAFETY NEED (affected by perception & personality)
  safetyDecayRate: number
  // Base: -2 per checkpoint
  // High perception: -3 (notices more threats)
  // High neuroticism: -4 (more anxious)
  // Low perception: -1 (blissfully unaware)
}
```

### Work Efficiency Modifiers

```typescript
interface WorkEfficiency {
  // Physical labor (farming, mining, lumberjacking)
  physicalWorkSpeed: number
  // Formula: (strength * 0.5 + endurance * 0.5) / 100
  // 70 STR, 60 END = 65% efficiency = work takes 1.54x time
  // 90 STR, 80 END = 85% efficiency = work takes 1.18x time
  
  // Crafting (blacksmithing, carpentry)
  craftingSpeed: number
  // Formula: (agility * 0.6 + intelligence * 0.4) / 100
  // Also affected by skill level
  
  // Mental work (research, planning)
  mentalWorkSpeed: number
  // Formula: intelligence / 100
  // 40 INT = 40% efficiency
  // 80 INT = 80% efficiency
  
  // Social work (trading, diplomacy)
  socialWorkSpeed: number
  // Formula: (charisma * 0.7 + wisdom * 0.3) / 100
}
```

---

## ðŸŽ® PLAYER TAKEOVER IMPLICATIONS

### When You Take Over an NPC

```typescript
interface NPCTakeoverState {
  // WHAT YOU INHERIT
  attributes: BodyAttributes & MentalAttributes
  // You are LIMITED by their physical/mental capabilities
  
  skills: Map<SkillType, number>
  // What they can DO currently
  
  learningPotential: {
    // How fast can they improve?
    attributeMultipliers: Map<SkillType, number>
    intelligenceFactor: number
    personalityModifiers: Map<SkillType, number>
  }
  
  physicalLimitations: {
    // What can't they do well?
    carryWeight: number      // Can't carry too much
    movementSpeed: number    // Some NPCs are slow
    fatigueRate: number      // Some tire quickly
    foodConsumption: number  // Some eat more
  }
  
  // GROWTH POTENTIAL
  canImprove: {
    skills: "quickly via training"
    attributes: "very slowly over months/years"
    personality: "barely at all"
  }
}
```

### Strategic Considerations

```typescript
// HIGH INTELLIGENCE NPC (INT 80+)
Advantages:
- Learns ALL skills 80% faster
- Can master complex crafts quickly
- Research tech efficiently
- Good for: Scholars, master craftsmen, mages

Disadvantages:
- Might have lower physical stats
- Higher food/rest needs (thinking burns energy)

// HIGH STRENGTH/ENDURANCE (STR 70+, END 70+)
Advantages:
- Excellent at physical labor
- Can work longer without rest
- High health pool (tanky)
- Good for: Warriors, laborers, explorers

Disadvantages:
- Learns slowly (if INT is low)
- Needs more food
- Can't do delicate work well

// HIGH CHARISMA (CHA 75+)
Advantages:
- Best for diplomatic missions
- Learns social skills quickly
- Better prices when trading
- Good for: Merchants, leaders, diplomats

Disadvantages:
- Needs frequent social interaction
- Might not be good at solitary tasks

// BALANCED (All stats 50-60)
Advantages:
- Flexible, can learn anything
- No major weaknesses
- Good all-around character

Disadvantages:
- Won't excel at anything
- Takes average time to master skills
```

---

## ðŸ“Š ATTRIBUTE GENERATION

### Starting NPCs

```typescript
function generateNPCAttributes(
  occupation: string,
  age: number,
  backstory?: string
): BodyAttributes & MentalAttributes {
  
  // 1. BASE GENERATION (with occupation bias)
  const occupationTemplate = OCCUPATION_TEMPLATES[occupation]
  
  // 2. AGE MODIFIERS
  const ageMods = calculateAgeModifiers(age)
  // 15-25: Full physical, developing mental
  // 26-50: Peak mental, good physical
  // 51-70: High mental, declining physical
  // 71+: Wisdom peaks, physical drops
  
  // 3. ROLL WITH VARIANCE
  const attributes = {
    strength: rollAttribute(occupationTemplate.strength, ageMods.physical),
    endurance: rollAttribute(occupationTemplate.endurance, ageMods.physical),
    agility: rollAttribute(occupationTemplate.agility, ageMods.physical),
    perception: rollAttribute(occupationTemplate.perception, 1.0),
    intelligence: rollAttribute(occupationTemplate.intelligence, ageMods.mental),
    wisdom: rollAttribute(occupationTemplate.wisdom, ageMods.wisdom),
    charisma: rollAttribute(occupationTemplate.charisma, 1.0)
  }
  
  return attributes
}

// OCCUPATION TEMPLATES
const OCCUPATION_TEMPLATES = {
  blacksmith: {
    strength: 70,      // High
    endurance: 65,
    agility: 50,
    perception: 55,
    intelligence: 50,
    wisdom: 50,
    charisma: 45
  },
  scholar: {
    strength: 40,
    endurance: 45,
    agility: 45,
    perception: 65,
    intelligence: 80,  // Very high
    wisdom: 70,        // High
    charisma: 55
  },
  merchant: {
    strength: 45,
    endurance: 55,
    agility: 50,
    perception: 65,
    intelligence: 60,
    wisdom: 65,
    charisma: 75       // Very high
  },
  guard: {
    strength: 65,
    endurance: 70,     // High
    agility: 60,
    perception: 65,
    intelligence: 45,
    wisdom: 50,
    charisma: 50
  },
  farmer: {
    strength: 60,
    endurance: 70,     // Very high
    agility: 45,
    perception: 55,
    intelligence: 45,
    wisdom: 60,
    charisma: 50
  }
}
```

---

## ðŸ”„ ATTRIBUTE IMPROVEMENT

### How Attributes Can Change

```typescript
interface AttributeGrowth {
  // SKILLS CAN IMPROVE ATTRIBUTES (slowly)
  
  // Strength
  improvedBy: ['physical labor', 'combat training']
  rate: '+1 per 100 hours of heavy work'
  cap: 'Genetic max (usually +20 from starting)'
  
  // Endurance
  improvedBy: ['sustained activity', 'athletics training']
  rate: '+1 per 80 hours of cardio work'
  
  // Agility
  improvedBy: ['acrobatics', 'combat training', 'crafting']
  rate: '+1 per 90 hours of dexterity work'
  
  // Perception
  improvedBy: ['scouting', 'investigation', 'hunting']
  rate: '+1 per 100 hours of observation'
  
  // Intelligence
  improvedBy: ['studying', 'research', 'complex problem solving']
  rate: '+1 per 120 hours of study'
  note: 'Hardest to improve, but most valuable'
  
  // Wisdom
  improvedBy: ['experience', 'decision-making', 'age']
  rate: '+1 per 100 hours of judgment practice OR +1 per year of age (up to 60)'
  
  // Charisma
  improvedBy: ['social interaction', 'leadership practice']
  rate: '+1 per 100 hours of social work'
}

// CRITICAL: Attributes improve MUCH slower than skills
// A dedicated NPC might gain +5 to an attribute over an entire year
// vs gaining +30 to a skill in a few months
```

---

## ðŸ“‹ COMPLETE NPC STRUCTURE

```typescript
interface CompleteNPC {
  // IDENTITY
  id: string
  name: string
  age: number
  occupation: string
  state: 'alive' | 'injured' | 'kidnapped' | 'dead'
  locationId: string
  
  // BODY ATTRIBUTES (natural talents, slow to change)
  attributes: {
    // Physical
    strength: number        // 10-100
    endurance: number       // 10-100
    agility: number         // 10-100
    perception: number      // 10-100
    // Mental
    intelligence: number    // 10-100 (CRITICAL for learning)
    wisdom: number          // 10-100
    charisma: number        // 10-100
    // Derived
    health: number          // Calculated from END + STR
    carryWeight: number     // Calculated from STR + END
    movementSpeed: number   // Calculated from AGI + END
    learningRate: number    // Calculated from INT + WIS
  }
  
  // PERSONALITY (behavioral, very slow to change)
  personality: {
    traits: {
      openness: number            // 0-100
      conscientiousness: number   // 0-100
      extraversion: number        // 0-100
      agreeableness: number       // 0-100
      neuroticism: number         // 0-100
    }
    values: string[]
    fears: string[]
    speechPattern: SpeechPattern
  }
  
  // SKILLS (learned abilities, fast to change)
  skills: {
    // Combat
    offense: number           // 0-100
    defense: number           // 0-100
    tactics: number           // 0-100
    // Fabrication
    simple_crafting: number   // 0-100
    complex_crafting: number  // 0-100
    repair: number            // 0-100
    // Social
    persuasion: number        // 0-100
    deception: number         // 0-100
    leadership: number        // 0-100
    // Knowledge
    analysis: number          // 0-100
    research: number          // 0-100
    application: number       // 0-100
    // Physical
    athletics: number         // 0-100
    stealth: number           // 0-100
    survival: number          // 0-100
  }
  
  // NEEDS (dynamic, changes frequently)
  needs: {
    food: number       // 0-100
    safety: number     // 0-100
    wealth: number     // 0-100
    social: number     // 0-100
    purpose: number    // 0-100
    rest: number       // 0-100
  }
  
  // EMOTIONS (dynamic, changes frequently)
  emotions: {
    happiness: number
    anger: number
    fear: number
    sadness: number
    trust: number
    anticipation: number
  }
  
  // SOCIAL
  relationships: Map<string, number>  // -100 to +100
  
  // MEMORY & GOALS
  goals: Goal[]
  memories: MemoryEntry[]
}
```

---

## ðŸŽ¯ DESIGN SUMMARY

**Three Layers of Character Definition:**

1. **Attributes** (Foundation)
   - Natural aptitudes
   - Change very slowly (months/years)
   - Limit what's possible

2. **Skills** (Capability)
   - Learned abilities
   - Change faster (weeks/months)
   - What you can actually do

3. **Personality** (Behavior)
   - How you approach things
   - Almost never changes
   - Affects learning and decisions

**Player Experience:**
- Taking over a strong but dumb NPC = powerful but learns slowly
- Taking over a smart but weak NPC = weak but learns everything fast
- Taking over a balanced NPC = flexible but not exceptional
- **Growth requires investment** - teaching, training, time

**Strategic Depth:**
- Choose NPCs for their attributes if you need immediate capability
- Choose NPCs for their intelligence if you want long-term potential
- Hybrid approach: Use strong NPCs for physical tasks while training smart NPCs for complex roles
