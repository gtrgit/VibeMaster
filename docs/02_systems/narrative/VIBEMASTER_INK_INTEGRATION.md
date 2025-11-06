# ðŸ“– VIBEMASTER + INK INTEGRATION GUIDE

**Ink Scripting Language for Living World Narratives**

---

## ðŸŽ¯ EXECUTIVE SUMMARY

**Ink** is inkle's open-source narrative scripting language, used in acclaimed games like *80 Days*, *Heaven's Vault*, and *Sorcery!*. It's the perfect dialogue system for VibeMaster's living world simulation because:

- âœ… **Text-first approach** - Write naturally, code comes second
- âœ… **Powerful state tracking** - Variables sync with your simulation
- âœ… **Conditional branching** - Like Citizen Sleeper's node gating
- âœ… **JSON export** - Perfect for web/Decentraland integration
- âœ… **Lightweight** - JavaScript runtime (inkjs) works anywhere
- âœ… **Open source & free** - MIT license

**The Magic:** Ink handles conversation flow, your simulation determines what conversations exist.

---

## ðŸŒŸ WHY INK + LIVING WORLD = REVOLUTIONARY

### Traditional Approach
```
Game Designer writes all possible dialogue
  â†“
10,000+ lines of scripted conversations
  â†“
Static outcomes, no real emergence
  â†“
Months of writing
```

### VibeMaster + Ink Approach
```
Voice describe character personality & goals
  â†“
VibeMaster generates Ink scripts
  â†“
Simulation determines what's possible
  â†“
Ink presents dynamic choices
  â†“
Emergent, unique, reactive narratives
  â†“
Hours instead of months
```

---

## ðŸ“š INK BASICS FOR VIBEMASTER

### 1. Simple Conversation (Node-Based)

```ink
=== marcus_forge ===
Marcus hammers at the anvil, sparks flying.

"Need something?" he grunts without looking up.

+ [Ask about his work]
    -> ask_about_work
+ [Ask about the village]
    -> ask_about_village
+ [Leave]
    -> END

=== ask_about_work ===
"Been smithing for thirty years. Best in three counties."

He wipes sweat from his brow.

+ [Continue conversation]
    -> marcus_forge
+ [Leave]
    -> END
```

**Result:** Node-based conversation system exactly like Citizen Sleeper!

### 2. Variables & World State

```ink
// Global variables (at top of file)
VAR marcus_relationship = 0
VAR sarah_kidnapped = false
VAR player_reputation = 0
VAR days_passed = 0
VAR village_food_supply = 100

=== marcus_desperate_plea ===
// Conditionals check world state
{ sarah_kidnapped and marcus_relationship > 30:
    Marcus grabs your arm, eyes red from crying.
    
    "You're the only one I trust. Please... find Sarah.
    The guards won't help. They're useless!"
    
    + [I'll help you] 
        ~ marcus_relationship += 20
        ~ quest_rescue_sarah = true
        -> accept_rescue_quest
        
    + [I'm sorry, I can't]
        ~ marcus_relationship -= 50
        ~ marcus_desperation += 30
        -> refuse_quest
- else:
    // Conditions not met - different conversation
    Marcus barely acknowledges you.
    -> END
}
```

**Key Features:**
- `~` symbol modifies variables
- `{ condition: text }` shows text only if condition met
- Tracks NPC emotions, relationships, quests
- **Syncs with your simulation!**

### 3. Quest Items as Keys (Citizen Sleeper Style)

```ink
VAR has_security_keycard = false
VAR has_hacking_skill = 2
VAR has_reputation_token = true
VAR has_combat_training = true

=== infiltrate_compound ===
The guarded compound looms before you.

// Options appear based on what player HAS
+ {has_security_keycard} [Use your keycard] â†’ swipe_keycard
    You swipe the stolen keycard. Click. The door opens.
    -> inside_compound
    
+ {has_hacking_skill >= 3} [Hack the electronic lock] â†’ requires_skill
    Your fingers fly across the keypad. The lock beeps green.
    -> inside_compound
    
+ {has_reputation_token} [Talk your way in] â†’ social_approach
    "I'm here on behalf of the Council."
    The guard nods and steps aside.
    -> inside_compound
    
+ {has_combat_training} [Fight your way in] â†’ aggressive_approach
    You draw your weapon. Time to do this the hard way.
    -> combat_entrance
    
+ [Try to sneak in] â†’ stealth_attempt
    You look for a way around...
    -> stealth_check
```

**Perfect for:**
- Gated content (need items/skills/reputation)
- Multiple solution paths
- Citizen Sleeper-style "cycle" tokens
- Dynamic options based on player build

