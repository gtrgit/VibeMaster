# 🎨 VIBEMASTER INTERACTIVE TILE CREATOR

**Speak Individual Tiles Into Existence**

---

## 🎯 **Core Concept**

Start with blank greenfield → Click tile → Speak description → Generate → Accept/Retry → Build tileset tile-by-tile

```
┌─────────────────────────────────────┐
│  Tileset Canvas (16x16 grid)        │
│                                      │
│  🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩           │
│  🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩           │
│  🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩           │
│  🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩           │
│                                      │
│  Click any green tile to create!    │
└─────────────────────────────────────┘

User clicks tile at [2, 1]
    ↓
🎤 Record: "Cobblestone path, gray stones"
    ↓
⚙️ Generate via OpenArt
    ↓
👁️ Preview result
    ↓
✅ Accept  or  🔄 Retry with tweaks
    ↓
Tile [2, 1] now shows cobblestone!
```

---

## 🎮 **Interactive Workflow**

### **Phase 1: Greenfield Start**

```typescript
interface TileCreatorSession {
  id: string;
  name: string;                  // "My Medieval Tileset"
  
  // Canvas settings
  gridSize: { cols: number; rows: number };  // 16x16
  tileSize: number;                          // 16px
  
  // Base style (applies to all tiles)
  baseStyle: {
    artStyle: string;            // "pixel art"
    perspective: string;         // "top-down"
    theme: string;               // "medieval"
    palette?: string[];          // Optional color constraints
  };
  
  // Tile grid
  tiles: Map<string, TileSlot>;  // key: "2,1" = tile at col 2, row 1
  
  // History
  history: TileCreationEvent[];
  
  // Export
  outputPath: string;
}

interface TileSlot {
  position: { col: number; row: number };
  status: 'empty' | 'generating' | 'preview' | 'complete';
  
  // If generated
  tile?: GeneratedTile;
  
  // Generation history for this slot
  attempts: TileAttempt[];
}

interface TileAttempt {
  attemptNumber: number;
  voiceInput: string;
  prompt: string;
  imageUrl: string;
  timestamp: Date;
  accepted: boolean;
  cost: number;
}
```

---

## 🎨 **UI Design**

### **Tile Creator Interface**

