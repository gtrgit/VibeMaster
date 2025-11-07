# Lifestyle Index & Production Chains - Quick Reference

## 🎯 The Core Concept

**Lifestyle Index** measures how well a village produces quality goods without bottlenecks. It's an **emergent metric** that rises naturally as you:
1. Eliminate production bottlenecks
2. Introduce deeper production chains
3. Enable specialized craftsmanship

## 📊 The Formula

```
Lifestyle Index = 
  (Production Capacity × 40%) +
  (Production Efficiency × 35%) +
  (Goods Accessibility × 25%)
```

### Production Capacity (40%)
- **Breadth:** How many different things can you make?
- **Depth:** How complex are your production chains?
- **Quality:** Can you make refined/luxury goods?

### Production Efficiency (35%)
- **Subsistence Overhead:** Time spent on basic needs (want LOW)
- **Bottlenecks:** Active problems blocking production
- **Supply Chain:** Reliability of material flow

### Goods Accessibility (25%)
- **Distribution:** How easy to acquire goods?
- **Affordability:** Can NPCs afford them?
- **Variety:** Choice available?

---

## 🏗️ Production Chain Depths

```
Depth 0: GATHERING
├─ Berries, Herbs, Wild Resources
└─ Lifestyle Index Contribution: Minimal

Depth 1-2: BASIC PRODUCTION  
├─ Wood → Planks
├─ Wheat → Flour → Bread
└─ Lifestyle Index: 20-40 (Subsistence)

Depth 3-4: INTERMEDIATE CRAFTING
├─ Ore → Ingots → Tools
├─ Wool → Thread → Cloth → Clothing
└─ Lifestyle Index: 41-70 (Stable/Comfortable)

Depth 5-6: ADVANCED GOODS
├─ Ore → Steel → Quality Weapons → Masterwork
├─ Multiple refined inputs → Luxury Furniture
└─ Lifestyle Index: 71-85 (Prosperous)

Depth 7+: LEGENDARY ITEMS
├─ Masterwork + Enchanting → Legendary
├─ Requires multiple specialized craftspeople
└─ Lifestyle Index: 86-100 (Flourishing)
```

---

## 🎮 Gameplay Progression

### Starting Village (Index 20-35)
**What you have:**
- 3-5 NPCs
- Depth 0-1 chains (gathering/farming)
- 40%+ time on subsistence
- No specialists

**Player Goal:** Build first workshop, get basic tools

### Growing Village (Index 36-55)
**What you have:**
- 15-30 NPCs
- Depth 2-3 chains (iron tools, bread, cloth)
- 20-35% subsistence overhead
- 3-5 specialists

**Player Goal:** Eliminate bottlenecks (water tower!), train specialists

### Prosperous Village (Index 56-75)
**What you have:**
- 40-80 NPCs
- Depth 4-5 chains (steel, quality goods)
- 10-20% subsistence overhead
- 8-12 specialists

**Player Goal:** Unlock masterwork tier, establish trade routes

### Flourishing City (Index 76-100)
**What you have:**
- 100+ NPCs
- Depth 6-7+ chains (enchanted items, luxury goods)
- <10% subsistence overhead
- 15+ specialists

**Player Goal:** Maintain dominance, cultural achievements

---

## ⚡ Example: Water Tower Impact

### BEFORE (Index 38)
```
Subsistence Overhead: 28%
├─ Water fetching: 2.4h per NPC per day
├─ 50 NPCs × 2.4h = 120 wasted hours/day
└─ Bottleneck severity: 85/100

Production Capacity: 40
Production Efficiency: 35 (bottleneck!)
Goods Accessibility: 45
```

### AFTER (Index 61) → +23 Points!
```
Subsistence Overhead: 8%
├─ Water from tower: 0.1h per NPC per day
├─ 50 NPCs × 2.3h saved = 115 productive hours/day
└─ Bottleneck ELIMINATED

Production Capacity: 48 (+8)
Production Efficiency: 82 (+47!) ← HUGE
Goods Accessibility: 53 (+8)
```

**Result:** Tier 1 (Subsistence) → Tier 3 (Comfortable)

---

## 🔧 Tech Tree Impact

Each technology has different effects:

```typescript
// EFFICIENCY TECH (removes bottlenecks)
Water Distribution System
├─ Efficiency: +20
├─ Removes: RESOURCE_GATHERING bottleneck
└─ Index Impact: +15-25 points

// CAPACITY TECH (enables new chains)
Steel Making
├─ Capacity: +20
├─ Enables: Depth 5 weapons/armor/tools
└─ Index Impact: +10-15 points

// ACCESSIBILITY TECH (distribution)
Printing Press
├─ Accessibility: +15
├─ Removes: EDUCATION bottleneck
└─ Index Impact: +8-12 points
```

---

## 📈 Example Progression Timeline

```
YEAR 1: Starting Village
├─ Index: 25 (Subsistence)
├─ 5 farmers, 2 gatherers
└─ Goal: Get through winter

YEAR 2: First Workshop
├─ Index: 38 (Stable)
├─ Added: 1 blacksmith, 1 carpenter
└─ Bottleneck: Water fetching (85 severity)

YEAR 3: Water Tower Built!
├─ Index: 61 (Comfortable) ← +23 jump!
├─ Subsistence drops from 28% to 8%
└─ New Bottleneck: Tool shortage

YEAR 5: Steel Unlocked
├─ Index: 72 (Prosperous)
├─ 3 blacksmiths making steel weapons
└─ Trade surplus, migration inflow

YEAR 10: Master Craftsmen
├─ Index: 88 (Flourishing)
├─ Enchanter, master weaponsmith
└─ Regional power, cultural center
```

