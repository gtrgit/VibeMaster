// DAILY_CYCLE_INTEGRATION.md - How to integrate the daily cycle system

# ðŸš€ Daily Cycle System - Integration Guide

## Quick Start

We've built a **need-based daily cycle system** with:
- âœ… Dynamic NPC behavior based on needs
- âœ… 4 checkpoints per day (Dawn, Midday, Evening, Night)
- âœ… Security flee mechanic (NPCs run to safety when threatened)
- âœ… Shared housing (multiple NPCs per home)
- âœ… Need decay and recovery
- âœ… Location system with workplaces, homes, tavern, etc.

## ðŸŽ® Test It Now

### Option 1: Standalone Test

Create `test-daily-cycle.ts`:

```typescript
import { LocationSystem } from './location-system';
import { DailyCycleSystem } from './daily-cycle-system';
import { NPCBehaviorState } from './need-based-behavior';

// 1. Create systems
const locationSystem = new LocationSystem();
const cycleSystem = new DailyCycleSystem(locationSystem);

// 2. Create NPCs
const marcus: NPCBehaviorState = {
  name: "Marcus",
  occupation: "Blacksmith",
  needFood: 85,
  needSafety: 90,
  needWealth: 45,
  needSocial: 60,
  needRest: 70,
  currentLocation: "",
  currentActivity: "idle",
  home: "",
  workplace: ""
};

const emma: NPCBehaviorState = {
  name: "Emma",
  occupation: "Healer",
  needFood: 75,
  needSafety: 85,
  needWealth: 65,
  needSocial: 35,
  needRest: 50,
  currentLocation: "",
  currentActivity: "idle",
  home: "",
  workplace: ""
};

const thor: NPCBehaviorState = {
  name: "Thor",
  occupation: "Farmer",
  needFood: 90,
  needSafety: 80,
  needWealth: 40,
  needSocial: 55,
  needRest: 65,
  currentLocation: "",
  currentActivity: "idle",
  home: "",
  workplace: ""
};

// 3. Register NPCs
cycleSystem.registerNPC(marcus);
cycleSystem.registerNPC(emma);
cycleSystem.registerNPC(thor);

// 4. Show locations
locationSystem.logLocations();

// 5. Run a full day
console.log("\nðŸŒ… === RUNNING FULL DAY ===\n");

cycleSystem.onHourChange(6);   // Dawn
cycleSystem.onHourChange(12);  // Midday
cycleSystem.onHourChange(18);  // Evening
cycleSystem.onHourChange(22);  // Night

// 6. Test security threat!
console.log("\n\nâš ï¸  === BANDITS ATTACK! ===\n");
cycleSystem.triggerSecurityThreat('major');

// Run checkpoint during threat
cycleSystem.onHourChange(6);  // Next dawn - NPCs should flee!

// 7. Resolve threat
console.log("\n\nâœ… === GUARDS DRIVE OFF BANDITS ===\n");
cycleSystem.restoreSecurity(60);

// Run checkpoint after threat
cycleSystem.onHourChange(12);  // Midday - NPCs return to normal
```

Run with:
```bash
npx tsx test-daily-cycle.ts
```

### Option 2: Integrate with Existing Game

Update your `main.ts`:

```typescript
// Add imports at top
import { LocationSystem } from './location-system';
import { DailyCycleSystem } from './daily-cycle-system';
import { NPCBehaviorState } from './need-based-behavior';

class GameScene extends Phaser.Scene {
  // Add to properties
  private locationSystem!: LocationSystem;
  private cycleSystem!: DailyCycleSystem;
  
  async create() {
    // After initResourceSystem(), add:
    this.initDailyCycleSystem();
    
    // ... rest of create
  }
  
  initDailyCycleSystem(): void {
    console.log("ðŸŒ… Initializing daily cycle system...");
    
    // Create systems
    this.locationSystem = new LocationSystem();
    this.cycleSystem = new DailyCycleSystem(this.locationSystem);
    
    // Convert existing NPCs to behavior NPCs
    if (this.worldData?.npcs) {
      for (const npc of this.worldData.npcs) {
        const behaviorNPC: NPCBehaviorState = {
          name: npc.name,
          occupation: npc.occupation,
          needFood: npc.needFood || 80,
          needSafety: npc.needSafety || 85,
          needWealth: npc.needWealth || 50,
          needSocial: 60,  // New need
          needRest: 70,    // New need
          currentLocation: "",
          currentActivity: "idle",
          home: "",
          workplace: ""
        };
        
        this.cycleSystem.registerNPC(behaviorNPC);
      }
    }
    
    // Show location setup
    this.locationSystem.logLocations();
    
    console.log("âœ… Daily cycle system initialized!");
  }
  
  updateResourceSystem(currentHour: number): void {
    // ... existing resource update code ...
    
    // ADD: Update daily cycle
    this.cycleSystem.onHourChange(currentHour);
    
    // ... rest of update
  }
}
```

