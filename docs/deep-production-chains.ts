// /home/claude/deep-production-chains.ts
// Deep Production Chain System - Enables Lifestyle Index through complex crafting

/**
 * RESOURCE TYPES - Expanded from 8 to 40+ types
 */

// RAW MATERIALS (Depth 0-1)
export type RawMaterial = 
  | 'wood' | 'stone' | 'iron_ore' | 'copper_ore' | 'tin_ore' | 'gold_ore'
  | 'silver_ore' | 'coal' | 'clay' | 'sand' | 'wheat' | 'barley' | 'hops'
  | 'grapes' | 'berries' | 'herbs' | 'wool' | 'cotton' | 'flax' | 'leather_hide'
  | 'gems' | 'obsidian' | 'marble' | 'limestone' | 'saltpeter' | 'sulfur';

// PROCESSED MATERIALS (Depth 2-3)
export type ProcessedMaterial = 
  | 'lumber' | 'planks' | 'cut_stone' | 'iron_ingots' | 'copper_ingots'
  | 'bronze_ingots' | 'steel_ingots' | 'gold_ingots' | 'silver_ingots'
  | 'thread' | 'cloth' | 'leather' | 'parchment' | 'paper' | 'glass'
  | 'bricks' | 'mortar' | 'charcoal' | 'flour' | 'malt' | 'dye'
  | 'tanned_leather' | 'cured_hide';

// COMPONENTS (Depth 3-4)
export type Component = 
  | 'nails' | 'screws' | 'hinges' | 'locks' | 'gears' | 'springs'
  | 'wire' | 'chain' | 'rope' | 'canvas' | 'buttons' | 'buckles'
  | 'inlay' | 'veneer' | 'carved_detail' | 'enchantment_base'
  | 'weapon_blade' | 'weapon_hilt' | 'armor_plate' | 'padding';

// FINISHED GOODS (Depth 4-7)
export type FinishedGood = 
  | 'basic_tool' | 'quality_tool' | 'masterwork_tool'
  | 'basic_weapon' | 'quality_weapon' | 'masterwork_weapon' | 'enchanted_weapon'
  | 'basic_armor' | 'quality_armor' | 'masterwork_armor' | 'enchanted_armor'
  | 'simple_furniture' | 'quality_furniture' | 'luxury_furniture'
  | 'basic_clothing' | 'quality_clothing' | 'fine_clothing' | 'noble_attire'
  | 'basic_food' | 'quality_food' | 'gourmet_food' | 'feast'
  | 'simple_medicine' | 'potent_medicine' | 'miracle_cure'
  | 'basic_book' | 'illuminated_manuscript' | 'masterwork_tome';

export type ResourceType = RawMaterial | ProcessedMaterial | Component | FinishedGood;

/**
 * QUALITY TIERS
 */
export enum QualityTier {
  CRUDE = 0,        // Makeshift, barely functional
  BASIC = 1,        // Standard quality
  QUALITY = 2,      // Well-made
  MASTERWORK = 3,   // Expert craftsmanship
  LEGENDARY = 4     // Once-in-a-generation
}

/**
 * RECIPE STRUCTURE
 */
export interface RecipeRequirement {
  resource: ResourceType;
  amount: number;
  qualityMin?: QualityTier;  // If it matters
}

export interface SkillRequirement {
  skill: string;
  minLevel: number;
}

export interface TechRequirement {
  techId: string;
  reason: string;
}

export interface ProductionRecipe {
  id: string;
  name: string;
  produces: ResourceType;
  amount: number;
  quality: QualityTier;
  
  // Time & difficulty
  baseTimeHours: number;
  skillModifier: number;        // How much skill reduces time (0-1)
  
  // Requirements
  requires: RecipeRequirement[];
  skillsRequired: SkillRequirement[];
  techRequired?: TechRequirement[];
  toolsRequired?: string[];
  locationRequired?: string;    // 'forge', 'workshop', 'kitchen', etc.
  
  // Chain metadata
  chainDepth: number;           // How many steps from raw materials
  category: 'gathering' | 'processing' | 'crafting' | 'refining' | 'assembling';
  
  // Economic
  baseValue: number;
  marketDemand: 'low' | 'medium' | 'high' | 'luxury';
  
  // Special flags
  rare?: boolean;
  seasonal?: boolean;
  requiresSpecialization?: boolean;
}

/**
 * PRODUCTION CHAINS DATABASE
 */

