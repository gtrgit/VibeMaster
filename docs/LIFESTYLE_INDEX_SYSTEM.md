# Lifestyle Index System
## Measuring Civilization Quality Through Production Efficiency

---

## Table of Contents

1. [Core Concept](#core-concept)
2. [What the Lifestyle Index Measures](#what-the-lifestyle-index-measures)
3. [Production Chain Depth](#production-chain-depth)
4. [Calculating the Lifestyle Index](#calculating-the-lifestyle-index)
5. [Civilization Tiers](#civilization-tiers)
6. [Bottleneck Impact](#bottleneck-impact)
7. [Tech & Innovation Effects](#tech--innovation-effects)
8. [Gameplay Impact](#gameplay-impact)
9. [Visual Dashboard](#visual-dashboard)
10. [Implementation Examples](#implementation-examples)

---

## Core Concept

### The Big Idea

**Lifestyle Index** is an emergent metric that measures **how well a village can produce quality goods without costly bottlenecks**.

It's NOT a number you set - it's a **natural consequence** of:
- Production chain depth available
- Efficiency of production (lack of bottlenecks)
- Quality of goods produced
- Access to specialized labor
- Technology level
- Resource availability

### Philosophy

```
Simple Village:
  - Short chains (wood → shelter)
  - Basic survival only
  - High subsistence overhead (40%+ time on needs)
  - Lifestyle Index: 20-35 (Subsistence)

Advanced Village:
  - Deep chains (ore → ingots → steel → refined weapons → enchanted items)
  - Luxury goods available
  - Low subsistence overhead (5-10% time on needs)
  - Lifestyle Index: 75-95 (Prosperous)
```

**Key Insight:** A village can't have a high Lifestyle Index with short production chains, because they can't produce quality goods that satisfy higher-order needs.

---

## What the Lifestyle Index Measures

### Three Pillars

#### 1. **Production Capacity** (40% weight)
Can the village produce diverse, quality goods?

```typescript
interface ProductionCapacity {
  // BREADTH: How many different things can we make?
  uniqueRecipesAvailable: number;
  occupationDiversity: number;
  
  // DEPTH: How complex are our production chains?
  averageChainDepth: number;      // 1-10 steps
  maxChainDepth: number;
  
  // QUALITY: Are we making basic or refined goods?
  basicGoodsOnly: boolean;
  refinedGoodsAvailable: boolean;
  luxuryGoodsAvailable: boolean;
  masterworkGoodsAvailable: boolean;
}
```

#### 2. **Production Efficiency** (35% weight)
How smoothly do production chains run?

```typescript
interface ProductionEfficiency {
  // From your existing efficiency detection system
  subsistenceOverhead: number;     // Want LOW (< 10%)
  productiveHours: number;         // Want HIGH (> 60%)
  
  // Bottleneck impact
  activeBottlenecks: Bottleneck[];
  bottleneckSeverity: number;      // 0-100
  
  // Resource availability
  supplyChainReliability: number;  // 0-100
  materialWaitTime: number;        // Hours NPCs wait for materials
  
  // Specialization
  specializationLevel: number;     // 0-100
  crossTraining: number;           // Redundancy
}
```

#### 3. **Goods Accessibility** (25% weight)
Can NPCs actually access the goods produced?

```typescript
interface GoodsAccessibility {
  // Distribution
  timeToAcquireNecessities: number;  // Hours per day
  marketEfficiency: number;          // 0-100
  
  // Affordability
  affordabilityIndex: number;        // Can average NPC afford goods?
  wealthDistribution: 'equal' | 'unequal' | 'extreme';
  
  // Availability
  stockoutFrequency: number;         // How often out of stock?
  varietyScore: number;              // Choice available
}
```

---

## Production Chain Depth

### Chain Depth Levels

```typescript
enum ChainDepth {
  LEVEL_0 = 0,  // Gathering (berries, water from stream)
  LEVEL_1 = 1,  // Simple (wood → planks)
  LEVEL_2 = 2,  // Basic craft (planks + nails → furniture)
  LEVEL_3 = 3,  // Intermediate (ore → ingots → tools)
  LEVEL_4 = 4,  // Advanced (ore → steel → refined tools)
  LEVEL_5 = 5,  // Complex (multiple refined inputs)
  LEVEL_6 = 6,  // Master (luxury goods)
  LEVEL_7 = 7,  // Exotic (rare materials + master skill)
}
```

### Example Production Chains

#### **Level 1: Simple Village**
```
Food:
  Foraging → Berries (depth 0)
  Farming → Grain (depth 1)

Shelter:
  Lumberjack → Wood (depth 1)
  Wood → Simple Hut (depth 2)

Tools:
  ❌ No metalworking yet

Lifestyle Index: 15-30 (Barely surviving)
```

#### **Level 3: Developing Village**
```
Food:
  Farming → Grain (depth 1)
  Grain + Water → Bread (depth 2)
  Grain + Yeast → Beer (depth 3) ← LUXURY!

Shelter:
  Wood + Stone → Sturdy House (depth 3)
  Wood + Iron → Reinforced Door (depth 4)

Tools:
  Mining → Iron Ore (depth 1)
  Ore → Smelting → Iron Ingots (depth 2)
  Ingots → Basic Tools (depth 3)

Clothing:
  Sheep → Wool (depth 1)
  Wool → Thread (depth 2)
  Thread → Cloth (depth 3)
  Cloth → Clothing (depth 4)

Lifestyle Index: 45-60 (Comfortable)
```

#### **Level 5: Prosperous Village**
```
Weapons:
  Ore → Ingots → Steel (depth 3)
  Steel + Wood + Leather → Quality Weapon (depth 5)
  Weapon + Enchanting → Masterwork Weapon (depth 6)

Medicine:
  Herbs → Processing → Base Medicine (depth 2)
  Base + Rare Herbs → Advanced Medicine (depth 4)
  Advanced + Alchemy → Curative Potion (depth 5)

Furniture:
  Wood → Lumber → Carved Components (depth 3)
  Components + Upholstery + Inlay → Luxury Furniture (depth 5)

Food:
  Multiple ingredients + Spices + Cooking → Gourmet Meals (depth 5)

Lifestyle Index: 75-90 (Prosperous)
```

---

## Calculating the Lifestyle Index

### Formula

```typescript
function calculateLifestyleIndex(village: Village): number {
  // 1. PRODUCTION CAPACITY (40%)
  const capacity = calculateProductionCapacity(village);
  
  // 2. PRODUCTION EFFICIENCY (35%)
  const efficiency = calculateProductionEfficiency(village);
  
  // 3. GOODS ACCESSIBILITY (25%)
  const accessibility = calculateGoodsAccessibility(village);
  
  // Weighted average
  const rawScore = (
    capacity * 0.40 +
    efficiency * 0.35 +
    accessibility * 0.25
  );
  
  // Apply modifiers
  const modified = applyModifiers(rawScore, village);
  
  // Clamp to 0-100
  return Math.max(0, Math.min(100, modified));
}
```

### Production Capacity Calculation

```typescript
function calculateProductionCapacity(village: Village): number {
  let score = 0;
  
  // BREADTH: Recipe diversity (0-30 points)
  const uniqueRecipes = village.getAvailableRecipes().length;
  const recipeBreadth = Math.min(30, uniqueRecipes * 2);
  score += recipeBreadth;
  
  // DEPTH: Average chain depth (0-40 points)
  const chains = village.getAllProductionChains();
  const avgDepth = chains.reduce((sum, c) => sum + c.depth, 0) / chains.length;
  const depthScore = Math.min(40, avgDepth * 6);
  score += depthScore;
  
  // QUALITY: Goods tier (0-30 points)
  const tiers = {
    basic: village.canProduce('basic') ? 5 : 0,
    refined: village.canProduce('refined') ? 10 : 0,
    luxury: village.canProduce('luxury') ? 10 : 0,
    masterwork: village.canProduce('masterwork') ? 5 : 0
  };
  score += Object.values(tiers).reduce((a, b) => a + b, 0);
  
  return score;
}
```

### Production Efficiency Calculation

```typescript
function calculateProductionEfficiency(village: Village): number {
  let score = 100;  // Start at perfect
  
  // SUBSISTENCE OVERHEAD PENALTY
  const subsistence = village.metrics.subsistenceOverhead;
  // For every 1% over 10%, lose 2 points
  if (subsistence > 10) {
    score -= (subsistence - 10) * 2;
  }
  
  // BOTTLENECK PENALTY
  const bottlenecks = village.detectBottlenecks();
  for (const bottleneck of bottlenecks) {
    score -= bottleneck.severity * 0.3;
  }
  
  // SUPPLY CHAIN RELIABILITY
  const reliability = calculateSupplyChainReliability(village);
  score *= (reliability / 100);
  
  // WAIT TIME PENALTY
  const avgWaitTime = calculateAverageMaterialWaitTime(village);
  // For every hour NPCs wait per day, lose 3 points
  score -= avgWaitTime * 3;
  
  return Math.max(0, score);
}
```

### Goods Accessibility Calculation

```typescript
function calculateGoodsAccessibility(village: Village): number {
  let score = 0;
  
  // TIME TO ACQUIRE (0-40 points)
  const acquisitionTime = calculateAcquisitionTime(village);
  // Under 30 minutes per day = full points
  // Over 3 hours per day = no points
  const timeScore = Math.max(0, 40 - (acquisitionTime / 0.5 * 40 / 6));
  score += timeScore;
  
  // AFFORDABILITY (0-35 points)
  const affordability = calculateAffordabilityIndex(village);
  score += affordability * 0.35;
  
  // VARIETY & CHOICE (0-25 points)
  const variety = calculateVarietyScore(village);
  score += variety * 0.25;
  
  return score;
}
```

---

## Civilization Tiers

### Tier 0: Survival (0-20)
```
Characteristics:
  - Gathering/hunting only
  - No permanent structures
  - 50%+ time on subsistence
  - No specialization
  - No trade

Available Chains:
  - Depth 0-1 only
  - Berries, water, basic shelter

NPC Mood: Desperate, stressed, hungry
Migration: High outflow if alternatives exist
```

### Tier 1: Subsistence (21-40)
```
Characteristics:
  - Basic farming
  - Simple shelters
  - 35-50% time on subsistence
  - Minimal specialization (1-2 craftspeople)
  - Local barter only

Available Chains:
  - Depth 1-2
  - Bread, simple tools, basic clothing

NPC Mood: Cautiously stable, focused on survival
Migration: Outflow > Inflow
Example: Early medieval village
```

### Tier 2: Stable (41-55)
```
Characteristics:
  - Reliable food production
  - Sturdy housing
  - 25-35% time on subsistence
  - Some specialization (3-5 occupations)
  - Regular trade

Available Chains:
  - Depth 2-3
  - Beer, iron tools, woven clothing

NPC Mood: Satisfied with basics, wanting more
Migration: Balanced
Example: Established village
```

### Tier 3: Comfortable (56-70)
```
Characteristics:
  - Food surplus
  - Quality housing
  - 15-25% time on subsistence
  - Good specialization (6-10 occupations)
  - Trade networks established

Available Chains:
  - Depth 3-4
  - Quality tools, processed foods, decent clothing

NPC Mood: Content, pursuing hobbies
Migration: Inflow > Outflow
Example: Market town
```

### Tier 4: Prosperous (71-85)
```
Characteristics:
  - Food abundance, luxury foods available
  - Excellent housing with amenities
  - 8-15% time on subsistence
  - High specialization (10+ occupations)
  - Regional trade hub

Available Chains:
  - Depth 4-6
  - Steel weapons, gourmet food, fine clothing, luxury goods

NPC Mood: Happy, ambitious, pursuing passions
Migration: Strong inflow
Example: Wealthy city
```

### Tier 5: Flourishing (86-100)
```
Characteristics:
  - Every want satisfied
  - Mansions and public works
  - 5-8% time on subsistence
  - Extreme specialization (15+ occupations)
  - International trade

Available Chains:
  - Depth 5-7+
  - Masterwork items, exotic goods, cultural works

NPC Mood: Fulfilled, creative, intellectual pursuits
Migration: People pilgrimage here
Example: Renaissance Florence
```

---

## Bottleneck Impact

### How Bottlenecks Lower the Index

Each bottleneck type has different impacts:

```typescript
interface BottleneckImpact {
  type: BottleneckType;
  indexPenalty: number;
  affectedPillar: 'capacity' | 'efficiency' | 'accessibility';
}

const BOTTLENECK_IMPACTS: Record<BottleneckType, BottleneckImpact> = {
  
  // Directly reduces efficiency
  RESOURCE_GATHERING: {
    type: 'RESOURCE_GATHERING',
    indexPenalty: -15,  // Huge impact
    affectedPillar: 'efficiency'
  },
  
  // Limits what can be produced
  TOOL_SHORTAGE: {
    type: 'TOOL_SHORTAGE',
    indexPenalty: -10,
    affectedPillar: 'capacity'
  },
  
  // Prevents advanced chains
  SKILL_GAP: {
    type: 'SKILL_GAP',
    indexPenalty: -12,
    affectedPillar: 'capacity'
  },
  
  // Slows production
  INFRASTRUCTURE: {
    type: 'INFRASTRUCTURE',
    indexPenalty: -8,
    affectedPillar: 'efficiency'
  },
  
  // Prevents goods from reaching people
  DISTRIBUTION: {
    type: 'DISTRIBUTION',
    indexPenalty: -10,
    affectedPillar: 'accessibility'
  },
  
  // Slows tech adoption
  EDUCATION: {
    type: 'EDUCATION',
    indexPenalty: -15,  // Blocks entire tech tree
    affectedPillar: 'capacity'
  }
};
```

### Example: Water Tower Impact

```typescript
// BEFORE water tower
const beforeBottleneck = {
  type: 'RESOURCE_GATHERING',
  severity: 85,
  timeWasted: 120,  // hours/day across 50 NPCs
  description: 'Water fetching takes 2.4h per NPC per day'
};

const villageBeforeMetrics = {
  subsistenceOverhead: 28,  // 28% of time!
  productiveHours: 42,
  lifestyleIndex: 38  // Tier 1: Subsistence
};

// AFTER water tower
const villageAfterMetrics = {
  subsistenceOverhead: 8,   // 20% reduction!
  productiveHours: 62,      // 20% increase!
  lifestyleIndex: 61        // Tier 3: Comfortable! (+23 points)
};

// Why such a big jump?
// - Efficiency pillar: +25 (subsistence overhead fixed)
// - Capacity pillar: +8 (more time for specialized work)
// - Accessibility pillar: +5 (faster distribution)
// Total: +38 raw → +23 after weighing
```

---

## Tech & Innovation Effects

### Tech Types and Their Impact

```typescript
interface TechnologyImpact {
  id: string;
  name: string;
  
  // Direct effects on index
  capacityBoost: number;      // Unlocks new chains
  efficiencyBoost: number;    // Reduces bottlenecks
  accessibilityBoost: number; // Improves distribution
  
  // Indirect effects
  enablesChains: string[];    // New recipes available
  removesBottleneck?: BottleneckType;
  prerequisiteFor: string[];  // Gates other tech
}

const TECH_IMPACTS: Record<string, TechnologyImpact> = {
  
  // TIER 1 TECH
  'bronze_working': {
    id: 'bronze_working',
    name: 'Bronze Working',
    capacityBoost: 8,
    efficiencyBoost: 5,
    accessibilityBoost: 0,
    enablesChains: ['bronze_tools', 'bronze_weapons'],
    prerequisiteFor: ['iron_forging']
  },
  
  // TIER 2 TECH
  'iron_forging': {
    id: 'iron_forging',
    name: 'Iron Forging',
    capacityBoost: 15,
    efficiencyBoost: 10,
    accessibilityBoost: 0,
    enablesChains: ['iron_tools', 'iron_weapons', 'iron_armor'],
    prerequisiteFor: ['steel_making']
  },
  
  'water_distribution': {
    id: 'water_distribution',
    name: 'Water Distribution System',
    capacityBoost: 3,
    efficiencyBoost: 20,  // MASSIVE efficiency gain
    accessibilityBoost: 10,
    enablesChains: ['public_baths', 'irrigation'],
    removesBottleneck: 'RESOURCE_GATHERING'
  },
  
  // TIER 3 TECH
  'steel_making': {
    id: 'steel_making',
    name: 'Steel Making',
    capacityBoost: 20,
    efficiencyBoost: 15,
    accessibilityBoost: 0,
    enablesChains: ['steel_weapons', 'steel_tools', 'steel_armor'],
    prerequisiteFor: ['advanced_construction']
  },
  
  'printing_press': {
    id: 'printing_press',
    name: 'Printing Press',
    capacityBoost: 10,
    efficiencyBoost: 5,
    accessibilityBoost: 15,  // Books for everyone!
    enablesChains: ['books', 'newspapers'],
    removesBottleneck: 'EDUCATION'
  }
};
```

### Tech Adoption Curve

```typescript
// Tech doesn't instantly raise lifestyle index
// It takes time to propagate and integrate

interface TechAdoptionCurve {
  tech: Technology;
  
  day0: {
    knownBy: 1,  // Just the inventor
    indexImpact: 0
  };
  
  day30: {
    knownBy: 5,  // Early adopters
    indexImpact: 0.2  // 20% of potential
  };
  
  day90: {
    knownBy: 20,  // Spreading
    indexImpact: 0.5  // 50% of potential
  };
  
  day180: {
    knownBy: 40,  // Majority
    indexImpact: 0.8  // 80% of potential
  };
  
  day365: {
    knownBy: 48,  // Nearly everyone
    indexImpact: 1.0  // Full impact
  };
}
```

---

## Gameplay Impact

### NPC Satisfaction Modifier

```typescript
function calculateNPCSatisfaction(npc: NPC, village: Village): number {
  const baseHappiness = npc.needs.overall;
  const lifestyleIndex = village.lifestyleIndex;
  
  // Lifestyle Index directly affects satisfaction
  const lifestyleBonus = (lifestyleIndex - 50) * 0.5;
  
  return baseHappiness + lifestyleBonus;
}

// Example:
// Village with index 30: -10 happiness (struggling)
// Village with index 70: +10 happiness (thriving)
```

### Migration System

```typescript
interface MigrationPressure {
  inflow: number;   // People wanting to move in
  outflow: number;  // People wanting to leave
  net: number;      // Net migration
}

function calculateMigration(village: Village): MigrationPressure {
  const index = village.lifestyleIndex;
  const nearbyVillages = village.getNearbySettlements();
  
  // Compare to neighbors
  const averageNearbyIndex = nearbyVillages.reduce((sum, v) => 
    sum + v.lifestyleIndex, 0) / nearbyVillages.length;
  
  const indexDifference = index - averageNearbyIndex;
  
  // If our index is 20+ points higher, people want to come
  // If our index is 20+ points lower, people want to leave
  
  const monthlyInflow = Math.max(0, indexDifference / 5);
  const monthlyOutflow = Math.max(0, -indexDifference / 5);
  
  return {
    inflow: monthlyInflow,
    outflow: monthlyOutflow,
    net: monthlyInflow - monthlyOutflow
  };
}
```

### Economic Multipliers

```typescript
// Higher lifestyle index = economic advantages

interface EconomicMultipliers {
  tradeVolume: number;      // More traders visit
  tradeProfit: number;      // Better prices
  investmentAttraction: number;  // Wealthy want to invest
  skillDevelopment: number; // NPCs learn faster
}

function calculateMultipliers(lifestyleIndex: number): EconomicMultipliers {
  // All multipliers are 1.0 at index 50 (baseline)
  const factor = lifestyleIndex / 50;
  
  return {
    tradeVolume: Math.max(0.3, Math.min(3.0, factor)),
    tradeProfit: Math.max(0.8, Math.min(1.5, factor * 0.6 + 0.4)),
    investmentAttraction: Math.max(0.1, Math.min(5.0, Math.pow(factor, 2))),
    skillDevelopment: Math.max(0.5, Math.min(2.0, factor))
  };
}

// Example: Village with index 80
{
  tradeVolume: 1.6x (60% more traders)
  tradeProfit: 1.36x (36% better prices)
  investmentAttraction: 2.56x (156% more investment)
  skillDevelopment: 1.6x (60% faster learning)
}
```

### Faction Formation

```typescript
// Higher lifestyle enables more complex factions

const FACTION_REQUIREMENTS: Record<FactionType, number> = {
  'peasant_militia': 20,        // Any village
  'craft_guild': 40,            // Need specialization
  'merchant_guild': 50,         // Need trade
  'noble_house': 60,            // Need wealth
  'university': 75,             // Need prosperity
  'artist_collective': 70,      // Need leisure time
  'banking_house': 80           // Need sophisticated economy
};

function canFormFaction(
  village: Village, 
  factionType: FactionType
): boolean {
  const required = FACTION_REQUIREMENTS[factionType];
  return village.lifestyleIndex >= required;
}
```

---

## Visual Dashboard

### Main Display

```
╔══════════════════════════════════════════════════════════╗
║  MILLBROOK - Lifestyle Index: 47 (Stable)               ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  █████████████████████░░░░░░░░░░░░░░░░░░░░░░  47/100   ║
║                                                          ║
║  Tier: Stable (Working toward Comfortable)              ║
║  Trend: ↗ +3 this month                                 ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║  BREAKDOWN:                                              ║
║                                                          ║
║  Production Capacity    [████████░░] 52/100  (40% wt.)  ║
║    • 12 unique recipes available                         ║
║    • Avg chain depth: 2.3 steps                          ║
║    • Can produce: Basic + some Refined                   ║
║                                                          ║
║  Production Efficiency  [██████░░░░] 42/100  (35% wt.)  ║
║    • Subsistence overhead: 18%  ⚠️ HIGH                  ║
║    • Productive hours: 52%                               ║
║    • 3 active bottlenecks                                ║
║                                                          ║
║  Goods Accessibility    [███████░░░] 48/100  (25% wt.)  ║
║    • Acquisition time: 1.2h/day                          ║
║    • Affordability: Good                                 ║
║    • Variety: Limited                                    ║
║                                                          ║
╠══════════════════════════════════════════════════════════╣
║  TOP IMPROVEMENT OPPORTUNITIES:                          ║
║                                                          ║
║  1. 🚰 Build Water Tower        → +12 Index (to 59)     ║
║     Cost: 500 resources, 15 days                         ║
║     Effect: Reduces subsistence by 10%                   ║
║                                                          ║
║  2. 🔧 Train 2 More Blacksmiths → +5 Index (to 52)      ║
║     Cost: 60 days training                               ║
║     Effect: Enables steel weapons (depth +1)             ║
║                                                          ║
║  3. 📚 Establish School         → +8 Index (to 55)      ║
║     Cost: 800 resources, 30 days                         ║
║     Effect: Unlocks literacy-gated tech                  ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

### Comparative View

```
╔══════════════════════════════════════════════════════════╗
║  REGIONAL COMPARISON                                     ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Millbrook (You)        [███████████████████] 47        ║
║  Riverside              [████████████████████████] 58    ║
║  Ironhaven              [████████████████████████████] 72║
║  Mudville               [████████████] 28                ║
║  Silvertown             [██████████████████████████] 65  ║
║                                                          ║
║  Regional Average: 54                                    ║
║  You are: 7 points below average                         ║
║                                                          ║
║  Migration: ←─── -2 NPCs/month (people leaving)         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

### Historical Trend

```
Lifestyle Index Over Time

80 │                                          
   │                                  
70 │                         ╱───────         
   │                    ╱────                 
60 │              ╱─────                      
   │         ╱────   ← School built           
50 │    ╱────                                 
   │╱───  ← Water tower built                 
40 │                                          
   └─────────────────────────────────────────
     Y1  Y2  Y3  Y4  Y5  Y6  Y7  Y8  Y9  Y10
```

---

## Implementation Examples

### Example 1: Simple Starting Village

```typescript
const startingVillage = {
  name: 'Newbrook',
  population: 25,
  
  // LIMITED PRODUCTION
  availableRecipes: [
    { name: 'gather_berries', depth: 0 },
    { name: 'farm_grain', depth: 1 },
    { name: 'chop_wood', depth: 1 },
    { name: 'hunt_game', depth: 1 },
    { name: 'bake_bread', depth: 2 }  // Only depth 2!
  ],
  
  occupations: [
    { role: 'farmer', count: 15 },
    { role: 'hunter', count: 5 },
    { role: 'lumberjack', count: 3 },
    { role: 'baker', count: 2 }
  ],
  
  metrics: {
    subsistenceOverhead: 42,  // Spending tons of time on basics
    productiveHours: 38,
    averageChainDepth: 0.9
  },
  
  bottlenecks: [
    { type: 'RESOURCE_GATHERING', severity: 75 },
    { type: 'TOOL_SHORTAGE', severity: 65 },
    { type: 'SKILL_GAP', severity: 80 }  // No metalworkers!
  ],
  
  // CALCULATE INDEX
  capacity: 22,      // Very limited (few recipes, shallow chains)
  efficiency: 35,    // Poor (high subsistence, bottlenecks)
  accessibility: 45, // Mediocre (local only)
  
  lifestyleIndex: 32  // Tier 1: Subsistence
};
```

### Example 2: Growing Village (Player Intervenes)

```typescript
// Player introduces iron forging to Marcus
// 6 months pass...

const growingVillage = {
  name: 'Newbrook',
  population: 32,  // +7 from migration
  
  // EXPANDED PRODUCTION
  availableRecipes: [
    // All previous recipes, plus:
    { name: 'mine_iron', depth: 1 },
    { name: 'smelt_iron', depth: 2 },
    { name: 'forge_tools', depth: 3 },
    { name: 'forge_weapons', depth: 3 },
    { name: 'craft_armor', depth: 4 },
    { name: 'weave_cloth', depth: 3 },
    { name: 'brew_ale', depth: 2 }
  ],
  
  occupations: [
    { role: 'farmer', count: 12 },
    { role: 'hunter', count: 3 },
    { role: 'lumberjack', count: 3 },
    { role: 'baker', count: 2 },
    { role: 'blacksmith', count: 3 },  // NEW!
    { role: 'miner', count: 2 },       // NEW!
    { role: 'weaver', count: 2 },      // NEW!
    { role: 'brewer', count: 1 },      // NEW!
    { role: 'guard', count: 4 }        // NEW! (using iron weapons)
  ],
  
  metrics: {
    subsistenceOverhead: 28,  // Improved by 14%!
    productiveHours: 52,      // +14%
    averageChainDepth: 2.4    // Almost 3x deeper!
  },
  
  bottlenecks: [
    { type: 'RESOURCE_GATHERING', severity: 55 },  // Still an issue
    { type: 'TOOL_SHORTAGE', severity: 20 },       // Much better!
    { type: 'SKILL_GAP', severity: 45 }            // Improving
  ],
  
  // RECALCULATE INDEX
  capacity: 48,      // Much better (more recipes, deeper chains)
  efficiency: 58,    // Improved (lower subsistence)
  accessibility: 52, // Slightly better (more variety)
  
  lifestyleIndex: 53  // Tier 2: Stable → Tier 3: Comfortable!
};
```

### Example 3: Water Tower Impact

```typescript
// Player builds water tower
// 3 months pass...

const improvedVillage = {
  name: 'Newbrook',
  population: 38,  // +6 more from positive migration
  
  // Same recipes, but...
  
  metrics: {
    subsistenceOverhead: 12,  // MASSIVE reduction! (was 28%)
    productiveHours: 68,      // +16%!
    averageChainDepth: 2.4    // Same
  },
  
  bottlenecks: [
    // RESOURCE_GATHERING bottleneck REMOVED!
    { type: 'SKILL_GAP', severity: 35 },
    { type: 'DISTRIBUTION', severity: 25 }  // New issue (more goods)
  ],
  
  // RECALCULATE
  capacity: 48,      // Same
  efficiency: 82,    // HUGE jump! (+24)
  accessibility: 58, // Better (+6)
  
  lifestyleIndex: 63  // Tier 3: Comfortable! (+10 points)
};
```

### Example 4: Flourishing City

```typescript
const flourishingCity = {
  name: 'Ironhaven',
  population: 250,
  
  availableRecipes: 65,  // Massive variety
  
  occupations: [
    // Primary production
    { role: 'farmer', count: 25 },
    { role: 'miner', count: 15 },
    { role: 'lumberjack', count: 10 },
    
    // Craftspeople
    { role: 'blacksmith', count: 12 },
    { role: 'weaponsmith', count: 8 },
    { role: 'armorer', count: 6 },
    { role: 'jeweler', count: 5 },
    { role: 'carpenter', count: 10 },
    { role: 'mason', count: 8 },
    
    // Luxury goods
    { role: 'baker', count: 5 },
    { role: 'brewer', count: 4 },
    { role: 'vintner', count: 3 },
    { role: 'chef', count: 4 },
    { role: 'tailor', count: 8 },
    { role: 'cobbler', count: 4 },
    
    // Services
    { role: 'merchant', count: 20 },
    { role: 'scholar', count: 8 },
    { role: 'teacher', count: 6 },
    { role: 'healer', count: 5 },
    { role: 'entertainer', count: 10 },
    
    // Security & government
    { role: 'guard', count: 30 },
    { role: 'administrator', count: 8 }
  ],
  
  metrics: {
    subsistenceOverhead: 7,   // Nearly eliminated!
    productiveHours: 71,      // Very high
    averageChainDepth: 4.8,   // Deep, complex chains
    literacyRate: 82,         // Educated population
  },
  
  technologies: [
    'steel_making',
    'water_distribution',
    'advanced_agriculture',
    'guild_system',
    'banking',
    'printing_press'
  ],
  
  bottlenecks: [
    { type: 'DISTRIBUTION', severity: 15 }  // Minor issues only
  ],
  
  // CALCULATE
  capacity: 91,       // Exceptional
  efficiency: 88,     // Excellent
  accessibility: 85,  // Very good
  
  lifestyleIndex: 89  // Tier 5: Flourishing!
};
```

---

## Summary

### Key Takeaways

1. **Lifestyle Index is emergent** - Not set by you, calculated from village state
2. **Production chain depth matters** - Can't have high index with shallow chains
3. **Bottlenecks are costly** - Each reduces index significantly
4. **Tech is transformative** - Single innovation can jump tiers
5. **Time lag exists** - Changes take months to fully impact index
6. **Comparative pressure** - NPCs migrate toward higher index villages

### Design Elegance

✅ **Works at any tech level** (medieval, modern, sci-fi)
✅ **Purely emergent** (no hand-tuning numbers)
✅ **Rewards efficiency** (players optimize naturally)
✅ **Creates drama** (bottlenecks are visible problems)
✅ **Enables strategy** (multiple paths to increase index)
✅ **Drives narrative** (index changes are story events)

**The Lifestyle Index becomes the player's primary long-term goal: transform a struggling village into a flourishing city through smart economic management and technological advancement.** 🏰✨
