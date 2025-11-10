# Circle-Based Procedural World Generation - Integration Layer

**Date:** November 8, 2025
**Status:** Design Specification
**Purpose:** Bridge VibeMaster Studio (voice input) and Living World Simulation (Phaser/Prisma) with hierarchical circle-based procedural generation

---

## 🎯 The Problem

**We have TWO working but disconnected systems:**

### System 1: VibeMaster Studio (✅ Production Ready)
- **What:** Single HTML file for voice → JSON conversion
- **Workflow:** Voice recording → Speech-to-Text → Claude parsing → JSON export
- **Strength:** Fast content creation (10 seconds to create a scene)
- **Limitation:** Creates static JSON files with no simulation connection

### System 2: Living World Simulation (🔧 ~40% Complete)
- **What:** Phaser + Tauri + Prisma database engine
- **Has:**
  - ✅ Complete Prisma schema (NPCs, locations, factions, goals, etc.)
  - ✅ NPC personality/emotions/needs system (Big Five traits)
  - ✅ Need-based daily cycle behavior
  - ✅ Resource production and economy system
  - ✅ Basic visual rendering in Phaser
- **Limitation:** No procedural world generation, manual data entry required

**The Gap:** No way to go from high-level descriptions to populated, living worlds.

---

## 💡 The Solution: Circle Generation Layer

The circle-based approach is **NOT a replacement** - it's the **MISSING INTEGRATION LAYER**:

```
Voice Input (Studio)
    ↓
🔵 CIRCLE GENERATION LAYER (NEW!)
    ↓ Top-down procedural generation
    ↓
Living World Simulation (Desktop)
```

### What Are Circles?

**Circles are hierarchical containers that spawn from each other:**

```
PopulationCircle (500 people, medieval town)
    ↓ spawns
WealthCircle (50% wealth distribution)
    ↓ spawns
DemographicCircles (Farmers: 200, Craftsmen: 150, Nobles: 50, Clergy: 100)
    ↓ spawns
ServiceCircles (Church needs clergy, Workshop needs craftsmen, Farm needs farmers)
    ↓ spawns
DemandCircles (Church needs donations, Workshop needs materials, Farm needs labor)
```

**Each circle knows:**
- What it needs to spawn (prerequisites)
- What it spawns (children)
- How many of its children to create
- Where to position them spatially

---

## 🏗️ Integration Architecture

### The Complete Pipeline

```typescript
// /src/integrations/world-generation-pipeline.ts

interface WorldGenerationPipeline {
  // STEP 1: Voice/Text Input
  // From VibeMaster Studio or direct text
  input: {
    source: 'voice' | 'text';
    description: string;  // "Create a medieval mining town of 500 people"
  };

  // STEP 2: High-Level Concept Extraction
  // Claude parses natural language into parameters
  concepts: {
    biome: string;           // "mountain"
    population: number;       // 500
    wealthLevel: number;      // 40 (poor mining town)
    primaryIndustry: string;  // "mining"
    techLevel: string;        // "medieval"
    culture: string;          // "hardworking, isolated"
  };

  // STEP 3: Circle Generation (NEW SYSTEM)
  circles: {
    population: PopulationCircle;
    wealth: WealthCircle;
    demographics: DemographicCircle[];  // Miners, smiths, merchants
    services: ServiceCircle[];          // Mine, smithy, tavern, church
    demands: QuestDemandCircle[];       // "Need iron", "Repair tools"
  };

  // STEP 4: Database Population (EXISTING SYSTEM)
  prismaData: {
    world: Prisma.WorldCreateInput;
    locations: Prisma.LocationCreateInput[];
    npcs: Prisma.NPCCreateInput[];
    factions: Prisma.FactionCreateInput[];
    goals: Prisma.GoalCreateInput[];
  };

  // STEP 5: Simulation Launch (EXISTING SYSTEM)
  // Your existing NPC systems take over
  simulation: {
    dailyCycle: true;
    needBasedBehavior: true;
    resourceProduction: true;
  };
}
```

---

## 📐 Circle System Design

### Core Circle Types