// ============================================================================
// TIER 0: GATHERING (Depth 0)
// ============================================================================

export const GATHERING_RECIPES: ProductionRecipe[] = [
  {
    id: 'gather_berries',
    name: 'Gather Wild Berries',
    produces: 'berries',
    amount: 5,
    quality: QualityTier.BASIC,
    baseTimeHours: 2,
    skillModifier: 0.2,
    requires: [],
    skillsRequired: [],
    chainDepth: 0,
    category: 'gathering',
    baseValue: 2,
    marketDemand: 'low',
    seasonal: true
  },
  
  {
    id: 'gather_herbs',
    name: 'Gather Medicinal Herbs',
    produces: 'herbs',
    amount: 3,
    quality: QualityTier.BASIC,
    baseTimeHours: 3,
    skillModifier: 0.3,
    requires: [],
    skillsRequired: [{ skill: 'herbalism', minLevel: 10 }],
    chainDepth: 0,
    category: 'gathering',
    baseValue: 5,
    marketDemand: 'medium'
  },
  
  {
    id: 'mine_iron_ore',
    name: 'Mine Iron Ore',
    produces: 'iron_ore',
    amount: 3,
    quality: QualityTier.BASIC,
    baseTimeHours: 4,
    skillModifier: 0.3,
    requires: [],
    skillsRequired: [{ skill: 'mining', minLevel: 20 }],
    toolsRequired: ['pickaxe'],
    locationRequired: 'mine',
    chainDepth: 0,
    category: 'gathering',
    baseValue: 8,
    marketDemand: 'high'
  },
  
  {
    id: 'quarry_stone',
    name: 'Quarry Stone',
    produces: 'stone',
    amount: 5,
    quality: QualityTier.BASIC,
    baseTimeHours: 3,
    skillModifier: 0.2,
    requires: [],
    skillsRequired: [{ skill: 'stoneworking', minLevel: 10 }],
    toolsRequired: ['pickaxe'],
    locationRequired: 'quarry',
    chainDepth: 0,
    category: 'gathering',
    baseValue: 4,
    marketDemand: 'medium'
  }
];

// ============================================================================
// TIER 1: BASIC PRODUCTION (Depth 1-2)
// ============================================================================

export const BASIC_PRODUCTION_RECIPES: ProductionRecipe[] = [
  {
    id: 'chop_wood',
    name: 'Chop Wood',
    produces: 'wood',
    amount: 8,
    quality: QualityTier.BASIC,
    baseTimeHours: 2,
    skillModifier: 0.2,
    requires: [],
    skillsRequired: [],
    toolsRequired: ['axe'],
    chainDepth: 1,
    category: 'gathering',
    baseValue: 3,
    marketDemand: 'high'
  },
  
  {
    id: 'farm_wheat',
    name: 'Farm Wheat',
    produces: 'wheat',
    amount: 12,
    quality: QualityTier.BASIC,
    baseTimeHours: 6,
    skillModifier: 0.3,
    requires: [],
    skillsRequired: [{ skill: 'farming', minLevel: 10 }],
    toolsRequired: ['hoe', 'scythe'],
    locationRequired: 'farm',
    chainDepth: 1,
    category: 'gathering',
    baseValue: 4,
    marketDemand: 'high',
    seasonal: true
  },
  
  {
    id: 'produce_charcoal',
    name: 'Produce Charcoal',
    produces: 'charcoal',
    amount: 4,
    quality: QualityTier.BASIC,
    baseTimeHours: 8,
    skillModifier: 0.2,
    requires: [
      { resource: 'wood', amount: 10 }
    ],
    skillsRequired: [{ skill: 'charcoal_making', minLevel: 15 }],
    locationRequired: 'charcoal_pit',
    chainDepth: 2,
    category: 'processing',
    baseValue: 8,
    marketDemand: 'high'
  },
  
  {
    id: 'mill_flour',
    name: 'Mill Flour',
    produces: 'flour',
    amount: 10,
    quality: QualityTier.BASIC,
    baseTimeHours: 2,
    skillModifier: 0.1,
    requires: [
      { resource: 'wheat', amount: 12 }
    ],
    skillsRequired: [],
    locationRequired: 'mill',
    chainDepth: 2,
    category: 'processing',
    baseValue: 6,
    marketDemand: 'high'
  }
];

