# 🎮 KAIROS 2.0 - Command Reference

Quick reference for all commands used in KAIROS 2.0 development.

---

## 📦 Installation

### Automated Setup
```bash
# macOS/Linux
./setup.sh

# Windows
setup.bat
```

### Manual Installation
```bash
# Install frontend dependencies
cd frontend
npm install

# Set up Python backend
cd ../backend
python3 -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows
pip install -r requirements.txt
cd ..

# Create environment file
cp frontend/.env.example frontend/.env.local
```

---

## ▶️ Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### Run Both (Alternative - using npm scripts)
```bash
# In frontend/package.json, you can add:
cd frontend
npm run dev        # Runs frontend

# In separate terminal for backend:
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

---

## 🔧 Development Commands

### Frontend

All commands should be run from the `frontend/` directory:

```bash
cd frontend

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npx tsc --noEmit

# Run tests
npm test

# Watch tests
npm test -- --watch

# Test coverage
npm test -- --coverage
```

### Backend

```bash
# Activate virtual environment first!
cd backend
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows

# Run development server
uvicorn main:app --reload

# Run with custom host/port
uvicorn main:app --host 0.0.0.0 --port 8080

# Run tests (if you add them)
pytest

# Run with coverage
pytest --cov

# Format code
black main.py

# Lint code
flake8 main.py
```

---

## 📝 Git Commands

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit: KAIROS 2.0 complete project"
git branch -M main
git remote add origin https://github.com/Likhith623/KAIROS-2.0.git
git push -u origin main

# Daily workflow
git status
git add .
git commit -m "Your commit message"
git push

# Create feature branch
git checkout -b feature/new-feature
git push -u origin feature/new-feature

# Merge feature
git checkout main
git merge feature/new-feature
git push
```

---

## 🐳 Docker Commands

### Build Images
```bash
# Frontend
docker build -t kairos-frontend .

# Backend
docker build -t kairos-backend ./backend
```

### Run Containers
```bash
# Frontend
docker run -p 3000:3000 kairos-frontend

# Backend
docker run -p 8000:8000 kairos-backend

# Using Docker Compose
docker-compose up
docker-compose up -d    # Detached mode
docker-compose down     # Stop containers
```

---

## 🧹 Cleanup Commands

```bash
# Remove node_modules
rm -rf node_modules

# Remove Python virtual environment
rm -rf backend/venv

# Remove build artifacts
rm -rf .next
rm -rf dist
rm -rf build

# Clear npm cache
npm cache clean --force

# Clear Python cache
find . -type d -name "__pycache__" -exec rm -r {} +

# Full cleanup and reinstall
rm -rf node_modules .next
npm install
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 🔍 Debugging Commands

### Check Ports
```bash
# Check if port 3000 is in use
lsof -i :3000          # macOS/Linux
netstat -ano | findstr :3000    # Windows

# Check if port 8000 is in use
lsof -i :8000          # macOS/Linux
netstat -ano | findstr :8000    # Windows

# Kill process on port
kill -9 $(lsof -t -i:3000)      # macOS/Linux
```

### View Logs
```bash
# Frontend logs
npm run dev 2>&1 | tee frontend.log

# Backend logs
uvicorn main:app --reload 2>&1 | tee backend.log

# Docker logs
docker logs container_name
docker-compose logs -f
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:8000/api/health

# Extract concepts
curl -X POST http://localhost:8000/api/extract-concepts \
  -H "Content-Type: application/json" \
  -d '{"object_class": "plant", "confidence": 0.95}'

# Solve equation
curl -X POST "http://localhost:8000/api/solve-equation?equation=x^2-4&variable=x"

# View API docs
open http://localhost:8000/docs    # macOS
start http://localhost:8000/docs   # Windows
```

---

## 📦 Package Management

### Update Dependencies
```bash
# Update npm packages
npm update

# Update specific package
npm update package-name

# Check outdated packages
npm outdated

# Update to latest versions
npx npm-check-updates -u
npm install