```typescript
// /src/systems/procedural/circle-types.ts

/**
 * Base circle interface
 * All circles extend this
 */
interface BaseCircle {
  id: string;
  centerX: number;
  centerY: number;
  radius: number;
  parent?: string;         // ID of parent circle
  children: string[];      // IDs of child circles
  metadata: Record<string, any>;
}

/**
 * Top-level circle: defines total population
 */
interface PopulationCircle extends BaseCircle {
  type: 'population';
  totalPopulation: number;
  settlementType: 'village' | 'town' | 'city';
  biome: string;
  techLevel: string;
}

/**
 * Wealth distribution circle
 */
interface WealthCircle extends BaseCircle {
  type: 'wealth';
  averageWealth: number;      // 0-100
  wealthDistribution: 'equal' | 'moderate' | 'extreme';
  giniCoefficient: number;    // Inequality measure
}

/**
 * Demographic segment (occupation/class)
 */
interface DemographicCircle extends BaseCircle {
  type: 'demographic';
  demographicType: 'farmer' | 'craftsman' | 'merchant' | 'noble' | 'clergy' | 'laborer';
  populationCount: number;
  averageWealth: number;
  skillLevel: number;         // 0-100
  culturalTraits: string[];
}

/**
 * Service/Building that serves demographics
 */
interface ServiceCircle extends BaseCircle {
  type: 'service';
  serviceType: 'essential' | 'commerce' | 'luxury' | 'governance';
  buildingType: string;       // "church", "smithy", "tavern"
  servesDemographics: string[]; // IDs of demographics served
  requiresResources: string[];  // ["iron", "wood"]
  employeeCount: number;
  capacity: number;           // How many people it can serve
}

/**
 * Quest demand generated from service needs
 */
interface QuestDemandCircle extends BaseCircle {
  type: 'demand';
  demandType: 'resource' | 'labor' | 'protection' | 'information';
  originService: string;      // ID of service that needs it
  resourceNeeded?: string;
  urgency: 'low' | 'medium' | 'high';
  reward: number;
}
```

### Circle Spawning Rules

