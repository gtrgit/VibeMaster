// /home/claude/TRAVEL_SYSTEM.md

# ðŸ—ºï¸ VibeMaster Travel System - Emergent Journey Narratives

## The Concept

**One tile = One day of travel**

When player clicks distant tile:
1. Calculate distance (in days)
2. Check provisions
3. Calculate encounter chances
4. Generate AI narrative of entire journey
5. Apply consequences (provisions consumed, encounters resolved, time passed)

---

## ðŸŽ® Player Experience

### Example Journey

```
Player clicks on tile 5 tiles away (mountains)
  â†“
System calculates:
  - Distance: 5 days
  - Provisions needed: 10 food
  - Terrain: Plains â†’ Forest â†’ Mountains
  - Weather: Clear â†’ Rain â†’ Clear
  - Encounter chance: 60% (3 encounters likely)
  â†“
AI generates journey narrative:
  â†“
"Day 1: You set out across the plains at dawn. The weather 
is clear and you make good progress. By afternoon, you 
encounter a traveling merchant who warns of bandits ahead.

Day 2: Rain begins to fall as you enter the forest. The 
path becomes muddy and slow. You camp beneath a large oak.

Day 3: Still raining. You spot tracks - large, predatory. 
You decide to take a safer but longer route around.

Day 4: The rain clears as you reach the mountain foothills. 
The climb is steep but rewarding - spectacular views.

Day 5: You arrive at your destination, weary but intact. 
Your provisions are nearly depleted."
  â†“
Player arrives at destination with:
  - 5 days passed
  - 10 food consumed
  - 1 encounter (merchant) added to knowledge
  - New location unlocked
```

---

## ðŸ§® Travel Calculation System

### Core Logic

