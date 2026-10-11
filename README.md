
# 🧠 MindHaven

MindHaven is a full-stack, cross-platform application featuring an Expo/React Native frontend and a Python/FastAPI backend. It integrates secure user authentication, AI-powered conversational endpoints (leveraging Groq AI), and custom guardrails for safe interactions across web and mobile devices.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React Native & Expo (Deployed as a Render Web Service supporting cross-device web/mobile compatibility).
- **Backend**: Python & FastAPI (Deployed as a separate Render Web Service).
- **AI / LLM Integration**: Groq API for lightning-fast inference and chat processing.
- **Security & Configuration**: Environment variables managed securely via Render dashboard; strict `.gitignore` protection for local `.env` files.

---

## Clone the repository

git clone [https://github.com/your-username/mindhaven.git](https://github.com/your-username/mindhaven.git)
cd mindhaven

## Set Up the Backend (FastAPI)

**Navigate to the backend directory:** cd ai-guardrail

**Create and activate a virtual environment:** python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

**Install Dependencies:** pip install -r requirements.txt

**Create a .env file in the ai-guardrail/ folder and add your Groq API key:**GROQ_API_KEY=your_actual_groq_api_key_here

**Run the FastAPI development server:** uvicorn main:app --reload --host 0.0.0.0 --port 8000

## Set Up the Frontend (Expo)

**Open a new terminal window and navigate to the frontend directory:** cd mindhaven-app

**Install dependencies**: npm install

**Verify or update your src/services/api.js base URL for local testing:** const API_BASE_URL = 'http://localhost:8000';

**Start the Expo development server:** : npx expo start


## Repository Structure

```text
mindhaven/
├── ai-guardrail/          # Python FastAPI Backend
│   ├── main.py            # Entry point for FastAPI routes (/api/auth, /api/chat)
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Local environment variables (Ignored by Git)
└── mindhaven-app/         # Expo / React Native Frontend
    ├── src/
    │   └── services/
    │       └── api.js     # Axios client configured with backend API base URL
    ├── App.js / _layout.js# Root navigation and multi-platform layout
    └── package.json       # Node.js dependencies
