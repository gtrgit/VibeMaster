Great! I can see you already have solid foundations for prompt management with:

1. **Claude Narrative Engine** - structures AI prompts based on game state
2. **StyleTemplate system** - manages art generation parameters
3. **Interactive Tile Creator** - voice-driven tile generation

Let me ideate on an **enhanced prompt management system for tile visual generation** that mirrors your game-state-driven approach:

## 🎨 **Contextual Tile Prompt Management System**

### **Core Concept**
Just like NPCs get contextual dialogue based on game state, **tiles get contextual visuals** based on:
- Neighboring tiles
- Environmental conditions
- Time of day / weather
- Game events
- Player progression

---

## 🧠 **System Architecture**

```typescript
// /mnt/project/TilePromptManager.ts

interface TileContext {
  // Spatial context
  position: { x: number; y: number };
  neighbors: {
    north?: TileData;
    south?: TileData;
    east?: TileData;
    west?: TileData;
    northEast?: TileData;
    northWest?: TileData;
    southEast?: TileData;
    southWest?: TileData;
  };
  
  // Environmental context
  biome: string;              // "forest", "desert", "urban"
  season: string;             // "spring", "summer", "fall", "winter"
  timeOfDay: string;          // "dawn", "day", "dusk", "night"
  weather: string;            // "clear", "rain", "snow", "fog"
  
  // Game state context
  visited: boolean;           // Has player been here?
  eventState: string;         // "peaceful", "battle", "aftermath"
  prosperity: number;         // 0-100 (affects detail/quality)
  corruption: number;         // 0-100 (affects visual degradation)
  
  // Style consistency
  regionStyle: string;        // "medieval", "cyberpunk", "fantasy"
  tilesetTheme: string;       // "cozy", "grim", "whimsical"
}

interface TilePromptTemplate {
  id: string;
  name: string;
  baseType: string;           // "grass", "water", "stone", etc.
  
  // Core prompt parts
  baseDescription: string;
  
  // Contextual modifiers
  biomeModifiers: Map<string, string>;
  seasonModifiers: Map<string, string>;
  weatherModifiers: Map<string, string>;
  timeModifiers: Map<string, string>;
  
  // Neighbor-aware transitions
  transitionRules: TransitionRule[];
  
  // Style parameters
  artStyle: string;
  perspective: string;
  colorPalette?: string[];
}

interface TransitionRule {
  neighborType: string;       // What type of tile is next to this one?
  direction: string;          // "north", "east", etc.
  transitionEffect: string;   // How to blend/transition
}
```

---

## 🎯 **Key Features**

### **1. Neighbor-Aware Transitions**

```typescript
// When generating a tile, consider what's next to it
class TilePromptManager {
  
  buildContextualPrompt(
    tileType: string,
    context: TileContext,
    template: TilePromptTemplate
  ): string {
    
    const parts: string[] = [];
    
    // Base description
    parts.push(template.baseDescription);
    
    // Neighbor transitions
    if (context.neighbors.north) {
      const transition = this.getTransition(
        tileType, 
        context.neighbors.north.type, 
        'north'
      );
      if (transition) {
        parts.push(transition);
      }
    }
    
    // Apply environmental modifiers
    if (context.weather === 'rain') {
      parts.push(template.weatherModifiers.get('rain') || 
        'wet surface, puddles, darker tones');
    }
    
    if (context.timeOfDay === 'night') {
      parts.push(template.timeModifiers.get('night') || 
        'moonlit, cool blue tones, deep shadows');
    }
    
    // Game state modifiers
    if (context.corruption > 50) {
      parts.push('decayed, twisted, corrupted appearance');
    }
    
    if (!context.visited) {
      parts.push('mysterious, unexplored feel, fog of war edges');
    }
    
    // Style consistency
    parts.push(`${template.artStyle} style`);
    parts.push(`${template.perspective} perspective`);
    parts.push(`theme: ${context.regionStyle}`);
    
    return parts.join(', ');
  }
  
  getTransition(
    currentType: string, 
    neighborType: string, 
    direction: string
  ): string | null {
    
    // Example: grass meeting water
    if (currentType === 'grass' && neighborType === 'water') {
      if (direction === 'north') {
        return 'shoreline at top edge, grass fading into sandy bank';
      }
      if (direction === 'south') {
        return 'shoreline at bottom edge, reeds and marsh grass';
      }
    }
    
    // Stone meeting grass
    if (currentType === 'stone' && neighborType === 'grass') {
      return `grass growing between cracks on ${direction} side`;
    }
    
    return null;
  }
}
```