### 4. NPCs Remember Everything

```ink
=== marcus_later_conversation ===
// Different responses based on past choices
{
    - stole_from_marcus:
        "YOU!" Marcus spits. "I know what you did. GET OUT!"
        ~ guard_called = true
        -> thrown_out
        
    - saved_sarah:
        "My friend! My hero!" Marcus beams.
        "Anything you need, it's yours. Always."
        -> marcus_loyal
        
    - refused_rescue_quest:
        Marcus turns away coldly.
        "I asked for your help once. Never again."
        -> cold_shoulder
        
    - helped_with_forge:
        "Good to see you. Need more work?"
        -> friendly_conversation
        
    - else:
        "Oh, hello again."
        -> normal_conversation
}
```

**Features:**
- Labels track every choice made
- Branching based on player history
- Grudges, alliances, betrayals persist
- **True consequences that last**

---

## ðŸ”— INTEGRATING INK WITH YOUR LIVING WORLD

### Architecture Overview

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                  VIBEMASTER SYSTEM                      â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚                                                          â”‚
â”‚  Voice Input                                             â”‚
â”‚      â†“                                                   â”‚
â”‚  VibeMaster Studio (generates Ink scripts)               â”‚
â”‚      â†“                                                   â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”         â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”          â”‚
â”‚  â”‚ Ink Scripts  â”‚ â†syncâ†’  â”‚ Living World    â”‚          â”‚
â”‚  â”‚ (.ink files) â”‚         â”‚ Simulation      â”‚          â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜         â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜          â”‚
â”‚      â†“                            â†“                      â”‚
â”‚  Inkjs Runtime              NPC AI & Economy            â”‚
â”‚      â†“                            â†“                      â”‚
â”‚  Player Choices  â”€â”€affectsâ†’  World Events               â”‚
â”‚      â†“                            â†“                      â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”                   â”‚
â”‚  â”‚  Emergent Narrative Generation   â”‚                   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                   â”‚
â”‚                    â†“                                     â”‚
â”‚          Unique Story Every Time                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

### The Bridge: TypeScript/JavaScript

```typescript
// Connects Ink to your Living World Simulation

interface InkWorldBridge {
  inkStory: InkStory;
  worldState: LivingWorldState;
  
  // Sync simulation â†’ Ink
  pushWorldStateToInk(): void;
  
  // Sync Ink â†’ simulation  
  pullInkToWorldState(): void;
  
  // Check what conversations are available
  getAvailableDialogues(): DialogueNode[];
}

class InkWorldBridge implements InkWorldBridge {
  private inkStory: Story  // from inkjs
  private worldState: LivingWorldState
  
  // Called before showing dialogue
  pushWorldStateToInk() {
    const npcs = this.worldState.getAllNPCs()
    
    // Push NPC states to Ink variables
    npcs.forEach(npc => {
      this.inkStory.variablesState[`${npc.id}_relationship`] = 
        npc.relationshipWithPlayer
        
      this.inkStory.variablesState[`${npc.id}_emotion`] = 
        npc.currentEmotion
        
      this.inkStory.variablesState[`${npc.id}_needs_food`] = 
        npc.needs.food < 30
        
      this.inkStory.variablesState[`${npc.id}_desperate`] = 
        npc.desperation > 70
    })
    
    // Push world states
    this.inkStory.variablesState['village_food_supply'] = 
      this.worldState.economy.getFoodSupply()
      
    this.inkStory.variablesState['days_passed'] = 
      this.worldState.time.getCurrentDay()
      
    this.inkStory.variablesState['player_reputation'] = 
      this.worldState.player.reputation
      
    // Push active quests
    const quests = this.worldState.getActiveQuests()
    quests.forEach(quest => {
      this.inkStory.variablesState[`quest_${quest.id}_active`] = true
      this.inkStory.variablesState[`quest_${quest.id}_progress`] = 
        quest.progress
    })
    
    // Push quest items (Citizen Sleeper style)
    const inventory = this.worldState.player.inventory
    inventory.forEach(item => {
      this.inkStory.variablesState[`has_${item.id}`] = true
    })
  }
  
  // Called after dialogue choice made
  pullInkToWorldState() {
    // Update NPC relationships from Ink changes
    const npcs = this.worldState.getAllNPCs()
    
    npcs.forEach(npc => {
      const inkRelationship = 
        this.inkStory.variablesState[`${npc.id}_relationship`]
      
      if (inkRelationship !== undefined) {
        npc.relationshipWithPlayer = inkRelationship
      }
    })
    
    // Check for new quests activated in Ink
    const inkVars = this.inkStory.variablesState
    Object.keys(inkVars).forEach(key => {
      if (key.startsWith('quest_') && key.endsWith('_active')) {
        const questId = key.replace('quest_', '').replace('_active', '')
        if (inkVars[key] === true) {
          this.worldState.activateQuest(questId)
        }
      }
    })
  }
  
  // Determine which Ink knots are accessible now
  getAvailableDialogues(): string[] {
    this.pushWorldStateToInk()
    
    const available: string[] = []
    
    // Check each NPC's main dialogue knot
    const npcs = this.worldState.getAllNPCs()
    
    npcs.forEach(npc => {
      // Can we talk to this NPC?
      if (npc.isNearPlayer() && npc.isConscious()) {
        available.push(`${npc.id}_main`)
      }
      
      // Special dialogues based on conditions
      if (npc.id === 'marcus' && 
          this.inkStory.variablesState['sarah_kidnapped']) {
        available.push('marcus_desperate_plea')
      }
      
      // Emergent dialogues from simulation
      if (npc.currentGoal?.type === 'ask_for_help' &&
          npc.relationshipWithPlayer > 30) {
        available.push(`${npc.id}_asks_favor`)
      }
    })
    
    return available
  }
}
```

