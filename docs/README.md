# 📚 VibeMaster Documentation

**Complete documentation for the VibeMaster Studio project**

---

## 🎯 Quick Navigation

### New to VibeMaster?
**Start here** → [00_start_here/START_HERE.md](00_start_here/START_HERE.md)

Then read:
1. [Quick Reference](00_start_here/VIBEMASTER_QUICK_REFERENCE.md) - 5 minute overview
2. [Project Status](00_start_here/VIBEMASTER_PROJECT_STATUS.md) - What's working now
3. [Current State](00_start_here/VIBEMASTER_CURRENT_STATE_DOCUMENTATION.md) - Complete inventory

### Want to Understand the System?
**Architecture** → [01_architecture/](01_architecture/)
- [Project Primer](01_architecture/VIBEMASTER_PROJECT_PRIMER.md) - Complete vision
- [Architecture Diagrams](01_architecture/VIBEMASTER_ARCHITECTURE_DIAGRAMS.md) - Visual design
- [Technical Decisions](01_architecture/VibeMaster_Technical_Architecture_Decisions.md) - Why we built it this way

### Want to Build Features?
**Implementation** → [03_implementation/](03_implementation/)
- [Quickstart Guide](03_implementation/VIBEMASTER_QUICKSTART_GUIDE.md) - Step-by-step tutorial
- [Setup Instructions](03_implementation/SETUP_INSTRUCTIONS_EXISTING_PROJECT.md) - Get it running
- [Custom Instructions](03_implementation/VIBEMASTER_CUSTOM_INSTRUCTIONS.md) - AI development guide

### Need System Details?
**Systems** → [02_systems/](02_systems/)
- [NPC System](02_systems/npc/) - Behavior, needs, attributes, relationships
- [World Simulation](02_systems/world/) - Living world, population, state management
- [Economy](02_systems/economy/) - Resources, production, trade, transportation
- [Narrative](02_systems/narrative/) - Dialogue, quests, storytelling
- [Travel](02_systems/travel/) - Movement, distance, vehicles
- [Tech](02_systems/tech/) - Innovation propagation, efficiency metrics

---

## 📁 Documentation Structure

```
docs/
├── 00_start_here/          # New user orientation
│   ├── START_HERE.md
│   ├── VIBEMASTER_QUICK_REFERENCE.md
│   ├── VIBEMASTER_PROJECT_STATUS.md
│   └── VIBEMASTER_CURRENT_STATE_DOCUMENTATION.md
│
├── 01_architecture/        # System design & vision
│   ├── VIBEMASTER_PROJECT_PRIMER.md
│   ├── VIBEMASTER_ARCHITECTURE_DIAGRAMS.md
│   └── VibeMaster_Technical_Architecture_Decisions.md
│
├── 02_systems/            # Deep dives by system
│   ├── npc/              # NPC AI, behavior, attributes
│   │   ├── VIBEMASTER_NPC_CYCLES_AND_CLOCKS.md
│   │   ├── DAILY_CYCLE_INTEGRATION.md
│   │   ├── NPC_ATTRIBUTE_SYSTEM.md
│   │   ├── NPC_OCCUPATIONS_REFERENCE.md
│   │   ├── NPC_RELATIONSHIP_STORAGE_ANALYSIS.md
│   │   ├── PHASER_TAURI_DATABASE_INTEGRATION.md
│   │   ├── NPC_DATABASE_OPTIMIZATION.md
│   │   └── PLAYER_NPC_TAKEOVER_SESSION_SUMMARY.md
│   │
│   ├── world/            # World simulation
│   │   ├── living_world_simulation_foundation.md
│   │   ├── LIVING_WORLD_POPULATION_AND_INFORMATION_SYSTEMS.md
│   │   └── world_building_development_flow.md
│   │
│   ├── economy/          # Resources & economy
│   │   ├── Universal_Resource_Production_Systems.md
│   │   ├── Transportation_Productivity.md
│   │   └── service_faction_formation.md
│   │
│   ├── narrative/        # Storytelling & dialogue
│   │   ├── VIBEMASTER_NARRATIVE_ARCHITECTURE.md
│   │   ├── VIBEMASTER_CLAUDE_NARRATIVE_ENGINE.md
│   │   ├── VIBEMASTER_INK_INTEGRATION.md
│   │   ├── VIBEMASTER_NARRATIVE_IMPLEMENTATION.md
│   │   └── VIBEMASTER_COMMAND_PATTERNS_AND_AI_SYSTEMS.md
│   │
│   ├── travel/           # Movement & transportation
│   │   └── TRAVEL_SYSTEM.md
│   │
│   └── tech/             # Innovation & efficiency
│       ├── INNOVATION_AND_TECH_PROPAGATION_SYSTEM.md
│       ├── EFFICIENCY_DETECTION_AND_METRICS_SYSTEM.md
│       └── tech_propagation_notes.md
│
├── 03_implementation/    # Developer guides
│   ├── VIBEMASTER_QUICKSTART_GUIDE.md
│   ├── SETUP_INSTRUCTIONS_EXISTING_PROJECT.md
│   ├── VIBEMASTER_CUSTOM_INSTRUCTIONS.md
│   ├── INTERACTIVE_TILE_CREATOR.md
│   └── Contextual_Tile_Prompt_Management_System.md
│
└── 04_progress/         # Status & reports
    ├── VIBEMASTER_STUDIO_PROGRESS_REPORT.md
    ├── SCHEMA_README.md
    └── VIBEMASTER_SERVER_SETUP_COMPLETE.md
```