---

### **2. Dynamic Variant Generation**

```typescript
// Generate multiple variants of same tile for different contexts
interface TileVariant {
  baseType: string;
  variantId: string;
  context: Partial<TileContext>;
  prompt: string;
  imageUrl?: string;
}

class TileVariantManager {
  
  async generateVariants(
    baseType: string,
    contexts: TileContext[]
  ): Promise<TileVariant[]> {
    
    const variants: TileVariant[] = [];
    
    for (const context of contexts) {
      const prompt = this.promptManager.buildContextualPrompt(
        baseType,
        context,
        this.getTemplate(baseType)
      );
      
      variants.push({
        baseType,
        variantId: `${baseType}_${this.hashContext(context)}`,
        context,
        prompt,
      });
    }
    
    return variants;
  }
  
  // Example: Generate grass variants for different conditions
  async generateGrassVariants(): Promise<TileVariant[]> {
    
    const baseContexts: TileContext[] = [
      {
        position: {x: 0, y: 0},
        neighbors: {},
        biome: 'temperate',
        season: 'spring',
        timeOfDay: 'day',
        weather: 'clear',
        visited: true,
        eventState: 'peaceful',
        prosperity: 80,
        corruption: 0,
        regionStyle: 'medieval',
        tilesetTheme: 'cozy'
      },
      // Summer variant
      { ...baseContexts[0], season: 'summer' },
      // Rainy variant
      { ...baseContexts[0], weather: 'rain' },
      // Night variant
      { ...baseContexts[0], timeOfDay: 'night' },
      // Corrupted variant
      { ...baseContexts[0], corruption: 80 }
    ];
    
    return this.generateVariants('grass', baseContexts);
  }
}
```

---

### **3. Template Library System**

```typescript
// /mnt/project/TilePromptTemplates.ts

class TileTemplateLibrary {
  
  templates = new Map<string, TilePromptTemplate>();
  
  constructor() {
    this.loadDefaultTemplates();
  }
  
  loadDefaultTemplates() {
    
    // Grass template
    this.templates.set('grass', {
      id: 'grass',
      name: 'Grass Tile',
      baseType: 'grass',
      baseDescription: 'lush green grass with small wildflowers',
      
      biomeModifiers: new Map([
        ['forest', 'moss-covered, forest floor vegetation'],
        ['desert', 'dry patches, sparse grass, sandy areas'],
        ['tundra', 'thin grass, hardy vegetation, rocky soil']
      ]),
      
      seasonModifiers: new Map([
        ['spring', 'bright green, fresh growth, flower buds'],
        ['summer', 'deep green, full blooms, vibrant'],
        ['fall', 'yellowing grass, fallen leaves scattered'],
        ['winter', 'dormant grass, frost-covered, snow patches']
      ]),
      
      weatherModifiers: new Map([
        ['rain', 'wet grass, puddles forming, darker green'],
        ['snow', 'snow-covered, grass blades poking through'],
        ['fog', 'misty atmosphere, dewdrops on grass']
      ]),
      
      timeModifiers: new Map([
        ['dawn', 'morning dew, soft golden light, long shadows'],
        ['day', 'bright daylight, vivid colors'],
        ['dusk', 'warm orange tones, lengthening shadows'],
        ['night', 'moonlit, silvery highlights, deep shadows']
      ]),
      
      transitionRules: [],
      
      artStyle: 'pixel art',
      perspective: 'top-down',
      colorPalette: ['#4a7c59', '#5c8a6b', '#3d6647']
    });
    
    // Water template
    this.templates.set('water', {
      id: 'water',
      name: 'Water Tile',
      baseType: 'water',
      baseDescription: 'clear blue water with gentle ripples',
      
      biomeModifiers: new Map([
        ['ocean', 'deep blue, larger waves, foam'],
        ['swamp', 'murky green water, algae, lily pads'],
        ['arctic', 'icy blue, ice chunks floating']
      ]),
      
      seasonModifiers: new Map([
        ['spring', 'clear water, fresh, slightly turbulent'],
        ['summer', 'warm colors, reflective surface'],
        ['fall', 'cooler tones, fallen leaves floating'],
        ['winter', 'partially frozen, ice formations at edges']
      ]),
      
      weatherModifiers: new Map([
        ['rain', 'ripples from raindrops, disturbed surface'],
        ['storm', 'choppy waves, whitecaps, dark water']
      ]),
      
      timeModifiers: new Map([
        ['dawn', 'reflecting sunrise, pink and orange tones'],
        ['day', 'bright blue, sparkling highlights'],
        ['dusk', 'reflecting sunset, warm colors'],
        ['night', 'dark blue, moonlight reflection, mysterious']
      ]),
      
      transitionRules: [],
      
      artStyle: 'pixel art',
      perspective: 'top-down',
      colorPalette: ['#3a7ca5', '#5899c2', '#2e628c']
    });
    
    // Add more templates...
  }
  
  getTemplate(tileType: string): TilePromptTemplate | undefined {
    return this.templates.get(tileType);
  }
  
  // Load custom templates from JSON
  async loadCustomTemplates(jsonPath: string) {
    const data = await fetch(jsonPath).then(r => r.json());
    data.forEach((template: TilePromptTemplate) => {
      this.templates.set(template.id, template);
    });
  }
}
```