```typescript
// /home/claude/travel-calculator.ts

class TravelCalculator {
  
  calculateJourney(from: Tile, to: Tile, player: Player): JourneyPlan {
    
    // 1. Calculate distance (Manhattan or Euclidean)
    const distance = this.calculateDistance(from, to);
    
    // 2. Analyze terrain along route
    const route = this.findPath(from, to);
    const terrains = this.analyzeTerrainAlongRoute(route);
    
    // 3. Calculate provisions needed
    const provisionsNeeded = this.calculateProvisionsNeeded(
      distance, 
      terrains,
      player
    );
    
    // 4. Check if player has enough provisions
    const canTravel = player.provisions >= provisionsNeeded;
    
    // 5. Calculate encounter chances
    const encounterChances = this.calculateEncounterChances(
      terrains,
      distance,
      player
    );
    
    // 6. Determine weather along journey
    const weather = this.generateWeatherPattern(distance, terrains);
    
    return {
      distance,
      route,
      terrains,
      provisionsNeeded,
      canTravel,
      encounterChances,
      weather,
      estimatedTime: distance // days
    };
  }
  
  calculateDistance(from: Tile, to: Tile): number {
    // Manhattan distance (move along grid)
    // Each tile = 1 day of travel
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    
    return dx + dy; // Total days of travel
  }
  
  findPath(from: Tile, to: Tile): Tile[] {
    // Simple pathfinding - could use A* for obstacles
    const path: Tile[] = [];
    let current = { x: from.x, y: from.y };
    
    // Move horizontally first, then vertically
    while (current.x !== to.x) {
      current.x += Math.sign(to.x - current.x);
      path.push(this.getTile(current.x, current.y));
    }
    
    while (current.y !== to.y) {
      current.y += Math.sign(to.y - current.y);
      path.push(this.getTile(current.x, current.y));
    }
    
    return path;
  }
  
  analyzeTerrainAlongRoute(route: Tile[]): TerrainSegment[] {
    const segments: TerrainSegment[] = [];
    let currentTerrain = route[0].terrain;
    let segmentLength = 0;
    
    for (const tile of route) {
      if (tile.terrain === currentTerrain) {
        segmentLength++;
      } else {
        segments.push({
          terrain: currentTerrain,
          days: segmentLength,
          difficulty: this.getTerrainDifficulty(currentTerrain)
        });
        currentTerrain = tile.terrain;
        segmentLength = 1;
      }
    }
    
    // Add final segment
    segments.push({
      terrain: currentTerrain,
      days: segmentLength,
      difficulty: this.getTerrainDifficulty(currentTerrain)
    });
    
    return segments;
  }
  
  calculateProvisionsNeeded(
    distance: number, 
    terrains: TerrainSegment[],
    player: Player
  ): number {
    let baseFood = distance * 2; // 2 food per day
    
    // Terrain modifiers
    for (const segment of terrains) {
      if (segment.terrain === 'mountains') {
        baseFood += segment.days * 1; // Extra food in mountains
      }
      if (segment.terrain === 'desert') {
        baseFood += segment.days * 2; // Much more in desert
      }
    }
    
    // Player skill modifiers
    if (player.skills.survival > 60) {
      baseFood *= 0.8; // Can forage/hunt
    }
    
    return Math.ceil(baseFood);
  }
  
  calculateEncounterChances(
    terrains: TerrainSegment[],
    distance: number,
    player: Player
  ): EncounterChance[] {
    const encounters: EncounterChance[] = [];
    
    for (const segment of terrains) {
      let chancePerDay = 0.2; // Base 20% per day
      
      // Terrain modifiers
      switch (segment.terrain) {
        case 'plains':
          chancePerDay = 0.15; // Safer
          break;
        case 'forest':
          chancePerDay = 0.25; // More encounters
          break;
        case 'mountains':
          chancePerDay = 0.20;
          break;
        case 'dangerous_lands':
          chancePerDay = 0.60; // Very dangerous!
          break;
      }
      
      // Player stealth reduces chance
      if (player.skills.stealth > 50) {
        chancePerDay *= 0.7;
      }
      
      const expectedEncounters = segment.days * chancePerDay;
      
      encounters.push({
        terrain: segment.terrain,
        days: segment.days,
        chancePerDay: chancePerDay,
        expectedEncounters: expectedEncounters,
        types: this.getEncounterTypes(segment.terrain)
      });
    }
    
    return encounters;
  }
  
  getEncounterTypes(terrain: string): EncounterType[] {
    const types = {
      plains: ['travelers', 'merchants', 'bandits', 'wildlife'],
      forest: ['hunters', 'wildlife', 'bandits', 'hermits'],
      mountains: ['wildlife', 'hermits', 'treasure_hunters'],
      desert: ['nomads', 'bandits', 'dangerous_creatures'],
      dangerous_lands: ['monsters', 'bandits', 'cultists']
    };
    
    return types[terrain] || ['travelers'];
  }
  
  generateWeatherPattern(distance: number, terrains: TerrainSegment[]): Weather[] {
    const weather: Weather[] = [];
    
    for (let day = 0; day < distance; day++) {
      // Random weather with some continuity
      const prevWeather = weather[day - 1]?.type || 'clear';
      const continuityBonus = prevWeather === 'rain' ? 0.4 : 0;
      
      const roll = Math.random() + continuityBonus;
      
      let weatherType: WeatherType;
      if (roll < 0.6) weatherType = 'clear';
      else if (roll < 0.8) weatherType = 'cloudy';
      else if (roll < 0.95) weatherType = 'rain';
      else weatherType = 'storm';
      
      weather.push({
        day: day + 1,
        type: weatherType,
        impact: this.getWeatherImpact(weatherType)
      });
    }
    
    return weather;
  }
  
  getTerrainDifficulty(terrain: string): number {
    const difficulties = {
      plains: 1.0,
      forest: 1.2,
      mountains: 1.5,
      desert: 1.8,
      dangerous_lands: 2.0
    };
    
    return difficulties[terrain] || 1.0;
  }
  
  getWeatherImpact(weather: WeatherType): string {
    const impacts = {
      clear: 'Good traveling conditions',
      cloudy: 'Slightly slower progress',
      rain: 'Muddy paths, reduced visibility',
      storm: 'Dangerous conditions, seek shelter'
    };
    
    return impacts[weather];
  }
}
```