---

## ðŸŽ® VOICE â†’ INK GENERATION PIPELINE

### VibeMaster Studio Integration

```typescript
// In your VibeMaster Studio

interface InkGenerationRequest {
  voiceInput: string;
  characterName: string;
  characterTraits: string[];
  worldContext: WorldStateSnapshot;
}

async function generateInkScript(
  request: InkGenerationRequest
): Promise<string> {
  // Send to Claude
  const prompt = `
Generate an Ink script for this character:

Voice input: "${request.voiceInput}"
Character: ${request.characterName}
Traits: ${request.characterTraits.join(', ')}

Current world state:
- Food supply: ${request.worldContext.foodSupply}
- Player reputation: ${request.worldContext.playerReputation}
- Active conflicts: ${request.worldContext.activeConflicts.join(', ')}

Generate Ink script with:
1. Variables for character state
2. Main conversation node
3. Conditional branches based on world state
4. Options that affect relationships
5. Integration with living world simulation
`

  const response = await callClaudeAPI(prompt)
  return response.inkScript
}
```

### Example Voice Input â†’ Ink Output

**Voice Input:**
```
"This is Marcus the blacksmith. He's gruff but has a heart of gold. 
He deeply loves his teenage daughter Sarah. Marcus hates corrupt 
officials and doesn't trust the town guards. If his daughter is 
kidnapped, he becomes desperate and will beg the player for help. 
If the player saves Sarah, Marcus becomes a loyal ally forever. 
If the player refuses to help, Marcus becomes bitter and hostile."
```

