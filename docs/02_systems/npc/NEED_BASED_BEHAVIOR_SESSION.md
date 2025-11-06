// NEED_BASED_BEHAVIOR_SESSION.md - Session summary

# ðŸŽ‰ Need-Based Daily Cycle System - Complete!

## What You Asked For

> "I think if we create a schedule for npc it will create a rigidity in the system. I was thinking of still aligning with a needs motivation system so that the npcs are more dynamic. It is just we only show their motivative actions say 4 or 5 segments in a daily cycle?"

## What We Built âœ…

### 1. **Dynamic Need-Based Behavior System**
NPCs make decisions based on their actual needs, not rigid schedules!

```typescript
Marcus at Hour 6:
  needWealth: 45 â† Low!
  needFood: 85 â† OK
  
  Decision: "I need money" â†’ Go to work

Sarah at Hour 6:
  needSocial: 30 â† Low!
  needFood: 75 â† OK
  
  Decision: "I'm lonely" â†’ Go to tavern
```

### 2. **4 Daily Checkpoints** 
NPCs re-evaluate every 6 hours:
- âœ… Hour 6 (Dawn)
- âœ… Hour 12 (Midday)
- âœ… Hour 18 (Evening)
- âœ… Hour 22 (Night)

### 3. **Security Flee Mechanic** 
```typescript
Normal (Safety > 20): Work, eat, socialize normally
Critical (Safety < 20): FLEE to town entrance!
```

When security drops too low, NPCs abandon everything and run to safety. When threat resolves, they return to normal activities.

### 4. **Shared Housing System**
```typescript
Cottage-1: [Marcus, Emma, Bjorn]  // 3 NPCs share
Cottage-2: [Thor, Sarah]          // 2 NPCs share
```

Multiple NPCs can live in the same home - more realistic!

### 5. **5 Needs with Decay**
```typescript
needFood: 85    // -8 per checkpoint
needSafety: 90  // -2 per checkpoint  
needWealth: 45  // -5 per checkpoint
needSocial: 60  // -6 per checkpoint (NEW!)
needRest: 70    // -10 per checkpoint (NEW!)
```

### 6. **Smart Location System**
- ðŸ  Homes (3 cottages, shared)
- ðŸ”¨ Workplaces (forge, farm, bakery, mine, etc.)
- ðŸº Tavern (eat, socialize)
- ðŸª Market (socialize, shop)
- â›ª Temple (future: pray)
- ðŸ›¡ï¸ Town Entrance (safety refuge)

## ðŸ“Š Files Created

### Core Systems (3 files)
1. **need-based-behavior.ts** (350 lines)
   - Decision logic with priority system
   - Security override for flee behavior
   - Need decay and recovery
   - Activity descriptions

2. **location-system.ts** (240 lines)
   - Location management
   - Shared home assignment
   - Workplace assignment by occupation
   - Distance calculations

3. **daily-cycle-system.ts** (280 lines)
   - 4 checkpoint management
   - NPC registration
   - Location tracking
   - Threat simulation

### Documentation (2 files)
4. **NEED_BASED_DAILY_CYCLE.md** (Complete guide)
   - How it works
   - Example scenarios
   - Configuration options
   - Integration patterns

5. **DAILY_CYCLE_INTEGRATION.md** (Quick start)
   - Test examples
   - Integration guide
   - Console output examples
   - Checklist

## ðŸŽ® How It Works

### Normal Behavior
```
Dawn (6): Check needs â†’ Decide action â†’ Move to location
  Marcus: Low wealth â†’ Work at forge
  Emma: Hungry â†’ Eat at tavern
  Thor: Tired â†’ Rest at home

Midday (12): Needs decayed, re-evaluate
  Marcus: Still working (wealth recovering)
  Emma: Now lonely â†’ Socialize at tavern
  Thor: Rested, now low wealth â†’ Work at farm

Evening (18): Continue cycle
Night (22): Most NPCs rest (tired + night time)
```

### Threat Scenario
```
Normal day â†’ Threat appears â†’ Security drops

Next checkpoint:
  ðŸš¨ All NPCs with Safety < 20 FLEE to town entrance!
  
Threat resolved â†’ Security recovers

Next checkpoint:
  âœ… NPCs return to normal activities
```

## âœ¨ Key Advantages

### 1. **Emergent Storytelling**
```
"Marcus worked through lunch, driven by his 
 empty coin purse."

"Emma abandoned her work mid-day, overcome 
 with loneliness, seeking company at the tavern."

"When bandits appeared, the entire village 
 fled to the gates in terror."
```

### 2. **No Two Days Alike**
Different need states â†’ Different decisions â†’ Different stories

### 3. **Realistic Patterns**
```
Common patterns emerge naturally:
- NPCs work when poor
- NPCs eat when hungry
- NPCs socialize when lonely
- NPCs rest when tired
- NPCs flee when scared

But with variation based on individual needs!
```