---

## ðŸ¤– AI Journey Generation

### Prompt Construction

```typescript
// /home/claude/journey-narrator.ts

class JourneyNarrator {
  
  async generateJourneyNarrative(
    journey: JourneyPlan,
    player: Player,
    worldState: WorldState
  ): Promise<JourneyNarrative> {
    
    // Roll for actual encounters
    const actualEncounters = this.rollEncounters(journey.encounterChances);
    
    // Build comprehensive prompt for Claude
    const prompt = this.buildJourneyPrompt(
      journey,
      actualEncounters,
      player,
      worldState
    );
    
    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      messages: [{
        role: 'user',
        content: prompt
      }],
      max_tokens: 2000
    });
    
    const narrative = response.content[0].text;
    
    // Parse out structured data if needed
    const structured = this.parseJourneyResults(narrative, actualEncounters);
    
    return {
      narrative: narrative,
      encounters: structured.encounters,
      discoveries: structured.discoveries,
      itemsGained: structured.itemsGained,
      itemsLost: structured.itemsLost,
      injuriesReceived: structured.injuries,
      relationshipsFormed: structured.relationships
    };
  }
  
  buildJourneyPrompt(
    journey: JourneyPlan,
    encounters: RolledEncounter[],
    player: Player,
    worldState: WorldState
  ): string {
    
    return `
You are narrating a ${journey.distance}-day journey in a fantasy world.

PLAYER CHARACTER:
- Name: ${player.name}
- Skills: Combat ${player.skills.combat}, Stealth ${player.skills.stealth}, Survival ${player.skills.survival}
- Current state: ${player.health}HP, ${player.provisions} provisions
- Personality: ${player.personality}

JOURNEY DETAILS:
Distance: ${journey.distance} days
Route: ${this.describeRoute(journey)}

Terrain breakdown:
${journey.terrains.map(t => `- ${t.days} days through ${t.terrain} (difficulty ${t.difficulty})`).join('\n')}

Weather:
${journey.weather.map(w => `Day ${w.day}: ${w.type} - ${w.impact}`).join('\n')}

Provisions: Starting with ${player.provisions}, need ${journey.provisionsNeeded}

ENCOUNTERS THAT OCCUR:
${encounters.map((e, i) => `
Day ${e.day}: ${e.type} encounter in ${e.terrain}
- Hostility: ${e.hostility}
- Player's response options: ${e.options.join(', ')}
- Recommended based on player skills: ${this.recommendAction(e, player)}
`).join('\n')}

WORLD CONTEXT:
- Current events: ${worldState.activeClocks.map(c => c.description).join(', ')}
- Known threats: ${worldState.knownThreats.join(', ')}
- Time of year: ${worldState.season}

INSTRUCTIONS:
Write a day-by-day narrative of this journey. Include:

1. **Daily Progress**: Describe terrain, weather, challenges each day
2. **Encounters**: For each encounter listed above:
   - Describe what player encounters
   - How player's skills/personality influence response
   - Outcome (success/failure/mixed)
   - Any items, injuries, or information gained
3. **Atmosphere**: Make it feel like a real journey with:
   - Changing conditions
   - Player's internal experience
   - Realistic travel challenges
4. **Consequences**: 
   - Show provisions depleting
   - Physical toll of terrain
   - Weather impact on morale
5. **Character moments**: 
   - Player's thoughts/feelings
   - Small details that make it personal

Format as cohesive narrative, broken into days.
Keep it engaging but realistic - not every day is dramatic.

If encounters result in:
- Combat: Describe outcome based on player combat skill
- Social: Use player's social skills and personality
- Stealth: Player's stealth skill determines detection

End with arrival at destination and final status.