**Generated Ink Script:**
```ink
// Marcus the Blacksmith
// Generated by VibeMaster Studio

// ============================================
// VARIABLES
// ============================================

VAR marcus_relationship = 0
VAR marcus_emotion = "neutral"  // neutral, happy, angry, desperate, grateful
VAR marcus_knows_player = false
VAR marcus_loyalty = 0

// Daughter
VAR sarah_status = "safe"  // safe, missing, rescued, dead
VAR sarah_kidnapped = false
VAR days_since_kidnapping = 0

// Player interactions
VAR player_helped_marcus = false
VAR player_refused_help = false
VAR player_saved_sarah = false

// World state (synced from simulation)
VAR guard_corruption = 75
VAR player_reputation = 0

// ============================================
// MAIN CONVERSATION HUB
// ============================================

=== marcus_main ===
{
    // DESPERATE STATE: Sarah kidnapped
    - sarah_kidnapped and not player_refused_help:
        -> marcus_desperate_plea
        
    // GRATEFUL STATE: Sarah rescued
    - player_saved_sarah:
        -> marcus_grateful
        
    // HOSTILE STATE: Player refused to help
    - player_refused_help:
        -> marcus_hostile
        
    // FRIENDLY STATE: Good relationship
    - marcus_relationship > 50:
        -> marcus_friendly
        
    // FIRST MEETING
    - not marcus_knows_player:
        -> marcus_first_meeting
        
    // DEFAULT STATE
    - else:
        -> marcus_normal
}

// ============================================
// FIRST MEETING
// ============================================

=== marcus_first_meeting ===
~ marcus_knows_player = true

A muscular man works at the forge, hammer ringing against hot metal.
He looks up briefly, sizing you up with a practiced eye.

"Marcus. Blacksmith." He grunts, returning to his work.
"Need something forged, or just passing through?"

+ [Ask about his work]
    -> ask_about_smithing
+ [Ask about the village]
    -> ask_about_village
+ [Introduce yourself properly]
    ~ marcus_relationship += 10
    -> proper_introduction
+ [Leave]
    "Right. Busy day."
    -> END

=== ask_about_smithing ===
"Been working this forge since I was twelve. My father's before me,
his father before him." 

Marcus wipes sweat from his brow.

"Best steel in three counties. That's not bragging, that's fact."

~ marcus_relationship += 5

+ [Impressive]
    -> marcus_warms_up
+ [Continue talking]
    -> marcus_first_meeting
+ [Leave]
    -> END

=== proper_introduction ===
You introduce yourself properly, explaining your background.

Marcus sets down his hammer, giving you his full attention.

"Alright then. Good to meet you proper." 

He extends a calloused hand.

~ marcus_relationship += 10

+ [Shake his hand]
    -> marcus_warms_up
    
=== marcus_warms_up ===
Marcus's expression softens slightly.

"Not many folks take time for courtesy these days. I appreciate that."

He glances toward the back room where you hear someone humming.

"That's my daughter Sarah. She helps with the books, deliveries.
Smart as a whip, that one. Pride of my life."

~ marcus_relationship += 5

+ [She sounds wonderful]
    ~ marcus_relationship += 10
    "She is. Everything good in this world."
    -> marcus_first_meeting
    
+ [Continue talking]
    -> marcus_first_meeting

// ============================================
// DESPERATE STATE: SARAH KIDNAPPED
// ============================================

=== marcus_desperate_plea ===
~ marcus_emotion = "desperate"
~ days_since_kidnapping += 1

{ days_since_kidnapping == 1:
    Marcus looks like he hasn't slept. His forge is cold.
    
    When he sees you, hope flares in his bloodshot eyes.
- else:
    Marcus is even more haggard than before. Time is running out.
}

"Thank the gods you're here." His voice cracks.

"Sarahâ€”they took her. Three days ago. Bandits from the hills.
Left a ransom note." He crumples a piece of paper in his fist.

"The guard captain won't help. Says it's 'outside jurisdiction.'
LIES! { guard_corruption > 50: He's in their pocket. Everyone knows it.}"

He grabs your arm desperately.

"You're the only one I can trust. { player_reputation > 50: Everyone 
says you're capable. Says you get things done.} Please. I'll give 
you everything I have. My forge, my savings, my life. Just bring 
her back."

+ [I'll help you]
    -> accept_rescue_quest
    
+ [I'm sorry, I can't]
    -> refuse_marcus_help
    
+ [Tell me more]
    -> get_rescue_details

=== accept_rescue_quest ===
~ marcus_relationship += 50
~ marcus_emotion = "hopeful"
~ player_helped_marcus = true
~ quest_rescue_sarah = true

Marcus nearly collapses with relief.

"Thank you. Thank you. I... I don't have words."

He wipes his eyes roughly.

"The bandits are camped in the old quarry, north of here. 
Their leader is a woman named Ravenâ€”ruthless, clever. 
She'll have guards posted."

He pulls out a wrapped bundle from behind the forge.

"Take this." 

{ marcus_loyalty < 50:
    It's a well-made sword, clearly expensive.
    ~ player_inventory_marcus_sword = true
- else:
    It's a masterwork blade, the finest you've ever seen.
    "I made this for the Duke. He can wait."
    ~ player_inventory_masterwork_sword = true
}

"Bring her home. That's all I ask."

-> END

=== refuse_marcus_help ===
~ marcus_relationship = -100
~ marcus_emotion = "betrayed"
~ player_refused_help = true
~ marcus_desperation += 50

Marcus's face hardens like cooling steel.

"I see." His voice is cold. Dead.

"I thought... I thought you were different. But you're like 
all the rest. USELESS!"

He turns away.

"Get out. I'll save her myself. Or die trying."

// CONSEQUENCE: Marcus will attempt rescue alone
// Your simulation can handle what happens next
~ marcus_solo_rescue_attempt = true

-> END

=== get_rescue_details ===
"They're in the old quarry. North, past the miller's road.
Maybe a dozen of them, all armed."

"Their leaderâ€”woman named Raven. She's smart. Dangerous.
This isn't her first time."

He shows you the ransom note.

"They want 500 gold. I don't have it. Took my life savings 
to build this forge. Even if I sold everything..."

He trails off hopelessly.

+ [I'll help you]
    -> accept_rescue_quest
    
+ [I'm sorry, I can't]
    -> refuse_marcus_help

// ============================================
// GRATEFUL STATE: SARAH RESCUED
// ============================================

=== marcus_grateful ===
~ marcus_emotion = "grateful"
~ marcus_loyalty = 100

{ player_saved_sarah and marcus_loyalty < 100:
    Marcus embraces you like family.
    
    "You brought her home. You brought my little girl home."
    
    His voice is thick with emotion.
    
    "Everything I have, everything I amâ€”it's yours. Always."
    
    ~ marcus_loyalty = 100
}

"Friend. Noâ€”family. What do you need?"

+ [I need equipment]
    -> marcus_shop_free
    
+ [I need information]
    -> marcus_information
    
+ [Just saying hello]
    "Always got time for you."
    -> friendly_chat
    
+ [Leave]
    "Come back anytime. My home is your home."
    -> END

=== marcus_shop_free ===
"Take whatever you need. Seriously. No charge. Ever."

He gestures to his finest work.

"I mean it. You saved my daughter. I can never repay that.
But I can make sure you're properly equipped."

// Grant access to best equipment
~ player_marcus_free_equipment = true

-> marcus_grateful

// ============================================
// HOSTILE STATE: PLAYER REFUSED
// ============================================

=== marcus_hostile ===
~ marcus_emotion = "hostile"

{ sarah_status == "dead":
    Marcus won't even look at you.
    
    "She's dead. My Sarah is dead. And YOUâ€”"
    
    His hand moves toward his hammer.
    
    "Get out. Before I do something I'll regret."
    
    -> END
- else:
    "I asked you for help. Once. ONCE."
    
    Marcus's voice is bitter as ash.
    
    "You turned your back. So now I turn mine."
    
    He won't speak to you.
    
    -> END
}

// ============================================
// NORMAL STATES
// ============================================

=== marcus_normal ===
"Need something?"

+ [Buy equipment]
    -> marcus_shop
+ [Ask about work]
    -> general_chat
+ [Leave]
    -> END

=== marcus_friendly ===
"Good to see you!"

{ marcus_relationship > 80:
    "Sarah asks about you, you know. Says you should come 
    by for dinner sometime."
}

+ [Buy equipment]
    -> marcus_shop_discount
+ [Chat]
    -> friendly_chat
+ [Leave]
    -> END

=== marcus_shop ===
"Standard prices. Quality work."

// Regular shop interaction
-> END

=== marcus_shop_discount ===
"For you? Friends and family pricing."

// 20% discount
-> END

=== friendly_chat ===
You chat with Marcus about village happenings, his work, his daughter.

~ marcus_relationship += 2

-> marcus_main
```

