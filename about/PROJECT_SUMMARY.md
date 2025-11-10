# 📦 KAIROS 2.0 - Complete Project Structure

## 📁 Project Files Overview

```
KAIROS-2.0/
│
├── 📄 README.md                     # Main project documentation
├── 📄 GETTING_STARTED.md            # Quick start guide for users
├── 📄 DEVELOPMENT.md                # Developer guide and API docs
├── 📄 LICENSE                       # MIT License
├── 📄 .gitignore                    # Git ignore rules
├── 📄 .env.example                  # Environment variables template
├── 📄 package.json                  # Node.js dependencies
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 next.config.js                # Next.js configuration
├── 📄 tailwind.config.js            # Tailwind CSS configuration
├── 📄 postcss.config.js             # PostCSS configuration
├── 🔧 setup.sh                      # macOS/Linux setup script
├── 🔧 setup.bat                     # Windows setup script
│
├── 📂 backend/                      # Python FastAPI backend
│   ├── main.py                      # API routes & concept database
│   └── requirements.txt             # Python dependencies
│
├── 📂 src/                          # Next.js frontend source
│   ├── 📂 app/                      # Next.js App Router
│   │   ├── page.tsx                 # Homepage
│   │   ├── layout.tsx               # Root layout
│   │   ├── globals.css              # Global styles
│   │   ├── 📂 scan/                 # AR scanning page
│   │   │   └── page.tsx
│   │   └── 📂 modules/              # Study modules page
│   │       └── page.tsx
│   │
│   ├── 📂 components/               # React components
│   │   ├── CameraFeed.tsx           # Camera stream management
│   │   ├── ObjectDetector.tsx       # TensorFlow.js object detection
│   │   ├── AROverlayCanvas.tsx      # Three.js AR rendering
│   │   └── ConceptPanel.tsx         # Concept display UI
│   │
│   ├── 📂 lib/                      # Utilities & services
│   │   ├── 📂 api/                  # Backend API client
│   │   │   └── client.ts
│   │   ├── 📂 stores/               # Zustand state management
│   │   │   └── arStore.ts
│   │   └── 📂 webllm/               # WebLLM integration
│   │       ├── index.ts
│   │       └── worker.ts
│   │
│   └── 📂 types/                    # TypeScript types
│       └── index.ts
│
└── 📂 public/                       # Static assets
    └── (favicon, images, etc.)
```

---

## 🎯 Key Features Implemented

### ✅ Frontend (Next.js + TypeScript)
- [x] Responsive homepage with feature showcase
- [x] Real-time camera feed with WebRTC
- [x] Object detection using TensorFlow.js (COCO-SSD)
- [x] AR overlay rendering with Three.js canvas
- [x] Scientific concept panel with expandable cards
- [x] Study modules page with search & filtering
- [x] WebLLM integration for AI explanations
- [x] Tailwind CSS custom styling
- [x] Framer Motion animations
- [x] Zustand state management
- [x] Mobile-responsive design

### ✅ Backend (FastAPI + Python)
- [x] REST API with FastAPI
- [x] Concept extraction endpoint
- [x] Mathematical equation solver (SymPy)
- [x] Knowledge graph generation (NetworkX)
- [x] Comprehensive concept database
- [x] CORS configuration for frontend
- [x] Health check endpoint
- [x] Pydantic data validation

### ✅ AR Overlays (Canvas 2D)
- [x] Vector arrows (torque, force)
- [x] Flow animations (CO₂ → O₂)
- [x] Label overlays
- [x] Directional arrows
- [x] Heatmap gradients
- [x] Particle simulations
- [x] Trajectory paths
- [x] Dimension measurements

