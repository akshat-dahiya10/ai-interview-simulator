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

# ---------- MEMORY ----------
sessions = {}

# ---------- MODELS ----------
class StartRequest(BaseModel):
    role: str
    level: str

class AnswerRequest(BaseModel):
    session_id: str
    answer: str


# ---------- START ----------
@app.post("/start")
def start(req: StartRequest):
    session_id = str(len(sessions) + 1)

    first_question = "Tell me about yourself."

    sessions[session_id] = {
        "questions": [first_question],
        "answers": []
    }

    return {
        "session_id": session_id,
        "question": first_question
    }


# ---------- NEXT ----------
@app.post("/next")
def next_question(req: AnswerRequest):
    session = sessions.get(req.session_id)

    if not session:
        return {"error": "Invalid session"}

    last_question = session["questions"][-1]

    # Save answer
    session["answers"].append(req.answer)

    # ---------- FEEDBACK ----------
    feedback_prompt = f"""
You are an interviewer.

Question: {last_question}
Answer: {req.answer}

Give short, helpful feedback in 2-3 lines.
"""

    feedback_res = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": feedback_prompt}]
    )

    feedback = feedback_res.choices[0].message.content.strip()

    # ---------- NEXT QUESTION ----------
    next_prompt = f"""
You are an interviewer.

Previous question: {last_question}
Candidate answer: {req.answer}

Ask a NEW interview question.
DO NOT repeat previous question.
Make it relevant to frontend role.
"""

    next_res = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": next_prompt}]
    )

    new_question = next_res.choices[0].message.content.strip()

    # Save new question
    session["questions"].append(new_question)

    return {
        "next_question": new_question,
        "feedback": feedback
    }