// ============================================================================
// TIER 2: INTERMEDIATE PROCESSING (Depth 2-3)
// ============================================================================

export const INTERMEDIATE_RECIPES: ProductionRecipe[] = [
  {
    id: 'smelt_iron_ingots',
    name: 'Smelt Iron Ingots',
    produces: 'iron_ingots',
    amount: 2,
    quality: QualityTier.BASIC,
    baseTimeHours: 3,
    skillModifier: 0.3,
    requires: [
      { resource: 'iron_ore', amount: 3 },
      { resource: 'charcoal', amount: 1 }
    ],
    skillsRequired: [{ skill: 'smelting', minLevel: 25 }],
    locationRequired: 'forge',
    chainDepth: 3,
    category: 'processing',
    baseValue: 25,
    marketDemand: 'high'
  },
  
  {
    id: 'create_bronze',
    name: 'Create Bronze Alloy',
    produces: 'bronze_ingots',
    amount: 2,
    quality: QualityTier.BASIC,
    baseTimeHours: 3,
    skillModifier: 0.3,
    requires: [
      { resource: 'copper_ore', amount: 3 },
      { resource: 'tin_ore', amount: 1 },
      { resource: 'charcoal', amount: 1 }
    ],
    skillsRequired: [{ skill: 'metalworking', minLevel: 20 }],
    techRequired: [{ techId: 'bronze_working', reason: 'Alloy knowledge' }],
    locationRequired: 'forge',
    chainDepth: 3,
    category: 'processing',
    baseValue: 30,
    marketDemand: 'medium'
  },
  
  {
    id: 'process_lumber',
    name: 'Process Lumber',
    produces: 'lumber',
    amount: 6,
    quality: QualityTier.BASIC,
    baseTimeHours: 2,
    skillModifier: 0.2,
    requires: [
      { resource: 'wood', amount: 8 }
    ],
    skillsRequired: [{ skill: 'carpentry', minLevel: 15 }],
    toolsRequired: ['saw'],
    locationRequired: 'sawmill',
    chainDepth: 2,
    category: 'processing',
    baseValue: 8,
    marketDemand: 'high'
  },
  
  {
    id: 'spin_thread',
    name: 'Spin Thread',
    produces: 'thread',
    amount: 4,
    quality: QualityTier.BASIC,
    baseTimeHours: 2,
    skillModifier: 0.2,
    requires: [
      { resource: 'wool', amount: 2 }
    ],
    skillsRequired: [{ skill: 'weaving', minLevel: 10 }],
    toolsRequired: ['spinning_wheel'],
    chainDepth: 2,
    category: 'processing',
    baseValue: 6,
    marketDemand: 'medium'
  },
  
  {
    id: 'weave_cloth',
    name: 'Weave Cloth',
    produces: 'cloth',
    amount: 3,
    quality: QualityTier.BASIC,
    baseTimeHours: 3,
    skillModifier: 0.3,
    requires: [
      { resource: 'thread', amount: 4 }
    ],
    skillsRequired: [{ skill: 'weaving', minLevel: 20 }],
    toolsRequired: ['loom'],
    locationRequired: 'workshop',
    chainDepth: 3,
    category: 'crafting',
    baseValue: 15,
    marketDemand: 'high'
  },
  
  {
    id: 'tan_leather',
    name: 'Tan Leather',
    produces: 'leather',
    amount: 2,
    quality: QualityTier.BASIC,
    baseTimeHours: 8,
    skillModifier: 0.2,
    requires: [
      { resource: 'leather_hide', amount: 3 }
    ],
    skillsRequired: [{ skill: 'leatherworking', minLevel: 15 }],
    locationRequired: 'tannery',
    chainDepth: 2,
    category: 'processing',
    baseValue: 20,
    marketDemand: 'medium'
  },
  
  {
    id: 'bake_bread',
    name: 'Bake Bread',
    produces: 'basic_food',
    amount: 8,
    quality: QualityTier.BASIC,
    baseTimeHours: 2,
    skillModifier: 0.2,
    requires: [
      { resource: 'flour', amount: 10 }
    ],
    skillsRequired: [{ skill: 'cooking', minLevel: 10 }],
    locationRequired: 'bakery',
    chainDepth: 3,
    category: 'crafting',
    baseValue: 10,
    marketDemand: 'high'
  }
];

// ============================================================================
// TIER 3: ADVANCED CRAFTING (Depth 3-4)
// ============================================================================