## ðŸ“Š What You'll See in Console

### Normal Day
```
======================================================================
ðŸŒ… DAWN CHECKPOINT (Hour 6)
======================================================================

â¬ === NEED DECAY ===
â¬ Needs decayed for Marcus: Food(77) Safety(88) Wealth(40) Social(54) Rest(60)
â¬ Needs decayed for Emma: Food(42) Safety(83) Wealth(60) Social(29) Rest(40)

ðŸƒ === SECURITY CHECK ===
âœ… All NPCs feel safe

ðŸ§  === NPC DECISIONS ===

ðŸ§  Marcus is deciding what to do...
   Needs: Food(77) Safety(88) Wealth(40) Social(54) Rest(60)
   ðŸ’° Could work (priority: 60)
   ðŸ‘¥ Could socialize (priority: 32.2)
   âœ… Decision: working at blacksmith-shop
   ðŸ“‹ Reason: Need money (40%)

ðŸ§  Emma is deciding what to do...
   Needs: Food(42) Safety(83) Wealth(60) Social(29) Rest(40)
   ðŸ½ï¸  Could eat (priority: 46.4)
   ðŸ‘¥ Could socialize (priority: 49.7)
   ðŸ˜´ Could rest (priority: 36)
   âœ… Decision: socializing at tavern
   ðŸ“‹ Reason: Lonely (29%)

ðŸš¶ === NPC MOVEMENT ===
   ðŸš¶ Marcus: Cottage-1 â†’ Marcus's Forge
      Activity: working (Need money (40%))
   ðŸš¶ Emma: Cottage-1 â†’ The Rusty Tankard
      Activity: socializing (Lonely (29%))

ðŸ“ === LOCATION SUMMARY ===
   ðŸ”¨ Marcus's Forge:
      - Marcus (working)
   ðŸº The Rusty Tankard:
      - Emma (socializing)
```

### Threat Event
```
âš ï¸  === SECURITY THREAT: MAJOR ===
All NPCs lose 40 security!
   Marcus: Security now 48%
   Emma: Security now 43%
   Thor: Security now 40%

======================================================================
ðŸŒ… DAWN CHECKPOINT (Hour 6)
======================================================================

ðŸƒ === SECURITY CHECK ===
âœ… All NPCs feel safe (lowest is 40%)

[Everyone continues normally]

âš ï¸  === SECURITY THREAT: CRITICAL ===
All NPCs lose 70 security!
   Marcus: Security now 18%  â† Below 20!
   Emma: Security now 13%    â† Below 20!
   Thor: Security now 10%    â† Below 20!

======================================================================
ðŸŒ… DAWN CHECKPOINT (Hour 6)
======================================================================

ðŸƒ === SECURITY CHECK ===
âš ï¸  3 NPCs have critical security and are fleeing!
   ðŸƒ Marcus: Safety(18%) - FLEEING!
   ðŸƒ Emma: Safety(13%) - FLEEING!
   ðŸƒ Thor: Safety(10%) - FLEEING!

ðŸ§  === NPC DECISIONS ===

ðŸ§  Marcus is deciding what to do...
   Needs: Food(77) Safety(18) Wealth(55) Social(54) Rest(50)
   âš ï¸  CRITICAL SECURITY! Fleeing to safety!

[All NPCs flee to town entrance]

ðŸš¶ === NPC MOVEMENT ===
   ðŸš¶ Marcus: Forge â†’ Town Entrance
      Activity: fleeing (Security critical (18%))
   ðŸš¶ Emma: Tavern â†’ Town Entrance
      Activity: fleeing (Security critical (13%))
   ðŸš¶ Thor: Farm â†’ Town Entrance
      Activity: fleeing (Security critical (10%))

ðŸ“ === LOCATION SUMMARY ===
   ðŸ›¡ï¸  Town Entrance:
      - Marcus (fleeing)
      - Emma (fleeing)
      - Thor (fleeing)
```

## ðŸŽ¯ Key Features to Notice

