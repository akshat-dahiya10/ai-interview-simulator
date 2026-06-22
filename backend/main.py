from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os

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

    # ---------- 5.2 ADD (Resume Context) ----------
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

    # ---------- 5.3 ADD (Resume Context) ----------
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
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    import json

    content = res.choices[0].message.content.strip()

    # remove markdown json fences
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