TONE: ${worldState.narrativeTone} (adventurous, gritty, whimsical, dark, etc.)
`;
  }
  
  rollEncounters(chances: EncounterChance[]): RolledEncounter[] {
    const rolled: RolledEncounter[] = [];
    let day = 1;
    
    for (const segment of chances) {
      for (let i = 0; i < segment.days; i++) {
        const roll = Math.random();
        
        if (roll < segment.chancePerDay) {
          // Encounter occurs!
          const encounterType = this.selectEncounterType(segment.types);
          const encounter = this.generateEncounter(
            day,
            segment.terrain,
            encounterType
          );
          
          rolled.push(encounter);
        }
        
        day++;
      }
    }
    
    return rolled;
  }
  
  selectEncounterType(types: EncounterType[]): EncounterType {
    // Weighted random selection
    return types[Math.floor(Math.random() * types.length)];
  }
  
  generateEncounter(
    day: number,
    terrain: string,
    type: EncounterType
  ): RolledEncounter {
    
    const templates = {
      merchants: {
        hostility: 'friendly',
        options: ['trade', 'talk', 'ignore'],
        potential: ['buy items', 'sell items', 'gain information', 'get quest']
      },
      bandits: {
        hostility: 'hostile',
        options: ['fight', 'flee', 'negotiate', 'stealth'],
        potential: ['lose items', 'lose health', 'gain items if win', 'gain reputation']
      },
      wildlife: {
        hostility: 'neutral',
        options: ['avoid', 'hunt', 'observe'],
        potential: ['gain food', 'lose health', 'gain survival knowledge']
      },
      travelers: {
        hostility: 'friendly',
        options: ['talk', 'trade', 'join temporarily', 'pass by'],
        potential: ['gain information', 'make friend', 'get warning']
      },
      hermits: {
        hostility: 'wary',
        options: ['approach', 'observe', 'leave'],
        potential: ['gain knowledge', 'get side quest', 'learn secret']
      }
    };
    
    const template = templates[type] || templates.travelers;
    
    return {
      day,
      terrain,
      type,
      hostility: template.hostility,
      options: template.options,
      potentialOutcomes: template.potential
    };
  }
  
  recommendAction(encounter: RolledEncounter, player: Player): string {
    // Based on player skills, recommend action
    
    if (encounter.hostility === 'hostile') {
      if (player.skills.combat > 70) {
        return 'fight (high combat skill)';
      } else if (player.skills.stealth > 60) {
        return 'stealth (good stealth skill)';
      } else {
        return 'flee (avoid danger)';
      }
    }
    
    if (encounter.hostility === 'friendly') {
      if (player.skills.social > 60) {
        return 'talk (good social skills)';
      } else {
        return 'trade (safe interaction)';
      }
    }
    
    return 'observe (cautious approach)';
  }
  
  describeRoute(journey: JourneyPlan): string {
    const segments = journey.terrains.map(t => 
      `${t.days} day${t.days > 1 ? 's' : ''} through ${t.terrain}`
    );
    return segments.join(', then ');
  }
  
  parseJourneyResults(
    narrative: string,
    encounters: RolledEncounter[]
  ): StructuredResults {
    // Could use Claude again to extract structured data
    // Or use regex/parsing if narrative follows format
    
    return {
      encounters: encounters.map(e => ({
        type: e.type,
        outcome: 'success', // Would parse from narrative
        details: ''
      })),
      discoveries: [],
      itemsGained: [],
      itemsLost: [],
      injuries: [],
      relationships: []
    };
  }
}
```

---

## ðŸŽ® UI Implementation

### Click Handling