export const ADVANCED_CRAFTING_RECIPES: ProductionRecipe[] = [
  {
    id: 'forge_steel',
    name: 'Forge Steel',
    produces: 'steel_ingots',
    amount: 1,
    quality: QualityTier.QUALITY,
    baseTimeHours: 5,
    skillModifier: 0.4,
    requires: [
      { resource: 'iron_ingots', amount: 3 },
      { resource: 'charcoal', amount: 2 },
      { resource: 'limestone', amount: 1 }
    ],
    skillsRequired: [{ skill: 'advanced_metalworking', minLevel: 50 }],
    techRequired: [{ techId: 'steel_making', reason: 'Carburization process' }],
    locationRequired: 'advanced_forge',
    chainDepth: 4,
    category: 'refining',
    baseValue: 80,
    marketDemand: 'luxury',
    requiresSpecialization: true
  },
  
  {
    id: 'craft_iron_nails',
    name: 'Craft Iron Nails',
    produces: 'nails',
    amount: 20,
    quality: QualityTier.BASIC,
    baseTimeHours: 1,
    skillModifier: 0.1,
    requires: [
      { resource: 'iron_ingots', amount: 1 }
    ],
    skillsRequired: [{ skill: 'blacksmithing', minLevel: 15 }],
    locationRequired: 'forge',
    chainDepth: 4,
    category: 'crafting',
    baseValue: 2,
    marketDemand: 'high'
  },
  
  {
    id: 'craft_hinges',
    name: 'Craft Hinges',
    produces: 'hinges',
    amount: 4,
    quality: QualityTier.BASIC,
    baseTimeHours: 2,
    skillModifier: 0.2,
    requires: [
      { resource: 'iron_ingots', amount: 1 },
      { resource: 'nails', amount: 4 }
    ],
    skillsRequired: [{ skill: 'blacksmithing', minLevel: 25 }],
    locationRequired: 'forge',
    chainDepth: 5,
    category: 'crafting',
    baseValue: 15,
    marketDemand: 'medium'
  },
  
  {
    id: 'forge_basic_tool',
    name: 'Forge Basic Tool',
    produces: 'basic_tool',
    amount: 1,
    quality: QualityTier.BASIC,
    baseTimeHours: 3,
    skillModifier: 0.3,
    requires: [
      { resource: 'iron_ingots', amount: 2 },
      { resource: 'wood', amount: 1 }
    ],
    skillsRequired: [{ skill: 'blacksmithing', minLevel: 20 }],
    locationRequired: 'forge',
    chainDepth: 4,
    category: 'crafting',
    baseValue: 35,
    marketDemand: 'high'
  },
  
  {
    id: 'forge_quality_tool',
    name: 'Forge Quality Tool',
    produces: 'quality_tool',
    amount: 1,
    quality: QualityTier.QUALITY,
    baseTimeHours: 5,
    skillModifier: 0.4,
    requires: [
      { resource: 'steel_ingots', amount: 2 },
      { resource: 'lumber', amount: 1 }
    ],
    skillsRequired: [{ skill: 'blacksmithing', minLevel: 50 }],
    techRequired: [{ techId: 'steel_making', reason: 'Steel tools required' }],
    locationRequired: 'advanced_forge',
    chainDepth: 5,
    category: 'crafting',
    baseValue: 120,
    marketDemand: 'medium',
    requiresSpecialization: true
  },
  
  {
    id: 'forge_basic_weapon',
    name: 'Forge Basic Iron Weapon',
    produces: 'basic_weapon',
    amount: 1,
    quality: QualityTier.BASIC,
    baseTimeHours: 4,
    skillModifier: 0.3,
    requires: [
      { resource: 'iron_ingots', amount: 3 },
      { resource: 'wood', amount: 1 },
      { resource: 'leather', amount: 1 }
    ],
    skillsRequired: [{ skill: 'weaponsmithing', minLevel: 30 }],
    locationRequired: 'forge',
    chainDepth: 4,
    category: 'crafting',
    baseValue: 80,
    marketDemand: 'high'
  },
  
  {
    id: 'craft_simple_furniture',
    name: 'Craft Simple Furniture',
    produces: 'simple_furniture',
    amount: 1,
    quality: QualityTier.BASIC,
    baseTimeHours: 4,
    skillModifier: 0.3,
    requires: [
      { resource: 'lumber', amount: 6 },
      { resource: 'nails', amount: 10 }
    ],
    skillsRequired: [{ skill: 'carpentry', minLevel: 25 }],
    locationRequired: 'workshop',
    chainDepth: 4,
    category: 'crafting',
    baseValue: 50,
    marketDemand: 'medium'
  },
  
  {
    id: 'sew_basic_clothing',
    name: 'Sew Basic Clothing',
    produces: 'basic_clothing',
    amount: 1,
    quality: QualityTier.BASIC,
    baseTimeHours: 3,
    skillModifier: 0.3,
    requires: [
      { resource: 'cloth', amount: 3 },
      { resource: 'thread', amount: 2 }
    ],
    skillsRequired: [{ skill: 'tailoring', minLevel: 20 }],
    chainDepth: 4,
    category: 'crafting',
    baseValue: 40,
    marketDemand: 'high'
  },
  
  {
    id: 'brew_ale',
    name: 'Brew Ale',
    produces: 'quality_food',
    amount: 5,
    quality: QualityTier.QUALITY,
    baseTimeHours: 12,
    skillModifier: 0.2,
    requires: [
      { resource: 'barley', amount: 8 },
      { resource: 'hops', amount: 2 }
    ],
    skillsRequired: [{ skill: 'brewing', minLevel: 30 }],
    locationRequired: 'brewery',
    chainDepth: 3,
    category: 'crafting',
    baseValue: 25,
    marketDemand: 'high'
  }
];