---

## ðŸŒ EMERGENT NARRATIVE EXAMPLES

### Example 1: The Cascading Consequences

```ink
// PLAYER IGNORES BAKER'S BROKEN OVEN (Day 1)

=== day_1_baker ===
The baker mentions his oven broke down last night.

+ [Offer to help fix it]
    ~ baker_relationship += 20
    ~ village_food_supply += 10
    -> fix_oven
    
+ [Ignore the problem]
    ~ baker_desperation += 10
    // CONSEQUENCE STARTS
    -> day_2_consequences

// DAY 2: Food shortage begins
=== day_2_consequences ===
~ village_food_supply -= 20
~ days_passed += 1

The baker's shop is closed today. You notice longer lines 
at the other bakery.

Bread prices have doubled.

~ village_unrest += 10

-> day_3_consequences

// DAY 3: Economy destabilizes
=== day_3_consequences ===
~ village_food_supply -= 20
~ days_passed += 1
~ village_unrest += 15

{ village_food_supply < 50:
    Angry crowds gather in the market square.
    
    "Why is bread so expensive?"
    "My family is going hungry!"
    
    -> day_4_consequences
}

// DAY 4: Baker closes permanently
=== day_4_consequences ===
~ baker_business_failed = true
~ village_food_supply -= 30
~ village_unrest += 20
~ days_passed += 1

The baker's shop has a "CLOSED" sign.

Through the window, you see him packing up. Broken.

{ marcus_knows_player:
    Marcus stops you on the street.
    
    "You know, you could've helped him fix that oven.
    Now we're all paying the price."
    
    ~ marcus_relationship -= 10
}

-> day_5_riot

// DAY 5: Riot breaks out
=== day_5_riot ===
~ days_passed += 1
~ village_unrest = 100

A full riot erupts in the town square.

Someone points at you. "THIS IS YOUR FAULT! You could've helped!"

{ helped_guard_captain in past:
    The guard captain remembers you helped him once.
    
    "I'll handle this. But you owe me."
    
    -> guards_save_you
- else:
    The guards don't intervene. You're on your own.
    
    -> mob_consequences
}
```