```typescript
// In Phaser map scene

class TravelMapScene extends Phaser.Scene {
  
  create() {
    // ... map setup ...
    
    // Click handler for tiles
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const worldX = pointer.worldX;
      const worldY = pointer.worldY;
      
      const clickedTile = this.getTileAt(worldX, worldY);
      
      if (clickedTile) {
        this.handleTileClick(clickedTile);
      }
    });
  }
  
  async handleTileClick(tile: Tile) {
    const playerTile = this.getPlayerTile();
    
    // Calculate journey
    const calculator = new TravelCalculator();
    const journey = calculator.calculateJourney(
      playerTile,
      tile,
      this.player
    );
    
    // Same tile or adjacent? Just move
    if (journey.distance === 0) {
      this.movePlayerToTile(tile);
      return;
    }
    
    if (journey.distance === 1) {
      // Adjacent tile - immediate movement
      this.movePlayerToTile(tile);
      this.consumeProvisions(1);
      return;
    }
    
    // Multi-day journey - show dialog
    this.showJourneyConfirmation(tile, journey);
  }
  
  showJourneyConfirmation(destination: Tile, journey: JourneyPlan) {
    const dialog = this.add.container(400, 300);
    
    // Background
    const bg = this.add.rectangle(0, 0, 600, 400, 0x000000, 0.9);
    dialog.add(bg);
    
    // Title
    const title = this.add.text(0, -150, 'Plan Journey', {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
    dialog.add(title);
    
    // Journey details
    const details = this.add.text(0, -80, `
Distance: ${journey.distance} days
Route: ${this.describeRoute(journey)}

Provisions needed: ${journey.provisionsNeeded}
You have: ${this.player.provisions}

Encounter risk: ${this.calculateRisk(journey)}%
    `.trim(), {
      fontSize: '16px',
      color: '#cccccc',
      align: 'center'
    }).setOrigin(0.5);
    dialog.add(details);
    
    // Warnings
    if (!journey.canTravel) {
      const warning = this.add.text(0, 50, 
        'âš ï¸ Not enough provisions!',
        { fontSize: '18px', color: '#ff0000' }
      ).setOrigin(0.5);
      dialog.add(warning);
    }
    
    // Buttons
    const beginBtn = this.add.text(0, 120, 'Begin Journey', {
      fontSize: '18px',
      color: '#00ff00',
      backgroundColor: '#003300',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      if (journey.canTravel) {
        this.beginJourney(destination, journey);
        dialog.destroy();
      }
    });
    dialog.add(beginBtn);
    
    const cancelBtn = this.add.text(0, 170, 'Cancel', {
      fontSize: '18px',
      color: '#ff0000',
      backgroundColor: '#330000',
      padding: { x: 20, y: 10 }
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      dialog.destroy();
    });
    dialog.add(cancelBtn);
  }
  
  async beginJourney(destination: Tile, journey: JourneyPlan) {
    // Show loading
    this.showLoadingScreen('Embarking on journey...');
    
    // Generate narrative with AI
    const narrator = new JourneyNarrator();
    const narrative = await narrator.generateJourneyNarrative(
      journey,
      this.player,
      this.worldState
    );
    
    // Hide loading, show narrative
    this.hideLoadingScreen();
    this.showJourneyNarrative(narrative);
    
    // Apply consequences
    this.applyJourneyConsequences(journey, narrative);
    
    // Move player to destination
    this.movePlayerToTile(destination);
    
    // Advance time
    this.advanceTime(journey.distance);
  }
  
  showJourneyNarrative(narrative: JourneyNarrative) {
    // Create scrollable text display
    const narrativePanel = this.add.container(400, 300);
    
    const bg = this.add.rectangle(0, 0, 700, 500, 0x1a1a1a, 0.95);
    narrativePanel.add(bg);
    
    const title = this.add.text(0, -220, 'Your Journey', {
      fontSize: '24px',
      color: '#ffa500'
    }).setOrigin(0.5);
    narrativePanel.add(title);
    
    // Narrative text (scrollable)
    const text = this.add.text(0, -150, narrative.narrative, {
      fontSize: '14px',
      color: '#e0e0e0',
      wordWrap: { width: 650 },
      lineSpacing: 8
    }).setOrigin(0.5, 0);
    narrativePanel.add(text);
    
    // Play audio if available
    if (narrative.audio) {
      this.playAudio(narrative.audio);
    }
    
    // Continue button
    const continueBtn = this.add.text(0, 220, 'Continue', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#4a90e2',
      padding: { x: 30, y: 12 }
    })
    .setOrigin(0.5)
    .setInteractive()
    .on('pointerdown', () => {
      narrativePanel.destroy();
    });
    narrativePanel.add(continueBtn);
  }
  
  applyJourneyConsequences(
    journey: JourneyPlan,
    narrative: JourneyNarrative
  ) {
    // Consume provisions
    this.player.provisions -= journey.provisionsNeeded;
    
    // Apply injuries
    for (const injury of narrative.injuriesReceived) {
      this.player.health -= injury.damage;
    }
    
    // Add items found
    for (const item of narrative.itemsGained) {
      this.player.inventory.push(item);
    }
    
    // Remove lost items
    for (const item of narrative.itemsLost) {
      const index = this.player.inventory.indexOf(item);
      if (index > -1) {
        this.player.inventory.splice(index, 1);
      }
    }
    
    // Add discovered information to knowledge
    for (const discovery of narrative.discoveries) {
      this.player.knownInformation.push(discovery);
    }
    
    // Update NPC relationships
    for (const rel of narrative.relationshipsFormed) {
      this.worldState.relationships[rel.npcId] = 
        (this.worldState.relationships[rel.npcId] || 0) + rel.change;
    }
  }
  
  calculateRisk(journey: JourneyPlan): number {
    // Calculate overall risk percentage
    let totalRisk = 0;
    
    for (const chance of journey.encounterChances) {
      totalRisk += chance.expectedEncounters * 20; // Each encounter = 20% risk
    }
    
    return Math.min(100, Math.round(totalRisk));
  }
  
  describeRoute(journey: JourneyPlan): string {
    return journey.terrains.map(t => 
      `${t.days}d ${t.terrain}`
    ).join(' â†’ ');
  }
}
```