---

### **4. Batch Generation with Context**

```typescript
// Generate an entire region with contextual awareness
class RegionTileGenerator {
  
  async generateRegion(
    width: number,
    height: number,
    regionConfig: RegionConfig
  ): Promise<TileVariant[][]> {
    
    const tiles: TileVariant[][] = [];
    
    // First pass: Determine tile types (e.g., from noise map)
    const typeMap = this.generateTypeMap(width, height, regionConfig);
    
    // Second pass: Generate prompts with neighbor awareness
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      
      for (let x = 0; x < width; x++) {
        const tileType = typeMap[y][x];
        
        const context: TileContext = {
          position: { x, y },
          neighbors: this.getNeighbors(typeMap, x, y),
          biome: regionConfig.biome,
          season: regionConfig.season,
          timeOfDay: regionConfig.timeOfDay,
          weather: regionConfig.weather,
          visited: false,
          eventState: 'peaceful',
          prosperity: regionConfig.prosperity,
          corruption: regionConfig.corruption,
          regionStyle: regionConfig.style,
          tilesetTheme: regionConfig.theme
        };
        
        const template = this.templateLibrary.getTemplate(tileType);
        if (!template) continue;
        
        const prompt = this.promptManager.buildContextualPrompt(
          tileType,
          context,
          template
        );
        
        tiles[y][x] = {
          baseType: tileType,
          variantId: `${tileType}_${x}_${y}`,
          context,
          prompt
        };
      }
    }
    
    // Third pass: Batch generate images via OpenArt
    await this.batchGenerate(tiles.flat());
    
    return tiles;
  }
  
  getNeighbors(
    typeMap: string[][], 
    x: number, 
    y: number
  ): TileContext['neighbors'] {
    
    const get = (dx: number, dy: number) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || ny >= typeMap.length || nx >= typeMap[0].length) {
        return undefined;
      }
      return { type: typeMap[ny][nx] };
    };
    
    return {
      north: get(0, -1),
      south: get(0, 1),
      east: get(1, 0),
      west: get(-1, 0),
      northEast: get(1, -1),
      northWest: get(-1, -1),
      southEast: get(1, 1),
      southWest: get(-1, 1)
    };
  }
}
```

---

## 🎮 **Integration with Game State**

