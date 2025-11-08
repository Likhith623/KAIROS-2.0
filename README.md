# KAIROS 2.0 🚀

**Turn your camera into an interactive science teacher**

KAIROS 2.0 is a fully web-based AI learning system that transforms real-world objects into interactive learning experiences. Simply point your camera at any object, and KAIROS instantly identifies hidden scientific principles, overlays AR visualizations, and generates detailed study modules—all in your browser, with zero cost and no database.

![KAIROS 2.0](https://img.shields.io/badge/KAIROS-2.0-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11+-green?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-teal?style=flat-square&logo=fastapi)

---

## ✨ Features

### 🔍 Real-Time Object Scanning
- Browser-based ML models (TensorFlow.js + COCO-SSD)
- No server-side processing required
- Works on any device with a camera

### 🔬 Scientific Concept Detection
Point at objects and discover:
- **🌱 Plants** → Photosynthesis, Diffusion, Transpiration, Osmosis
- **🚲 Bicycles** → Torque, Angular Momentum, Mechanical Advantage, Friction
- **🍶 Bottles** → Volume, Surface Area, Pressure, Material Properties
- **⚽ Balls** → Projectile Motion, Elastic Collision, Energy Transfer
- **🚗 Cars** → Newton's Laws, Thermodynamics, Heat Transfer

### ✨ AR Overlays
Live visualizations on camera feed:
- Vector arrows (force, torque)
- Flow animations (CO₂ → O₂)
- Heatmaps (friction, pressure)
- Dimension labels (geometry)
- Particle simulations (diffusion)
- Trajectory paths (projectile motion)

### 📚 Instant Study Modules
Auto-generated content includes:
- Detailed explanations
- Mathematical formulas (rendered with KaTeX)
- Real-world examples
- Practice questions
- Concept relationships

### 🤖 AI-Powered Explanations
- WebLLM with Llama 3.1 (runs locally in browser)
- No API keys or cloud costs
- Privacy-first design

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Three.js** - 3D graphics and AR rendering
- **WebXR** - Augmented reality APIs
- **MindAR.js** - Marker-based AR tracking
- **ONNX Runtime Web** - ML model inference
- **TensorFlow.js** - Object detection (COCO-SSD)
- **WebLLM** - Local LLM inference (Llama 3.1)
- **KaTeX** - LaTeX math rendering
- **Framer Motion** - Smooth animations
- **Zustand** - Lightweight state management

### Backend
- **FastAPI** - High-performance Python API
- **Uvicorn** - ASGI server
- **SymPy** - Symbolic mathematics
- **NetworkX** - Knowledge graph generation
- **Pydantic** - Data validation

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn/pnpm
- **Python** 3.11+
- Modern browser with WebGL support
- Camera access permission

### 1. Clone the Repository
```bash
git clone https://github.com/Likhith623/KAIROS-2.0.git
cd KAIROS-2.0
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Backend

#### Create Python Virtual Environment
```bash
cd backend
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
```bash
# From project root, copy example env file
cp frontend/.env.example frontend/.env.local

# Edit frontend/.env.local with your settings (optional)
```

### 5. Run the Application

#### Terminal 1: Start Backend
```bash
cd backend
source venv/bin/activate  # if not already activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will run at `http://localhost:8000`

#### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will run at `http://localhost:3000`

### 6. Open in Browser
Navigate to `http://localhost:3000` and allow camera access when prompted.

---

## 📱 Usage

### 1. Home Page
- Learn about KAIROS 2.0 features
- Click **"Start Scanning"** to launch the AR camera

### 2. Scan Page
- Grant camera permission
- Point camera at any object
- Click the **scan button** (🔍)
- Watch as KAIROS:
  - Detects the object
  - Identifies scientific concepts
  - Overlays AR visualizations
  - Shows concept panel

### 3. Study Modules
- Click **"Open Study Modules"** from concept panel
- Browse modules by category
- Search for specific concepts
- Learn with detailed explanations and formulas

---

## 🎯 Example Workflows

### Workflow 1: Learning About Plants 🌱
1. Point camera at a plant
2. KAIROS detects: `plant`
3. Concepts identified:
   - Photosynthesis (6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂)
   - Diffusion (J = -D × dC/dx)
   - Transpiration
4. AR overlays show:
   - CO₂ → O₂ flow animation
   - Chlorophyll highlighting
   - Water vapor arrows
5. Study modules available for deeper learning

### Workflow 2: Understanding Bicycles 🚲
1. Point camera at bicycle
2. KAIROS detects: `bicycle`
3. Concepts identified:
   - Torque (τ = r × F)
   - Angular Momentum (L = I × ω)
   - Mechanical Advantage
   - Friction
4. AR overlays show:
   - Rotating torque vectors on pedals
   - Gear ratio visualization
   - Friction heatmap on tires
5. Interactive formulas with explanations

---

## 🗂️ Project Structure

```
KAIROS-2.0/
├── backend/                  # Python FastAPI backend
│   ├── main.py              # API routes & concept database
│   └── requirements.txt     # Python dependencies
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx        # Home page
│   │   ├── scan/           # AR scanning page
│   │   ├── modules/        # Study modules page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/          # React components
│   │   ├── CameraFeed.tsx           # Camera access & stream
│   │   ├── ObjectDetector.tsx       # TensorFlow.js detection
│   │   ├── AROverlayCanvas.tsx      # Three.js AR rendering
│   │   └── ConceptPanel.tsx         # Concept display UI
│   ├── lib/                 # Utilities & services
│   │   ├── api/            # Backend API client
│   │   ├── stores/         # Zustand state management
│   │   └── webllm/         # WebLLM integration
│   ├── types/              # TypeScript type definitions
│   └── hooks/              # Custom React hooks
├── public/                  # Static assets
├── package.json            # Node dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.js      # Tailwind CSS config
├── next.config.js          # Next.js configuration
└── README.md               # This file
```

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` in project root:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# WebLLM Model (optional - runs in browser)
NEXT_PUBLIC_LLM_MODEL=Llama-3.1-8B-Instruct-q4f32_1-MLC

# Feature Flags
NEXT_PUBLIC_ENABLE_WEBLLM=true
NEXT_PUBLIC_ENABLE_AR_OVERLAYS=true
```

### Customizing Concepts

Edit `backend/main.py` to add new objects and concepts:

```python
CONCEPT_DATABASE = {
    "your_object": {
        "concepts": [
            {
                "name": "Your Concept",
                "category": "physics",
                "formulas": ["F = ma"],
                "overlays": [
                    {"type": "vector", "color": "blue"}
                ]
            }
        ]
    }
}
```

---

## 🎨 Customization

### Adding New AR Overlays

Edit `src/components/AROverlayCanvas.tsx`:

```typescript
// Add new overlay type
case 'custom':
  drawCustomOverlay(ctx, x, y, overlay);
  break;

// Implement drawing function
const drawCustomOverlay = (ctx: CanvasRenderingContext2D, x: number, y: number, overlay: AROverlay) => {
  // Your custom rendering logic
};
```

### Styling

Modify colors in `tailwind.config.js`:

```javascript
colors: {
  'kairos-primary': '#2563eb',    // Primary blue
  'kairos-secondary': '#7c3aed',  // Secondary purple
  'kairos-accent': '#06b6d4',     // Accent cyan
}
```

---

## 📊 API Endpoints

### Backend API (`http://localhost:8000`)

#### `POST /api/extract-concepts`
Extract scientific concepts from detected object.

**Request:**
```json
{
  "object_class": "plant",
  "confidence": 0.95,
  "context": "outdoor"
}
```

**Response:**
```json
{
  "concepts": [...],
  "overlays": [...],
  "modules": [...]
}
```

#### `POST /api/solve-equation`
Solve mathematical equations using SymPy.

**Query Params:**
- `equation`: Math equation string
- `variable`: Variable to solve for (default: "x")

#### `POST /api/concept-relationships`
Get knowledge graph of concept relationships.

**Request:**
```json
["photosynthesis", "diffusion", "osmosis"]
```

---

## 🧪 Development

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

### Build for Production
```bash
npm run build
npm start
```

### Backend Development
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## 🚀 Deployment

### Vercel (Frontend)
```bash
vercel deploy
```

### Docker (Backend)
```bash
cd backend
docker build -t kairos-backend .
docker run -p 8000:8000 kairos-backend
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Roadmap

- [ ] Add more object categories (astronomy, engineering, etc.)
- [ ] Implement marker-based AR with MindAR
- [ ] Add WebXR immersive mode
- [ ] Create multiplayer learning sessions
- [ ] Export study notes to PDF
- [ ] Add voice explanations
- [ ] Offline mode with service workers
- [ ] Mobile app (React Native)

---

## 🐛 Troubleshooting

### Camera Not Working
- Ensure HTTPS or localhost
- Check browser camera permissions
- Try different browser (Chrome/Edge recommended)

### Backend Connection Failed
- Verify backend is running on port 8000
- Check CORS settings in `backend/main.py`
- Confirm `NEXT_PUBLIC_API_URL` in `.env.local`

### WebLLM Loading Slow
- First load downloads ~4GB model
- Model caches in browser for future use
- Disable WebLLM in `.env.local` if not needed

### TypeScript Errors
- Run `npm install` to ensure all dependencies installed
- Delete `.next` folder and rebuild

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **TensorFlow.js** - Object detection models
- **WebLLM** - Local LLM inference
- **Three.js** - 3D graphics
- **FastAPI** - Python backend framework
- **Next.js** - React framework

---

## 📧 Contact

**Likhith** - [@Likhith623](https://github.com/Likhith623)

**Project Link:** [https://github.com/Likhith623/KAIROS-2.0](https://github.com/Likhith623/KAIROS-2.0)

---

## ⭐ Show Your Support

If you find KAIROS 2.0 helpful, please consider giving it a ⭐ on GitHub!

---

**Made with ❤️ for curious minds and lifelong learners**