```typescript
// /src/systems/procedural/circle-spawning-rules.ts

/**
 * Hierarchical spawning rules
 * Each circle type knows how to spawn its children
 */

class CircleSpawningRules {

  /**
   * LEVEL 1: Population → Wealth
   */
  spawnWealthFromPopulation(pop: PopulationCircle): WealthCircle {
    // Wealth distribution based on settlement type and industry
    let averageWealth = 50; // Base
    let distribution: 'equal' | 'moderate' | 'extreme' = 'moderate';

    // Adjust based on industry
    if (pop.metadata.primaryIndustry === 'mining') {
      averageWealth = 40; // Hard work, low wealth
      distribution = 'moderate';
    } else if (pop.metadata.primaryIndustry === 'trade') {
      averageWealth = 70; // Trade brings wealth
      distribution = 'extreme'; // Merchants vs laborers
    }

    return {
      id: generateId(),
      type: 'wealth',
      centerX: pop.centerX,
      centerY: pop.centerY,
      radius: pop.radius * 0.9,
      parent: pop.id,
      children: [],
      averageWealth,
      wealthDistribution: distribution,
      giniCoefficient: distribution === 'equal' ? 0.25 :
                       distribution === 'moderate' ? 0.45 : 0.65,
      metadata: {}
    };
  }

  /**
   * LEVEL 2: Wealth → Demographics
   */
  spawnDemographicsFromWealth(
    pop: PopulationCircle,
    wealth: WealthCircle
  ): DemographicCircle[] {
    const demographics: DemographicCircle[] = [];
    const totalPop = pop.totalPopulation;
    const industry = pop.metadata.primaryIndustry;

    // Distribution based on industry
    const distributions = {
      mining: {
        miners: 0.40,      // 40% miners
        laborers: 0.25,    // 25% general labor
        craftsmen: 0.15,   // 15% smiths/toolmakers
        merchants: 0.10,   // 10% merchants
        clergy: 0.05,      // 5% clergy
        nobles: 0.05       // 5% mine owners/nobles
      },
      farming: {
        farmers: 0.60,
        laborers: 0.20,
        craftsmen: 0.10,
        merchants: 0.05,
        clergy: 0.03,
        nobles: 0.02
      },
      trade: {
        merchants: 0.35,
        craftsmen: 0.25,
        laborers: 0.20,
        nobles: 0.10,
        farmers: 0.05,
        clergy: 0.05
      }
    };

    const dist = distributions[industry] || distributions.farming;

    // Create demographic circles
    Object.entries(dist).forEach(([type, percentage], index) => {
      const count = Math.round(totalPop * percentage);

      if (count === 0) return;

      // Position around wealth circle
      const angle = (index / Object.keys(dist).length) * Math.PI * 2;
      const distance = wealth.radius * 0.7;

      demographics.push({
        id: generateId(),
        type: 'demographic',
        demographicType: type as any,
        populationCount: count,
        centerX: wealth.centerX + Math.cos(angle) * distance,
        centerY: wealth.centerY + Math.sin(angle) * distance,
        radius: Math.sqrt(count) * 5, // Size based on population
        parent: wealth.id,
        children: [],
        averageWealth: this.calculateDemographicWealth(type, wealth),
        skillLevel: this.calculateSkillLevel(type, pop.techLevel),
        culturalTraits: this.getCulturalTraits(type, industry),
        metadata: { industry }
      });
    });

    return demographics;
  }

  /**
   * LEVEL 3: Demographics → Services
   */
  spawnServicesFromDemographics(
    demographics: DemographicCircle[]
  ): ServiceCircle[] {
    const services: ServiceCircle[] = [];

    for (const demo of demographics) {
      // Each demographic needs certain services
      const requiredServices = this.getRequiredServices(demo);

      for (const serviceType of requiredServices) {
        // Check if service already exists
        const existing = services.find(s =>
          s.buildingType === serviceType &&
          s.servesDemographics.includes(demo.id)
        );

        if (existing) {
          // Add this demographic to existing service
          existing.servesDemographics.push(demo.id);
          existing.capacity += demo.populationCount;
        } else {
          // Create new service
          services.push(this.createServiceCircle(serviceType, demo));
        }
      }
    }

    return services;
  }

  /**
   * LEVEL 4: Services → Demands (Quests)
   */
  spawnDemandsFromServices(
    services: ServiceCircle[]
  ): QuestDemandCircle[] {
    const demands: QuestDemandCircle[] = [];

    for (const service of services) {
      // Each service has resource needs
      for (const resource of service.requiresResources) {
        demands.push({
          id: generateId(),
          type: 'demand',
          demandType: 'resource',
          originService: service.id,
          resourceNeeded: resource,
          centerX: service.centerX,
          centerY: service.centerY,
          radius: 20,
          parent: service.id,
          children: [],
          urgency: this.calculateUrgency(service, resource),
          reward: this.calculateReward(service, resource),
          metadata: { buildingType: service.buildingType }
        });
      }

      // Labor demands if understaffed
      if (service.employeeCount < service.capacity * 0.1) {
        demands.push({
          id: generateId(),
          type: 'demand',
          demandType: 'labor',
          originService: service.id,
          centerX: service.centerX,
          centerY: service.centerY,
          radius: 20,
          parent: service.id,
          children: [],
          urgency: 'high',
          reward: service.metadata.averageWage || 10,
          metadata: { jobType: service.buildingType }
        });
      }
    }

    return demands;
  }

  // Helper methods
  private calculateDemographicWealth(
    type: string,
    wealth: WealthCircle
  ): number {
    const wealthMultipliers = {
      nobles: 2.5,
      merchants: 1.8,
      clergy: 1.2,
      craftsmen: 1.0,
      farmers: 0.8,
      miners: 0.7,
      laborers: 0.6
    };

    return wealth.averageWealth * (wealthMultipliers[type] || 1.0);
  }

  private calculateSkillLevel(type: string, techLevel: string): number {
    const baseSkill = {
      medieval: 40,
      renaissance: 60,
      industrial: 80
    }[techLevel] || 40;

    const skillModifiers = {
      craftsmen: 1.5,
      clergy: 1.3,
      nobles: 1.2,
      merchants: 1.1,
      miners: 0.9,
      farmers: 0.8,
      laborers: 0.7
    };

    return baseSkill * (skillModifiers[type] || 1.0);
  }

  private getCulturalTraits(type: string, industry: string): string[] {
    const traits = [];

    if (industry === 'mining') {
      traits.push('hardworking', 'resilient', 'isolated');
    } else if (industry === 'trade') {
      traits.push('cosmopolitan', 'ambitious', 'competitive');
    }

    if (type === 'clergy') {
      traits.push('pious', 'educated', 'traditional');
    } else if (type === 'nobles') {
      traits.push('proud', 'entitled', 'cultured');
    }

    return traits;
  }

  private getRequiredServices(demo: DemographicCircle): string[] {
    const services = ['church', 'market']; // Universal needs

    if (demo.demographicType === 'miners') {
      services.push('mine', 'tavern', 'smithy');
    } else if (demo.demographicType === 'craftsmen') {
      services.push('workshop', 'guild_hall');
    } else if (demo.demographicType === 'farmers') {
      services.push('granary', 'mill');
    } else if (demo.demographicType === 'nobles') {
      services.push('manor', 'estate');
    }

    return services;
  }

  private createServiceCircle(
    buildingType: string,
    demo: DemographicCircle
  ): ServiceCircle {
    const serviceData = {
      church: {
        type: 'essential' as const,
        resources: ['gold', 'candles'],
        capacity: 200
      },
      mine: {
        type: 'essential' as const,
        resources: ['tools', 'timber'],
        capacity: 100
      },
      smithy: {
        type: 'commerce' as const,
        resources: ['iron', 'coal'],
        capacity: 50
      },
      tavern: {
        type: 'commerce' as const,
        resources: ['food', 'ale'],
        capacity: 80
      }
    };

    const data = serviceData[buildingType] || {
      type: 'commerce' as const,
      resources: [],
      capacity: 50
    };

    return {
      id: generateId(),
      type: 'service',
      serviceType: data.type,
      buildingType,
      servesDemographics: [demo.id],
      requiresResources: data.resources,
      employeeCount: Math.ceil(demo.populationCount * 0.05),
      capacity: data.capacity,
      centerX: demo.centerX + (Math.random() - 0.5) * 50,
      centerY: demo.centerY + (Math.random() - 0.5) * 50,
      radius: 30,
      parent: demo.id,
      children: [],
      metadata: {
        averageWage: demo.averageWealth * 0.1
      }
    };
  }

  private calculateUrgency(
    service: ServiceCircle,
    resource: string
  ): 'low' | 'medium' | 'high' {
    if (service.serviceType === 'essential') {
      return resource === 'food' ? 'high' : 'medium';
    }
    return 'low';
  }

  private calculateReward(
    service: ServiceCircle,
    resource: string
  ): number {
    const baseReward = 10;
    const multiplier = service.serviceType === 'essential' ? 1.5 : 1.0;
    return baseReward * multiplier;
  }
}
```