---

## ðŸ“Š Example Generated Narrative

### Input:
```
Distance: 5 days
Route: 2 days plains, 2 days forest, 1 day mountains
Encounters: Day 2 (merchant), Day 4 (wildlife)
Weather: Clear, Clear, Rain, Rain, Clear
Provisions: 10 â†’ 0
```

### Output from Claude:
```
Day 1 - The Plains

You set out at first light, the morning air crisp and clear. 
The plains stretch endlessly before you, golden grass swaying 
in the breeze. Your boots find easy purchase on the well-worn 
trail. By midday, you've made excellent progress.

You consume 2 provisions. (8 remaining)

Day 2 - Merchant Encounter

Late morning, you spot dust on the horizon - a merchant's 
wagon approaches. The merchant, a jovial man named Cedric, 
is heading to the capital with spices and fabrics.

"Bandits been troubling these roads," he warns. "Stay alert 
in the forest ahead."

You trade a silver coin for dried meat and fresh water. 
Cedric marks your map with a safer path through the woods.

You consume 2 provisions. (6 remaining)
Gained: Dried meat x2, Map update

Day 3 - Into the Forest

Rain begins as you enter the dense forest. The canopy provides 
some shelter, but the path becomes muddy and treacherous. Your 
survival skills help you find edible mushrooms and a clean 
spring for water.

Progress is slow. You make camp beneath an ancient oak, its 
branches keeping the worst of the rain off.

You consume 2 provisions. (4 remaining)

Day 4 - Predator

Still raining. Through the downpour, you spot fresh tracks - 
large paw prints, definitely predatory. Your stealth training 
kicks in. Moving quietly, you spot a wolf pack ahead, bedded 
down in the rain.

You take Cedric's alternate route, adding an hour but avoiding 
confrontation entirely. Smart.

By evening, you emerge from the forest at the mountain's base.

You consume 2 provisions. (2 remaining)

Day 5 - The Summit

The rain clears for your final day. The mountain path is steep 
but your athletic build serves you well. The air grows thin as 
you climb.

By afternoon, you reach your destination - a monastery perched 
on the mountainside. The monks welcome weary travelers.

You arrive exhausted but uninjured. Your provisions are nearly 
depleted, but you made it safely.

You consume 2 provisions. (0 remaining)

Journey Complete:
- Days traveled: 5
- Encounters survived: 2
- Items gained: Dried meat x2, Map knowledge
- Health: 95/100 (minor fatigue)
- Relationships: +10 with Cedric (merchant)
```