```html
<!-- vibemaster-tile-creator.html -->
<!DOCTYPE html>
<html>
<head>
  <title>VibeMaster Tile Creator</title>
  <style>
    body {
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      background: #1a1a1a;
      color: white;
    }
    
    .container {
      display: flex;
      height: 100vh;
    }
    
    /* Left Panel: Tileset Canvas */
    .canvas-panel {
      flex: 2;
      padding: 20px;
      overflow: auto;
    }
    
    .tileset-canvas {
      display: grid;
      gap: 1px;
      background: #333;
      padding: 1px;
      width: fit-content;
    }
    
    .tile-slot {
      width: 32px;
      height: 32px;
      background: #4CAF50; /* Greenfield default */
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
    }
    
    .tile-slot:hover {
      transform: scale(1.1);
      box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
    }
    
    .tile-slot.selected {
      outline: 3px solid #FFD700;
      outline-offset: 2px;
    }
    
    .tile-slot.generating {
      background: #FF9800;
      animation: pulse 1s infinite;
    }
    
    .tile-slot.complete {
      background-size: cover;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    /* Right Panel: Controls */
    .control-panel {
      flex: 1;
      padding: 20px;
      background: #2c2c2c;
      overflow: auto;
    }
    
    .section {
      margin-bottom: 30px;
      padding: 15px;
      background: #3a3a3a;
      border-radius: 8px;
    }
    
    .section h3 {
      margin-top: 0;
      color: #4CAF50;
    }
    
    .record-btn {
      width: 100%;
      padding: 15px;
      font-size: 18px;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 10px;
    }
    
    .record-btn:hover {
      background: #45a049;
    }
    
    .record-btn.recording {
      background: #f44336;
      animation: pulse 1s infinite;
    }
    
    .preview-area {
      width: 100%;
      height: 256px;
      background: #222;
      border: 2px solid #444;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 10px 0;
    }
    
    .preview-area img {
      max-width: 100%;
      max-height: 100%;
      image-rendering: pixelated;
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
    }
    
    .action-buttons button {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    }
    
    .accept-btn {
      background: #4CAF50;
      color: white;
    }
    
    .retry-btn {
      background: #FF9800;
      color: white;
    }
    
    .tile-info {
      background: #222;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      margin: 10px 0;
    }
    
    .cost-tracker {
      background: #1a1a1a;
      padding: 10px;
      border-radius: 4px;
      text-align: center;
    }
    
    .cost-tracker .amount {
      font-size: 24px;
      color: #4CAF50;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- Left: Tileset Canvas -->
    <div class="canvas-panel">
      <h2>🎨 Tileset Canvas</h2>
      <p>Click any green tile to create. Click completed tiles to edit.</p>
      
      <div id="tileset-canvas" class="tileset-canvas">
        <!-- Generated dynamically by JavaScript -->
      </div>
      
      <div style="margin-top: 20px;">
        <button onclick="exportTileset()" style="padding: 10px 20px; font-size: 16px;">
          💾 Export Tileset PNG
        </button>
        <button onclick="saveTiledProject()" style="padding: 10px 20px; font-size: 16px; margin-left: 10px;">
          📦 Save Tiled Project
        </button>
      </div>
    </div>
    
    <!-- Right: Controls -->
    <div class="control-panel">
      <h2>🎙️ Tile Creator</h2>
      
      <!-- Base Style -->
      <div class="section">
        <h3>📐 Base Style (applies to all tiles)</h3>
        <label>Art Style:</label>
        <select id="art-style" onchange="updateBaseStyle()">
          <option value="pixel art">Pixel Art</option>
          <option value="hand-drawn">Hand-Drawn</option>
          <option value="low poly">Low Poly</option>
        </select>
        
        <label style="margin-top: 10px; display: block;">Perspective:</label>
        <select id="perspective" onchange="updateBaseStyle()">
          <option value="top-down">Top-Down</option>
          <option value="isometric">Isometric</option>
          <option value="side-on">Side-On</option>
        </select>
        
        <label style="margin-top: 10px; display: block;">Theme:</label>
        <input type="text" id="theme" value="medieval village" 
               onchange="updateBaseStyle()" style="width: 100%; padding: 5px;">
      </div>
      
      <!-- Selected Tile -->
      <div class="section">
        <h3>📍 Selected Tile</h3>
        <div class="tile-info">
          Position: <span id="selected-position">None</span><br>
          Status: <span id="selected-status">-</span><br>
          Attempts: <span id="attempt-count">0</span>
        </div>
      </div>
      
      <!-- Voice Input -->
      <div class="section">
        <h3>🎤 Voice Description</h3>
        <button id="record-btn" class="record-btn" onclick="toggleRecording()">
          🎤 Click to Record
        </button>
        <div id="transcript" style="padding: 10px; background: #222; border-radius: 4px; min-height: 60px;">
          Transcript will appear here...
        </div>
        <button onclick="generateTile()" style="width: 100%; padding: 12px; margin-top: 10px; background: #2196F3; color: white; border: none; border-radius: 8px; cursor: pointer;">
          ⚙️ Generate This Tile
        </button>
      </div>
      
      <!-- Preview -->
      <div class="section">
        <h3>👁️ Preview</h3>
        <div id="preview" class="preview-area">
          <span style="color: #666;">No tile generated yet</span>
        </div>
        
        <div class="action-buttons">
          <button class="accept-btn" onclick="acceptTile()" disabled id="accept-btn">
            ✅ Accept
          </button>
          <button class="retry-btn" onclick="retryTile()" disabled id="retry-btn">
            🔄 Retry
          </button>
        </div>
      </div>
      
      <!-- Cost Tracker -->
      <div class="section cost-tracker">
        <h3>💰 Session Cost</h3>
        <div class="amount">$<span id="total-cost">0.00</span></div>
        <div style="font-size: 12px; color: #666; margin-top: 5px;">
          Tiles generated: <span id="tiles-generated">0</span>
        </div>
      </div>
      
    </div>
  </div>

  <script>
    // Session state
    const session = {
      gridSize: { cols: 16, rows: 16 },
      tileSize: 16,
      baseStyle: {
        artStyle: 'pixel art',
        perspective: 'top-down',
        theme: 'medieval village'
      },
      tiles: new Map(),
      selectedTile: null,
      totalCost: 0,
      tilesGenerated: 0
    };
    
    // Initialize tileset canvas
    function initCanvas() {
      const canvas = document.getElementById('tileset-canvas');
      canvas.style.gridTemplateColumns = `repeat(${session.gridSize.cols}, 32px)`;
      
      for (let row = 0; row < session.gridSize.rows; row++) {
        for (let col = 0; col < session.gridSize.cols; col++) {
          const tile = document.createElement('div');
          tile.className = 'tile-slot';
          tile.dataset.col = col;
          tile.dataset.row = row;
          tile.onclick = () => selectTile(col, row);
          canvas.appendChild(tile);
          
          // Initialize tile data
          session.tiles.set(`${col},${row}`, {
            position: { col, row },
            status: 'empty',
            attempts: []
          });
        }
      }
    }
    
    // Select a tile
    function selectTile(col, row) {
      // Clear previous selection
      document.querySelectorAll('.tile-slot').forEach(t => t.classList.remove('selected'));
      
      // Select new tile
      const key = `${col},${row}`;
      session.selectedTile = key;
      
      const tile = document.querySelector(`[data-col="${col}"][data-row="${row}"]`);
      tile.classList.add('selected');
      
      // Update UI
      document.getElementById('selected-position').textContent = `[${col}, ${row}]`;
      
      const tileData = session.tiles.get(key);
      document.getElementById('selected-status').textContent = tileData.status;
      document.getElementById('attempt-count').textContent = tileData.attempts.length;
      
      // Show preview if tile exists
      if (tileData.tile) {
        showPreview(tileData.tile.imageUrl);
      } else {
        clearPreview();
      }
    }
    
    // Recording
    let mediaRecorder;
    let audioChunks = [];
    
    async function toggleRecording() {
      const btn = document.getElementById('record-btn');
      
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        // Stop recording
        mediaRecorder.stop();
        btn.textContent = '🎤 Click to Record';
        btn.classList.remove('recording');
      } else {
        // Start recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
          audioChunks.push(e.data);
        };
        
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          await transcribeAudio(audioBlob);
        };
        
        mediaRecorder.start();
        btn.textContent = '🔴 Recording... (click to stop)';
        btn.classList.add('recording');
      }
    }
    
    // Transcribe audio
    async function transcribeAudio(audioBlob) {
      document.getElementById('transcript').textContent = 'Transcribing...';
      
      // Call your ElevenLabs STT endpoint
      const formData = new FormData();
      formData.append('file', audioBlob);
      
      try {
        const response = await fetch('YOUR_SERVER/stt', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        document.getElementById('transcript').textContent = data.text;
        
      } catch (error) {
        document.getElementById('transcript').textContent = 'Error: ' + error.message;
      }
    }
    
    // Generate tile
    async function generateTile() {
      if (!session.selectedTile) {
        alert('Please select a tile first!');
        return;
      }
      
      const transcript = document.getElementById('transcript').textContent;
      if (!transcript || transcript === 'Transcript will appear here...') {
        alert('Please record a description first!');
        return;
      }
      
      // Update tile status
      const tileData = session.tiles.get(session.selectedTile);
      tileData.status = 'generating';
      
      const [col, row] = session.selectedTile.split(',').map(Number);
      const tile = document.querySelector(`[data-col="${col}"][data-row="${row}"]`);
      tile.classList.add('generating');
      
      // Build prompt
      const prompt = buildTilePrompt(transcript);
      
      try {
        // Call OpenArt API (you'll implement this)
        const result = await generateWithOpenArt(prompt);
        
        // Store result
        tileData.tile = {
          imageUrl: result.imageUrl,
          prompt: prompt,
          cost: 0.02
        };
        tileData.attempts.push({
          attemptNumber: tileData.attempts.length + 1,
          voiceInput: transcript,
          prompt: prompt,
          imageUrl: result.imageUrl,
          timestamp: new Date(),
          accepted: false,
          cost: 0.02
        });
        tileData.status = 'preview';
        
        // Show preview
        showPreview(result.imageUrl);
        
        // Enable buttons
        document.getElementById('accept-btn').disabled = false;
        document.getElementById('retry-btn').disabled = false;
        
        tile.classList.remove('generating');
        
        // Update cost
        session.totalCost += 0.02;
        session.tilesGenerated++;
        updateCostDisplay();
        
      } catch (error) {
        alert('Generation failed: ' + error.message);
        tileData.status = 'empty';
        tile.classList.remove('generating');
      }
    }
    
    // Build OpenArt prompt
    function buildTilePrompt(description) {
      return `