### 1. **Dynamic Decisions**
Each checkpoint, NPCs evaluate their needs and make choices:
- Low wealth? Go work
- Hungry? Go eat
- Lonely? Socialize
- Tired? Rest

### 2. **Shared Homes**
```
ðŸ  HOMES:
   Riverside Cottage (3/3): Marcus, Emma, Bjorn
   Mill House (2/2): Thor, Sarah
```

### 3. **Security Override**
When security drops below 20:
```
ALL OTHER NEEDS IGNORED
â†’ FLEE TO TOWN ENTRANCE
```

### 4. **Need Decay**
Every checkpoint:
```
Food: -8
Safety: -2
Wealth: -5
Social: -6
Rest: -10
```

### 5. **Need Recovery**
Based on activity:
```
Working: +15 wealth, -5 rest
Eating: +30 food, +5 social
Socializing: +20 social, -3 food
Resting: +40 rest, -5 food
```

## ðŸ§ª Testing Scenarios

### Test 1: Normal Day
```typescript
cycleSystem.onHourChange(6);   // Everyone wakes up
cycleSystem.onHourChange(12);  // Lunch time
cycleSystem.onHourChange(18);  // Evening activities
cycleSystem.onHourChange(22);  // Bedtime

// Should see: Work â†’ Eat â†’ Work/Socialize â†’ Rest
```

### Test 2: Security Threat
```typescript
cycleSystem.triggerSecurityThreat('major');
cycleSystem.onHourChange(6);

// Should see: Everyone flees to town entrance
```

### Test 3: Gradual Threat
```typescript
cycleSystem.triggerSecurityThreat('minor');  // -20 security
cycleSystem.onHourChange(6);
// Most NPCs OK, maybe 1-2 flee

cycleSystem.triggerSecurityThreat('minor');  // -20 more
cycleSystem.onHourChange(12);
// More flee

cycleSystem.restoreSecurity(50);
cycleSystem.onHourChange(18);
// Everyone returns to normal
```

### Test 4: Overworked NPC
```typescript
const workaholic = cycleSystem.getNPC("Marcus");
workaholic.needWealth = 10;  // Very low!
workaholic.needRest = 10;    // Exhausted!

cycleSystem.onHourChange(6);
// Will he work or rest? (Work priority higher!)

cycleSystem.onHourChange(12);
// Still working... needs might be critical now
```

## ðŸŽ¨ Visual Integration (Next Step)

After this works in console, add visual representation:

```typescript
renderNPCs(npcs: any[]) {
  for (const npc of npcs) {
    // Get behavior state
    const behaviorNPC = this.cycleSystem.getNPC(npc.name);
    if (!behaviorNPC) continue;
    
    // Get location
    const location = this.locationSystem.getLocation(
      behaviorNPC.currentLocation
    );
    
    if (location) {
      // Position NPC sprite at location
      const npcVisual = this.npcSprites.get(npc.name);
      if (npcVisual) {
        // Move to location
        npcVisual.sprite.setPosition(location.x, location.y);
        
        // Show activity icon
        const activityEmoji = this.behaviorSystem.getActivityEmoji(
          behaviorNPC.currentActivity
        );
        npcVisual.activityIcon?.setText(activityEmoji);
      }
    }
  }
}
```

## ðŸ“š Files Created

- `need-based-behavior.ts` - Decision logic with flee mechanic
- `location-system.ts` - Locations and shared homes
- `daily-cycle-system.ts` - 4 checkpoints per day
- `NEED_BASED_DAILY_CYCLE.md` - Full documentation
- `DAILY_CYCLE_INTEGRATION.md` - This guide

## âœ… Checklist

Before testing:
- [ ] Files created in project
- [ ] NPCs have all 5 needs (add needSocial and needRest)
- [ ] Hour system working
- [ ] Console open (F12) to see logs

During test:
- [ ] NPCs assigned to homes
- [ ] Workplaces assigned based on occupation
- [ ] Checkpoints run at hours 6, 12, 18, 22
- [ ] NPCs make different decisions based on needs
- [ ] Security threat causes flee behavior
- [ ] Recovery restores normal behavior

## ðŸš€ Ready?

1. **Create test file** or **integrate with main.ts**
2. **Run the game**
3. **Open console** (F12)
4. **Watch NPCs** make dynamic decisions!

The system is designed to create **emergent, interesting behavior** that drives narrative! ðŸŽ®âœ¨

---

**Next step after this works**: Add player character and proximity detection!
