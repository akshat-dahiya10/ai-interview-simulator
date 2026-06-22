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

# ---------- MODELS ----------
class QuestionRequest(BaseModel):
    role: str
    difficulty: str
    history: list


class AnswerRequest(BaseModel):
    question: str
    answer: str
    code: str = ""


# ---------- GENERATE QUESTION ----------
@app.post("/generate-question")
def generate_question(req: QuestionRequest):
    prompt = f"""
You are a {req.role} interviewer.

Difficulty: {req.difficulty}

Previous conversation:
{req.history}

Ask ONE new interview question.
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
    prompt = f"""
You are an interviewer.

Question: {req.question}
Answer: {req.answer}

Give response in JSON format:

{{
  "score": number (0-10),
  "strengths": ["point1", "point2"],
  "weaknesses": ["point1", "point2"],
  "improved_answer": "better version"
}}
"""

    res = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}]
    )

    import json

    try:
        data = json.loads(res.choices[0].message.content)
    except:
        data = {
            "score": 5,
            "strengths": ["Good attempt"],
            "weaknesses": ["Needs improvement"],
            "improved_answer": req.answer
        }

    return data
