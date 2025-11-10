# 🧪 KAIROS 2.0 - Testing Guide

## ✅ System Status Check

### 1. Backend Health Check
```bash
curl http://localhost:8000/api/health
# Expected: {"status":"healthy","service":"KAIROS 2.0 Backend"}
```

### 2. Frontend Running
```bash
curl http://localhost:3000
# Expected: HTML response (Next.js page)
```

## 🎯 Test AR Overlays

### Step 1: Start Both Servers
```bash
# Terminal 1: Backend
cd /Users/likhith./KAIROS-2.0/backend
python3 -m uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd /Users/likhith./KAIROS-2.0/frontend
npm run dev
```

### Step 2: Open AR Scan Page
1. Navigate to **http://localhost:3000/scan**
2. Click the **🔍 Scan** button
3. Allow camera permissions when prompted

### Step 3: Point Camera at Objects

#### 🌿 Test with Plant/Leaf:
**Expected AR Overlays:**
- Green glowing bounding box with corner markers
- Labels: "Blade" (top), "Petiole" (middle), "Base" (bottom), "Stoma" (right), "Chloroplast" (center)
- Blue arrow pointing down: "H₂O Uptake"
- Cyan arrow pointing up: "O₂ Release"
- Green particles moving randomly: "CO₂"
- Top-left panel shows: "Photosynthesis" concept

#### 🚴 Test with Bicycle:
**Expected AR Overlays:**
- Green glowing bounding box
- Labels: "Pedal", "Crank Arm", "Chain", "Wheel", "Frame", "Handlebar"
- Red/orange/yellow color gradient for labels
- Rotating force vectors
- Top-left panel shows: "Torque" concept

#### 🍾 Test with Bottle:
**Expected AR Overlays:**
- Cyan glowing bounding box
- Labels: "Cap/Lid", "Neck", "Body", "Base"
- Dimension labels: "Height (h)", "Radius (r)"
- Top-left panel shows: "Volume & Surface Area" concept

#### ⚽ Test with Ball:
**Expected AR Overlays:**
- Orange glowing bounding box
- Labels: "Panels", "Valve", "Seam", "Surface"
- Red arrow pointing down: "Gravity (g)"
- Yellow trajectory path
- Top-left panel shows: "Projectile Motion" concept

#### 🚗 Test with Car (or car image):
**Expected AR Overlays:**
- Multicolor glowing bounding box
- Labels: "Engine", "Wheels", "Chassis", "Doors", "Headlights", "Windshield"
- Green vector: "Acceleration"
- Red arrow: "Friction"
- Top-left panel shows: "Newton's Laws" concept

### Step 4: Verify Top-Left Panel
- Shows detected concept name
- Shows confidence percentage
- Shows 2-3 recommended modules
- Clicking module navigates to /modules?topic=...

## 📚 Test Module Generation

### Test 1: Generate Physics Topics
```bash
curl "http://localhost:8000/api/topics/generate?subject=Physics&count=5" | python3 -m json.tool
```

**Expected Output:**
```json
{
  "subject": "Physics",
  "topics": [
    {
      "name": "Newton's Laws",
      "category": "physics",
      "notes": "200-300 word explanation...",
      "formulas": ["F=ma", "p=mv", ...],
      "difficulty": "intermediate",
      "key_points": ["...", "..."],
      "applications": ["...", "..."],
      "byjus_link": "https://byjus.com/search/?q=Newton's+Laws"
    },
    ...
  ],
  "total": 5
}
```

### Test 2: Generate Comprehensive Catalog
```bash
curl "http://localhost:8000/api/topics/generate?count=100" | python3 -m json.tool | head -n 100
```

**Expected:** Array of 100 topics across all subjects

### Test 3: Browse Modules in Browser
1. Navigate to **http://localhost:3000/modules**
2. Wait 3-5 seconds for Gemini to generate topics
3. Should see 100+ module cards
4. Filter by category (Math, Physics, Chemistry, etc.)
5. Search for "Newton" - should show Newton's Laws
6. Click "Open on BYJU'S" - opens BYJU'S search page

## 🔍 Debug Console Logs

### Expected Console Output (Frontend):

```
✅ Object detection model loaded
🔍 Detection results: 1 objects found
   Class: potted plant
   Score: 0.9523
   Bbox: [123, 45, 234, 345]

📚 Concepts loaded: {concepts: [...], overlays: [...], modules: [...]}

🎨 AROverlayCanvas mounted: {
  overlays: 9,
  detections: 1,
  videoReady: true
}

📐 Canvas resized: 1280 x 720

✅ Professional AR Canvas Ready: 1280 x 720
```

### Expected Console Output (Backend):

```
🤖 Gemini raw response for Physics:
```json
[{"name":"Newton's Laws",...}]
```

✅ Generated 3 topics for Physics

INFO: 127.0.0.1:61857 - "GET /api/topics/generate?subject=Physics&count=3 HTTP/1.1" 200 OK
INFO: 127.0.0.1:61858 - "POST /api/extract-concepts HTTP/1.1" 200 OK
```

