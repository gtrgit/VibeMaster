## 📋 SESSION SUMMARY: Universal Resource & Production Systems

### **Core Problem Solved**
Made VibeMaster's resource/production systems **universal and theme-agnostic** instead of locked to medieval fantasy, enabling the same simulation engine to power any setting (medieval, sci-fi, modern, post-apocalypse, etc.)

---

### **Key Design: Macro ↔ Micro Integration**

**MACRO LEVEL (Faction/Strategic)**
- Aggregate resources (wealth, supplies, security as 0-100 values)
- Faction-level needs drive collective goals
- Example: "Security: 45/100" means 9/20 soldiers fully equipped
- Performance-optimized for distant areas

**MICRO LEVEL (Individual/Tactical)**  
- Individual NPCs produce specific items
- Skills affect production time & quality
- Production chains create bottlenecks and drama
- Full simulation near player

**THE CONNECTION:**
- Macro needs trigger micro production orders
- Micro production feeds back to macro totals
- Security value = (equipped_soldiers / total_soldiers) × tech_bonuses × skill_bonuses

---

### **Universal Systems**

#### **1. NEEDS (Theme-Agnostic)**
```
survival: sustenance, health, shelter
safety: security, stability  
social: belonging, status, communication
growth: knowledge, resources, influence
```
- Medieval: "food" | Sci-fi: "life_support" | Modern: "salary"
- Same mechanics, different names

#### **2. SKILLS (Universal Categories)**
```
combat: offense, defense, tactics
fabrication: simple_crafting, complex_crafting, repair
technical: operation, maintenance, innovation
social: persuasion, deception, leadership
knowledge: analysis, research, application
physical: athletics, stealth, endurance
```
- Skill 65 = 70% production time, 65 quality (universal formula)
- Practice increases skills over time

#### **3. ITEMS (Function-Based)**
```
Functions (universal):
- damage_output, damage_reduction
- utility_bonus, sustenance_value
- healing_value, information_value
- status_bonus, efficiency_bonus

Theme (runtime):
- Medieval: "Iron Sword" 
- Sci-fi: "Plasma Pistol"
- Modern: "9mm Handgun"
- Post-apoc: "Pipe Gun"

SAME STATS, DIFFERENT NAMES!
```

#### **4. TECHNOLOGY (Abstract Tiers)**
```
Tier 1: Basic (starting tech)
Tier 2: Advanced (research/learn/steal)
Tier 3: Master (rare, powerful)

Effects (universal):
- fabrication_speed: 1.3x (30% faster)
- offensive_power: 1.25x (+25% damage)
- resource_efficiency: 0.8x (20% less materials)

Names (themed):
- Medieval: "Steel Forging"
- Sci-fi: "Plasma Weaponry"  
- Modern: "Advanced Ballistics"
```

---

### **Production Chain Example**

**To equip ONE soldier:**
```
Requires: 4-5 items (weapon, armor, shield, helmet, boots)
Materials: 13 primary_material, 4 binding_material, 3 secondary_material
Time: 9 days (if parallel production)
Cost: 260 currency units
Needs: 3+ different skilled craftsmen

Bottlenecks create drama:
- Blacksmith can only make 1 sword per 2 days
- No armorer available (need to recruit/train)
- Material shortage (need to trade/raid)
- Insufficient funding (political tension)
```

**Cascading consequences:**
- Can't improve security → vulnerable to attack
- During research → temporary weakness window
- Theft/loss → must replace equipment
- Tech disadvantage → permanent handicap

---

### **Knowledge Transfer Mechanics**

**4 Ways to Gain Technology:**
1. **Research** - Time + gold + skilled NPC (60 days, 800 gold)
2. **Teaching** - Master trains student (Marcus busy 60 days, can't produce)
3. **Espionage** - Spy steals blueprints (risky, free if successful, war if caught)
4. **Purchase** - Buy from another faction (instant, expensive, requires good relations)

**Knowledge as Power:**
- Factions compete for tech advantage
- Intelligence gathering = strategic resource
- Tech gap = force multiplier (64% more powerful + 35% faster with skill + tech)

---

### **Theme System Architecture**

```typescript
// UNIVERSAL MECHANICS (in code)
class UniversalNPC {
  needs: Map<NeedCategory, number>
  skills: Map<SkillCategory, number>
  produceItem(template: UniversalItem)
}

// THEME LAYER (JSON files)
{
  "medieval.json": {
    "resources": { "primary_material": "iron_ore" },
    "roles": { "fabrication.simple": "Blacksmith" },
    "items": { "basic_offensive": "Iron Sword" }
  },
  
  "scifi.json": {
    "resources": { "primary_material": "durasteel" },
    "roles": { "fabrication.simple": "Technician" },
    "items": { "basic_offensive": "Plasma Pistol" }
  }
}

// SAME ENGINE, DIFFERENT SKIN!
```

---

### **Key Benefits**

✅ **Single codebase** supports infinite settings  
✅ **Modding-friendly** - new themes via JSON, no coding  
✅ **Universal tutorials** - not setting-specific  
✅ **Emergent gameplay** - bottlenecks create organic quests  
✅ **Strategic depth** - tech races, espionage, production chains  
✅ **Scalable performance** - macro aggregation for distant areas  

---

### **Design Principles**

1. **Separate mechanics from theme** - Function vs flavor
2. **Macro needs drive micro actions** - Top-down goals
3. **Micro results feed macro state** - Bottom-up aggregation  
4. **Time is a resource** - Training = opportunity cost
5. **Knowledge multiplies power** - Tech = force multiplier
6. **Scarcity creates drama** - Bottlenecks = quests
7. **Multiple solution paths** - Research, buy, steal, recruit

---

### **Next Session Topic: TRANSPORTATION**

Questions to explore:
- How do NPCs/goods move between locations?
- Macro vs micro travel systems?
- Trade routes, caravans, supply lines?
- How does transportation affect security, economy, information flow?
- Universal system for medieval horses, sci-fi shuttles, modern trucks?

---

**This summary captures the core universal systems that make VibeMaster a simulation engine, not just a game!**