### Example 2: NPC Goals Driving Quests

```ink
// Your simulation detects: Marcus is desperate + Player nearby + Player has reputation

=== marcus_emergency_spawn ===
// This conversation only exists because simulation created it

{ marcus_desperation > 80 
  and player_reputation > 30 
  and player_near_marcus 
  and sarah_kidnapped:
    
    // EMERGENT QUEST - not scripted!
    "Wait!" Marcus runs up to you, breathless.
    
    "I need to talk to you. It's urgent. About Sarah."
    
    + [Listen to him]
        -> marcus_desperate_plea
    + [Not now]
        ~ marcus_relationship -= 20
        "Please... I'm begging you."
        + + [Alright, tell me]
            -> marcus_desperate_plea
        + + [I'm sorry, I can't]
            -> refuse_marcus_help
}
```

### Example 3: Multiple NPCs Interacting

```ink
// Your simulation: Marcus attempts solo rescue â†’ captured by bandits
// Now BOTH Sarah and Marcus need rescuing

=== bandit_camp_both_captives ===
{ marcus_solo_rescue_attempt and not player_helped_marcus:
    
    You infiltrate the bandit camp.
    
    In separate cages, you see Sarah... and Marcus.
    
    Raven laughs. "The fool tried to rescue his daughter alone.
    Now I have leverage on the whole village."
    
    + {player_stealth_skill >= 3} [Sneak them both out]
        -> rescue_both
        
    + {has_backup_team} [Signal your team]
        -> rescue_with_help
        
    + [You can only save one]
        -> impossible_choice
}

=== impossible_choice ===
You only have seconds before the guards return.

You can only free one cage.

+ [Free Sarah]
    ~ sarah_status = "rescued"
    ~ marcus_status = "captured"
    ~ player_guilt = 100
    
    "No! Take my daughter! Save her!"
    
    Sarah is sobbing as you carry her away.
    
    -> return_without_marcus
    
+ [Free Marcus]
    ~ marcus_status = "rescued"
    ~ sarah_status = "still_captive"
    ~ marcus_guilt = 100
    
    "NO! Sarah! SARAH!"
    
    Marcus fights you as you drag him away.
    
    -> marcus_breakdown
```

---

## ðŸŽ¨ CITIZEN SLEEPER STYLE SYSTEMS

### Clocks & Timers

```ink
VAR rescue_timer = 5  // Days until Sarah is moved/killed
VAR investigation_progress = 0
VAR clues_found = 0

=== search_for_sarah ===
{ rescue_timer > 0:
    You have {rescue_timer} days left.
    
    + {investigation_progress < 3} [Search thoroughly]
        ~ investigation_progress += 1
        ~ rescue_timer -= 1
        ~ clues_found += 1
        
        You find {clues_found == 1: a torn piece of fabric|clues_found == 2: fresh tracks|signs of a struggle}.
        
        { investigation_progress >= 3:
            You know where they're keeping her!
            -> found_location
        - else:
            Keep searching...
            -> search_for_sarah
        }
    
    + [Rush to save her now]
        { investigation_progress >= 3:
            -> rescue_well_prepared
        - else:
            -> rescue_unprepared
        }
- else:
    Too late. They've moved her.
    -> sarah_moved
}
```

### Dice Rolls / Skill Checks

```ink
VAR player_stealth = 5
VAR player_combat = 3
VAR player_persuasion = 7

=== sneak_past_guards ===
You need to get past the guards.

+ {player_stealth >= 5} [Sneak past] â†’ SUCCESS
    Your training pays off. You slip by unseen.
    -> inside_compound
    
+ {player_combat >= 6} [Fight through] â†’ LOCKED (need more skill)
    // Option doesn't appear - skill too low
    
+ {player_persuasion >= 7} [Talk your way past] â†’ SUCCESS
    "I'm with the merchant guild. Here to inspect shipments."
    They believe you.
    -> inside_compound
    
+ [Try to sneak anyway] â†’ RISKY
    -> stealth_check_difficult
```

### Multiple Paths with Consequences

