from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GROQ client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class RoleRequest(BaseModel):
    role: str

class AnswerRequest(BaseModel):
    question: str
    answer: str

@app.get("/")
def root():
    return {"message": "Backend running 🚀 (Groq Mode)"}

# Generate Question
@app.post("/generate-question")
def generate_question(data: RoleRequest):
    prompt = f"Generate a technical interview question for a {data.role} developer."

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
        )

        return {
            "question": response.choices[0].message.content
        }

    except Exception as e:
        return {"error": str(e)}

# Evaluate Answer
@app.post("/evaluate-answer")
def evaluate_answer(data: AnswerRequest):
    prompt = f"""
    Question: {data.question}
    Answer: {data.answer}

    Give:
    Score (0-10),
    Strengths,
    Weaknesses,
    Improved Answer
    """

    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[{"role": "user", "content": prompt}],
        )

        return {
            "feedback": response.choices[0].message.content
        }

    except Exception as e:
        return {"error": str(e)}