### 4. **Performance Efficient**
Only 4 updates per day instead of every hour

### 5. **Easy to Extend**
```typescript
// Add new need?
needCreativity: number;  // Artists need this

// Add new location?
library: { type: 'library', ... }

// Add new activity?
'studying' | 'creating' | 'trading'
```

## ðŸŽ¯ What Makes This Special

### Dynamic, Not Scripted
```
âŒ Rigid Schedule:
  6am: Go to work
  12pm: Go to tavern
  6pm: Go home
  [Boring, predictable]

âœ… Need-Based:
  Check needs â†’ Decide â†’ Act
  [Interesting, emergent, different each day]
```

### Security as Override
```
âŒ Just another need:
  "I'm at 40% security... should I work or flee?"
  [Unrealistic]

âœ… Critical threshold:
  "Below 20%? DROP EVERYTHING AND RUN!"
  [Creates drama, feels realistic]
```

### Shared Housing
```
âŒ One house per NPC:
  Map: ðŸ ðŸ ðŸ ðŸ ðŸ ðŸ ðŸ ðŸ ðŸ ðŸ 
  [Cluttered, unrealistic]

âœ… Shared homes:
  Map: ðŸ ðŸ ðŸ 
  Cottage-1: Marcus, Emma, Bjorn
  [Clean, realistic, creates relationships]
```

## ðŸš€ Next Steps

### Now (Test It!)
1. Create test file or integrate with main.ts
2. Run checkpoints, watch console
3. Test security threats
4. Verify NPCs make smart decisions

### Soon (Visual Integration)
1. Show NPCs at their locations on map
2. Animate movement between locations
3. Activity icons above NPCs
4. Location buildings visible

### Later (Player Interaction)
1. Player character with movement
2. Proximity detection (LOD system)
3. Contextual events when near NPCs
4. Audio cues based on location
5. AI-generated descriptions

## ðŸ’¡ Example Usage

```typescript
// Create systems
const locationSystem = new LocationSystem();
const cycleSystem = new DailyCycleSystem(locationSystem);

// Register NPCs
cycleSystem.registerNPC({
  name: "Marcus",
  occupation: "Blacksmith",
  needFood: 85, needSafety: 90, needWealth: 45,
  needSocial: 60, needRest: 70,
  currentLocation: "", currentActivity: "idle",
  home: "", workplace: ""
});

// Run day
cycleSystem.onHourChange(6);   // Dawn
cycleSystem.onHourChange(12);  // Midday
cycleSystem.onHourChange(18);  // Evening
cycleSystem.onHourChange(22);  // Night

// Trigger events
cycleSystem.triggerSecurityThreat('major');  // Everyone flees!
cycleSystem.restoreSecurity(60);              // Return to normal
```

## ðŸ“ˆ Statistics

- **5 needs** that drive behavior
- **4 checkpoints** per day
- **10+ locations** in the world
- **6 activity types** (working, eating, socializing, resting, fleeing, idle)
- **3 shared homes** (capacity 2-3 each)
- **~870 lines** of production code
- **~450 lines** of documentation

## âœ… What We Accomplished

You wanted:
- âŒ Not rigid schedules
- âœ… Need-based motivation
- âœ… Dynamic behavior
- âœ… 4-5 checkpoints per day
- âœ… Security affects location choice
- âœ… Flee behavior when unsafe
- âœ… Shared homes

**All delivered!** ðŸŽ‰

## ðŸŽ® Ready to Test

The system is complete and ready to use. You can:

1. **Test standalone** - Create test file, run checkpoints
2. **Integrate with game** - Add to main.ts, use with existing NPCs
3. **Watch console** - See dynamic decisions being made
4. **Trigger threats** - Test flee behavior
5. **Build on it** - Add player, proximity, AI narration

## ðŸŒŸ The Vision

This creates a foundation for:
```
Player walks through village at Hour 12 (Midday)

Approaches forge:
  - Marcus is working (needWealth was low)
  - Hears hammer on anvil
  - AI narration: "Marcus strikes iron rhythmically,
    sweat on his brow. He's been working since dawn,
    driven by an empty coin purse."

Approaches tavern:
  - Emma is socializing (needSocial was low)
  - Hears laughter and conversation
  - AI narration: "Emma sits with friends, her
    earlier loneliness forgotten as she shares
    stories over ale."

Bandits approach! Security drops!

Next checkpoint:
  - Everyone at town entrance (fleeing)
  - Guard patrol visible
  - AI narration: "The village huddles at the gates,
    fear in their eyes as guards drive off the bandits."
```

**An immersive, dynamic, living world!** âœ¨

---

Files:
- `need-based-behavior.ts`
- `location-system.ts`  
- `daily-cycle-system.ts`
- `NEED_BASED_DAILY_CYCLE.md`
- `DAILY_CYCLE_INTEGRATION.md`
- `NEED_BASED_BEHAVIOR_SESSION.md` (this file)
