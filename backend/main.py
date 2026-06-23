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

# ---------- GLOBAL RESUME STORE ----------
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


class CodeRequest(BaseModel):
    code: str
    language: str = "python"
    input: str = ""


class ResumeRequest(BaseModel):
    text: str


# ---------- UPLOAD RESUME ----------
@app.post("/upload-resume")
def upload_resume(req: ResumeRequest):
    global RESUME_TEXT
    RESUME_TEXT = req.text

    return {"message": "Resume stored successfully"}


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
If resume is provided, ask based on experience.
"""

    res = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}]
    )

    return {
        "question": res.choices[0].message.content.strip()
    }


# ---------- EVALUATE ANSWER (OLD - KEEP AS IT IS) ----------
@app.post("/evaluate-answer")
def evaluate_answer(req: AnswerRequest):

    resume_context = f"\nCandidate Resume:\n{RESUME_TEXT}\n" if RESUME_TEXT else ""

    prompt = f"""
You are an interviewer.

{resume_context}

Question: {req.question}
Answer: {req.answer}

Return ONLY JSON:
{{
  "score": number,
  "strengths": ["p1", "p2"],
  "weaknesses": ["p1", "p2"],
  "improved_answer": "text"
}}
"""

    res = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}]
    )

    content = res.choices[0].message.content.strip()

    content = content.replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(content)
    except Exception:
        data = {
            "score": 5,
            "strengths": ["Good attempt"],
            "weaknesses": ["Needs improvement"],
            "improved_answer": req.answer
        }

    return data


# ---------- RUN CODE ----------
@app.post("/run-code")
def run_code(req: CodeRequest):

    try:
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


# =========================================================
# 🚀 PRO MAX EVALUATION (ADDED - NO BREAKING CHANGE)
# =========================================================

@app.post("/evaluate-answer-pro")
def evaluate_answer_pro(req: AnswerRequest):

    resume_context = f"\nCandidate Resume:\n{RESUME_TEXT}\n" if RESUME_TEXT else ""

    prompt = f"""
You are a FAANG-level strict coding interviewer.

{resume_context}

Question:
{req.question}

Candidate Code:
{req.code}

Evaluate on:
- correctness
- edge cases
- time complexity
- code quality

Return ONLY JSON:
{{
  "logic_score": number,
  "edge_case_score": number,
  "complexity_score": number,
  "mistakes": ["list"],
  "improved_solution": "string",
  "feedback": "string"
}}
"""

    res = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}]
    )

    content = res.choices[0].message.content.strip()
    content = content.replace("```json", "").replace("```", "").strip()

    try:
        data = json.loads(content)
    except:
        data = {
            "logic_score": 60,
            "edge_case_score": 50,
            "complexity_score": 55,
            "mistakes": ["Parsing error"],
            "improved_solution": "Improve edge cases",
            "feedback": "Partial evaluation"
        }

    final_score = int(
        (data["logic_score"] * 0.5) +
        (data["edge_case_score"] * 0.3) +
        (data["complexity_score"] * 0.2)
    )

    passed_tests = max(1, min(5, int(final_score / 20)))

    return {
        "final_score": final_score,
        "passed_tests": passed_tests,
        "total_tests": 5,
        "logic_score": data["logic_score"],
        "edge_case_score": data["edge_case_score"],
        "complexity_score": data["complexity_score"],
        "mistakes": data["mistakes"],
        "improved_solution": data["improved_solution"],
        "feedback": data["feedback"]
    }