---

## ðŸŽ¯ Integration with World Systems

### Time Advancement

```typescript
function advanceTime(days: number) {
  for (let i = 0; i < days; i++) {
    // Advance hour by 24 (full day)
    worldState.currentHour += 24;
    
    // Run daily cycle for each day
    cycleSystem.onDayChange(worldState.currentDay + i);
    
    // NPCs act during this time
    for (const npc of worldState.npcs) {
      npcBehaviorSystem.simulateDay(npc);
    }
    
    // Advance all active clocks
    for (const clock of worldState.activeClocks) {
      if (!clock.paused) {
        clock.current += 1; // Each day
        
        if (clock.current >= clock.max) {
          triggerClockEvent(clock);
        }
      }
    }
  }
  
  worldState.currentDay += days;
}
```

### Provision System

```typescript
interface Provisions {
  food: number;
  water: number;
  medicine: number;
}

function consumeProvisions(days: number, terrain: string[]) {
  const foodPerDay = 2;
  let totalFood = days * foodPerDay;
  
  // Terrain modifiers
  if (terrain.includes('mountains')) totalFood += days;
  if (terrain.includes('desert')) totalFood += days * 2;
  
  player.provisions.food -= totalFood;
  
  // Consequences of running out
  if (player.provisions.food < 0) {
    player.health -= Math.abs(player.provisions.food) * 5;
    return {
      warning: "You ran out of food during the journey. You arrived weak and hungry.",
      healthLost: Math.abs(player.provisions.food) * 5
    };
  }
}
```

---

## ðŸ’¡ Advanced Features

### Dynamic Difficulty

```typescript
function adjustEncounterDifficulty(player: Player, terrain: string): number {
  let baseDifficulty = getTerrainBaseDifficulty(terrain);
  
  // Scale to player level
  const playerPower = (
    player.skills.combat + 
    player.skills.stealth + 
    player.skills.survival
  ) / 3;
  
  // Keep it challenging but fair
  const scaledDifficulty = baseDifficulty * (playerPower / 50);
  
  return Math.max(20, Math.min(90, scaledDifficulty));
}
```

### Companion Travel

```typescript
function calculateWithCompanions(
  journey: JourneyPlan,
  companions: NPC[]
): JourneyPlan {
  
  // More people = more provisions needed
  journey.provisionsNeeded *= (1 + companions.length);
  
  // But better encounter outcomes
  for (const encounter of journey.encounterChances) {
    encounter.chancePerDay *= 0.8; // Safer in numbers
  }
  
  // Companions contribute skills
  const groupSkills = {
    combat: player.skills.combat,
    stealth: player.skills.stealth,
    survival: player.skills.survival
  };
  
  for (const companion of companions) {
    groupSkills.combat = Math.max(groupSkills.combat, companion.skills.combat);
    groupSkills.stealth = Math.min(groupSkills.stealth, companion.skills.stealth); // Slowest
    groupSkills.survival = Math.max(groupSkills.survival, companion.skills.survival);
  }
  
  return journey;
}
```

---

## ðŸŽ¯ Summary

**One Click on Distant Tile:**
1. âœ… Calculate distance in days
2. âœ… Check provisions
3. âœ… Determine encounters
4. âœ… Generate weather
5. âœ… AI writes full journey narrative
6. âœ… Apply all consequences
7. âœ… Player arrives at destination
8. âœ… World time advanced
9. âœ… NPCs acted during absence

**Result: Emergent storytelling from simple map click!** ðŸ—ºï¸âœ¨
