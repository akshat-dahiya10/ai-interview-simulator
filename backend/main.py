from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import json

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
        raise ValueError("GROQ_API_KEY not found in environment variables")
    return Groq(api_key=api_key)


# =============================
# Request Models
# =============================
class QuestionRequest(BaseModel):
    role: str
    history: list = []  # [{question, answer}]


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
# Generate Question (Adaptive)
# =============================
@app.post("/generate-question")
def generate_question(data: QuestionRequest):
    client = get_client()

    history_text = ""
    if data.history:
        history_text = "\n".join([
            f"Q: {item.get('question')}\nA: {item.get('answer')}"
            for item in data.history
        ])

    prompt = f"""
You are a professional {data.role} interviewer conducting a real interview.

Previous conversation:
{history_text if history_text else "No previous questions."}

Rules:
- NEVER repeat any previous question
- First question should be "Tell me about yourself"
- After that, ask DIFFERENT and RELEVANT questions
- Increase difficulty gradually
- Ask practical, real-world interview questions
- Keep it short and natural (1-2 lines max)

Examples of good flow:
1. Tell me about yourself
2. What technologies do you use in frontend?
3. Explain React lifecycle
4. What is virtual DOM?
5. How do you optimize performance?

Now ask the NEXT question.
Only return the question text.
"""
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )

        question = response.choices[0].message.content.strip()

        return {
            "question": question
        }

    except Exception as e:
        return {"error": str(e)}


# =============================
# Evaluate Answer (Structured)
# =============================
@app.post("/evaluate-answer")
def evaluate_answer(data: AnswerRequest):
    client = get_client()

    prompt = f"""
You are a senior technical interviewer.

Question:
{data.question}

Candidate Answer:
{data.answer}

Return ONLY valid JSON:

{{
  "score": number (0-10),
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"],
  "improved_answer": "better version of answer"
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )

        content = response.choices[0].message.content.strip()

        # Safely parse JSON
        try:
            parsed = json.loads(content)
        except:
            parsed = {
                "score": 0,
                "strengths": [],
                "weaknesses": ["Parsing error"],
                "improved_answer": content
            }

        return parsed

    except Exception as e:
        return {"error": str(e)}