${description},
${session.baseStyle.artStyle} style,
${session.baseStyle.perspective} view,
${session.baseStyle.theme} theme,
single tile, ${session.tileSize}x${session.tileSize} pixels,
seamless edges for tiling,
game asset, tileable texture,
sharp pixels, no anti-aliasing, retro game graphics
`.trim();
    }
    
    // Show preview
    function showPreview(imageUrl) {
      const preview = document.getElementById('preview');
      preview.innerHTML = `<img src="${imageUrl}" alt="Generated tile">`;
    }
    
    function clearPreview() {
      const preview = document.getElementById('preview');
      preview.innerHTML = '<span style="color: #666;">No tile generated yet</span>';
    }
    
    // Accept tile
    function acceptTile() {
      if (!session.selectedTile) return;
      
      const tileData = session.tiles.get(session.selectedTile);
      if (!tileData.tile) return;
      
      // Mark as complete
      tileData.status = 'complete';
      tileData.attempts[tileData.attempts.length - 1].accepted = true;
      
      // Update tile visual
      const [col, row] = session.selectedTile.split(',').map(Number);
      const tile = document.querySelector(`[data-col="${col}"][data-row="${row}"]`);
      tile.style.backgroundImage = `url(${tileData.tile.imageUrl})`;
      tile.classList.add('complete');
      
      // Disable buttons
      document.getElementById('accept-btn').disabled = true;
      document.getElementById('retry-btn').disabled = true;
      
      // Clear transcript for next tile
      document.getElementById('transcript').textContent = 'Transcript will appear here...';
      
      alert('✅ Tile accepted! Click another tile to continue.');
    }
    
    // Retry tile
    function retryTile() {
      // Just call generateTile again with same settings
      generateTile();
    }
    
    // Update base style
    function updateBaseStyle() {
      session.baseStyle.artStyle = document.getElementById('art-style').value;
      session.baseStyle.perspective = document.getElementById('perspective').value;
      session.baseStyle.theme = document.getElementById('theme').value;
    }
    
    // Update cost display
    function updateCostDisplay() {
      document.getElementById('total-cost').textContent = session.totalCost.toFixed(2);
      document.getElementById('tiles-generated').textContent = session.tilesGenerated;
    }
    
    // Export tileset
    async function exportTileset() {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = session.gridSize.cols * session.tileSize;
      canvas.height = session.gridSize.rows * session.tileSize;
      
      // Fill with green background (unfilled tiles)
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw completed tiles
      for (const [key, tileData] of session.tiles) {
        if (tileData.status === 'complete' && tileData.tile) {
          const [col, row] = key.split(',').map(Number);
          const img = await loadImage(tileData.tile.imageUrl);
          ctx.drawImage(img, 
            col * session.tileSize, 
            row * session.tileSize, 
            session.tileSize, 
            session.tileSize
          );
        }
      }
      
      // Download
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vibemaster-tileset.png';
        a.click();
      });
      
      alert('✅ Tileset exported!');
    }
    
    // Helper to load image
    function loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    }
    
    // Placeholder for OpenArt API call
    async function generateWithOpenArt(prompt) {
      // TODO: Implement actual OpenArt API call
      console.log('Generating with prompt:', prompt);
      
      // For now, return mock data
      // In real implementation, call your server endpoint
      return {
        imageUrl: 'https://via.placeholder.com/16x16/8b7355/8b7355' // placeholder
      };
    }
    
    // Initialize on load
    window.onload = initCanvas;
  </script>
</body>
</html>
```

