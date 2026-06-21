from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random

app = FastAPI()

# =============================
# MODELS
# =============================
class QuestionRequest(BaseModel):
    role: str
    history: List[dict] = []

class AnswerRequest(BaseModel):
    question: str
    answer: str

# =============================
# QUESTION BANK
# =============================
QUESTION_BANK = {
    "frontend": [
        "Tell me about yourself.",
        "Explain your recent project.",
        "What is React lifecycle?",
        "Explain useEffect in React.",
        "Difference between var, let, const?",
        "What is Virtual DOM?",
        "How React rendering works?",
        "What is state vs props?",
        "How do you optimize performance in React?"
    ]
}

# =============================
# GENERATE QUESTION (NO REPEAT GUARANTEED)
# =============================
@app.post("/generate-question")
def generate_question(req: QuestionRequest):
    role = req.role.lower().strip()

    questions = QUESTION_BANK.get(role, QUESTION_BANK["frontend"])

    asked_questions = [h["question"] for h in req.history if "question" in h]

    remaining = [q for q in questions if q not in asked_questions]

    # 🚀 HARD FIX: never repeat until exhausted
    if remaining:
        next_q = remaining[0]   # deterministic (no random repeat bug)
    else:
        next_q = random.choice(questions)

    return {"question": next_q}


# =============================
# EVALUATE ANSWER (ALWAYS RETURNS DATA)
# =============================
@app.post("/evaluate-answer")
def evaluate_answer(req: AnswerRequest):
    answer = req.answer.strip()

    word_count = len(answer.split())

    # scoring logic
    if word_count < 5:
        score = 2
    elif word_count < 12:
        score = 5
    elif word_count < 25:
        score = 7
    else:
        score = 9

    strengths = []
    weaknesses = []

    if word_count > 10:
        strengths.append("Good explanation")
    else:
        weaknesses.append("Too short answer")

    if "project" in answer.lower():
        strengths.append("Relevant to question")

    if not strengths:
        strengths.append("Basic attempt made")

    if not weaknesses:
        weaknesses.append("Add more depth & examples")

    return {
        "score": score,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "improved_answer": f"You can improve by giving structured explanation, examples, and clarity.\n\nBetter version:\n{answer} (add real-world example + depth)"
    }