---

## 🎯 Strategic Priorities

**To Raise Lifestyle Index:**

1. **Eliminate Highest Severity Bottleneck** (fastest ROI)
   - Water tower if subsistence >20%
   - Tools if craftsmen idle
   - Education if literacy <50%

2. **Unlock Next Chain Depth** (capacity boost)
   - Bronze → Iron → Steel
   - Each depth tier = +5-10 index

3. **Train Specialists** (quality boost)
   - Masterwork goods = luxury demand
   - Specialists = deep chains possible

4. **Improve Distribution** (accessibility)
   - Markets, roads, storage
   - Makes goods actually available

---

## 🏆 Migration & Economic Effects

```typescript
// Villages compared by neighbors
Millbrook (you): 47
Riverside: 58
Ironhaven: 72

Result: -2 NPCs/month leaving Millbrook
        (moving to higher-index villages)

// After water tower
Millbrook (you): 61 ← Now competitive!
Result: +1 NPC/month (neutral to positive)

// Economic multipliers at index 61
Trade Volume: 1.22x (22% more traders)
Trade Profit: 1.13x (13% better prices)
Investment: 1.49x (49% more investment)
Skill Development: 1.22x (22% faster learning)
```

---

## 💡 Key Design Insights

1. **Deep chains impossible without infrastructure**
   - Can't make enchanted armor without steel
   - Can't make steel without education
   - Can't educate without leisure time
   - Can't have leisure without efficiency!

2. **Bottlenecks are more impactful than tech**
   - Removing water bottleneck = +23 index
   - Adding steel tech = +12 index
   - Fix problems before adding features!

3. **Quality matters more than quantity**
   - 1 masterwork weapon (value: 1200)
   - vs 30 basic weapons (value: 2400)
   - But masterwork unlocks noble buyers!

4. **Specialization requires scale**
   - Need 50+ NPCs for master craftsmen
   - Can't specialize if everyone farms
   - Efficiency enables specialization

---

## 📋 Production Examples

### Simple Village Recipe (Depth 2)
```
OUTPUT: 8x Bread (basic_food)
CHAIN:
  1. Farm wheat (6h) → 12 wheat
  2. Mill flour (2h) → 10 flour  
  3. Bake bread (2h) → 8 bread
  
Total: 10 hours, depth 3
Value: 10 gold per unit
```

### Prosperous Village Recipe (Depth 5)
```
OUTPUT: 1x Quality Steel Weapon
CHAIN:
  1. Mine iron ore (4h) → 3 ore
  2. Make charcoal (8h) → 4 charcoal
  3. Smelt iron (3h) → 2 ingots
  4. Forge steel (5h) → 1 steel ingot
  5. Craft weapon (8h) → 1 quality weapon
  
Total: 28 hours across 3 specialists, depth 5
Value: 300 gold
```

### Flourishing City Recipe (Depth 7)
```
OUTPUT: 1x Enchanted Masterwork Weapon
CHAIN:
  1-4. (Same as above to get steel)
  5. Craft masterwork (16h) → 1 masterwork
  6. Mine gems (6h) → 3 gems
  7. Enchant (24h) → 1 enchanted weapon
  
Total: 68 hours across 5 specialists, depth 7
Value: 5000 gold
Requires: Master weaponsmith + Enchanter
```

---

## 🎨 Visual Summary

```
LIFESTYLE INDEX: The measure of civilization quality

   0-20: Survival    [████                ] Gathering/hunting
  21-40: Subsistence [█████████           ] Basic farming
  41-55: Stable      [██████████████      ] Reliable production  
  56-70: Comfortable [████████████████    ] Food surplus
  71-85: Prosperous  [██████████████████  ] Luxury goods
 86-100: Flourishing [████████████████████] Cultural center

WHAT RAISES IT:
  ✅ Eliminate bottlenecks (water, tools, education)
  ✅ Unlock deeper production chains (depth 1→2→3→4→5+)
  ✅ Train specialized craftspeople (masterwork tier)
  ✅ Improve accessibility (markets, distribution)

WHAT LOWERS IT:
  ❌ High subsistence overhead (>20% time on basics)
  ❌ Active bottlenecks (resource, skill, tool shortages)
  ❌ Shallow production chains (only depth 0-2)
  ❌ Poor distribution (goods exist but inaccessible)
```

---

## 🚀 Implementation Notes

### Files Created:
1. **LIFESTYLE_INDEX_SYSTEM.md** (60+ pages)
   - Complete design document
   - Formula breakdown
   - Civilization tiers
   - Examples for each tier

2. **deep-production-chains.ts** (700+ lines)
   - 100+ recipes across 7 depth levels
   - Quality tiers (Basic → Masterwork → Legendary)
   - Skill requirements, tech gates
   - Helper functions for chain analysis

### Integration Points:
- Works with existing `EFFICIENCY_DETECTION_AND_METRICS_SYSTEM.md`
- Uses existing `INNOVATION_AND_TECH_PROPAGATION_SYSTEM.md`
- Extends current `resource-system-with-logging.ts`
- Compatible with `need-based-behavior.ts` NPC system

### Next Steps:
1. Implement Lifestyle Index calculator
2. Add chain depth tracking to ResourceManager
3. Create dashboard UI showing index + breakdown
4. Test with different village scenarios
5. Balance recipe times and values

---

## 🎯 The Vision

> "A simple village can only produce simple chains, so their lifestyle is low. But as you eliminate bottlenecks and unlock technologies, production chains deepen naturally. Quality goods become possible. Specialists emerge. The village transforms from subsistence to flourishing—not because you set a number, but because the economy itself evolved."

**This is emergent gameplay at its finest.** 🏰✨