```ink
=== rescue_approach ===
How will you rescue Sarah?

+ {player_stealth >= 5} [Stealth approach] â†’ QUIET
    ~ approach_method = "stealth"
    -> sneak_rescue
    
+ {has_backup} [Assault the camp] â†’ LOUD
    ~ approach_method = "assault"
    ~ bandits_alerted = true
    -> full_assault
    
+ {player_persuasion >= 7 and has_money >= 500} [Pay the ransom] â†’ PEACEFUL
    ~ approach_method = "ransom"
    ~ marcus_in_debt = true
    -> negotiate_release
    
+ [Infiltrate and negotiate] â†’ DIPLOMATIC
    ~ approach_method = "diplomacy"
    -> talk_to_raven

// Each path has different consequences
=== sneak_rescue ===
You rescue Sarah without the bandits knowing who did it.

~ sarah_rescued = true
~ bandits_dont_know_player = true
// Bandits might seek revenge on village later

-> rescue_success

=== full_assault ===
You storm the camp with your team.

~ sarah_rescued = true
~ bandits_destroyed = true
~ player_reputation += 30
// But several bandits escaped - future revenge plot

-> rescue_success_violent
```

---

## ðŸ“Š VIBEMASTER STUDIO INTEGRATION

### Voice â†’ Ink Workflow

```javascript
// In VibeMaster Studio UI

class InkScriptGenerator {
  async generateFromVoice(audioBlob, contextData) {
    // 1. Transcribe voice
    const transcript = await this.sttService.transcribe(audioBlob)
    
    // 2. Parse with Claude
    const parseRequest = {
      transcript: transcript,
      format: "ink_script",
      context: {
        existingCharacters: contextData.characters,
        worldState: contextData.simulation,
        style: "citizen_sleeper" // Node-based with conditions
      }
    }
    
    const parsed = await this.claudeService.parse(parseRequest)
    
    // 3. Validate Ink syntax
    const validation = this.validateInkScript(parsed.inkScript)
    
    if (!validation.valid) {
      console.error("Ink syntax errors:", validation.errors)
      // Try again with corrections
      return this.fixInkScript(parsed.inkScript, validation.errors)
    }
    
    // 4. Return complete Ink file
    return {
      inkScript: parsed.inkScript,
      metadata: {
        characters: parsed.characters,
        variables: parsed.variables,
        knots: parsed.knots,
        entryPoints: parsed.entryPoints
      }
    }
  }
  
  validateInkScript(script) {
    // Use inklecate or inkjs to validate
    try {
      const story = new Story(script)
      return { valid: true }
    } catch (error) {
      return { 
        valid: false, 
        errors: [error.message] 
      }
    }
  }
}
```

### Export Options

```javascript
// Export formats for different engines

class InkExporter {
  exportForDecentraland(inkScript, metadata) {
    return {
      inkJson: this.compileToJson(inkScript),
      typeScriptTypes: this.generateTypes(metadata),
      integrationCode: this.generateDecentralandBridge(metadata)
    }
  }
  
  exportForUnity(inkScript, metadata) {
    return {
      inkFile: inkScript,
      unityPackage: this.createUnityPackage(metadata)
    }
  }
  
  exportForWeb(inkScript, metadata) {
    return {
      inkJson: this.compileToJson(inkScript),
      htmlPlayer: this.generateWebPlayer(metadata),
      standalone: true
    }
  }
}
```

---

## ðŸš€ IMPLEMENTATION ROADMAP

### Phase 1: Core Integration (Week 1)
- [ ] Install inkjs in project
- [ ] Create InkWorldBridge class
- [ ] Test basic variable syncing
- [ ] Create simple test conversation
- [ ] Verify Ink â†’ Simulation â†’ Ink loop

### Phase 2: VibeMaster Integration (Week 2)
- [ ] Add Ink generation to Claude prompts
- [ ] Create Ink syntax validator
- [ ] Build Ink editor in VibeMaster Studio
- [ ] Test voice â†’ Ink â†’ JSON pipeline
- [ ] Create Ink template library

### Phase 3: Advanced Features (Week 3)
- [ ] Implement emergent dialogue detection
- [ ] Add Citizen Sleeper-style clocks
- [ ] Create quest item system
- [ ] Build NPC memory system
- [ ] Test complex branching narratives

### Phase 4: Polish & Testing (Week 4)
- [ ] Create example game using system
- [ ] Write comprehensive documentation
- [ ] Build tutorial / demo scenes
- [ ] Performance optimization
- [ ] Community feedback & iteration

---

## ðŸ”§ TECHNICAL SETUP

### Installing Inkjs

```bash
# For Node.js / Decentraland project
npm install inkjs

# Or for browser
<script src="https://cdn.jsdelivr.net/npm/inkjs/dist/ink.js"></script>
```

### Basic Usage