---

## 🎯 **Workflow Example**

### **Creating a Medieval Village Tileset**

**Tile 1: Grass**
```
1. Click position [0, 0]
2. 🎤 Record: "Lush green grass with tiny yellow flowers"
3. ⚙️ Click "Generate This Tile"
4. 👁️ Preview shows grass tile
5. ✅ Accept (or 🔄 Retry if not happy)
6. Tile [0, 0] now shows grass!
```

**Tile 2: Cobblestone**
```
1. Click position [1, 0]
2. 🎤 Record: "Gray cobblestone path, weathered stones"
3. ⚙️ Generate
4. 👁️ Preview
5. ✅ Accept
```

**Continue building...**
- [2, 0]: Dirt path
- [3, 0]: Water
- [0, 1]: Tavern wall (wood)
- [1, 1]: Forge wall (stone)
- etc.

---

## 💰 **Cost Tracking**

The interface shows real-time cost:
```
Session Cost: $0.68
Tiles generated: 34
```

You know exactly how much you're spending as you build!

---

## 🚀 **Implementation Steps**

### **Step 1: Basic Interface** (No API yet)
- HTML interface works
- Click tiles to select
- Record voice (browser MediaRecorder)
- Show placeholders
- Export canvas to PNG

### **Step 2: Add STT**
- Connect to your existing ElevenLabs endpoint
- Transcribe voice descriptions

### **Step 3: Add OpenArt** (Later)
- Implement OpenArt API calls
- Generate actual tiles
- Preview and accept/retry

---

## 📦 **File Structure**

```
vibemaster/
├── vibemaster-tile-creator.html     ← NEW! Interactive tile creator
├── vibemaster-studio.html           ← Existing (scene creator)
├── vibemaster-visualization.html    ← Existing (Phaser view)
└── public/
    └── assets/
        └── tilesets/
            └── my-tileset.png       ← Generated from tile creator
```

---

## ✅ **Advantages of This Approach**

1. **Iterative** - Build tileset tile-by-tile
2. **Controlled** - Accept/reject each tile
3. **Cost-Effective** - Only pay for tiles you keep
4. **Fun** - Like painting with voice!
5. **Flexible** - Can mix generated + manual tiles
6. **Visual** - See your tileset grow in real-time

---

Want me to create the complete working HTML file for you? You can start using it with free Kenney tiles now, then add OpenArt API later! 🎨
