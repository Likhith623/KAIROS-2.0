# 🚀 Getting Started with KAIROS 2.0

Welcome to KAIROS 2.0! This guide will help you get the app running in under 5 minutes.

---

## ⚡ Quick Setup (Automated)

### Option 1: Automated Setup Script

**macOS/Linux:**
```bash
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

The script will:
✅ Check prerequisites (Node.js, Python)
✅ Install all dependencies
✅ Set up Python virtual environment
✅ Create configuration files

---

## 🔧 Manual Setup

If you prefer to set up manually or the script fails:

### Step 1: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 2: Set Up Python Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # macOS/Linux
# OR
venv\Scripts\activate         # Windows

pip install -r requirements.txt
cd ..
```

### Step 3: Create Environment File
```bash
cp frontend/.env.example frontend/.env.local
```

---

## ▶️ Running KAIROS 2.0

You need **TWO terminal windows** running simultaneously.

### Terminal 1️⃣: Backend Server

```bash
cd backend
source venv/bin/activate      # macOS/Linux
# OR
venv\Scripts\activate         # Windows

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ Backend will run at: `http://localhost:8000`

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```

This starts the Next.js development server at `http://localhost:3000`.

---

## 🌐 Open in Browser

Navigate to: **http://localhost:3000**

You'll see the KAIROS 2.0 homepage!

---

## 📱 First-Time Usage

1. **Click "Start Scanning"** on the homepage
2. **Allow camera access** when prompted (required!)
3. **Point camera at an object** (plant, bicycle, bottle, ball, etc.)
4. **Tap the scan button** (🔍) at the bottom
5. **Watch the magic happen!** ✨
   - Object gets detected
   - Scientific concepts appear
   - AR overlays render on camera feed
   - Study modules become available

---

## 🎯 Supported Objects

KAIROS 2.0 currently recognizes these objects with pre-configured concepts:

| Object | Concepts Detected |
|--------|-------------------|
| 🌱 **Plant** | Photosynthesis, Diffusion, Transpiration, Osmosis |
| 🚲 **Bicycle** | Torque, Angular Momentum, Mechanical Advantage, Friction |
| 🍶 **Bottle** | Volume & Surface Area, Pressure, Material Properties |
| ⚽ **Ball** | Projectile Motion, Elastic Collision, Energy Transfer |
| 🚗 **Car** | Newton's Laws, Thermodynamics, Heat Transfer |

*More objects coming soon! You can also add your own (see DEVELOPMENT.md)*

---

## 🔥 Pro Tips

### Tip 1: Better Object Detection
- Ensure good lighting
- Hold camera steady
- Keep object in frame
- Move closer for small objects

### Tip 2: AR Overlays
- AR overlays appear automatically when object is detected
- Different concepts show different visualizations:
  - **Vectors** (rotating arrows for torque)
  - **Flows** (animated particles for diffusion)
  - **Heatmaps** (color gradients for friction)
  - **Dimensions** (measurement lines)

### Tip 3: Study Modules
- Click "Open Study Modules" from the concept panel
- Or navigate directly to `/modules` page
- Search and filter by category
- Bookmark interesting modules for later

### Tip 4: Performance
- **First load**: May take time to download ML models (~100MB)
- **Subsequent loads**: Models cached in browser (instant!)
- **WebLLM**: First-time download is ~4GB (optional feature)

---

## ❓ Troubleshooting

### Camera Not Working?
```
✅ Solutions:
- Grant camera permission in browser settings
- Use HTTPS or localhost (required for camera access)
- Try Chrome/Edge (best support)
- Check if another app is using camera
- Restart browser
```

### Backend Connection Failed?
```
✅ Solutions:
- Ensure backend is running (Terminal 1)
- Check port 8000 is not in use
- Verify NEXT_PUBLIC_API_URL in .env.local
- Check firewall settings
```

### Object Not Detected?
```
✅ Solutions:
- Wait for "AI Ready" indicator (top-right)
- Ensure good lighting
- Try different camera angle
- Supported objects: plant, bicycle, bottle, ball, car
```

### Slow Performance?
```
✅ Solutions:
- Close other browser tabs
- Disable WebLLM in .env.local if not needed
- Reduce detection frequency (see DEVELOPMENT.md)
- Use wired internet for first-time model downloads
```

### TypeScript Errors in IDE?
```
✅ Solutions:
- These are expected before running npm install
- Run: npm install
- Restart VS Code
- Delete .next folder and rebuild
```

---

## 📚 Next Steps

Once you have KAIROS 2.0 running:

1. **Explore the Demo**: Try scanning different objects
2. **Browse Study Modules**: Learn about the scientific concepts
3. **Read Development Guide**: See `DEVELOPMENT.md` for customization
4. **Add Your Own Objects**: Extend the concept database
5. **Contribute**: Submit PRs with new features!

---

## 🆘 Need Help?

- **Issues**: [GitHub Issues](https://github.com/Likhith623/KAIROS-2.0/issues)
- **Questions**: Check `DEVELOPMENT.md` for detailed docs
- **API Docs**: Visit `http://localhost:8000/docs` (when backend is running)

---

## 🎉 You're All Set!

Happy exploring the science behind everyday objects! 🔬✨

**Remember**: Keep both terminal windows running while using the app.

---

**Made with ❤️ for curious minds**
