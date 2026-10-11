import os
import re
import sqlite3
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from groq import Groq

load_dotenv(dotenv_path=".env")

app = FastAPI(title="MindHaven Backend", version="2.5")

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

# --- Password Validation Helper ---
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

# --- Authentication Endpoints ---
@app.post("/api/auth/register")
def register_user(request: RegisterRequest):
    email = request.email.strip().lower()
    password = request.password

    # 1. Validate password policy
    is_valid, error_msg = validate_password_strength(password)
    if not is_valid:
        return {"status": "error", "message": error_msg}

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        # Check if email already exists
        cursor.execute("SELECT user_id FROM users WHERE email = ?", (email,))
        existing = cursor.fetchone()
        if existing:
            conn.close()
            return {"status": "error", "message": "Email is already registered. Please log in!"}

        # Insert new user
        cursor.execute(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            (email, password)
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()

        print(f"✅ Successfully registered user: {email}")
        return {
            "status": "success",
            "message": "Registration successful! Welcome to MindHaven. 🌱",
            "user_id": user_id
        }
    except Exception as e:
        traceback.print_exc()
        return {"status": "error", "message": str(e)}

@app.post("/api/auth/login")
def login_user(request: LoginRequest):
    email = request.email.strip().lower()
    password = request.password

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        cursor.execute("SELECT user_id, password FROM users WHERE email = ?", (email,))
        row = cursor.fetchone()
        conn.close()

        if not row:
            return {"status": "error", "message": "Account not found. Please register first!"}

        user_id, stored_password = row

        if stored_password != password:
            return {"status": "error", "message": "Incorrect password. Please try again."}

        print(f"🔑 Successfully logged in: {email}")
        return {
            "status": "success",
            "message": "Login successful! 🌿",
            "user_id": user_id
        }
    except Exception as e:
        traceback.print_exc()
        return {"status": "error", "message": str(e)}