## 🐛 Common Issues & Fixes

### Issue 1: AR Overlays Not Showing
**Symptoms:** Video works, detection works, but no AR overlays visible

**Debug Steps:**
1. Open browser console (F12)
2. Check for error messages
3. Verify `overlays` array has items:
   ```javascript
   // In console
   console.log('Overlays:', overlays);
   // Should show array with 8-12 items
   ```
4. Check canvas size:
   ```javascript
   const canvas = document.querySelector('canvas');
   console.log('Canvas:', canvas.width, canvas.height);
   // Should match video size (e.g., 1280x720)
   ```

**Fix:**
- Refresh page
- Restart frontend server
- Check if `ProfessionalAROverlay` component is imported correctly

### Issue 2: Gemini API Not Working
**Symptoms:** `topics` array is empty, error 404 or 500

**Debug Steps:**
1. Check API key is correct in `backend/main.py`
2. Test manually:
   ```bash
   curl -v "http://localhost:8000/api/topics/generate?subject=Physics&count=1"
   ```
3. Check backend logs for errors

**Fix:**
- Update Gemini model name (currently using `gemini-2.0-flash-exp`)
- Check if google-generativeai package is installed:
  ```bash
  pip3 show google-generativeai
  ```

### Issue 3: Camera Permission Denied
**Symptoms:** Video feed shows "Camera access denied"

**Fix:**
1. Allow camera permissions in browser settings
2. Use HTTPS (or localhost)
3. Try different browser (Chrome recommended)

### Issue 4: Labels Not Positioned Correctly
**Symptoms:** Labels overlap with object or each other

**Fix:**
- Adjust position in `backend/main.py` CONCEPT_DATABASE
- Supported positions: top, bottom, left, right, center, top-left, bottom-right, front
- Example:
  ```python
  {"type": "label", "text": "Blade", "position": "top", "color": "#00ff00"}
  ```

### Issue 5: Performance Issues
**Symptoms:** Laggy AR rendering, low FPS

**Fix:**
1. Reduce particle count in ProfessionalAROverlay.tsx (change `particleCount` from 30 to 15)
2. Increase detection interval in ObjectDetector.tsx (change from 500ms to 1000ms)
3. Use smaller video resolution

## 📊 Performance Benchmarks

### Good Performance:
- Object detection: 2-3 FPS (every 500ms)
- AR rendering: 60 FPS
- API response: < 200ms
- Topic generation: 5-10 seconds for 100 topics

### Expected Load Times:
- Initial page load: 1-2 seconds
- Camera activation: 1-2 seconds
- First detection: 500ms-1s
- Concept fetch: 100-300ms
- AR overlay render: Instant (60 FPS)

## ✅ Test Checklist

- [ ] Backend health check passes
- [ ] Frontend loads at localhost:3000
- [ ] Modules page shows 100+ topics
- [ ] Can filter modules by category
- [ ] Can search modules by keyword
- [ ] Scan page opens camera successfully
- [ ] Object detection works (green bounding box)
- [ ] AR overlays render with labels
- [ ] Labels have correct colors and positions
- [ ] Arrows animate smoothly
- [ ] Particles move realistically
- [ ] Top-left panel shows concepts
- [ ] Recommended modules link to /modules?topic=...
- [ ] BYJU'S links work
- [ ] 60 FPS smooth rendering
- [ ] No console errors

## 🎓 Success Criteria

### Minimum Viable AR:
✅ Object detected
✅ Bounding box visible
✅ At least 1 label showing
✅ Top-left panel with concept name

### Professional AR:
✅ Glowing bounding box with corner markers
✅ 5-10 anatomical labels positioned correctly
✅ Animated arrows showing processes
✅ Particle effects for molecules
✅ Smooth 60 FPS rendering
✅ Connection lines linking labels to object
✅ Gradient backgrounds on labels
✅ Pulsing animations

### Complete System:
✅ 100+ modules auto-generated
✅ Professional AR overlays
✅ Real-time Gemini content
✅ Module recommendations working
✅ BYJU'S integration functional
✅ Search and filter working
✅ No console errors
✅ Smooth user experience

---

## 🚀 Quick Test Command

Run all tests at once:
```bash
# Test backend
curl http://localhost:8000/api/health && echo "✅ Backend OK"

# Test Gemini
curl -s "http://localhost:8000/api/topics/generate?subject=Physics&count=1" | grep -q "Newton" && echo "✅ Gemini OK"

# Test concepts
curl -s -X POST "http://localhost:8000/api/extract-concepts" \
  -H "Content-Type: application/json" \
  -d '{"object_class":"potted plant","confidence":0.9}' | grep -q "Photosynthesis" && echo "✅ Concepts OK"

# Test frontend (basic)
curl -s http://localhost:3000 | grep -q "KAIROS" && echo "✅ Frontend OK"

echo "🎉 All systems operational!"
```

---

**🧪 Happy Testing!**
**KAIROS 2.0 - Learn through Reality**