// ============================================================================
// TIER 4: QUALITY GOODS (Depth 4-5)
// ============================================================================

export const QUALITY_GOODS_RECIPES: ProductionRecipe[] = [
  {
    id: 'forge_quality_weapon',
    name: 'Forge Quality Steel Weapon',
    produces: 'quality_weapon',
    amount: 1,
    quality: QualityTier.QUALITY,
    baseTimeHours: 8,
    skillModifier: 0.4,
    requires: [
      { resource: 'steel_ingots', amount: 4 },
      { resource: 'lumber', amount: 1 },
      { resource: 'leather', amount: 2 }
    ],
    skillsRequired: [{ skill: 'weaponsmithing', minLevel: 60 }],
    techRequired: [{ techId: 'steel_making', reason: 'Steel weapons' }],
    locationRequired: 'advanced_forge',
    chainDepth: 5,
    category: 'crafting',
    baseValue: 300,
    marketDemand: 'luxury',
    requiresSpecialization: true
  },
  
  {
    id: 'craft_quality_armor',
    name: 'Craft Quality Steel Armor',
    produces: 'quality_armor',
    amount: 1,
    quality: QualityTier.QUALITY,
    baseTimeHours: 12,
    skillModifier: 0.4,
    requires: [
      { resource: 'steel_ingots', amount: 8 },
      { resource: 'leather', amount: 4 },
      { resource: 'cloth', amount: 3 }
    ],
    skillsRequired: [{ skill: 'armorsmithing', minLevel: 65 }],
    techRequired: [{ techId: 'steel_making', reason: 'Steel armor plates' }],
    locationRequired: 'armory',
    chainDepth: 5,
    category: 'crafting',
    baseValue: 500,
    marketDemand: 'luxury',
    requiresSpecialization: true
  },
  
  {
    id: 'craft_quality_furniture',
    name: 'Craft Quality Furniture',
    produces: 'quality_furniture',
    amount: 1,
    quality: QualityTier.QUALITY,
    baseTimeHours: 8,
    skillModifier: 0.4,
    requires: [
      { resource: 'lumber', amount: 10 },
      { resource: 'nails', amount: 20 },
      { resource: 'hinges', amount: 2 },
      { resource: 'cloth', amount: 2 }
    ],
    skillsRequired: [{ skill: 'carpentry', minLevel: 55 }],
    locationRequired: 'workshop',
    chainDepth: 5,
    category: 'crafting',
    baseValue: 180,
    marketDemand: 'medium'
  },
  
  {
    id: 'sew_quality_clothing',
    name: 'Sew Quality Clothing',
    produces: 'quality_clothing',
    amount: 1,
    quality: QualityTier.QUALITY,
    baseTimeHours: 6,
    skillModifier: 0.4,
    requires: [
      { resource: 'cloth', amount: 5 },
      { resource: 'thread', amount: 4 },
      { resource: 'dye', amount: 1 },
      { resource: 'buttons', amount: 6 }
    ],
    skillsRequired: [{ skill: 'tailoring', minLevel: 50 }],
    chainDepth: 5,
    category: 'crafting',
    baseValue: 120,
    marketDemand: 'medium'
  },
  
  {
    id: 'prepare_quality_meal',
    name: 'Prepare Quality Meal',
    produces: 'quality_food',
    amount: 4,
    quality: QualityTier.QUALITY,
    baseTimeHours: 3,
    skillModifier: 0.3,
    requires: [
      { resource: 'wheat', amount: 3 },
      { resource: 'berries', amount: 2 },
      { resource: 'herbs', amount: 1 }
    ],
    skillsRequired: [{ skill: 'cooking', minLevel: 40 }],
    locationRequired: 'kitchen',
    chainDepth: 2,
    category: 'crafting',
    baseValue: 30,
    marketDemand: 'medium'
  },
  
  {
    id: 'craft_potent_medicine',
    name: 'Craft Potent Medicine',
    produces: 'potent_medicine',
    amount: 2,
    quality: QualityTier.QUALITY,
    baseTimeHours: 4,
    skillModifier: 0.4,
    requires: [
      { resource: 'herbs', amount: 4 },
      { resource: 'berries', amount: 2 }
    ],
    skillsRequired: [{ skill: 'alchemy', minLevel: 50 }],
    locationRequired: 'laboratory',
    chainDepth: 2,
    category: 'crafting',
    baseValue: 80,
    marketDemand: 'medium'
  }
];

