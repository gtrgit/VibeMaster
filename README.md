# 🎙️ VibeMaster Studio

**Voice-Driven Game Development Revolution**

[![Status](https://img.shields.io/badge/Status-Active%20Development-green)]()
[![Web Studio](https://img.shields.io/badge/Web%20Studio-Production%20Ready-blue)]()
[![Game Engine](https://img.shields.io/badge/Game%20Engine-In%20Development-orange)]()

---

## ✨ What is VibeMaster?

VibeMaster Studio is a revolutionary game development system that lets you **speak games into existence**:

- 🎤 **Voice Input** → Speak your game scenes naturally
- 🤖 **AI Parsing** → Claude converts speech to structured data
- 🎮 **Instant Testing** → See your game world immediately
- 🎨 **Smart Art Pipeline** → Generate visuals only when ready
- 🌍 **Living World** → NPCs with needs, goals, relationships, and emergent behavior

**Status:** Web Studio is production-ready. Game engine with living world simulation is in active development.

---

## 🚀 Quick Start

### Using the Web Studio (Ready Now)

```bash
# Clone this repository
git clone https://github.com/gtrgit/VibeMaster.git
cd VibeMaster

# Open the web studio
open vibemaster-studio.html
# Or: python -m http.server 8000

# Configure your API keys in Settings:
# - ElevenLabs API key (for speech-to-text)
# - Claude API key (for AI parsing)

# Start creating!
# 1. Click record
# 2. Describe your scene
# 3. Export JSON
# 4. Use in any game engine
```

### Setting Up the Game Engine (In Development)

See [SETUP_INSTRUCTIONS](/docs/03-IMPLEMENTATION/SETUP_INSTRUCTIONS_EXISTING_PROJECT.md) for detailed setup guide.

---

## 📚 Documentation

### 🟢 START HERE (First Time)

| Document | Time | Purpose |
|----------|------|---------|
| [📖 Quick Reference](docs/00-START-HERE/VIBEMASTER_QUICK_REFERENCE.md) | 5 min | One-page overview |
| [🎯 Project Status](docs/00-START-HERE/VIBEMASTER_PROJECT_STATUS.md) | 15 min | What works now |
| [🗺️ Current State](docs/00-START-HERE/VIBEMASTER_CURRENT_STATE_DOCUMENTATION.md) | 20 min | Complete inventory |

### 🔵 ARCHITECTURE (Understanding the System)

| Document | Focus |
|----------|-------|
| [📘 Project Primer](docs/01-ARCHITECTURE/VIBEMASTER_PROJECT_PRIMER.md) | Complete vision & roadmap |
| [📐 Architecture Diagrams](docs/01-ARCHITECTURE/VIBEMASTER_ARCHITECTURE_DIAGRAMS.md) | Visual system design |
| [🏗️ Technical Decisions](docs/01-ARCHITECTURE/VibeMaster_Technical_Architecture_Decisions.md) | Why we built it this way |

### 🟡 SYSTEMS (Deep Dives)

#### NPC & AI Systems
- [🤖 NPC Daily Cycles](docs/02-SYSTEMS/npc/VIBEMASTER_NPC_CYCLES_AND_CLOCKS.md)
- [🧠 Need-Based Behavior](docs/02-SYSTEMS/npc/NEED_BASED_BEHAVIOR.md)
- [📊 NPC Attributes](docs/02-SYSTEMS/npc/NPC_ATTRIBUTE_SYSTEM.md)
- [💼 NPC Occupations](docs/02-SYSTEMS/npc/NPC_OCCUPATIONS_REFERENCE.md)
- [🔗 Relationship Systems](docs/02-SYSTEMS/npc/NPC_RELATIONSHIP_STORAGE_ANALYSIS.md)

#### World Simulation
- [🌍 Living World Foundation](docs/02-SYSTEMS/world/living_world_simulation_foundation.md)
- [🏘️ Population & Information Systems](docs/02-SYSTEMS/world/LIVING_WORLD_POPULATION_AND_INFORMATION_SYSTEMS.md)
- [🔄 World Building Development Flow](docs/02-SYSTEMS/world/world_building_development_flow.md)

#### Economy & Resources
- [💰 Universal Resource System](docs/02-SYSTEMS/economy/Universal_Resource___Production_Systems.md)
- [🚚 Transportation & Productivity](docs/02-SYSTEMS/economy/Transportation___Productivity.md)
- [🤝 Service Faction Formation](docs/02-SYSTEMS/economy/service_faction_formation.md)

#### Narrative
- [📖 Narrative Architecture](docs/02-SYSTEMS/narrative/VIBEMASTER_NARRATIVE_ARCHITECTURE.md)
- [🎭 Claude Narrative Engine](docs/02-SYSTEMS/narrative/VIBEMASTER_CLAUDE_NARRATIVE_ENGINE.md)
- [✍️ Ink Integration](docs/02-SYSTEMS/narrative/VIBEMASTER_INK_INTEGRATION.md)

#### Technology & Innovation
- [🔬 Tech Propagation](docs/02-SYSTEMS/tech/INNOVATION_AND_TECH_PROPAGATION_SYSTEM.md)
- [📈 Efficiency Detection](docs/02-SYSTEMS/tech/EFFICIENCY_DETECTION_AND_METRICS_SYSTEM.md)

#### Travel
- [🗺️ Travel System](docs/02-SYSTEMS/travel/TRAVEL_SYSTEM.md)

### 🟣 IMPLEMENTATION (For Developers)

- [⚡ Quick Start Guide](docs/03-IMPLEMENTATION/VIBEMASTER_QUICKSTART_GUIDE.md)
- [🔧 Setup Instructions](docs/03-IMPLEMENTATION/SETUP_INSTRUCTIONS_EXISTING_PROJECT.md)
- [🛠️ Custom Instructions](docs/03-IMPLEMENTATION/VIBEMASTER_CUSTOM_INSTRUCTIONS.md)
- [📱 Interactive Tile Creator](docs/03-IMPLEMENTATION/INTERACTIVE_TILE_CREATOR.md)

### 🔴 PROGRESS & STATUS

- [📊 Studio Progress Report](docs/04-PROGRESS/VIBEMASTER_STUDIO_PROGRESS_REPORT.md)
- [🗓️ Roadmap](ROADMAP.md)
- [🗺️ Component Map](COMPONENTS.md)
- [📋 Database Schema Reference](docs/04-PROGRESS/SCHEMA_README.md)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│           USER INTERFACE                    │
│  ┌────────────────┐  ┌─────────────────┐  │
│  │  Web Studio    │  │  Game Engine    │  │
│  │  (Browser)     │  │  (Phaser/Tauri) │  │
│  └────────────────┘  └─────────────────┘  │
└──────────────┬──────────────┬──────────────┘
               │              │
               ▼              ▼
┌─────────────────────────────────────────────┐
│          CORE SYSTEMS                       │
│  ┌────────────┐  ┌────────────┐           │
│  │ NPC Engine │  │  Resource  │           │
│  │  Behavior  │  │   Manager  │           │
│  └────────────┘  └────────────┘           │
│  ┌────────────┐  ┌────────────┐           │
│  │  Narrative │  │   Travel   │           │
│  │  Generator │  │   System   │           │
│  └────────────┘  └────────────┘           │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│            DATA LAYER                       │
│  ┌─────────────────────────────────────┐  │
│  │  Prisma ORM → SQLite Database       │  │
│  └─────────────────────────────────────┘  │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│       EXTERNAL SERVICES                     │
│  ElevenLabs API | Claude API | OpenArt API  │
└─────────────────────────────────────────────┘
```

---

## 🎯 Current Status

### ✅ Production Ready
- **Web Studio**: Voice → structured JSON export
- **NPC Need System**: Food, safety, wealth, social, rest
- **Daily Cycle**: 4 checkpoints/day with dynamic decisions
- **Location System**: Homes, workplaces, shared housing
- **Resource Production**: 12+ occupations with crafting chains
- **Database Schema**: Complete Prisma models

### 🔧 In Development
- **Phaser/Tauri Integration**: Connecting database to visual rendering
- **Player Character**: Movement and interaction
- **Database Testing**: Verifying Tauri SQLite connection

### 📋 Designed (Ready to Implement)
- **Narrative Generation**: Claude-powered storytelling
- **Tech Propagation**: 60-page system design complete
- **Travel System**: Distance/time calculations
- **Faction Formation**: Economic specialization
- **AI Conversation**: Natural language NPC queries

---

## 🛠️ Tech Stack

### Web Studio
- Pure HTML/CSS/JavaScript (no build step)
- MediaRecorder API (browser audio recording)
- ElevenLabs Scribe API (speech-to-text)
- Claude API (AI parsing)

### Game Engine
- **Frontend**: Phaser 3 (game rendering)
- **Desktop**: Tauri (native app wrapper)
- **Database**: SQLite + Prisma ORM
- **Language**: TypeScript
- **State Management**: In-memory + persistent DB

### External Services
- **ElevenLabs**: Speech-to-text transcription
- **Claude**: Natural language processing
- **OpenArt** (planned): AI art generation

---

## 📊 Project Structure

```
VibeMaster/
├── .github/
│   ├── ISSUE_TEMPLATE/        # Bug/feature templates
│   └── workflows/             # CI/CD (future)
│
├── docs/                      # All documentation
│   ├── 00-START-HERE/        # New user orientation
│   ├── 01-ARCHITECTURE/      # System design
│   ├── 02-SYSTEMS/           # Deep dives by system
│   ├── 03-IMPLEMENTATION/    # Developer guides
│   └── 04-PROGRESS/          # Status & reports
│
├── src/                      # Game engine source
│   ├── core/                 # Core systems
│   ├── systems/              # Game systems (NPC, world, etc.)
│   ├── database/             # Database utilities
│   └── ui/                   # UI components
│
├── prisma/
│   └── schema.prisma         # Database schema
│
├── assets/
│   ├── sprites/              # Sprite sheets
│   └── exports/              # Generated content
│
├── vibemaster-studio.html    # Web studio (single file)
├── README.md                 # This file
├── ROADMAP.md               # Development roadmap
└── COMPONENTS.md            # Component mapping guide
```

---

## 🎮 Example Workflow

### Creating a Medieval Village

```bash
# 1. Open Web Studio
open vibemaster-studio.html

# 2. Record voice description
🎤 "Create a medieval village called Millbrook. 
    There's a baker named Marcus who works at the bakery. 
    A blacksmith named Sarah at the forge.
    And a farmer named Thomas who tends the fields."

# 3. AI processes and structures data
# (Happens automatically)

# 4. Export & test
# Download scene.json
# Import to game engine
# Watch NPCs live their lives!
```

---

## 🤝 Contributing

We're in active development! Here's how to help:

### 1. Check Current Tasks
- See [ROADMAP.md](ROADMAP.md) for planned features
- Check [GitHub Issues](https://github.com/gtrgit/VibeMaster/issues) for open tasks
- Review [Component Map](COMPONENTS.md) to understand system relationships

### 2. Development Priorities

**Immediate (Phase 1)**
- [ ] Complete Prisma/Tauri database connection
- [ ] Visual rendering of NPC daily cycles
- [ ] Player character movement
- [ ] Resource system integration

**Next (Phase 2)**
- [ ] Player-NPC conversation system
- [ ] Natural language world queries
- [ ] Quest generation

**Future (Phase 3+)**
- [ ] Tech propagation implementation
- [ ] Faction conflict system
- [ ] Advanced narrative generation

### 3. Pull Request Guidelines
- Link to related issue
- Include tests if applicable
- Update documentation
- Follow existing code style

---

## 📖 Philosophy

VibeMaster is built on three core principles:

### 1. **Voice-First Development**
Why type when you can speak? Natural language is faster and more intuitive than code or GUI tools.

### 2. **Test Before Polish**
White-box placeholders let you iterate on gameplay before investing in art. Generate visuals only when mechanics are proven.

### 3. **Emergent Complexity**
Simple rules (needs, goals, relationships) create complex, believable behavior. No scripting required.

---

## 🎯 Success Metrics

- **Development Speed**: Prototype → playable in < 1 hour
- **Voice Accuracy**: > 95% transcription accuracy
- **Parsing Success**: > 90% correct structured output
- **Performance**: 60 FPS with 50+ NPCs
- **Memory**: < 200MB for full simulation

---

## 📞 Links & Resources

- **GitHub**: [github.com/gtrgit/VibeMaster](https://github.com/gtrgit/VibeMaster)
- **Web Studio Demo**: [Live demo link] (coming soon)
- **Documentation**: You're reading it!
- **Component Map**: [COMPONENTS.md](COMPONENTS.md)
- **Roadmap**: [ROADMAP.md](ROADMAP.md)

---

## 📄 License

[License information to be added]

---

## 🙏 Acknowledgments

Built with:
- [Phaser 3](https://phaser.io/) - Game engine
- [Tauri](https://tauri.app/) - Desktop framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [ElevenLabs](https://elevenlabs.io/) - Speech-to-text
- [Anthropic Claude](https://www.anthropic.com/) - AI parsing

Inspired by games with living worlds: Dwarf Fortress, RimWorld, Crusader Kings.

---

**Last Updated**: November 7, 2025  
**Version**: 0.1.0 (Active Development)

---

*"The future of game development is spoken, not written."*