### ✅ Object Concepts Database
- [x] Plants (Photosynthesis, Diffusion, Osmosis)
- [x] Bicycles (Torque, Angular Momentum, Friction)
- [x] Bottles (Volume, Pressure, Materials)
- [x] Balls (Projectile Motion, Collisions)
- [x] Cars (Newton's Laws, Thermodynamics)

---

## 🚀 Technologies Used

### Frontend Stack
| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework | 14.2.0 |
| TypeScript | Type safety | 5.5.0 |
| Tailwind CSS | Styling | 3.4.0 |
| Three.js | 3D/AR graphics | 0.168.0 |
| TensorFlow.js | ML inference | 4.21.0 |
| WebLLM | Local LLM | 0.2.72 |
| ONNX Runtime | ML models | 1.19.0 |
| KaTeX | Math rendering | 0.16.11 |
| Framer Motion | Animations | 11.5.0 |
| Zustand | State management | 4.5.0 |
| Axios | HTTP client | 1.7.0 |

### Backend Stack
| Technology | Purpose | Version |
|------------|---------|---------|
| FastAPI | Web framework | 0.115.0+ |
| Uvicorn | ASGI server | 0.31.0+ |
| SymPy | Symbolic math | 1.13.0+ |
| NetworkX | Graph theory | 3.3+ |
| Pydantic | Data validation | 2.9.0+ |
| Python | Language | 3.11+ |

---

## 🎨 Design System

### Color Palette
```css
--kairos-primary:   #2563eb  /* Blue - Primary actions */
--kairos-secondary: #7c3aed  /* Purple - Secondary actions */
--kairos-accent:    #06b6d4  /* Cyan - Highlights */
--kairos-dark:      #0f172a  /* Dark blue-gray - Backgrounds */
--kairos-light:     #f8fafc  /* Light gray - Text backgrounds */
```

### Typography
- **Font**: Inter (sans-serif)
- **Headings**: Bold, large sizes (text-4xl to text-8xl)
- **Body**: Regular weight, readable sizes (text-base to text-xl)
- **Code**: Monospace for formulas and equations

### Components
- **Concept Cards**: Glassmorphism effect with backdrop blur
- **Module Cards**: Gradient backgrounds with hover effects
- **Buttons**: Rounded-full with transition animations
- **AR Overlays**: Semi-transparent with neon colors
- **Loading States**: Spinner animations with pulse effects

---

## 🔌 API Endpoints

### Backend API (`http://localhost:8000`)

#### 1. Extract Concepts
```http
POST /api/extract-concepts
Content-Type: application/json

{
  "object_class": "plant",
  "confidence": 0.95,
  "context": "outdoor"
}

Response: {
  "concepts": [...],
  "overlays": [...],
  "modules": [...]
}
```

#### 2. Solve Equation
```http
POST /api/solve-equation?equation=x^2-4&variable=x

Response: {
  "equation": "x^2-4",
  "variable": "x",
  "solutions": ["-2", "2"],
  "latex": "x^{2} - 4"
}
```

#### 3. Concept Relationships
```http
POST /api/concept-relationships
Content-Type: application/json

["photosynthesis", "diffusion"]

Response: {
  "nodes": [...],
  "edges": [...]
}
```

#### 4. Health Check
```http
GET /api/health

Response: {
  "status": "healthy",
  "service": "KAIROS 2.0 Backend"
}
```

---

## 📊 Data Flow

### Object Detection → Concept Display
```
1. User points camera at object
2. CameraFeed captures video stream
3. ObjectDetector runs TensorFlow.js inference
4. Detection sent to FastAPI backend
5. Backend matches object to concepts
6. Concepts & overlays returned
7. AROverlayCanvas renders visualizations
8. ConceptPanel displays information
```

### Study Module Generation
```
1. User clicks "Open Study Modules"
2. Backend generates module metadata
3. WebLLM (optional) enhances explanations
4. Modules page renders with KaTeX formulas
5. User browses, searches, and learns
```

---

## 🔐 Environment Variables

Create `.env.local` in project root:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# WebLLM Model (optional)
NEXT_PUBLIC_LLM_MODEL=Llama-3.1-8B-Instruct-q4f32_1-MLC

# Feature Flags
NEXT_PUBLIC_ENABLE_WEBLLM=true
NEXT_PUBLIC_ENABLE_AR_OVERLAYS=true
```

---

## 🧪 Testing Strategy

### Frontend Tests
- Component unit tests (React Testing Library)
- Integration tests (camera + detection flow)
- E2E tests (Playwright/Cypress)
- Visual regression tests (Percy/Chromatic)

### Backend Tests
- API endpoint tests (pytest)
- Concept extraction accuracy
- Performance benchmarks
- Load testing (Locust)

---

## 📈 Performance Metrics

### Target Benchmarks
- **Object Detection**: < 500ms per frame
- **API Response Time**: < 200ms
- **AR Overlay Rendering**: 60 FPS
- **Page Load Time**: < 2s (cached)
- **Bundle Size**: < 500KB (gzipped)

### Optimization Techniques
- Code splitting with Next.js dynamic imports
- Image optimization with next/image
- Canvas rendering with requestAnimationFrame
- Debounced object detection
- Service worker caching (future)

---

## 🚢 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)
```bash
# Frontend
vercel deploy

# Backend
railway up
```

### Option 2: Docker Compose
```bash
docker-compose up -d
```

### Option 3: Traditional Hosting
```bash
# Frontend: Build and deploy static files
npm run build
npm start

# Backend: Use gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

## 🎓 Learning Resources

### For Contributors
- **Next.js**: https://nextjs.org/learn
- **TypeScript**: https://www.typescriptlang.org/docs/
- **TensorFlow.js**: https://www.tensorflow.org/js/tutorials
- **Three.js**: https://threejs.org/manual/
- **FastAPI**: https://fastapi.tiangolo.com/tutorial/

### For Users
- Read `GETTING_STARTED.md` for quick setup
- Read `DEVELOPMENT.md` for customization
- Check API docs at `http://localhost:8000/docs`

---

## 🎯 Future Enhancements

### Phase 2 (Planned)
- [ ] Marker-based AR with MindAR
- [ ] WebXR immersive mode (VR headsets)
- [ ] Voice commands and explanations
- [ ] Multiplayer learning sessions
- [ ] Export study notes to PDF
- [ ] Offline mode with service workers

### Phase 3 (Ideas)
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Teacher dashboard
- [ ] Student progress tracking
- [ ] Gamification (badges, points)
- [ ] Community-contributed concepts

---

## 📞 Support

- **Documentation**: README.md, GETTING_STARTED.md, DEVELOPMENT.md
- **Issues**: https://github.com/Likhith623/KAIROS-2.0/issues
- **API Docs**: http://localhost:8000/docs (when running)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

Built with amazing open-source technologies:
- TensorFlow.js team for COCO-SSD
- WebLLM team for browser-based LLMs
- Three.js contributors
- FastAPI & Uvicorn teams
- Next.js & Vercel team

---

**KAIROS 2.0** - Bringing science to life through AI and AR! 🚀✨