# Update Python packages
cd backend
source venv/bin/activate
pip list --outdated
pip install --upgrade package-name
pip freeze > requirements.txt
```

---

## 🚀 Deployment Commands

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
```

### Railway (Backend)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up

# View logs
railway logs
```

### Heroku (Alternative)
```bash
# Login
heroku login

# Create app
heroku create kairos-backend

# Deploy backend
cd backend
git subtree push --prefix backend heroku main

# View logs
heroku logs --tail
```

---

## 🧪 Testing Commands

### Frontend Testing
```bash
# Unit tests
npm test

# Specific test file
npm test -- CameraFeed.test.tsx

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# Update snapshots
npm test -- -u

# E2E tests (if configured)
npx playwright test
npx cypress open
```

### Backend Testing
```bash
cd backend
source venv/bin/activate

# Run all tests
pytest

# Specific test file
pytest tests/test_api.py

# Verbose mode
pytest -v

# Coverage
pytest --cov=. --cov-report=html

# Run specific test
pytest tests/test_api.py::test_extract_concepts
```

---

## 🛠️ Maintenance Commands

### Dependency Audit
```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may break)
npm audit fix --force

# Python security check
pip install safety
safety check
```

### Code Quality
```bash
# Frontend linting
npm run lint
npm run lint -- --fix

# Prettier formatting
npx prettier --write .

# Type checking
npx tsc --noEmit

# Backend formatting
cd backend
black .
isort .

# Backend linting
flake8 .
pylint main.py
```

---

## 📊 Performance Analysis

```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Lighthouse audit
npx lighthouse http://localhost:3000

# Performance testing
npm install -g clinic
clinic doctor -- node server.js

# Load testing (backend)
pip install locust
locust -f locustfile.py
```

---

## 💾 Database Commands (Future)

```bash
# If you add a database later:

# SQLite
sqlite3 kairos.db

# PostgreSQL
psql kairos_db

# MongoDB
mongo kairos_db

# Prisma
npx prisma migrate dev
npx prisma studio
```

---

## 🔐 Environment Management

```bash
# Create environment files
cp .env.example .env.local
cp .env.example .env.production

# Load environment variables
export $(cat .env.local | xargs)     # Linux/macOS
Get-Content .env.local | ForEach-Object { [Environment]::SetEnvironmentVariable($_.Split('=')[0], $_.Split('=')[1]) }  # PowerShell

# View current env vars
printenv | grep NEXT_     # Linux/macOS
Get-ChildItem Env:NEXT_*  # PowerShell
```

---

## 🎯 Quick Commands Cheat Sheet

```bash
# Start everything
Terminal 1: cd backend && source venv/bin/activate && uvicorn main:app --reload
Terminal 2: npm run dev

# Full reset
rm -rf node_modules .next backend/venv && ./setup.sh

# Quick test
curl http://localhost:8000/api/health && curl http://localhost:3000

# Deploy
vercel --prod && railway up

# Update all
npm update && cd backend && pip list --outdated

# Clean build
rm -rf .next && npm run build && npm start
```

---

## 📱 Browser Commands

```bash
# Open in default browser
open http://localhost:3000           # macOS
start http://localhost:3000          # Windows
xdg-open http://localhost:3000       # Linux

# Open API docs
open http://localhost:8000/docs      # macOS
start http://localhost:8000/docs     # Windows
```

---

## 🆘 Emergency Commands

```bash
# If npm/Node.js is broken
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# If Python is broken
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# If ports are stuck
lsof -ti:3000 | xargs kill -9      # macOS/Linux
lsof -ti:8000 | xargs kill -9      # macOS/Linux

# If Git is messy
git reset --hard HEAD
git clean -fd

# Nuclear option (start fresh)
git clean -fdx
./setup.sh
```

---

## 📚 Documentation Commands

```bash
# Generate API docs (backend)
cd backend
python -m pydoc -w main

# Generate TypeScript docs
npx typedoc --out docs src

# Preview README locally
npx grip README.md
```

---

**Pro Tip**: Bookmark this file for quick reference! 🔖

---

**KAIROS 2.0 Command Reference** - Your terminal cheat sheet! 💻✨
