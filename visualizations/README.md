# 🎨 VibeMaster Interactive Visualizations

**Interactive HTML dashboard for exploring game components and systems**

## 🚀 Quick Start

### Option 1: Direct File Open
```bash
# Simply open in your browser
open vibemaster-visualizations.html
# or double-click the file
```

### Option 2: Local Server
```bash
# From the VibeMaster root directory
cd visualizations
python -m http.server 8000

# Open browser to:
# http://localhost:8000/vibemaster-visualizations.html
```

## 📊 What's Included

### 1. NPC Behavior State Machine
**What it shows:** Complete decision-making flow from need detection to action execution

**Based on:** `src/systems/npc/NPC.ts`

**Features:**
- Visual representation of the NPC AI loop
- Color-coded state types (Evaluation, Critical, Action, Update)
- Interactive tooltips with code references
- Shows method names and line numbers

**Key Insights:**
- NPCs tick every game hour
- Needs decay continuously (Food -2/hour, Social -1/hour)
- Crisis thresholds trigger urgent goals (Food < 20, Safety < 30)
- Actions are planned based on goal type and executed with database persistence

---

### 2. System Dependency Graph
**What it shows:** How VibeMaster's systems depend on and interact with each other

**Based on:** `COMPONENTS.md` + actual implementation files

**Features:**
- Force-directed graph with draggable nodes
- Node size indicates number of connections
- Color-coded by system category
- Click to highlight dependencies
- Hover for file paths and connection counts

**Categories:**
- 🟣 **Core Systems** - Database Layer
- 🔵 **NPC Systems** - Behavior, Cycles, Relationships
- 🟢 **World Systems** - Time, Locations
- 🟠 **Economy Systems** - Resources, Occupations
- 🔴 **Planned Systems** - Narrative, Tech, Travel

---

### 3. Data Flow Diagram
**What it shows:** How data transforms through the NPC decision pipeline

**Based on:** `NPC.ts` methods and Prisma schema

**Features:**
- Step-by-step data transformation
- Shows actual data values at each stage
- Function calls and data structures
- Database update flow

**Pipeline:**
```
NPC State → updateNeeds() → Need Values
          ↓
          → updateEmotions() → Emotion State
          ↓
          → evaluateGoals() → Goal Queue
          ↓
          → takeAction() → executeAction()
          ↓
          → Database Updates
```

---

### 4. Daily Cycle Timeline
**What it shows:** 24-hour simulation with 4 decision checkpoints

**Based on:** `src/systems/npc/daily-cycle-system.ts`

**Features:**
- Interactive timeline (drag to pan, scroll to zoom)
- Multiple NPCs shown simultaneously
- Color-coded activities
- Hover for activity details

**Checkpoint Schedule:**
- 🌅 **06:00 Morning** - Wake up, evaluate needs, plan day
- ☀️ **12:00 Midday** - Lunch, reassess goals
- 🌆 **18:00 Evening** - Dinner, social activities
- 🌙 **22:00 Night** - Prepare for rest, sleep

---

## 🎯 Use Cases

### For Developers
- **Understanding the codebase** - Visual map of system relationships
- **Debugging** - Trace data flow from input to database
- **Documentation** - Share visual explanations with team
- **Architecture planning** - See where new systems fit

### For Designers
- **Game balance** - Understand NPC behavior patterns
- **Feature planning** - See what systems are complete vs. planned
- **Timing design** - Visualize daily rhythms and schedules

### For Documentation
- **Onboarding** - Help new contributors understand the project
- **Presentations** - Visual aids for explaining VibeMaster
- **Technical writing** - Reference for documentation updates

---

## 🛠️ Technical Details

### Technologies Used
- **D3.js v7** - Force-directed graphs and SVG manipulation
- **Vis.js Timeline** - Interactive timeline component
- **Pure HTML/CSS/JS** - No build step required
- **CDN Libraries** - No local dependencies

### Browser Compatibility
- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Requires JavaScript enabled

### File Size
- Single HTML file: ~35KB
- No external dependencies to download
- Libraries loaded from CDN

---

## 🔧 Customization

### Adding New Systems to Dependency Graph

Edit the `systems` array in the `createDependencyGraph()` function:

```javascript
const systems = [
    {
        id: 'mysystem',
        label: 'My New\nSystem',
        category: 'npc', // core, npc, world, economy, planned
        size: 14,
        file: 'my-system.ts'
    },
    // ... existing systems
];

// Add connections
const connections = [
    { source: 'database', target: 'mysystem' },
    // ... existing connections
];
```

### Modifying Colors

Change the `categoryColors` object:

```javascript
const categoryColors = {
    core: '#9b59b6',
    npc: '#3498db',
    world: '#2ecc71',
    economy: '#f39c12',
    planned: '#e74c3c',
    mycategory: '#1abc9c' // Add new category
};
```

### Adding Timeline Activities

Edit the `createTimeline()` function:

```javascript
items.push({
    id: itemId++,
    group: npcIndex + 1,
    content: '🎯 New Activity',
    start: '2024-01-01 15:00',
    end: '2024-01-01 16:00',
    className: 'custom',
    title: 'Description of the activity'
});
```

---

## 🔄 Future Enhancements

### Phase 1 (Completed)
- ✅ Static visualizations with sample data
- ✅ Interactive exploration
- ✅ Tooltips and code references
- ✅ Responsive design

### Phase 2 (Planned)
- ⏳ Connect to real database via Tauri
- ⏳ Live data updates
- ⏳ Filter by world/save file
- ⏳ Export visualizations as images

### Phase 3 (Future)
- ⏳ Real-time simulation visualization
- ⏳ NPC relationship network graph
- ⏳ Resource flow animations
- ⏳ Time travel / replay functionality

---

## 📚 Related Documentation

- [COMPONENTS.md](../COMPONENTS.md) - System cross-reference guide
- [Architecture Diagrams](../docs/01_architecture/VIBEMASTER_ARCHITECTURE_DIAGRAMS.md) - Text-based diagrams
- [NPC System Docs](../docs/02_systems/npc/) - Deep dives into NPC behavior
- [Project Primer](../docs/01_architecture/VIBEMASTER_PROJECT_PRIMER.md) - Complete vision

---

## 🐛 Troubleshooting

### Visualizations not loading
- **Check browser console** for JavaScript errors
- **Ensure internet connection** (CDN libraries need to load)
- **Try different browser** (Chrome/Edge recommended)

### Graph is too crowded
- **Drag nodes** to rearrange (dependency graph)
- **Zoom out** using browser zoom (Ctrl/Cmd + -)
- **Use fullscreen** (F11 on most browsers)

### Timeline is empty
- Check that Vis.js library loaded (network tab in dev tools)
- Verify date format in `items` array
- Ensure groups are defined correctly

---

## 💡 Tips & Tricks

1. **State Machine**: Click states to see implementation details
2. **Dependency Graph**: Drag nodes apart to reduce overlap
3. **Data Flow**: Follow the arrows to trace execution
4. **Timeline**: Use mouse wheel to zoom, drag to pan
5. **Tooltips**: Hover over any element for more information
6. **Tabs**: Switch between visualizations using top buttons

---

## 🤝 Contributing

Found a bug or have an enhancement idea?

1. Check existing [GitHub Issues](https://github.com/gtrgit/VibeMaster/issues)
2. Create new issue with "Visualization" label
3. Or submit a PR with improvements

---

**Last Updated:** November 7, 2025
**Created By:** VibeMaster Development Team
**License:** Same as VibeMaster project

---

*"A picture is worth a thousand lines of code."*