---

## 🎓 Documentation by Purpose

### Understanding the Vision
```
Read These:
1. Project Primer (01_architecture/)
2. Architecture Diagrams (01_architecture/)
3. Technical Decisions (01_architecture/)
```

### Getting Started Developing
```
Read These:
1. Setup Instructions (03_implementation/)
2. Quickstart Guide (03_implementation/)
3. Custom Instructions (03_implementation/)
```

### Implementing a Specific Feature

**NPC-related:**
```
1. Find feature in: docs/02_systems/npc/
2. Check: ../../../COMPONENTS.md for code locations
3. Review: ../../../ROADMAP.md for priority
```

**Economy-related:**
```
1. Find feature in: docs/02_systems/economy/
2. Check: ../../../COMPONENTS.md for code locations
3. Review: ../../../ROADMAP.md for priority
```

**Narrative-related:**
```
1. Find feature in: docs/02_systems/narrative/
2. Check: ../../../COMPONENTS.md for code locations
3. Review: ../../../ROADMAP.md for priority
```

### Checking Current Status
```
Read These:
1. Current State (00_start_here/)
2. Project Status (00_start_here/)
3. Progress Report (04_progress/)
```

---

## 🔍 Finding Specific Information

### "How do I...?"
1. Check [Quickstart Guide](03_implementation/VIBEMASTER_QUICKSTART_GUIDE.md)
2. Check [Setup Instructions](03_implementation/SETUP_INSTRUCTIONS_EXISTING_PROJECT.md)
3. Search relevant system docs in [02_systems/](02_systems/)

### "Where is X implemented?"
1. Check [COMPONENTS.md](../COMPONENTS.md) for file mappings
2. Search in [src/](../src/) directory
3. Check [schema.prisma](../prisma/schema.prisma) for database models

### "What's the status of X?"
1. Check [Current State](00_start_here/VIBEMASTER_CURRENT_STATE_DOCUMENTATION.md)
2. Check [ROADMAP.md](../ROADMAP.md)
3. Check GitHub issues

### "Why was X designed this way?"
1. Check [Technical Decisions](01_architecture/VibeMaster_Technical_Architecture_Decisions.md)
2. Check relevant system doc in [02_systems/](02_systems/)
3. Check [Architecture Diagrams](01_architecture/VIBEMASTER_ARCHITECTURE_DIAGRAMS.md)

---

## 📊 Documentation Status

| Category | Status | Notes |
|----------|--------|-------|
| **Start Here** | ✅ Complete | Up to date |
| **Architecture** | ✅ Complete | Core vision documented |
| **NPC System** | ✅ Complete | Comprehensive |
| **World System** | ✅ Complete | Foundation solid |
| **Economy System** | ✅ Complete | 60+ pages |
| **Narrative System** | ✅ Complete | Ready to implement |
| **Travel System** | ✅ Complete | Fully designed |
| **Tech System** | ✅ Complete | 60+ pages! |
| **Implementation Guides** | ✅ Complete | Step-by-step |
| **Progress Reports** | 🔧 Ongoing | Updated weekly |

---

## 🔄 Keeping Documentation Updated

When you:
- **Complete a feature**: Update [Current State](00_start_here/VIBEMASTER_CURRENT_STATE_DOCUMENTATION.md)
- **Change architecture**: Update relevant docs in [01_architecture/](01_architecture/)
- **Implement a system**: Update [COMPONENTS.md](../COMPONENTS.md)
- **Hit a milestone**: Update [ROADMAP.md](../ROADMAP.md)
- **Fix a bug**: Update [Progress Report](04_progress/VIBEMASTER_STUDIO_PROGRESS_REPORT.md)

---

## 💡 Documentation Best Practices

### Writing New Docs
1. Use clear, descriptive headers
2. Include code examples where relevant
3. Link to related documents
4. Add to this README's navigation
5. Update COMPONENTS.md if system mapping changes

### Updating Existing Docs
1. Note the update at the bottom (Last Updated: date)
2. Increment version number if major changes
3. Keep old information if still relevant
4. Archive outdated docs instead of deleting

### Cross-Referencing
Always use relative links:
```markdown
[Link to file](../path/to/file.md)
```

Not absolute paths:
```markdown
❌ [Link](/absolute/path/file.md)
```

---

## 🆘 Getting Help

**Can't find what you need?**
1. Search all markdown files: `grep -r "search term" docs/`
2. Check [COMPONENTS.md](../COMPONENTS.md) for system mappings
3. Ask in GitHub discussions
4. Open a documentation issue

**Found an error?**
Open an issue with `[DOCS]` in the title.

**Want to contribute docs?**
See [Contributing Guide](../README.md#contributing)

---

**Last Updated**: November 7, 2025  
**Documentation Version**: 1.0  
**Maintained By**: Core team

---

*"Good documentation is as important as good code."*