```typescript
// /mnt/project/GameStateTileSync.ts

// Tiles react to game events in real-time
class GameStateTileSync {
  
  // When a major event happens, update affected tiles
  async onGameEvent(event: GameEvent) {
    
    switch (event.type) {
      case 'battle_started':
        await this.applyBattleVisuals(event.location);
        break;
        
      case 'building_constructed':
        await this.updateAreaProsperity(event.location, +20);
        break;
        
      case 'corruption_spread':
        await this.applyCorruptionVisuals(event.location);
        break;
        
      case 'season_changed':
        await this.regenerateAllVisuals({ season: event.newSeason });
        break;
    }
  }
  
  async applyBattleVisuals(location: Vector2) {
    const affectedTiles = this.getRadiusTiles(location, 5);
    
    for (const tile of affectedTiles) {
      // Update context
      tile.context.eventState = 'battle';
      
      // Regenerate with battle effects
      const newPrompt = this.promptManager.buildContextualPrompt(
        tile.baseType,
        tile.context,
        this.templateLibrary.getTemplate(tile.baseType)!
      );
      
      // Add battle-specific details
      const battlePrompt = `${newPrompt}, battle damage, scorch marks, debris`;
      
      // Generate new visual
      await this.generateAndApply(tile, battlePrompt);
    }
  }
  
  async applyCorruptionVisuals(location: Vector2) {
    const affectedTiles = this.getRadiusTiles(location, 10);
    
    for (const tile of affectedTiles) {
      const distance = this.distance(tile.position, location);
      const corruptionLevel = Math.max(0, 100 - (distance * 10));
      
      tile.context.corruption = corruptionLevel;
      
      const newPrompt = this.promptManager.buildContextualPrompt(
        tile.baseType,
        tile.context,
        this.templateLibrary.getTemplate(tile.baseType)!
      );
      
      await this.generateAndApply(tile, newPrompt);
    }
  }
}
```

---

## 💡 **Example Prompts Generated**

### **Same Grass Tile in Different Contexts:**

**Spring Day (Peaceful):**
```
lush green grass with small wildflowers, bright green, fresh growth, 
flower buds, bright daylight, vivid colors, pixel art style, 
top-down perspective, theme: medieval, cozy atmosphere
```

**Fall Rain (After Battle):**
```
lush green grass with small wildflowers, yellowing grass, fallen 
leaves scattered, wet grass, puddles forming, darker green, 
battle damage, scorch marks, debris, pixel art style, 
top-down perspective, theme: medieval
```

**Winter Night (Corrupted):**
```
lush green grass with small wildflowers, dormant grass, 
frost-covered, snow patches, moonlit, silvery highlights, 
deep shadows, decayed, twisted, corrupted appearance, 
pixel art style, top-down perspective, theme: medieval
```

---

## 🎨 **UI Integration Idea**

```html
<!-- Add to vibemaster-studio.html -->
<div id="tile-prompt-manager">
  <h3>Tile Visual Settings</h3>
  
  <label>Biome:</label>
  <select id="biome">
    <option>forest</option>
    <option>desert</option>
    <option>tundra</option>
  </select>
  
  <label>Season:</label>
  <select id="season">
    <option>spring</option>
    <option>summer</option>
    <option>fall</option>
    <option>winter</option>
  </select>
  
  <label>Time of Day:</label>
  <select id="time-of-day">
    <option>dawn</option>
    <option>day</option>
    <option>dusk</option>
    <option>night</option>
  </select>
  
  <label>Weather:</label>
  <select id="weather">
    <option>clear</option>
    <option>rain</option>
    <option>snow</option>
    <option>fog</option>
  </select>
  
  <label>Corruption Level:</label>
  <input type="range" id="corruption" min="0" max="100" value="0">
  
  <label>Prosperity Level:</label>
  <input type="range" id="prosperity" min="0" max="100" value="80">
  
  <button onclick="regenerateVisuals()">Regenerate All Tiles</button>
  <button onclick="generateVariants()">Generate Variants</button>
</div>
```

---

## 🚀 **Next Steps for Implementation**

1. **Create TypeScript files** for the prompt management classes
2. **Integrate with existing StyleTemplate system**
3. **Add context awareness** to tile generation workflow
4. **Test neighbor transitions** with a small grid
5. **Build variant library** for common tile types
6. **Connect to game state** events for dynamic updates

Want me to create the actual TypeScript files with full implementations? I can start with the `TilePromptManager.ts` class! 🎨