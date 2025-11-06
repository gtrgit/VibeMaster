# Efficiency Detection and Metrics System
## What Problems the Vibemaster Can Detect and How

---

## Table of Contents

1. [Core Concept](#core-concept)
2. [Time & Value Metrics](#time--value-metrics)
3. [NPC Time Allocation](#npc-time-allocation)
4. [Aggregate Settlement Metrics](#aggregate-settlement-metrics)
5. [Bottleneck Detection System](#bottleneck-detection-system)
6. [Efficiency Dashboard](#efficiency-dashboard)
7. [Problem Categories](#problem-categories)
8. [Analysis Examples](#analysis-examples)

---

## Core Concept

### The Problem with Hardcoded Metrics

âŒ **BAD APPROACH:**
```typescript
timeSpent: {
  water_fetching: 2.5,
  firewood_gathering: 1.5
}
```
This hardcodes technology level into the system!

âœ… **GOOD APPROACH:**
```typescript
needs: {
  thirst: 45,                    // Universal body-level need
  temperature_comfort: 60        // Universal body-level need
}

satisfactionMethods: [
  { need: 'thirst', method: 'fetch_from_well', time: 2.5 },
  { need: 'thirst', method: 'turn_on_faucet', time: 0.05 }
]
```
Technology-agnostic! Works at any tech level!

### Key Principles

1. **Needs are universal** - Thirst, hunger, comfort are constant
2. **Technologies are methods** - Different ways to satisfy needs
3. **Efficiency is relative** - Compare methods, not absolute values
4. **Time = Value** - Calculate opportunity cost
5. **Bottlenecks are emergent** - Detected from aggregate behavior
6. **Solutions are contextual** - What works depends on resources/skills available

---

## Time & Value Metrics

### Individual NPC Time Allocation

```typescript
interface NPCTimeAllocation {
  npcId: string;
  day: number;
  
  // TIME BREAKDOWN (24 hours)
  timeSpent: {
    // SURVIVAL (necessary but not productive)
    sleep: number;              // 6-8 hours (fixed)
    eating: number;             // 1-2 hours (fixed)
    personal_hygiene: number;   // 0.5 hours
    
    // SUBSISTENCE (could be optimized with tech)
    needSatisfaction: Map<NeedType, number>;
    // e.g., thirst: 2.5 hours, temperature: 1.0 hours
    
    // PRODUCTIVE WORK (creates value)
    primary_occupation: number; // Blacksmithing, farming, etc.
    skill_improvement: number;  // Learning/practicing
    
    // ECONOMIC ACTIVITY
    trading: number;
    selling: number;
    negotiating: number;
    
    // SOCIAL (relationship building)
    socializing: number;
    family_time: number;
    
    // LEISURE (rest/recreation)
    entertainment: number;
    hobbies: number;
    
    // TRAVEL (moving between activities)
    commute_to_work: number;
    other_travel: number;
    
    // IDLE (wasted time)
    waiting: number;            // Waiting for shop to open, etc.
    idle: number;               // Nothing to do
  };
  
  // VALUE PRODUCED
  valueCreated: {
    economic: number;           // Gold value of goods/services
    social: number;             // Relationship improvements
    knowledge: number;          // Skills learned
    infrastructure: number;     // Buildings/improvements
  };
  
  // EFFICIENCY METRICS
  productiveHours: number;      // Work + economic + skill improvement
  subsistenceHours: number;     // Time on need satisfaction
  wastedHours: number;          // Idle + excessive travel
  
  valuePerProductiveHour: number;
  totalEfficiency: number;      // 0-100 score
}
```

### Value Calculation

```typescript
class ValueCalculator {
  
  /**
   * Calculate economic value of NPC's output
   */
  calculateEconomicValue(npc: NPC, dayActivities: Activity[]): number {
    let totalValue = 0;
    
    for (const activity of dayActivities) {
      switch (activity.type) {
        case 'craft_item':
          const item = activity.result.item;
          const marketValue = this.getMarketValue(item);
          const skillBonus = npc.skills[activity.skill] / 100;
          totalValue += marketValue * (1 + skillBonus);
          break;
          
        case 'farm':
          const yield = activity.result.yield;
          totalValue += this.getMarketValue('food') * yield;
          break;
          
        case 'trade':
          totalValue += activity.result.profit;
          break;
          
        case 'service':
          totalValue += activity.result.payment || 
                       this.estimateServiceValue(activity);
          break;
      }
    }
    
    return totalValue;
  }
  
  /**
   * Calculate subsistence burden
   */
  calculateSubsistenceBurden(npc: NPC, day: number): SubsistenceCost {
    const needSatisfactionTime = npc.getTimeSpentOnNeeds(day);
    
    const totalSubsistenceTime = Object.values(needSatisfactionTime)
      .reduce((sum, time) => sum + time, 0);
    
    // What could they have produced instead?
    const opportunityCost = totalSubsistenceTime * npc.hourlyValuePotential;
    
    return {
      timeSpent: totalSubsistenceTime,
      percentOfDay: (totalSubsistenceTime / 16) * 100, // 16 waking hours
      opportunityCost: opportunityCost,
      category: this.categorizeSubsistenceBurden(totalSubsistenceTime)
    };
  }
  
  categorizeSubsistenceBurden(hours: number): string {
    if (hours < 2) return 'minimal';
    if (hours < 4) return 'moderate';
    if (hours < 6) return 'heavy';
    return 'crushing';
  }
}
```

---

## NPC Time Allocation

### Example: Marcus the Blacksmith

```typescript
// Day 47 for Marcus
const marcusTimeAllocation = {
  npcId: 'marcus',
  day: 47,
  
  timeSpent: {
    // SURVIVAL (fixed)
    sleep: 7,
    eating: 1.5,
    personal_hygiene: 0.5,
    
    // SUBSISTENCE (could be optimized!)
    needSatisfaction: {
      thirst: 2.5,              // Fetching water from well
      temperature: 0.5,         // Gathering firewood
      cleanliness: 0.3          // Washing at river
    },
    
    // PRODUCTIVE
    primary_occupation: 9,      // Blacksmithing
    skill_improvement: 0.5,     // Practicing new technique
    
    // ECONOMIC
    trading: 0,
    selling: 1.5,               // Selling finished goods
    
    // SOCIAL
    socializing: 0.5,
    family_time: 0.2,
    
    // TRAVEL
    commute_to_work: 0.2,       // Lives near forge
    other_travel: 0.3,
    
    // IDLE
    waiting: 0,
    idle: 0
  },
  
  valueCreated: {
    economic: 135,              // Made 3 iron swords (45 gold each)
    social: 5,                  // Chatted with customers
    knowledge: 2,               // Practiced new technique
    infrastructure: 0
  },
  
  // EFFICIENCY METRICS
  productiveHours: 11,          // 9 + 0.5 + 1.5
  subsistenceHours: 3.3,        // Could be reduced!
  wastedHours: 0,
  
  valuePerProductiveHour: 12.3, // 135 / 11 = 12.3 gold/hour
  totalEfficiency: 75           // Above average
};

// ANALYSIS:
// Marcus is efficient, but wastes 3.3 hours on subsistence
// If water tower built: saves 2.5 hours â†’ 2.5 * 12.3 = 30.75 gold/day gain
// Annual benefit for Marcus: 30.75 * 365 = 11,224 gold/year
```

---

## Aggregate Settlement Metrics

```typescript
interface AggregateEfficiencyMetrics {
  locationId: string;
  day: number;
  population: number;
  
  // AGGREGATE TIME
  totalPopulationHours: number; // population * 24
  
  timeAllocation: {
    survival: number;           // % of total hours
    subsistence: number;        // % - WANT THIS LOW
    productive: number;         // % - WANT THIS HIGH
    social: number;
    travel: number;
    wasted: number;
  };
  
  // VALUE PRODUCTION
  totalValueCreated: {
    goods_produced: Map<ItemType, number>;
    services_rendered: number;
    infrastructure_built: number;
    knowledge_gained: number;
  };
  
  // EFFICIENCY RATIOS
  averageValuePerCapita: number;
  averageProductiveHours: number;
  subsistenceOverhead: number;  // CRITICAL METRIC
  
  // COMPARISON
  efficiencyTrend: number[];    // Last 7 days
  comparedToSimilar: number;    // Percentile
}
```

### Example: Millbrook Settlement

```typescript
const millbrookMetrics = {
  locationId: 'millbrook',
  day: 47,
  population: 100,
  
  totalPopulationHours: 2400,   // 100 * 24
  
  timeAllocation: {
    survival: 37.5,             // 900 hours (sleep, eating)
    subsistence: 15.6,          // 375 hours - PROBLEM!
    productive: 35.4,           // 850 hours
    social: 6.3,                // 150 hours
    travel: 4.2,                // 100 hours
    wasted: 1.0                 // 25 hours
  },
  
  totalValueCreated: {
    goods_produced: {
      food: 250,
      tools: 45,
      weapons: 15,
      clothing: 30
    },
    services_rendered: 120,
    infrastructure_built: 0,
    knowledge_gained: 15
  },
  
  averageValuePerCapita: 8.5,   // 850 gold / 100 people
  averageProductiveHours: 8.5,  // 850 / 100
  subsistenceOverhead: 15.6,    // 15.6% of time on subsistence!
  
  efficiencyTrend: [62, 61, 63, 62, 64, 63, 62], // Stable
  comparedToSimilar: 45         // 45th percentile - below average
};

// ANALYSIS:
// Settlement is moderately inefficient
// Main problem: 15.6% subsistence overhead
// 375 hours/day wasted on need satisfaction
// At 8.5 gold/hour average, that's 3,187 gold/day lost
// Annual loss: 1,163,255 gold
```

---

## Bottleneck Detection System

```typescript
enum BottleneckType {
  RESOURCE_GATHERING = 'resource_gathering',   // Water, food, firewood
  INFRASTRUCTURE = 'infrastructure',           // No roads, bridges
  TOOL_SHORTAGE = 'tool_shortage',            // Not enough tools
  SKILL_GAP = 'skill_gap',                    // No one knows how
  DISTRIBUTION = 'distribution',              // Goods don't reach people
  COMMUNICATION = 'communication',            // Info doesn't spread
  COORDINATION = 'coordination',              // No organization
  EDUCATION = 'education',                    // Illiteracy blocks tech
  SEASONAL = 'seasonal'                       // Winter/summer bottleneck
}

interface Bottleneck {
  id: string;
  type: BottleneckType;
  severity: number;         // 0-100
  affectedNPCs: number;     // How many people
  timeWasted: number;       // Hours per day across population
  opportunityCost: number;  // Value lost
  
  description: string;
  suggestions: Solution[];
}

interface Solution {
  tech?: TechId;
  action?: string;
  timeReduction?: number;
  valueSaved?: number;
  productivityGain?: number;
  requirements: string[];
  cost: number;
  roi: number;              // Return on investment %
}
```

### Bottleneck Detection Logic

```typescript
class BottleneckDetector {
  
  detectBottlenecks(
    settlement: Location, 
    metrics: AggregateEfficiencyMetrics
  ): Bottleneck[] {
    
    const bottlenecks: Bottleneck[] = [];
    
    // 1. WATER FETCHING BOTTLENECK
    const waterTime = this.calculateAggregateNeedTime(
      settlement, 
      'thirst'
    );
    
    if (waterTime.totalHours > settlement.population * 1.5) {
      bottlenecks.push({
        id: 'water_fetching',
        type: BottleneckType.RESOURCE_GATHERING,
        severity: 80,
        affectedNPCs: settlement.population,
        timeWasted: waterTime.totalHours,
        opportunityCost: waterTime.totalHours * metrics.averageValuePerCapita,
        
        description: `Population spends ${waterTime.totalHours} hours/day on water. Could be reduced to near-zero.`,
        
        suggestions: [
          {
            tech: 'water_tower',
            timeReduction: waterTime.totalHours * 0.95,
            valueSaved: waterTime.totalHours * 0.95 * metrics.averageValuePerCapita,
            requirements: ['engineering_skill', 'materials', 'labor'],
            cost: 500,
            roi: 30000  // 300x return
          },
          {
            tech: 'public_well',
            timeReduction: waterTime.totalHours * 0.60,
            valueSaved: waterTime.totalHours * 0.60 * metrics.averageValuePerCapita,
            requirements: ['digging_tools', 'labor'],
            cost: 150,
            roi: 15000  // 150x return
          }
        ]
      });
    }
    
    // 2. TOOL SHORTAGE BOTTLENECK
    const toolRatio = this.calculateToolAvailability(settlement);
    
    if (toolRatio < 0.5) {
      const productivityLoss = this.estimateProductivityLoss(toolRatio);
      
      bottlenecks.push({
        id: 'tool_shortage',
        type: BottleneckType.TOOL_SHORTAGE,
        severity: 70,
        affectedNPCs: settlement.getWorkerCount(),
        timeWasted: 0,
        opportunityCost: productivityLoss,
        
        description: `Only ${toolRatio * 100}% tool availability. ${productivityLoss} gold/day lost productivity.`,
        
        suggestions: [
          {
            tech: 'iron_tools',
            productivityGain: 40,
            requirements: ['iron_forging', 'blacksmith', 'iron_ore'],
            cost: 200,
            roi: 8000
          }
        ]
      });
    }
    
    // 3. SKILL GAP BOTTLENECK
    const criticalSkills = this.identifyCriticalSkillGaps(settlement);
    
    for (const skillGap of criticalSkills) {
      bottlenecks.push({
        id: `skill_gap_${skillGap.skill}`,
        type: BottleneckType.SKILL_GAP,
        severity: skillGap.severity,
        affectedNPCs: skillGap.affectedNPCs,
        
        description: `No NPCs with ${skillGap.skill}. Cannot produce ${skillGap.blockedProduction.join(', ')}.`,
        
        suggestions: [
          {
            action: 'introduce_teacher',
            description: 'Bring in NPC with this skill',
            requirements: ['recruitment', 'salary_budget']
          },
          {
            action: 'player_teaches',
            description: 'Player can teach if they have skill',
            requirements: ['player_skill', 'time']
          },
          {
            action: 'establish_school',
            description: 'Build formal education system',
            requirements: ['building', 'teacher', 'curriculum'],
            cost: 500
          }
        ]
      });
    }
    
    // 4. TRAVEL/DISTANCE BOTTLENECK
    const travelTime = this.calculateAggregateActivity(settlement, 'travel');
    
    if (travelTime.averagePerNPC > 2) {
      bottlenecks.push({
        id: 'excessive_travel',
        type: BottleneckType.INFRASTRUCTURE,
        severity: 60,
        affectedNPCs: settlement.population,
        timeWasted: travelTime.totalHours,
        opportunityCost: travelTime.totalHours * metrics.averageValuePerCapita,
        
        description: `${travelTime.totalHours} hours/day on travel. Layout inefficient.`,
        
        suggestions: [
          {
            tech: 'roads',
            timeReduction: travelTime.totalHours * 0.30,
            requirements: ['labor', 'stone'],
            cost: 300,
            roi: 5000
          },
          {
            action: 'reorganize_settlement',
            description: 'Move homes closer to workplaces',
            requirements: ['building', 'labor'],
            cost: 200
          }
        ]
      });
    }
    
    // 5. ILLITERACY BOTTLENECK
    const literacyRate = this.calculateLiteracyRate(settlement);
    
    if (literacyRate < 30) {
      const techsBlocked = this.countBlockedTechs(settlement);
      
      bottlenecks.push({
        id: 'illiteracy',
        type: BottleneckType.EDUCATION,
        severity: 85,
        affectedNPCs: settlement.population,
        
        description: `Only ${literacyRate}% literacy. Blocks ${techsBlocked} technologies.`,
        
        suggestions: [
          {
            action: 'build_school',
            description: 'Establish basic education system',
            requirements: ['building', 'teacher', 'books'],
            cost: 500,
            valueSaved: 'Unlocks all blueprint-based tech',
            roi: 50000
          }
        ]
      });
    }
    
    // 6. COORDINATION BOTTLENECK
    const coordination = this.calculateCoordinationEfficiency(settlement);
    
    if (coordination < 50) {
      bottlenecks.push({
        id: 'poor_coordination',
        type: BottleneckType.COORDINATION,
        severity: 50,
        affectedNPCs: settlement.population,
        
        description: `Low coordination. Tasks overlap, resources wasted.`,
        
        suggestions: [
          {
            action: 'establish_leadership',
            description: 'Create formal leadership structure',
            requirements: ['leader_npc']
          },
          {
            action: 'create_guilds',
            description: 'Organize by profession',
            requirements: ['guild_halls', 'organization']
          }
        ]
      });
    }
    
    return bottlenecks.sort((a, b) => b.severity - a.severity);
  }
  
  /**
   * Calculate total time spent satisfying a need
   */
  calculateAggregateNeedTime(
    settlement: Location, 
    need: NeedType
  ): AggregateNeedTime {
    
    const npcs = settlement.getNPCs();
    let totalHours = 0;
    let npcsAffected = 0;
    
    for (const npc of npcs) {
      const needTime = npc.getTimeSpentOnNeed(need);
      if (needTime > 0) {
        totalHours += needTime;
        npcsAffected++;
      }
    }
    
    return {
      need,
      totalHours,
      averagePerNPC: totalHours / npcs.length,
      npcsAffected,
      currentMethods: this.getMethodsUsed(settlement, need)
    };
  }
}
```

---

## Efficiency Dashboard

```typescript
interface EfficiencyDashboard {
  settlement: Location;
  currentDay: number;
  
  // OVERVIEW
  overallEfficiency: number;      // 0-100
  trend: 'improving' | 'stable' | 'declining';
  
  // TIME ALLOCATION (Pie Chart)
  timeBreakdown: {
    productive: number;           // 35% (WANT HIGH)
    subsistence: number;          // 30% (WANT LOW)
    social: number;               // 15%
    travel: number;               // 10% (WANT LOW)
    survival: number;             // 10% (fixed)
  };
  
  // VALUE PRODUCTION
  valueMetrics: {
    totalValuePerDay: number;
    valuePerCapita: number;
    valuePerProductiveHour: number;
    comparedToLastWeek: number;   // % change
  };
  
  // TOP BOTTLENECKS (sorted by severity)
  topBottlenecks: Bottleneck[];
  
  // OPPORTUNITIES (sorted by ROI)
  opportunities: Opportunity[];
  
  // DRILL-DOWN VIEWS
  byOccupation: Map<Occupation, EfficiencyMetrics>;
  byNPC: Map<NPCId, NPCTimeAllocation>;
  byActivity: Map<ActivityType, AggregateActivityMetrics>;
}
```

### Example Dashboard: Millbrook

```typescript
const millbrookDashboard = {
  settlement: 'Millbrook',
  currentDay: 47,
  
  overallEfficiency: 62,          // Out of 100
  trend: 'stable',
  
  timeBreakdown: {
    productive: 35.4,
    subsistence: 15.6,            // PROBLEM!
    social: 6.3,
    travel: 4.2,                  // PROBLEM!
    survival: 37.5,
    wasted: 1.0
  },
  
  valueMetrics: {
    totalValuePerDay: 850,
    valuePerCapita: 8.5,
    valuePerProductiveHour: 10.0,
    comparedToLastWeek: -2        // Slight decline
  },
  
  topBottlenecks: [
    {
      id: 'illiteracy',
      severity: 85,
      description: '85% illiterate, blocks all blueprint tech',
      potentialGain: 'Massive'
    },
    {
      id: 'water_fetching',
      severity: 80,
      description: '250 hours/day fetching water',
      potentialGain: '2,125 gold/day'
    },
    {
      id: 'tool_shortage',
      severity: 70,
      description: '40% productivity loss from lack of tools',
      potentialGain: '340 gold/day'
    }
  ],
  
  opportunities: [
    {
      action: 'Build school',
      cost: 500,
      benefit: 'Unlocks blueprint-based tech',
      roi: 50000,
      priority: 1
    },
    {
      action: 'Build water tower',
      cost: 500,
      benefit: '2,125 gold/day',
      roi: 30000,
      priority: 2
    },
    {
      action: 'Produce iron tools',
      cost: 200,
      benefit: '340 gold/day',
      roi: 8000,
      priority: 3
    }
  ]
};
```

---

## Problem Categories

### 1. Resource Gathering Inefficiencies

**Symptoms:**
- High time spent on basic needs (water, food, fuel)
- Subsistence overhead > 10%
- NPCs traveling far for basic resources

**Solutions:**
- Infrastructure (wells, water towers, storage)
- Technology (better tools, automation)
- Organization (centralized resource distribution)

**Example:**
- Problem: 250 hours/day fetching water
- Solution: Water tower
- Cost: 500 gold
- Benefit: 2,125 gold/day saved
- ROI: 300x

### 2. Tool/Equipment Shortages

**Symptoms:**
- Low productivity despite skilled workers
- Long production times
- Low quality output
- Tool sharing/queuing

**Solutions:**
- Produce more tools
- Improve tool quality (better materials)
- Establish tool-making infrastructure

**Example:**
- Problem: 0.5 tools per worker
- Solution: Iron tools production
- Cost: 200 gold
- Benefit: +40% productivity
- ROI: 80x

### 3. Skill Gaps

**Symptoms:**
- Critical functions not performed
- No one can make X
- Knowledge bottleneck
- Innovation blocked

**Solutions:**
- Education system
- Recruit skilled NPCs
- Apprenticeships
- Player teaching

**Example:**
- Problem: No engineers
- Solution: Build school, curriculum
- Cost: 500 gold + ongoing
- Benefit: Unlocks infrastructure tech
- ROI: 500x

### 4. Infrastructure Deficiencies

**Symptoms:**
- High travel time
- Poor distribution
- Inefficient layout
- Resource waste in transit

**Solutions:**
- Roads
- Bridges
- Reorganize settlement
- Storage facilities

**Example:**
- Problem: 100 hours/day travel
- Solution: Road network
- Cost: 300 gold
- Benefit: 850 gold/day saved
- ROI: 50x

### 5. Coordination Failures

**Symptoms:**
- Duplicated work
- Conflicting goals
- Resource contention
- Poor timing

**Solutions:**
- Leadership structure
- Guild organization
- Communication systems
- Planning/scheduling

**Example:**
- Problem: Multiple NPCs making same item
- Solution: Guild coordination
- Cost: 100 gold
- Benefit: 20% efficiency gain
- ROI: 30x

### 6. Knowledge/Information Barriers

**Symptoms:**
- Illiteracy blocks tech
- Can't read blueprints
- Poor record keeping
- Information silos

**Solutions:**
- Basic education
- Writing/reading courses
- Document creation
- Information sharing systems

**Example:**
- Problem: 85% illiteracy rate
- Solution: Basic school
- Cost: 500 gold + 125/month
- Benefit: Unlocks all blueprint tech
- ROI: Incalculable

---

## Analysis Examples

### Example 1: Water Fetching Deep Dive

```typescript
// Millbrook Water Analysis
{
  need: 'thirst',
  population: 100,
  
  currentMethod: 'fetch_from_well',
  currentStats: {
    averageTimePerNPC: 2.5,       // 2.5 hours each
    totalTimeSpent: 250,          // 250 hours/day
    percentOfWakingHours: 15.6,   // Huge!
    
    breakdown: {
      walkToWell: 90,             // 90 hours walking
      waitInLine: 60,             // 60 hours waiting (peak times!)
      fillContainers: 50,         // 50 hours filling
      walkHome: 50                // 50 hours returning
    }
  },
  
  opportunityCost: {
    averageValuePerHour: 8.5,
    dailyLoss: 2125,              // 250 * 8.5 = 2,125 gold/day
    annualLoss: 775625            // 775,625 gold/year!
  },
  
  potentialSolutions: [
    {
      solution: 'public_well_closer',
      timeReduction: 60,          // Save 60 hours (eliminate most walking)
      valueSaved: 510,            // 510 gold/day
      cost: 150,
      payback: 0.3,               // Pays for itself in 0.3 days!
      roi: 120000                 // 1200x
    },
    {
      solution: 'public_fountain',
      timeReduction: 200,         // Save 200 hours
      valueSaved: 1700,           // 1,700 gold/day
      cost: 2000,
      payback: 1.2,
      roi: 31000
    },
    {
      solution: 'water_tower_plumbing',
      timeReduction: 238,         // Save 238 hours (keep 12 for maintenance)
      valueSaved: 2023,           // 2,023 gold/day
      cost: 5000,
      payback: 2.5,
      roi: 14800
    }
  ],
  
  recommendation: {
    phase1: 'Build additional public well (150 gold, quick win)',
    phase2: 'Build public fountain (2000 gold, major improvement)',
    phase3: 'Full water tower system (5000 gold, maximum efficiency)',
    totalTransformation: '250 hours â†’ 12 hours (95% reduction)'
  }
}
```

### Example 2: Illiteracy Impact Analysis

```typescript
// Millbrook Education Gap
{
  population: 100,
  
  literacyMetrics: {
    canRead: 15,                  // Only 15%
    canReadAdvanced: 3,           // Only 3%
    canDoMath: 8,                 // Only 8%
    canWrite: 10                  // Only 10%
  },
  
  blockedTechnologies: [
    'steel_forging',              // Requires reading + math
    'engineering',                // Requires math
    'advanced_medicine',          // Requires reading
    'accounting',                 // Requires math
    'architecture',               // Requires both
    'chemistry',                  // Requires both
    'legal_system',               // Requires reading
    'advanced_farming'            // Requires reading
  ],
  
  currentImpact: {
    productivityPenalty: 40,      // 40% less productive
    techGenerationsBehind: 2,     // 2 tiers behind literate settlements
    vulnerableToFraud: true,      // Can't read contracts
    tradingDisadvantage: true,    // Can't verify documents
    innovationBlocked: true       // Can't learn from blueprints
  },
  
  solution: {
    action: 'Build basic school',
    costs: {
      construction: 500,
      teacherSalary: 100,         // Per month
      maintenance: 25,            // Per month
      books: 50,                  // One-time
      supplies: 10                // Per month
    },
    
    timeline: {
      year1: 'First 20 students enrolled',
      year5: 'First graduates, 30% literacy',
      year10: '70% literacy achieved',
      year15: 'Universal basic education'
    },
    
    benefits: {
      immediateUnlock: 'Can now learn blueprint-based tech',
      year5Impact: '+15% productivity',
      year10Impact: '+35% productivity, +2 tech tiers',
      year15Impact: '+60% productivity, knowledge economy'
    },
    
    roi: {
      paybackPeriod: 18,          // Months
      annualBenefit: 50000,       // After year 10
      strategicValue: 'Incalculable - enables entire tech tree'
    }
  }
}
```

### Example 3: Comparative Analysis

```typescript
// Comparing Three Settlements
{
  settlements: [
    {
      name: 'Millbrook',
      efficiency: 62,
      subsistenceOverhead: 15.6,
      literacyRate: 15,
      valuePerCapita: 8.5,
      techTier: 1
    },
    {
      name: 'Riverside',
      efficiency: 78,
      subsistenceOverhead: 8.2,   // Water tower built!
      literacyRate: 45,           // Basic school
      valuePerCapita: 14.2,
      techTier: 2
    },
    {
      name: 'Ironhaven',
      efficiency: 91,
      subsistenceOverhead: 3.5,   // Full infrastructure
      literacyRate: 85,           // University
      valuePerCapita: 25.8,
      techTier: 3
    }
  ],
  
  insights: [
    'Subsistence overhead correlates strongly with efficiency',
    'Literacy rate enables higher tech tiers',
    'Infrastructure investment compounds over time',
    'Millbrook has 3x improvement potential'
  ],
  
  millbrookPath: {
    currentState: 'Early medieval, pre-infrastructure',
    potentialState: 'Advanced medieval, educated population',
    transformationCost: 2000,     // Build school + water tower
    transformationTime: '5-10 years',
    expectedEfficiency: 85,
    expectedValuePerCapita: 22.0,
    expectedGrowth: '2.5x'
  }
}
```

---

## Summary

### This System Provides:

1. **Technology-Agnostic Metrics** - Works at any tech level
2. **Automatic Bottleneck Detection** - VM sees problems emerge
3. **ROI Calculations** - Quantifies value of solutions
4. **Multiple Solution Paths** - Tech, organization, infrastructure
5. **Comparative Analysis** - Benchmark against similar settlements
6. **Predictive Modeling** - Project future improvements
7. **Drill-Down Capability** - From macro to individual NPCs
8. **Actionable Insights** - Clear recommendations with costs/benefits

### Key Metrics:

- **Subsistence Overhead** - % time on need satisfaction (want low)
- **Productive Hours** - % time creating value (want high)
- **Value Per Capita** - Economic output per person
- **Efficiency Score** - Overall 0-100 rating
- **Tech Tier** - What generation of solutions available
- **Literacy Rate** - % who can read/write (gates advanced tech)
- **Tool Availability** - Tools per worker ratio
- **Travel Time** - Infrastructure efficiency indicator

**The Vibemaster gets real, actionable data about where bottlenecks are and what solutions would provide the best ROI!** ðŸ“Š