---

## 🔗 Studio to Simulation Bridge

### Complete Bridge Implementation

```typescript
// /src/integrations/studio-to-simulation-bridge.ts

import { PrismaClient } from '@prisma/client';
import { CircleSpawningRules } from '../systems/procedural/circle-spawning-rules';

/**
 * Converts VibeMaster Studio JSON → Circle System → Prisma Database
 */
export class StudioToSimulationBridge {
  private prisma: PrismaClient;
  private spawner: CircleSpawningRules;

  constructor() {
    this.prisma = new PrismaClient();
    this.spawner = new CircleSpawningRules();
  }

  /**
   * STEP 1: Import from VibeMaster Studio JSON
   */
  async importFromStudio(jsonPath: string): Promise<string> {
    const studioData = await this.loadStudioJSON(jsonPath);

    // Studio gives us: roomName, objects[]
    // Expand into world context
    const worldData = await this.expandToWorldContext(studioData);

    // Generate circles
    const circles = await this.generateCircleHierarchy(worldData);

    // Populate database
    const worldId = await this.circlesToDatabase(circles, worldData);

    return worldId;
  }

  /**
   * STEP 2: Expand single scene into world context
   */
  private async expandToWorldContext(
    studioScene: any
  ): Promise<WorldContext> {
    // Use Claude to infer world properties from scene
    const prompt = `
      A game creator described this location:
      Name: "${studioScene.roomName}"
      Objects: ${studioScene.objects.map(o => o.name).join(', ')}

      Based on this, infer:
      1. What kind of settlement is this? (village/town/city)
      2. Approximate population
      3. Primary industry
      4. Wealth level (0-100)
      5. Tech level (medieval/renaissance/industrial)
      6. Cultural atmosphere

      Respond in JSON format.
    `;

    // Call Claude API (implementation depends on your setup)
    const response = await this.callClaude(prompt);

    return {
      settlementName: studioScene.roomName,
      settlementType: response.settlementType,
      population: response.population,
      primaryIndustry: response.industry,
      wealthLevel: response.wealthLevel,
      techLevel: response.techLevel,
      biome: response.biome || 'temperate',
      culture: response.culture
    };
  }

  /**
   * STEP 3: Generate complete circle hierarchy
   */
  private async generateCircleHierarchy(
    worldData: WorldContext
  ): Promise<CircleHierarchy> {
    // Create population circle
    const popCircle: PopulationCircle = {
      id: generateId(),
      type: 'population',
      totalPopulation: worldData.population,
      settlementType: worldData.settlementType,
      biome: worldData.biome,
      techLevel: worldData.techLevel,
      centerX: 0,
      centerY: 0,
      radius: Math.sqrt(worldData.population) * 2,
      parent: undefined,
      children: [],
      metadata: {
        primaryIndustry: worldData.primaryIndustry,
        culture: worldData.culture
      }
    };

    // Spawn wealth circle
    const wealthCircle = this.spawner.spawnWealthFromPopulation(popCircle);
    popCircle.children.push(wealthCircle.id);

    // Spawn demographics
    const demographics = this.spawner.spawnDemographicsFromWealth(
      popCircle,
      wealthCircle
    );
    wealthCircle.children = demographics.map(d => d.id);

    // Spawn services
    const services = this.spawner.spawnServicesFromDemographics(demographics);
    demographics.forEach(d => {
      d.children = services
        .filter(s => s.servesDemographics.includes(d.id))
        .map(s => s.id);
    });

    // Spawn demands (quests)
    const demands = this.spawner.spawnDemandsFromServices(services);
    services.forEach(s => {
      s.children = demands
        .filter(d => d.originService === s.id)
        .map(d => d.id);
    });

    return {
      population: popCircle,
      wealth: wealthCircle,
      demographics,
      services,
      demands
    };
  }

  /**
   * STEP 4: Convert circles to Prisma database entries
   */
  private async circlesToDatabase(
    circles: CircleHierarchy,
    worldData: WorldContext
  ): Promise<string> {
    // Create world
    const world = await this.prisma.world.create({
      data: {
        name: worldData.settlementName,
        currentDay: 0,
        currentHour: 8
      }
    });

    // Create locations from service circles
    const locationMap = new Map<string, string>();

    for (const service of circles.services) {
      const location = await this.prisma.location.create({
        data: {
          worldId: world.id,
          name: this.formatBuildingName(service.buildingType),
          type: 'building',
          hasFood: service.requiresResources.includes('food'),
          hasShelter: service.buildingType !== 'market',
          isPublic: service.serviceType !== 'luxury',
          occupancyLimit: service.capacity
        }
      });

      locationMap.set(service.id, location.id);
    }

    // Create NPCs from demographics
    for (const demo of circles.demographics) {
      await this.createNPCsFromDemographic(
        world.id,
        demo,
        locationMap,
        circles
      );
    }

    // Create factions from demographics
    for (const demo of circles.demographics) {
      await this.createFactionFromDemographic(world.id, demo);
    }

    // Create goals from demands
    for (const demand of circles.demands) {
      await this.createGoalsFromDemand(world.id, demand, circles);
    }

    return world.id;
  }

  /**
   * STEP 5: Create NPCs using existing personality system
   */
  private async createNPCsFromDemographic(
    worldId: string,
    demo: DemographicCircle,
    locationMap: Map<string, string>,
    circles: CircleHierarchy
  ): Promise<void> {
    // Find service this demographic works at
    const workService = circles.services.find(s =>
      s.servesDemographics.includes(demo.id)
    );

    const workLocationId = workService ? locationMap.get(workService.id) : undefined;

    // Create NPCs for this demographic
    for (let i = 0; i < demo.populationCount; i++) {
      // Generate personality based on demographic and culture
      const personality = this.generatePersonality(
        demo.demographicType,
        demo.culturalTraits
      );

      // Create NPC using existing Prisma schema
      await this.prisma.nPC.create({
        data: {
          worldId: worldId,
          name: this.generateName(demo.demographicType),
          age: this.randomAge(),
          occupation: demo.demographicType,

          // Your existing Big Five personality system
          openness: personality.openness,
          conscientiousness: personality.conscientiousness,
          extraversion: personality.extraversion,
          agreeableness: personality.agreeableness,
          neuroticism: personality.neuroticism,

          // Wealth from demographic
          wealth: demo.averageWealth + (Math.random() - 0.5) * 20,

          // Your existing needs system
          needFood: 60 + Math.random() * 20,
          needSafety: 70 + Math.random() * 20,
          needWealth: demo.averageWealth < 50 ? 60 : 40,
          needSocial: 50 + Math.random() * 30,
          needRest: 60 + Math.random() * 20,

          // Emotions
          currentEmotion: 'neutral',
          emotionIntensity: 50,

          // Location
          currentLocationId: workLocationId,
          homeLocationId: workLocationId
        }
      });
    }
  }

  /**
   * Create faction from demographic
   */
  private async createFactionFromDemographic(
    worldId: string,
    demo: DemographicCircle
  ): Promise<void> {
    await this.prisma.faction.create({
      data: {
        worldId: worldId,
        name: `${demo.demographicType} Guild`,
        type: 'guild',
        influence: Math.round(demo.averageWealth),
        members: demo.populationCount
      }
    });
  }

  /**
   * Create goals/quests from demands
   */
  private async createGoalsFromDemand(
    worldId: string,
    demand: QuestDemandCircle,
    circles: CircleHierarchy
  ): Promise<void> {
    // Find NPCs in the service that created this demand
    const service = circles.services.find(s => s.id === demand.originService);
    if (!service) return;

    const demographic = circles.demographics.find(d =>
      service.servesDemographics.includes(d.id)
    );
    if (!demographic) return;

    // Find an NPC from this demographic
    const npc = await this.prisma.nPC.findFirst({
      where: {
        worldId: worldId,
        occupation: demographic.demographicType
      }
    });

    if (!npc) return;

    // Create goal using your existing schema
    await this.prisma.goal.create({
      data: {
        npcId: npc.id,
        goalType: demand.demandType === 'resource' ? 'acquire_item' : 'work',
        description: this.formatDemandDescription(demand, service),
        priority: demand.urgency === 'high' ? 90 :
                 demand.urgency === 'medium' ? 60 : 30,
        needDrivers: JSON.stringify({
          wealth: demand.demandType === 'resource' ? 80 : 50
        }),
        status: 'active'
      }
    });
  }

  // Helper methods
  private generatePersonality(
    occupation: string,
    culturalTraits: string[]
  ): BigFivePersonality {
    // Base personality
    const base = {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50
    };

    // Occupation modifiers
    const occupationMods = {
      miners: { conscientiousness: +15, neuroticism: +10 },
      craftsmen: { conscientiousness: +20, openness: +10 },
      merchants: { extraversion: +20, agreeableness: -5 },
      nobles: { extraversion: +10, agreeableness: -10 },
      clergy: { conscientiousness: +15, agreeableness: +10 },
      farmers: { conscientiousness: +10, neuroticism: -5 }
    };

    const mods = occupationMods[occupation] || {};

    // Apply cultural trait modifiers
    if (culturalTraits.includes('hardworking')) {
      base.conscientiousness += 10;
    }
    if (culturalTraits.includes('isolated')) {
      base.extraversion -= 15;
    }

    // Apply occupation mods and clamp to 0-100
    Object.entries(mods).forEach(([trait, mod]) => {
      base[trait] = Math.max(0, Math.min(100, base[trait] + mod));
    });

    // Add randomness
    Object.keys(base).forEach(trait => {
      base[trait] += (Math.random() - 0.5) * 20;
      base[trait] = Math.max(0, Math.min(100, base[trait]));
    });

    return base;
  }

  private generateName(occupation: string): string {
    const firstNames = ['John', 'Mary', 'Thomas', 'Elizabeth', 'William', 'Sarah'];
    const lastNames = ['Smith', 'Miller', 'Cooper', 'Baker', 'Fletcher', 'Mason'];

    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`;
  }

  private randomAge(): number {
    return 18 + Math.floor(Math.random() * 50);
  }

  private formatBuildingName(type: string): string {
    const names = {
      church: 'Village Church',
      mine: 'Iron Mine',
      smithy: 'Blacksmith',
      tavern: 'The Rusty Pick Tavern',
      market: 'Market Square',
      workshop: 'Craftsman Workshop'
    };

    return names[type] || type;
  }

  private formatDemandDescription(
    demand: QuestDemandCircle,
    service: ServiceCircle
  ): string {
    if (demand.demandType === 'resource') {
      return `Obtain ${demand.resourceNeeded} for ${service.buildingType}`;
    } else if (demand.demandType === 'labor') {
      return `Work needed at ${service.buildingType}`;
    }
    return 'Help needed';
  }

  private async callClaude(prompt: string): Promise<any> {
    // Placeholder - implement your Claude API call
    // For now, return mock data
    return {
      settlementType: 'town',
      population: 500,
      industry: 'mining',
      wealthLevel: 40,
      techLevel: 'medieval',
      biome: 'mountain',
      culture: 'hardworking, isolated, resilient'
    };
  }

  private async loadStudioJSON(path: string): Promise<any> {
    // Implement JSON file loading
    const fs = require('fs').promises;
    return JSON.parse(await fs.readFile(path, 'utf-8'));
  }
}

