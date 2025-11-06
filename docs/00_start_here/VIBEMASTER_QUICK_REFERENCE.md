# 🎯 VIBEMASTER STUDIO - QUICK REFERENCE

**Status:** ✅ WORKING  
**Date:** November 1, 2025  

---

## 🚀 WHAT IT DOES

Voice → Transcription → AI Parsing → Scene JSON → Export

**Flow:**
1. Speak scene description
2. Auto-transcribe (ElevenLabs)
3. Auto-parse (Claude AI)
4. Export JSON for Decentraland

---

## 🔗 LINKS

**Web App:** `vibemaster-studio.html`  
**Server:** `https://audio.netrunners.xyz/vibemaster`  
**Health:** `https://audio.netrunners.xyz/vibemaster/health`  

---

## 🔑 API KEYS NEEDED

```
ElevenLabs: sk_... (with STT enabled)
Claude:     sk-ant-...
```

---

## ⚙️ SERVER CONFIG

**Location:** `/root/vibemaster-proxy/server.js`  
**PM2 Name:** `vibemaster-proxy`  
**Port:** 3001  

**Commands:**
```bash
pm2 restart vibemaster-proxy
pm2 logs vibemaster-proxy
cd ~/vibemaster-proxy && nano server.js
```

---

## 🔧 CRITICAL CONFIG VALUES

### STT Endpoint
```javascript
form.append('file', audioBuffer, ...)  // ✅ 'file' not 'audio'
form.append('model_id', 'scribe_v1')   // ✅ STT model
```

### Claude Endpoint
```javascript
model: 'claude-3-haiku-20240307'  // ✅ Most compatible
```

---

## 🐛 COMMON ISSUES

**401 Error:** API key invalid/no STT permission  
**400 Error:** Wrong parameter name (use 'file')  
**404 Error:** Wrong model name  
**529 Error:** Wrong Claude model  

---

## 📊 CURRENT STATUS

✅ Voice recording works  
✅ STT transcription works  
✅ Claude parsing works  
✅ JSON export works  
✅ Server stable  

---

## 🎯 NEXT STEPS

1. Visual position editor
2. Art generation (OpenArt)
3. Decentraland export
4. Multi-room support

---

## 💾 FILES

**Main App:** `vibemaster-studio.html`  
**Server:** `/root/vibemaster-proxy/server.js`  
**Full Docs:** `VIBEMASTER_STUDIO_PROGRESS_REPORT.md`  

---

**Last Updated:** November 1, 2025  
**Session Duration:** ~2 hours  
**Result:** WORKING! 🎉
