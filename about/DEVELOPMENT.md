# KAIROS 2.0 Development Guide

## 🎯 Quick Start for Developers

### Prerequisites
- Node.js 18+
- Python 3.11+
- Modern browser with camera support

### One-Command Setup

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

---

## 🏗️ Architecture Overview

### Frontend Architecture
```
User → Camera Feed → Object Detection (TensorFlow.js)
                   ↓
            FastAPI Backend (Concept Extraction)
                   ↓
         AR Overlay Rendering (Three.js)
                   ↓
         WebLLM (Optional AI Explanations)
                   ↓
         Study Module Generation
```

### Component Hierarchy
```
App
├── HomePage (/)
│   └── Feature cards, examples, CTA
├── ScanPage (/scan)
│   ├── CameraFeed
│   ├── ObjectDetector (TensorFlow.js)
│   ├── AROverlayCanvas (Three.js)
│   └── ConceptPanel
└── ModulesPage (/modules)
    └── Module cards, search, filters
```

---

## 🔧 Development Workflow

### 1. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - Watch Tests (Optional):**
```bash
npm test -- --watch
```

### 2. Hot Reload

Both frontend and backend support hot reload:
- **Frontend:** Changes in `src/` auto-refresh browser
- **Backend:** Changes in `backend/main.py` auto-restart server

---

## 📝 Adding New Features

### Add New Object Type

**1. Update Backend (`backend/main.py`):**
```python
CONCEPT_DATABASE = {
    "telescope": {
        "concepts": [
            {
                "name": "Optics",
                "category": "physics",
                "formulas": ["1/f = 1/u + 1/v"],
                "overlays": [
                    {"type": "vector", "label": "Light Path", "color": "yellow"}
                ]
            }
        ]
    }
}
```

**2. Test the API:**
```bash
curl -X POST http://localhost:8000/api/extract-concepts \
  -H "Content-Type: application/json" \
  -d '{"object_class": "telescope", "confidence": 0.9}'
```

### Adding a New AR Overlay Type

1. Define the overlay type in `frontend/src/types/index.ts`
2. Add the rendering logic in `frontend/src/components/AROverlayCanvas.tsx`
3. Update the backend concept database in `backend/main.py` to include the new overlay

Example:
```typescript
// frontend/src/types/index.ts
export type AROverlayType = 
  | 'vector'
  | 'flow'
  | 'label'
  | 'arrow'
  | 'heatmap'
  | 'particles'
  | 'trajectory'
  | 'dimensions'
  | 'newOverlayType';  // Add new type
```

```typescript
// frontend/src/components/AROverlayCanvas.tsx
const drawNewOverlay = (ctx: CanvasRenderingContext2D, overlay: AROverlay) => {
  // Implement rendering logic
  ctx.fillStyle = overlay.color || '#ffffff';
  // ... drawing code
};

// Add to render function
case 'newOverlayType':
  drawNewOverlay(ctx, overlay);
  break;
```

### Add New Study Module

**Edit `src/app/modules/page.tsx`:**
```typescript
const SAMPLE_MODULES: Module[] = [
  // ... existing modules
  {
    id: 'quantum',
    title: 'Quantum Mechanics',
    category: 'physics',
    difficulty: 'advanced',
    concepts: ['Wave-particle duality', 'Heisenberg principle', 'Schrödinger equation'],
    icon: '⚛️',
  },
];
```

---

## 🧪 Testing

### Frontend Tests
```bash
npm test                # Run all tests
npm test -- --watch     # Watch mode
npm test -- --coverage  # Coverage report
```

### Backend Tests
```bash
cd backend
pytest                  # Run all tests
pytest -v               # Verbose mode
pytest --cov            # Coverage report
```

### Manual Testing Checklist

- [ ] Camera feed loads correctly
- [ ] Object detection works (point at common objects)
- [ ] AR overlays render on detected objects
- [ ] Concept panel displays correct information
- [ ] Backend API responds within 500ms
- [ ] WebLLM loads (first time may take 5+ minutes)
- [ ] Study modules page loads and filters work
- [ ] Mobile responsive design works
- [ ] Camera switch button functions
- [ ] All links navigate correctly

---

## 🎨 Styling Guidelines

### Tailwind Classes
Use existing utility classes before adding custom CSS:

```tsx
// ✅ Good
<div className="bg-kairos-primary hover:bg-kairos-secondary rounded-lg p-4">

// ❌ Avoid
<div style={{ backgroundColor: '#2563eb', padding: '16px' }}>
```