// Type definitions
interface WorldContext {
  settlementName: string;
  settlementType: 'village' | 'town' | 'city';
  population: number;
  primaryIndustry: string;
  wealthLevel: number;
  techLevel: string;
  biome: string;
  culture: string;
}

interface CircleHierarchy {
  population: PopulationCircle;
  wealth: WealthCircle;
  demographics: DemographicCircle[];
  services: ServiceCircle[];
  demands: QuestDemandCircle[];
}

interface BigFivePersonality {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
```

---

## 🚀 Implementation Plan

### Phase 1: Core Circle Generator (Week 1)

**New files to create:**
```
/src/systems/procedural/
  ├── circle-types.ts              # Circle interfaces
  ├── circle-spawning-rules.ts     # Hierarchical spawning logic
  ├── circle-generator.ts          # Main generator class
  └── README.md                    # Documentation
```

**What to build:**
1. Circle type definitions
2. Spawning rules for each level
3. Test with console output (no database yet)

**Success criteria:**
- Can generate full circle hierarchy from parameters
- Console logs show correct demographics/services
- Numbers add up (population distributed correctly)

### Phase 2: Database Integration (Week 2)

**New files to create:**
```
/src/integrations/
  ├── studio-to-simulation-bridge.ts   # Main bridge class
  ├── circle-to-prisma.ts              # Circle → Database conversion
  └── README.md                        # Usage guide
```

**What to build:**
1. Bridge class that connects circles to Prisma
2. NPC generation from demographics
3. Location generation from services
4. Goal generation from demands

**Success criteria:**
- Can populate empty database from circles
- NPCs have correct occupations and personalities
- Locations exist and are linked to NPCs
- Simulation can run on generated data

### Phase 3: Studio Enhancement (Week 3)

**Enhanced Studio HTML:**
```html
<!-- Add to vibemaster-studio.html -->
<div class="mode-selector">
  <button id="single-scene-mode">Create Single Scene</button>
  <button id="full-world-mode">Create Entire World</button>
</div>

<div id="world-mode-ui" style="display:none;">
  <h3>Describe your world:</h3>
  <textarea id="world-description"></textarea>
  <button id="generate-world">Generate World</button>
  <div id="world-preview"></div>
</div>
```

**What to build:**
1. New mode in Studio for world creation
2. Text input for world description
3. Preview of generated circles
4. Export to Tauri app database

**Success criteria:**
- Can describe world in natural language
- See visual preview of circles before export
- Export creates playable simulation

### Phase 4: Visual Circle Editor (Week 4)

**New tool:**
```
/src/tools/circle-editor.html    # Visual editor for circles
```

**What to build:**
1. Drag-and-drop circle editor
2. Resize circles to adjust populations
3. Real-time preview of demographics/services
4. Export to database

**Success criteria:**
- Can visually adjust world parameters
- See impact on NPCs/services in real-time
- Export creates correct database entries

---

## 📊 Example: Complete Generation Flow

### Input: Voice Description

**User says:** "Create a medieval mining town of 500 people in the mountains"

### Step 1: Concept Extraction

```json
{
  "settlementType": "town",
  "population": 500,
  "primaryIndustry": "mining",
  "wealthLevel": 40,
  "techLevel": "medieval",
  "biome": "mountain",
  "culture": "hardworking, isolated, resilient"
}
```

### Step 2: Circle Generation

```
PopulationCircle
  ├─ totalPopulation: 500
  ├─ settlementType: town
  └─ biome: mountain

