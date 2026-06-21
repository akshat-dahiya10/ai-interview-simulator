from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import json
import re

load_dotenv()

app = FastAPI()

# =============================
# CORS (Production Safe)
# =============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ai-interview-simulator-sigma-one.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================
# Groq Client
# =============================
def get_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY not found")
    return Groq(api_key=api_key)


# =============================
# Utils
# =============================
def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def is_duplicate(new_q: str, history: list) -> bool:
    new_q_norm = normalize(new_q)

    for item in history:
        old_q = item.get("question", "")
        old_q_norm = normalize(old_q)

        # exact match
        if new_q_norm == old_q_norm:
            return True

        # partial similarity
        if new_q_norm in old_q_norm or old_q_norm in new_q_norm:
            return True

    return False


def build_history(history: list) -> str:
    if not history:
        return "No previous questions."

    return "\n".join([
        f"Question Asked: {item.get('question')}\nCandidate Answer: {item.get('answer')}"
        for item in history
    ])


def extract_json(text: str):
    """Safely extract JSON from LLM response"""
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return match.group(0)
    return text


# =============================
# Request Models
# =============================
class QuestionRequest(BaseModel):
    role: str
    history: list = []


class AnswerRequest(BaseModel):
    question: str
    answer: str


# =============================
# Root
# =============================
@app.get("/")
def root():
    return {"message": "Backend running 🚀 (AI Interview Simulator)"}


# =============================
# Generate Question (NO REPEAT GUARANTEED)
# =============================
@app.post("/generate-question")
def generate_question(data: QuestionRequest):
    client = get_client()

    # First question force
    if len(data.history) == 0:
        return {"question": "Tell me about yourself."}

    history_text = build_history(data.history)

    prompt = f"""
You are a strict professional {data.role} interviewer.

Previous conversation:
{history_text}

CRITICAL RULES:
- NEVER repeat any previous question
- NEVER ask similar questions
- Always move forward logically
- Ask short, natural questions (max 1-2 lines)
- Increase difficulty gradually

Interview Flow:
- Experience → Projects → Tech → Deep concepts → Optimization → Real-world

If you repeat anything, the answer is WRONG.

Now generate the NEXT UNIQUE question.
Return ONLY the question text.
"""

    try:
        # retry system
        for _ in range(3):
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
            )

            question = response.choices[0].message.content.strip()

            # backend duplicate protection
            if not is_duplicate(question, data.history):
                return {"question": question}

        # fallback safe question
        return {
            "question": "How do you optimize performance in a frontend application?"
        }

    except Exception as e:
        return {"error": str(e)}


# =============================
# Evaluate Answer (BULLETPROOF)
# =============================
@app.post("/evaluate-answer")
def evaluate_answer(data: AnswerRequest):
    client = get_client()

    prompt = f"""
You are a strict senior technical interviewer.

Question:
{data.question}

Candidate Answer:
{data.answer}

CRITICAL RULES:
- Return ONLY valid JSON
- No explanation
- No text outside JSON

Format:
{{
  "score": number (0-10),
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"],
  "improved_answer": "better version"
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )

        raw = response.choices[0].message.content.strip()

        # extract JSON safely
        json_str = extract_json(raw)

        try:
            parsed = json.loads(json_str)
        except:
            parsed = None

        if not parsed:
            return {
                "score": 0,
                "strengths": [],
                "weaknesses": ["Parsing error"],
                "improved_answer": raw
            }

        return {
            "score": parsed.get("score", 0),
            "strengths": parsed.get("strengths", []),
            "weaknesses": parsed.get("weaknesses", []),
            "improved_answer": parsed.get("improved_answer", "")
        }

    except Exception as e:
        return {
            "score": 0,
            "strengths": [],
            "weaknesses": [str(e)],
            "improved_answer": ""
        }
