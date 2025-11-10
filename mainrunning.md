## How to Run

### 1. Run the frontend for RAG Platform (in a terminal)
```bash
cd RAG-AGENT/front_end
npm install
npm run dev
```

### 2. Run the backend for RAG Platform (in another terminal)
```bash
cd RAG-AGENT
python main.py
```

### 3. Run the frontend for the website (in a terminal)
```bash
cd frontend
npm install
PORT=3001 npm run dev
```

### 4. Run the backend for the website (in another terminal)
```bash
cd backend
uvicorn main:app --reload
```