  spawns ↓

WealthCircle
  ├─ averageWealth: 40
  ├─ distribution: moderate
  └─ gini: 0.45

  spawns ↓

Demographics (5 circles)
  ├─ Miners (200 people, wealth: 28)
  ├─ Laborers (125 people, wealth: 24)
  ├─ Craftsmen (75 people, wealth: 40)
  ├─ Merchants (50 people, wealth: 72)
  └─ Clergy (25 people, wealth: 48)

  spawns ↓

Services (7 circles)
  ├─ Iron Mine (serves miners, needs tools/timber)
  ├─ Smithy (serves craftsmen, needs iron/coal)
  ├─ Tavern (serves laborers, needs food/ale)
  ├─ Church (serves clergy, needs gold/candles)
  ├─ Market (serves merchants, needs goods)
  ├─ Guild Hall (serves craftsmen)
  └─ Manor (serves merchants/clergy)

  spawns ↓

Demands (10 circles)
  ├─ Mine needs: tools (urgent), timber (medium)
  ├─ Smithy needs: iron (high), coal (medium)
  ├─ Tavern needs: food (high), ale (low)
  ├─ Church needs: gold (low), candles (low)
  ├─ Market needs: labor (medium)
  └─ ...
```

### Step 3: Database Population

**Created in Prisma:**
- 1 World ("Mountain Mining Town")
- 7 Locations (Mine, Smithy, Tavern, Church, Market, Guild Hall, Manor)
- 500 NPCs with correct:
  - Occupations (200 miners, 125 laborers, etc.)
  - Personalities (miners = high conscientiousness + neuroticism)
  - Wealth (miners poor, merchants rich)
  - Needs (all start with moderate needs)
- 5 Factions (Miners Guild, Laborers Guild, etc.)
- 10+ Goals (acquire tools for mine, obtain iron for smithy, etc.)

### Step 4: Simulation Runs

**Your existing systems take over:**
- Daily cycle starts (6:00 AM)
- NPCs go to work based on occupation
- Need-based behavior activates
- Resource production begins
- Relationships form
- Quests become available to player

---

## 🎮 Integration Benefits

### Before Circle System
- **Manual:** Create each NPC by hand
- **Inconsistent:** No guarantee of balanced demographics
- **Static:** Can't easily adjust world parameters
- **Disconnected:** Studio creates scenes, simulation needs separate setup

### After Circle System
- **Automated:** 10-second voice input → 500 NPCs
- **Balanced:** Demographics automatically match industry/wealth
- **Dynamic:** Adjust one circle, everything recalculates
- **Connected:** Studio → Circles → Database → Simulation (seamless)

---

## 📚 References

**Related Systems:**
- `LIVING_WORLD_POPULATION_AND_INFORMATION_SYSTEMS.md` - World structure
- `NEED_BASED_BEHAVIOR_SESSION.md` - NPC needs and behavior
- `NPC_OCCUPATIONS_REFERENCE.md` - Occupation definitions
- `VIBEMASTER_NARRATIVE_ARCHITECTURE.md` - Quest and narrative systems

**New Implementation Files:**
- `/src/systems/procedural/circle-types.ts` - Circle definitions
- `/src/systems/procedural/circle-spawning-rules.ts` - Spawning logic
- `/src/integrations/studio-to-simulation-bridge.ts` - Main bridge
- `/src/integrations/circle-to-prisma.ts` - Database conversion

**External Files:**
- `/visualizations/vibemaster-studio.html` - Voice input tool (existing)
- `/prisma/schema.prisma` - Database schema (existing)
- `/src/systems/npc/NPC.ts` - NPC behavior system (existing)

**Key Innovation:**
> The circle system is not a replacement - it's the missing integration layer that transforms VibeMaster from two disconnected tools into one unified world-creation system.