// ============================================================================
// TIER 5: MASTERWORK (Depth 5-6)
// ============================================================================

export const MASTERWORK_RECIPES: ProductionRecipe[] = [
  {
    id: 'forge_masterwork_weapon',
    name: 'Forge Masterwork Weapon',
    produces: 'masterwork_weapon',
    amount: 1,
    quality: QualityTier.MASTERWORK,
    baseTimeHours: 16,
    skillModifier: 0.5,
    requires: [
      { resource: 'steel_ingots', amount: 6, qualityMin: QualityTier.QUALITY },
      { resource: 'lumber', amount: 2, qualityMin: QualityTier.QUALITY },
      { resource: 'leather', amount: 3, qualityMin: QualityTier.QUALITY },
      { resource: 'gems', amount: 1 },
      { resource: 'inlay', amount: 1 }
    ],
    skillsRequired: [{ skill: 'weaponsmithing', minLevel: 85 }],
    techRequired: [{ techId: 'steel_making', reason: 'Steel required' }],
    locationRequired: 'master_forge',
    chainDepth: 6,
    category: 'crafting',
    baseValue: 1200,
    marketDemand: 'luxury',
    requiresSpecialization: true,
    rare: true
  },
  
  {
    id: 'craft_masterwork_armor',
    name: 'Craft Masterwork Armor',
    produces: 'masterwork_armor',
    amount: 1,
    quality: QualityTier.MASTERWORK,
    baseTimeHours: 24,
    skillModifier: 0.5,
    requires: [
      { resource: 'steel_ingots', amount: 12, qualityMin: QualityTier.QUALITY },
      { resource: 'leather', amount: 6, qualityMin: QualityTier.QUALITY },
      { resource: 'cloth', amount: 4, qualityMin: QualityTier.QUALITY },
      { resource: 'chain', amount: 4 }
    ],
    skillsRequired: [{ skill: 'armorsmithing', minLevel: 90 }],
    techRequired: [{ techId: 'steel_making', reason: 'Steel armor' }],
    locationRequired: 'master_armory',
    chainDepth: 6,
    category: 'crafting',
    baseValue: 2000,
    marketDemand: 'luxury',
    requiresSpecialization: true,
    rare: true
  },
  
  {
    id: 'craft_luxury_furniture',
    name: 'Craft Luxury Furniture',
    produces: 'luxury_furniture',
    amount: 1,
    quality: QualityTier.MASTERWORK,
    baseTimeHours: 16,
    skillModifier: 0.5,
    requires: [
      { resource: 'lumber', amount: 15, qualityMin: QualityTier.QUALITY },
      { resource: 'inlay', amount: 3 },
      { resource: 'veneer', amount: 2 },
      { resource: 'carved_detail', amount: 4 },
      { resource: 'hinges', amount: 4 },
      { resource: 'locks', amount: 2 }
    ],
    skillsRequired: [{ skill: 'carpentry', minLevel: 80 }],
    locationRequired: 'master_workshop',
    chainDepth: 6,
    category: 'crafting',
    baseValue: 800,
    marketDemand: 'luxury',
    requiresSpecialization: true
  },
  
  {
    id: 'sew_noble_attire',
    name: 'Sew Noble Attire',
    produces: 'noble_attire',
    amount: 1,
    quality: QualityTier.MASTERWORK,
    baseTimeHours: 12,
    skillModifier: 0.5,
    requires: [
      { resource: 'cloth', amount: 8, qualityMin: QualityTier.QUALITY },
      { resource: 'thread', amount: 6, qualityMin: QualityTier.QUALITY },
      { resource: 'dye', amount: 3 },
      { resource: 'buttons', amount: 12 },
      { resource: 'inlay', amount: 2 }
    ],
    skillsRequired: [{ skill: 'tailoring', minLevel: 75 }],
    chainDepth: 6,
    category: 'crafting',
    baseValue: 600,
    marketDemand: 'luxury',
    requiresSpecialization: true
  },
  
  {
    id: 'prepare_gourmet_meal',
    name: 'Prepare Gourmet Meal',
    produces: 'gourmet_food',
    amount: 2,
    quality: QualityTier.MASTERWORK,
    baseTimeHours: 5,
    skillModifier: 0.4,
    requires: [
      { resource: 'wheat', amount: 4 },
      { resource: 'berries', amount: 3 },
      { resource: 'herbs', amount: 2 },
      { resource: 'grapes', amount: 2 }
    ],
    skillsRequired: [{ skill: 'cooking', minLevel: 70 }],
    locationRequired: 'gourmet_kitchen',
    chainDepth: 3,
    category: 'crafting',
    baseValue: 150,
    marketDemand: 'luxury'
  },
  
  {
    id: 'brew_miracle_cure',
    name: 'Brew Miracle Cure',
    produces: 'miracle_cure',
    amount: 1,
    quality: QualityTier.MASTERWORK,
    baseTimeHours: 8,
    skillModifier: 0.5,
    requires: [
      { resource: 'herbs', amount: 8 },
      { resource: 'berries', amount: 4 },
      { resource: 'gems', amount: 1 }
    ],
    skillsRequired: [{ skill: 'alchemy', minLevel: 85 }],
    techRequired: [{ techId: 'advanced_alchemy', reason: 'Master alchemical knowledge' }],
    locationRequired: 'master_laboratory',
    chainDepth: 3,
    category: 'refining',
    baseValue: 500,
    marketDemand: 'luxury',
    requiresSpecialization: true,
    rare: true
  }
];