### Custom Colors
Defined in `tailwind.config.js`:
- `kairos-primary`: #2563eb (blue)
- `kairos-secondary`: #7c3aed (purple)
- `kairos-accent`: #06b6d4 (cyan)
- `kairos-dark`: #0f172a (dark blue-gray)
- `kairos-light`: #f8fafc (light gray)

### Animation Classes
- `animate-float`: Gentle floating motion
- `animate-scan`: Scanning line effect
- `animate-pulse-slow`: Slow pulse for attention

---

## 🔍 Debugging

### Frontend Debugging

**Enable verbose logging:**
```typescript
// Add to src/app/layout.tsx
if (process.env.NODE_ENV === 'development') {
  console.log('🐛 Debug mode enabled');
}
```

**Check AR overlay rendering:**
```typescript
// In AROverlayCanvas.tsx
console.log('Overlays:', overlays);
console.log('Detections:', detections);
```

**Inspect object detection:**
```typescript
// In ObjectDetector.tsx
console.log('Predictions:', predictions);
```

### Backend Debugging

**Enable FastAPI debug mode:**
```python
# In backend/main.py
import logging
logging.basicConfig(level=logging.DEBUG)

@app.post("/api/extract-concepts")
async def extract_concepts(request: ConceptRequest):
    print(f"📥 Request: {request}")
    # ... rest of code
```

**Test API directly:**
```bash
# Health check
curl http://localhost:8000/api/health

# Extract concepts
curl -X POST http://localhost:8000/api/extract-concepts \
  -H "Content-Type: application/json" \
  -d '{"object_class": "plant", "confidence": 0.95}'
```

### Browser DevTools

**Check camera stream:**
```javascript
// In browser console
const video = document.querySelector('video');
console.log('Video dimensions:', video.videoWidth, video.videoHeight);
console.log('Stream active:', video.srcObject?.active);
```

**Monitor performance:**
```javascript
// Measure component render time
performance.mark('component-start');
// ... component code
performance.mark('component-end');
performance.measure('component-render', 'component-start', 'component-end');
console.log(performance.getEntriesByType('measure'));
```

---

## 🚀 Performance Optimization

### Frontend Optimization

**1. Lazy load heavy components:**
```typescript
const AROverlayCanvas = dynamic(() => import('@/components/AROverlayCanvas'), {
  ssr: false,
  loading: () => <div>Loading AR...</div>
});
```

**2. Throttle object detection:**
```typescript
// Reduce detection frequency
detectionIntervalRef.current = setInterval(() => {
  detectObjects(videoElement);
}, 1000); // 1 second instead of 500ms
```

**3. Optimize canvas rendering:**
```typescript
// Use requestAnimationFrame for smooth animations
const animate = () => {
  // Only redraw if needed
  if (overlays.length > 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ... draw overlays
  }
  requestAnimationFrame(animate);
};
```

### Backend Optimization

**1. Add caching:**
```python
from functools import lru_cache

@lru_cache(maxsize=128)
def get_concepts_for_object(object_class: str):
    return CONCEPT_DATABASE.get(object_class)
```

**2. Use async operations:**
```python
from fastapi import BackgroundTasks

@app.post("/api/extract-concepts")
async def extract_concepts(
    request: ConceptRequest,
    background_tasks: BackgroundTasks
):
    # Process immediately
    concepts = get_concepts_for_object(request.object_class)
    
    # Log asynchronously
    background_tasks.add_task(log_detection, request)
    
    return concepts
```

---

## 📦 Building for Production

### Frontend Build
```bash
npm run build
npm start  # Test production build locally
```

### Backend Production Server
```bash
cd backend
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Docker Deployment

**Dockerfile.frontend:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Dockerfile.backend:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
```

---

## 🤝 Contributing Guidelines

1. **Fork & Clone**
2. **Create Feature Branch:** `git checkout -b feature/AmazingFeature`
3. **Make Changes** (follow code style)
4. **Test Thoroughly**
5. **Commit:** `git commit -m 'Add AmazingFeature'`
6. **Push:** `git push origin feature/AmazingFeature`
7. **Open Pull Request**

### Code Style

**TypeScript:**
- Use TypeScript strict mode
- Prefer functional components
- Use meaningful variable names
- Add JSDoc comments for complex functions

**Python:**
- Follow PEP 8
- Use type hints
- Add docstrings for functions
- Keep functions under 50 lines

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Three.js Docs](https://threejs.org/docs/)
- [WebLLM GitHub](https://github.com/mlc-ai/web-llm)

---

**Happy Coding! 🚀**