```typescript
import { Story } from 'inkjs'

// Load compiled Ink JSON
const inkJson = await fetch('/stories/marcus.json').then(r => r.json())
const story = new Story(inkJson)

// Set variables from your simulation
story.variablesState['marcus_relationship'] = 30
story.variablesState['sarah_kidnapped'] = true

// Get current text
while (story.canContinue) {
  const text = story.Continue()
  console.log(text)
}

// Get choices
story.currentChoices.forEach(choice => {
  console.log(`${choice.index}: ${choice.text}`)
})

// Make a choice
story.ChooseChoiceIndex(0)

// Read variables after choice
const newRelationship = story.variablesState['marcus_relationship']
console.log(`Relationship changed to: ${newRelationship}`)
```

---

## ðŸ“š RESOURCES

### Official Ink Resources
- **Ink GitHub**: https://github.com/inkle/ink
- **Inky Editor**: https://github.com/inkle/inky (Download & test your scripts)
- **Writing with Ink Guide**: https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md
- **inkjs (JavaScript runtime)**: https://github.com/y-lohse/inkjs

### Community Resources
- **Ink Discord**: Join for help & examples
- **Heaven's Vault GDC Talk**: How inkle uses Ink for 3D games
- **80 Days Postmortem**: Ink in a complex open-world game

### VibeMaster Specific
- See `VIBEMASTER_PROJECT_PRIMER.md` for living world architecture
- See `living_world_simulation_foundation` for NPC AI design
- See `VIBEMASTER_CUSTOM_INSTRUCTIONS.md` for Decentraland constraints

---

## ðŸŽ¯ SUCCESS CRITERIA

### Ink integration is successful when:

âœ… Voice input generates valid Ink scripts  
âœ… Ink variables sync with simulation state  
âœ… NPCs respond to emergent world events  
âœ… Player choices create real consequences  
âœ… Conversations feel dynamic and reactive  
âœ… Multiple playthroughs tell different stories  
âœ… No manual dialogue writing needed  
âœ… Export works for Decentraland  

---

## ðŸ’¡ KEY INSIGHTS

### Why This Works

1. **Separation of Concerns**
   - Ink = conversation structure & flow
   - Simulation = "why does this conversation exist?"
   - Perfect division of responsibility

2. **Text-First Philosophy**
   - Write naturally, add logic later
   - Matches VibeMaster voice-driven approach
   - Non-programmers can write Ink

3. **Variables as Bridge**
   - Simple key-value pairs
   - Easy to sync between systems
   - No complex integration needed

4. **Proven at Scale**
   - inkle shipped millions of words with Ink
   - Battle-tested in real games
   - Handles complexity gracefully

---

## ðŸ”® FUTURE POSSIBILITIES

### Advanced Features

- **Multi-NPC conversations**: Ink v3.0 parallel story flows
- **Procedural dialogue**: Generate Ink from templates
- **Voice acting integration**: Ink â†’ audio line mapping
- **Localization**: Ink supports multiple languages
- **Save/Load**: Ink state serialization
- **Analytics**: Track player choices for iteration

### Platform Expansion

- **Decentraland** (primary target)
- **Unity** (via ink-unity-integration)
- **Unreal** (via Inkpot plugin)
- **Web** (pure JavaScript)
- **Mobile** (React Native + inkjs)

---

## ðŸ“ž QUICK REFERENCE

### Common Ink Syntax

```ink
// Comments
/* Multi-line
   comments */

// Variables
VAR name = "Marcus"
VAR relationship = 0
VAR has_key = false

// Change variables
~ relationship += 10
~ has_key = true

// Knots (like functions)
=== knot_name ===
Text here
-> next_knot

// Choices
+ [Choice text] -> destination
* [One-time choice] -> destination

// Sticky choices (repeatable)
+ [Choice that stays]
  Text
  -> back_to_menu

// Conditional text
{ variable > 10:
    This shows if true
- else:
    This shows if false
}

// Conditional choices
+ {has_key} [Unlock door]
+ {strength >= 5} [Break down door]

// Diverts (goto)
-> knot_name

// Gathering point
- gather_here

// End story
-> END
```

---

## ðŸŽ‰ CONCLUSION

**Ink + VibeMaster + Living World = Revolutionary**

You get:
- Professional dialogue system (Ink)
- Voice-driven content creation (VibeMaster)
- Emergent narratives (Your simulation)
- Rapid iteration (Voice â†’ Test â†’ Ship)
- Proven technology (Used in shipped games)
- Open source (MIT license, free forever)

**Start prototyping today. Ship faster tomorrow.**

---

**Next Steps:**
1. Download Inky editor
2. Write test conversation
3. Export to JSON
4. Test in browser with inkjs
5. Integrate with your simulation
6. Add to VibeMaster pipeline

**Questions? Check the Ink Discord or VibeMaster docs.**

---

*Last Updated: November 1, 2025*  
*Document Version: 1.0*  
*Part of VibeMaster Project Documentation*