// ============================================================================
// TIER 6: LEGENDARY (Depth 7+)
// ============================================================================

export const LEGENDARY_RECIPES: ProductionRecipe[] = [
  {
    id: 'enchant_weapon',
    name: 'Enchant Masterwork Weapon',
    produces: 'enchanted_weapon',
    amount: 1,
    quality: QualityTier.LEGENDARY,
    baseTimeHours: 24,
    skillModifier: 0.6,
    requires: [
      { resource: 'masterwork_weapon', amount: 1 },
      { resource: 'gems', amount: 3 },
      { resource: 'enchantment_base', amount: 1 }
    ],
    skillsRequired: [
      { skill: 'enchanting', minLevel: 90 },
      { skill: 'weaponsmithing', minLevel: 70 }
    ],
    techRequired: [{ techId: 'enchanting', reason: 'Magical knowledge' }],
    locationRequired: 'enchantment_tower',
    chainDepth: 7,
    category: 'refining',
    baseValue: 5000,
    marketDemand: 'luxury',
    requiresSpecialization: true,
    rare: true
  },
  
  {
    id: 'enchant_armor',
    name: 'Enchant Masterwork Armor',
    produces: 'enchanted_armor',
    amount: 1,
    quality: QualityTier.LEGENDARY,
    baseTimeHours: 32,
    skillModifier: 0.6,
    requires: [
      { resource: 'masterwork_armor', amount: 1 },
      { resource: 'gems', amount: 5 },
      { resource: 'enchantment_base', amount: 2 }
    ],
    skillsRequired: [
      { skill: 'enchanting', minLevel: 95 },
      { skill: 'armorsmithing', minLevel: 70 }
    ],
    techRequired: [{ techId: 'enchanting', reason: 'Magical knowledge' }],
    locationRequired: 'enchantment_tower',
    chainDepth: 7,
    category: 'refining',
    baseValue: 8000,
    marketDemand: 'luxury',
    requiresSpecialization: true,
    rare: true
  },
  
  {
    id: 'scribe_masterwork_tome',
    name: 'Scribe Masterwork Tome',
    produces: 'masterwork_tome',
    amount: 1,
    quality: QualityTier.MASTERWORK,
    baseTimeHours: 40,
    skillModifier: 0.5,
    requires: [
      { resource: 'parchment', amount: 50 },
      { resource: 'inlay', amount: 5 },
      { resource: 'leather', amount: 3, qualityMin: QualityTier.QUALITY },
      { resource: 'gold_ingots', amount: 1 }
    ],
    skillsRequired: [
      { skill: 'literacy', minLevel: 90 },
      { skill: 'calligraphy', minLevel: 80 }
    ],
    techRequired: [{ techId: 'printing_press', reason: 'Advanced book production' }],
    locationRequired: 'scriptorium',
    chainDepth: 5,
    category: 'crafting',
    baseValue: 1500,
    marketDemand: 'luxury',
    requiresSpecialization: true,
    rare: true
  }
];

