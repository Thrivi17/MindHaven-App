import os
import re
import sqlite3
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from groq import Groq

load_dotenv(dotenv_path=".env")

app = FastAPI(title="MindHaven Persistent Backend", version="2.5")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SQLite Database Setup ---
DB_FILE = "mindhaven.db"

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            water_drops INTEGER DEFAULT 10,
            sunlight INTEGER DEFAULT 5,
            stage_index INTEGER DEFAULT 0,
            streak INTEGER DEFAULT 1
        )
    """)
    conn.commit()
    conn.close()

init_db()

# --- Initialize Groq ---
groq_api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=groq_api_key) if groq_api_key else None

# --- Request Models ---
class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ProgressSyncRequest(BaseModel):
    user_id: int
    water_drops: int
    sunlight: int
    stage_index: int
    streak: int

class PromptRequest(BaseModel):
    user_id: int = 1
    prompt: str
    mood: Optional[str] = "Neutral"

# --- Helpers ---
def validate_password_strength(password: str) -> tuple[bool, str]:
    if len(password) < 6:
        return False, "Password must be at least 6 characters long."
    if not re.search(r"[A-Z]", password):
        return False, "Password must contain at least 1 uppercase letter."
    if not re.search(r"\d", password):
        return False, "Password must contain at least 1 number."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "Password must contain at least 1 special character."
    return True, ""

# --- Routes ---

@app.post("/api/auth/register")
def register_user(request: RegisterRequest):
    email = request.email.strip().lower()
    
    is_valid, error_msg = validate_password_strength(request.password)
    if not is_valid:
        return {"status": "error", "message": error_msg}
    
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, request.password))
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        
        return {"status": "success", "message": "Registration successful!", "user_id": user_id}
    except sqlite3.IntegrityError:
        return {"status": "error", "message": "Email is already registered. Please log in!"}

@app.post("/api/auth/login")
def login_user(request: LoginRequest):
    email = request.email.strip().lower()
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT user_id, password, water_drops, sunlight, stage_index, streak FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user or user[1] != request.password:
        return {"status": "error", "message": "Invalid email or password."}
    
    return {
        "status": "success",
        "message": "Login successful!",
        "user_id": user[0],
        "progress": {
            "water_drops": user[2],
            "sunlight": user[3],
            "stage_index": user[4],
            "streak": user[5]
        }
    }

@app.post("/api/progress/save")
def save_progress(request: ProgressSyncRequest):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE users 
        SET water_drops = ?, sunlight = ?, stage_index = ?, streak = ?
        WHERE user_id = ?
    """, (request.water_drops, request.sunlight, request.stage_index, request.streak, request.user_id))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Progress saved successfully!"}

@app.post("/api/chat/secure")
def secure_chat(request: PromptRequest):
    if not client:
        return {"status": "error", "response": " Groq API key missing."}
    try:
        completion = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": "You are MindHaven's supportive AI wellness guide. Keep responses concise and warm (2-4 sentences)."},
                {"role": "user", "content": request.prompt}
            ],
            temperature=0.7,
            max_tokens=200
        )
        return {"status": "success", "response": completion.choices[0].message.content}
    except Exception as e:
        return {"status": "error", "response": f" Error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)