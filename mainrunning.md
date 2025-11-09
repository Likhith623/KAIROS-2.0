
1. In other terminal:
Run the frontend for RAG Platform.
cd RAG-AGENT
cd front_end
npm install
npm run dev


2. In other terminal:
Run the backend for RAG Platform.
cd RAG-AGENT
python main.py



3. In one terminal: 
Run the frontend for the website.
cd frontend
npm install
PORT=3001 npm run dev


4. In other terminal:
Run the backend for the website.
cd backend
uvicorn main:app --reload

