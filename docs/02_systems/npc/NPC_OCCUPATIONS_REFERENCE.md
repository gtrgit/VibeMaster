// NPC_OCCUPATIONS_REFERENCE.md - Complete list of working occupations

# ðŸ‘· NPC Occupations Reference

Complete list of occupations that have production recipes and can work.

## âœ… Working Occupations

### ðŸŒ² Raw Resource Gatherers (No materials needed)

| Occupation | Produces | Amount | Time | Materials |
|------------|----------|--------|------|-----------|
| **Lumberjack** | Wood ðŸªµ | 5 | 2h | None (gathers from forest) |
| **Miner** | Stone ðŸª¨ | 3 | 3h | None (gathers from mine) |
| **Blacksmith** | Iron âš™ï¸ | 2 | 4h | None (smelts ore) |
| **Farmer** | Food ðŸŽ | 8 | 4h | None (grows crops) |

### ðŸž Food Producers

| Occupation | Produces | Amount | Time | Materials |
|------------|----------|--------|------|-----------|
| **Farmer** | Food ðŸŽ | 8 | 4h | None |
| **Baker** | Food ðŸŽ | 10 | 3h | 2 food (raw ingredients) |

### ðŸ’Š Medicine Producers

| Occupation | Produces | Amount | Time | Materials |
|------------|----------|--------|------|-----------|
| **Healer** | Medicine ðŸ’Š | 2 | 2h | 2 food |
| **Herbalist** | Medicine ðŸ’Š | 3 | 2h | 1 food (herbs) |

### ðŸ§µ Cloth Producers

| Occupation | Produces | Amount | Time | Materials |
|------------|----------|--------|------|-----------|
| **Tailor** | Cloth ðŸ§µ | 2 | 2h | 1 food |

### ðŸ”¨ Tool & Weapon Crafters

| Occupation | Produces | Amount | Time | Materials |
|------------|----------|--------|------|-----------|
| **Carpenter** | Tools ðŸ”¨ | 1 | 3h | 2 wood + 1 iron |
| **Weaponsmith** | Weapons âš”ï¸ | 1 | 4h | 3 iron + 1 wood |

## ðŸ“Š Production Chains

### Food Chain
```
Farmer (8 food, 4h) â†’ Baker (10 food, 3h)
                      Uses 2 food to make 10 food
                      Net gain: +8 food
```

### Medicine Chain
```
Farmer (8 food, 4h) â†’ Healer (2 medicine, 2h)
                      Uses 2 food to make medicine
                   OR
                   â†’ Herbalist (3 medicine, 2h)
                      Uses 1 food to make medicine
```

### Tool Chain
```
Lumberjack (5 wood, 2h) â”
                         â”œâ†’ Carpenter (1 tool, 3h)
Blacksmith (2 iron, 4h) â”˜   Uses 2 wood + 1 iron
```

### Weapon Chain
```
Blacksmith (2 iron, 4h) â”
                         â”œâ†’ Weaponsmith (1 weapon, 4h)
Lumberjack (5 wood, 2h) â”˜   Uses 3 iron + 1 wood
```

## âŒ Non-Working Occupations

These occupations don't have recipes yet and will show "I don't know how to work":

- Merchant
- Trader
- Guard
- Soldier
- Knight
- Captain
- Noble
- Lord
- Lady
- Villager
- Cook
- Innkeeper
- Priest
- Scholar
- Mage
- Alchemist
- Scribe
- Teacher
- Librarian
- Jeweler

## ðŸŽ¯ Recommended Occupation Balance

For a working economy, aim for:

### Starting Village (5 NPCs)
```
2 Farmers    (base food production)
1 Lumberjack (wood supply)
1 Blacksmith (iron supply)
1 Healer     (uses food â†’ medicine)
```

### Growing Village (10 NPCs)
```
2 Farmers
2 Lumberjacks
1 Blacksmith
1 Miner
1 Baker      (multiplies food)
1 Herbalist  (medicine production)
1 Carpenter  (tool production)
1 Tailor     (cloth production)
```

### Large Village (15+ NPCs)
```
3 Farmers
2 Lumberjacks
2 Blacksmiths
1 Miner
2 Bakers
1 Herbalist
1 Healer
2 Carpenters
1 Weaponsmith
```

## ðŸ’¡ Efficiency Tips

### Best Food Producers
1. **Baker** - 10 food in 3h (3.33/hour) - BUT needs 2 food input
2. **Farmer** - 8 food in 4h (2.0/hour) - No materials needed

**Strategy**: Have 2 farmers feeding 1 baker
- Farmers: 16 food per 4h cycle
- Baker uses: 2 food, makes 10 food
- Net: +14 food per cycle

### Best Medicine Producers
1. **Herbalist** - 3 medicine in 2h (1.5/hour) - Only needs 1 food
2. **Healer** - 2 medicine in 2h (1.0/hour) - Needs 2 food

**Strategy**: Use herbalists for efficiency

### Resource Bottlenecks
- **Iron** is slow (4h per 2 iron) - have 2+ blacksmiths
- **Wood** is fast (2h per 5 wood) - 1 lumberjack is enough initially
- **Stone** is medium (3h per 3 stone) - 1 miner is enough

## ðŸ”„ Changing NPC Occupations

If you have NPCs with non-working occupations, update your mock data:

```typescript
// In main.ts, getMockData()
{
  name: "Sarah",
  occupation: "Merchant",  // âŒ No recipe
  // ... rest of NPC data
}

// Change to:
{
  name: "Sarah",
  occupation: "Baker",     // âœ… Has recipe!
  // ... rest of NPC data
}
```

## ðŸ“ Adding New Occupations

To add a new occupation, edit `resource-system-with-logging.ts`:

```typescript
export const PRODUCTION_RECIPES = {
  // ... existing recipes ...
  
  // Add your new occupation
  cook: { 
    produces: 'food', 
    amount: 6, 
    timeHours: 2,
    requires: [{ resource: 'food', amount: 1 }]
  }
}
```

## ðŸŽ® In-Game Identification

When you see in console:
```
Sarah (Merchant):
   ðŸ’­ "I don't know how to work... no recipe for my occupation"
```

**Solution Options**:
1. Change Sarah's occupation to something from the âœ… Working list
2. Add a recipe for "merchant" in the code
3. Keep them as non-working NPCs (they'll just be idle)

## ðŸ” Quick Lookup

**Quick check if occupation works**:
```
Occupation lowercase is in this list?
  lumberjack, miner, blacksmith, farmer,
  baker, tailor, healer, herbalist,
  carpenter, weaponsmith
  
If YES â†’ Will work! âœ…
If NO  â†’ Won't work âŒ
```

## ðŸ“š Related Files

- **resource-system-with-logging.ts** - Where recipes are defined
- **RESOURCE_LOGGING_GUIDE.md** - How to read the logs
- **CONSOLE_OUTPUT_EXAMPLE.md** - Example console output
- **NPC_OCCUPATIONS_REFERENCE.md** - This file!

---

**Remember**: Occupations are case-insensitive. "Baker", "baker", and "BAKER" all work the same!