// ============================================================================
// COMPLETE RECIPE DATABASE
// ============================================================================

export const ALL_RECIPES: ProductionRecipe[] = [
  ...GATHERING_RECIPES,
  ...BASIC_PRODUCTION_RECIPES,
  ...INTERMEDIATE_RECIPES,
  ...ADVANCED_CRAFTING_RECIPES,
  ...QUALITY_GOODS_RECIPES,
  ...MASTERWORK_RECIPES,
  ...LEGENDARY_RECIPES
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all recipes an NPC can perform based on skills and tech
 */
export function getAvailableRecipes(
  npcSkills: Map<string, number>,
  villageTech: Set<string>,
  availableLocations: Set<string>
): ProductionRecipe[] {
  
  return ALL_RECIPES.filter(recipe => {
    // Check skill requirements
    const hasSkills = recipe.skillsRequired.every(req => 
      (npcSkills.get(req.skill) || 0) >= req.minLevel
    );
    
    // Check tech requirements
    const hasTech = !recipe.techRequired || 
      recipe.techRequired.every(req => villageTech.has(req.techId));
    
    // Check location requirements
    const hasLocation = !recipe.locationRequired || 
      availableLocations.has(recipe.locationRequired);
    
    return hasSkills && hasTech && hasLocation;
  });
}

/**
 * Calculate actual production time based on NPC skill
 */
export function calculateProductionTime(
  recipe: ProductionRecipe,
  npcSkillLevel: number
): number {
  const skillBonus = npcSkillLevel * recipe.skillModifier / 100;
  return recipe.baseTimeHours * (1 - skillBonus);
}

/**
 * Get the full production chain for a resource
 */
export function getProductionChain(
  targetResource: ResourceType,
  depth: number = 0,
  visited: Set<string> = new Set()
): ProductionRecipe[] {
  
  // Find recipe that produces this resource
  const recipe = ALL_RECIPES.find(r => r.produces === targetResource);
  if (!recipe || visited.has(recipe.id)) return [];
  
  visited.add(recipe.id);
  const chain: ProductionRecipe[] = [recipe];
  
  // Recursively get chains for all requirements
  for (const req of recipe.requires) {
    const subChain = getProductionChain(req.resource, depth + 1, visited);
    chain.push(...subChain);
  }
  
  return chain;
}

/**
 * Calculate total value of a production chain
 */
export function calculateChainValue(chain: ProductionRecipe[]): number {
  return chain.reduce((total, recipe) => total + recipe.baseValue, 0);
}

/**
 * Get recipes by depth level
 */
export function getRecipesByDepth(depth: number): ProductionRecipe[] {
  return ALL_RECIPES.filter(r => r.chainDepth === depth);
}

/**
 * Get maximum chain depth available in village
 */
export function getMaxChainDepth(availableRecipes: ProductionRecipe[]): number {
  return Math.max(...availableRecipes.map(r => r.chainDepth), 0);
}

/**
 * Calculate average chain depth
 */
export function getAverageChainDepth(availableRecipes: ProductionRecipe[]): number {
  if (availableRecipes.length === 0) return 0;
  const total = availableRecipes.reduce((sum, r) => sum + r.chainDepth, 0);
  return total / availableRecipes.length;
}
