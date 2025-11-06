# Session Summary: VibeMaster Technical Architecture Decisions

**Date:** November 5, 2025  
**Topic:** Platform Migration & Database Architecture

---

## Key Decisions Made

### 1. Platform Pivot: Decentraland → Phaser
**Decision:** VibeMaster is now a Phaser-based game (no longer Decentraland SDK7)

**Impact:**
- Different game engine with different architecture
- Opens door to desktop distribution via Tauri
- Phaser Editor v5 MCP integration now relevant (but not required)

---

### 2. Development Environment: VSCode (Not Phaser Editor)
**Decision:** Continue with VSCode for primary development

**Rationale:**
- Maintains voice-first workflow philosophy
- Browser-based tools already working (`vibemaster-studio.html`)
- Phaser Editor can be added later if visual editing becomes necessary
- Simpler toolchain during prototyping phase

**Future Option:** Add Phaser Editor v5 + Claude Desktop MCP integration for visual tilemap editing if needed

---

### 3. Desktop Distribution: Tauri Framework
**Decision:** Use Tauri for desktop app packaging

**Benefits:**
- Small file size (~600KB vs Electron's 100MB+)
- Native OS webview (better performance)
- Access to file system and native APIs
- SQLite database can be packaged with installation

**Architecture:**
```
Browser Tools              Desktop Game
(Content Creation)    →    (Runtime)
─────────────────          ────────────────
vibemaster-studio.html     Tauri + Phaser
Voice → JSON export   →    SQLite database
```

---

### 4. Database Strategy: SQLite from Day One
**Decision:** Start with `tauri-plugin-sql` immediately (NOT localStorage migration)

**Critical Rationale:**
VibeMaster requires heavy database usage:
- Living world simulation with persistent NPC states
- Claude narrative engine with dialogue history
- Ink script storage and branching narratives
- Event history and causality tracking
- Relationship systems (NPC ↔ NPC, Player ↔ NPC)
- Player choices with consequences
- Generated art metadata

**localStorage limitations:**
- 5-10MB maximum storage
- No complex queries
- No relationships/foreign keys
- VibeMaster needs 100MB+ capacity

**SQLite advantages:**
- Unlimited storage (scales with content)
- Complex queries (JOIN, WHERE, aggregation)
- Transactions (atomic game state updates)
- Relationships with foreign keys
- Indexed performance
- No migration pain later

---

## Recommended Database Schema

```sql
-- Core tables needed:
scenes                 -- Scene definitions and data
npcs                   -- NPC state, emotions, needs, goals
relationships          -- Entity connections and trust levels
dialogue_history       -- Player choices and consequences
events                 -- World events with causality
player_state          -- Player progress and inventory
art_assets            -- Generated art metadata and costs
```

---

## Architecture Diagram

```
┌─────────────────────────────────────┐
│  Browser Content Creation Tools     │
│  ─────────────────────────────      │
│  vibemaster-studio.html             │
│  - Voice recording                  │
│  - Scene editing                    │
│  - Export JSON                      │
└──────────────┬──────────────────────┘
               │
               │ JSON Export
               ↓
┌─────────────────────────────────────┐
│  Tauri Desktop App                  │
│  ┌─────────────────────────────┐   │
│  │  Phaser 3 Game Engine       │   │
│  │  - Scene rendering          │   │
│  │  - Player interaction       │   │
│  │  - Game logic               │   │
│  └──────────┬──────────────────┘   │
│             │                       │
│             ↓                       │
│  ┌─────────────────────────────┐   │
│  │  SQLite Database            │   │
│  │  (tauri-plugin-sql)         │   │
│  │  - All game data            │   │
│  │  - Persistent state         │   │
│  │  - Query engine             │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## Development Workflow

1. **Content Creation:** Use browser-based `vibemaster-studio.html`
   - Voice → Transcription → JSON
   - Visual preview and editing
   - Export scene definitions

2. **Game Runtime:** Tauri desktop app
   - Import JSON scenes into SQLite
   - Phaser renders and runs game
   - All state persisted to database

3. **Distribution:** Package as native desktop app
   - Windows/Mac/Linux executables
   - SQLite database bundled with app
   - Small file size (~10-50MB depending on assets)

---

## Code Style Convention

**Established:** All code files must include path and filename as comment on line 1

```typescript
// /src/database/GameDatabase.ts

export class GameDatabase {
  // ...
}
```

---

## Next Steps

1. Set up Tauri project structure
2. Install `tauri-plugin-sql`
3. Create database schema and migrations
4. Build database abstraction layer
5. Integrate with existing Phaser game code
6. Connect browser tools to export pipeline

---

## Documentation Updates Needed

- Update all references from Decentraland SDK7 → Phaser 3
- Add Tauri setup instructions
- Document SQLite schema
- Update architecture diagrams
- Remove Decentraland-specific constraints (Y-axis vertical, etc.)