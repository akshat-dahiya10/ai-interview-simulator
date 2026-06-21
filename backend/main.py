from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import random

app = FastAPI()

class QuestionRequest(BaseModel):
    role: str
    history: List[dict] = []
    difficulty: str = "medium"

class AnswerRequest(BaseModel):
    question: str
    answer: str
    code: str = ""

QUESTION_BANK = {
    "frontend": {
        "easy": [
            "Tell me about yourself.",
            "What is HTML?",
            "What is CSS?"
        ],
        "medium": [
            "Explain your recent project.",
            "What is Virtual DOM?",
            "Difference between var, let, const?"
        ],
        "hard": [
            "Explain React rendering lifecycle in detail.",
            "How do you optimize performance in React?",
            "Explain advanced hooks in React."
        ]
    }
}

@app.post("/generate-question")
def generate_question(req: QuestionRequest):
    role = req.role.lower().strip()
    difficulty = req.difficulty

    role_data = QUESTION_BANK.get(role, QUESTION_BANK["frontend"])
    questions = role_data.get(difficulty, role_data["medium"])

    asked_questions = [h["question"] for h in req.history if "question" in h]
    remaining = [q for q in questions if q not in asked_questions]

    if remaining:
        next_q = remaining[0]
    else:
        next_q = random.choice(questions)

    return {"question": next_q}

@app.post("/evaluate-answer")
def evaluate_answer(req: AnswerRequest):
    answer = req.answer.strip()
    code = req.code.strip()

    word_count = len(answer.split())

    if word_count < 5:
        score = 2
    elif word_count < 12:
        score = 5
    elif word_count < 25:
        score = 7
    else:
        score = 9

    if code:
        score = min(score + 1, 10)

    strengths = []
    weaknesses = []

    if word_count > 10:
        strengths.append("Good explanation")
    else:
        weaknesses.append("Too short answer")

    if code:
        strengths.append("Code provided")

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
        "improved_answer": f"Improve with structured explanation, examples, and cleaner logic.\n\n{answer}"
    }
