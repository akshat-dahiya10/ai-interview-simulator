from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
import json
import requests

app = FastAPI()

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- GROQ ----------
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ---------- GLOBAL RESUME STORE (NEW - 5.1) ----------
RESUME_TEXT = ""

# ---------- MODELS ----------
class QuestionRequest(BaseModel):
    role: str
    difficulty: str
    history: list


class AnswerRequest(BaseModel):
    question: str
    answer: str
    code: str = ""

# ---------- NEW MODEL (RUN CODE) ----------
class CodeRequest(BaseModel):
    code: str
    language: str = "python"
    input: str = ""


# ---------- NEW MODEL (5.1) ----------
class ResumeRequest(BaseModel):
    text: str


# ---------- UPLOAD RESUME API (5.1) ----------
@app.post("/upload-resume")
def upload_resume(req: ResumeRequest):
    global RESUME_TEXT
    RESUME_TEXT = req.text

    return {
        "message": "Resume stored successfully"
    }


# ---------- GENERATE QUESTION ----------
@app.post("/generate-question")
def generate_question(req: QuestionRequest):

    resume_context = f"\nCandidate Resume:\n{RESUME_TEXT}\n" if RESUME_TEXT else ""

    prompt = f"""
You are a {req.role} interviewer.

Difficulty: {req.difficulty}

{resume_context}

Previous conversation:
{req.history}

Ask ONE new interview question.
If resume is provided, ask question based on candidate experience.
"""

    res = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}]
    )

    return {
        "question": res.choices[0].message.content.strip()
    }


# ---------- EVALUATE ANSWER ----------
@app.post("/evaluate-answer")
def evaluate_answer(req: AnswerRequest):

    resume_context = f"\nCandidate Resume:\n{RESUME_TEXT}\n" if RESUME_TEXT else ""

    prompt = f"""
You are an interviewer.

{resume_context}

Question: {req.question}
Answer: {req.answer}

Evaluate answer considering candidate's resume if provided.

Return ONLY valid JSON.

{{
  "score": number,
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"],
  "improved_answer": "better version"
}}
"""

    res = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}]
    )

    content = res.choices[0].message.content.strip()

    content = content.replace("```json", "")
    content = content.replace("```", "")
    content = content.strip()

    try:
        data = json.loads(content)
    except Exception as e:
        print("JSON ERROR:", e)
        print("RAW RESPONSE:", content)

        data = {
            "score": 5,
            "strengths": ["Good attempt"],
            "weaknesses": ["Needs improvement"],
            "improved_answer": req.answer
        }

    return data


# =========================================================
# 🚀 STEP 3: CODE RUNNER (ADDED - LEETCODE STYLE BACKEND)
# =========================================================

@app.post("/run-code")
def run_code(req: CodeRequest):

    try:
        # Using Judge0 API (safe external runner)
        url = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true"

        language_map = {
            "python": 71,
            "javascript": 63,
            "cpp": 54
        }

        payload = {
            "source_code": req.code,
            "language_id": language_map.get(req.language, 71),
            "stdin": req.input
        }

        headers = {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": os.getenv("RAPID_API_KEY"),
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        }

        response = requests.post(url, json=payload, headers=headers)
        result = response.json()

        output = (
            result.get("stdout")
            or result.get("stderr")
            or result.get("compile_output")
            or "No output"
        )

        return {
            "output": output,
            "status": result.get("status", {})
        }

    except Exception as e:
        return {
            "error": "Code execution failed",
            "details": str(e)
        }
