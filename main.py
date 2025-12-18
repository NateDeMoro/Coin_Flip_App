import random
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Request

app = FastAPI(title="Coin Flip")
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Simple in-memory stats (resets when the server restarts)
stats = {
    "right": 0,
    "wrong": 0,
    "total": 0,
    "last_result": None,
}

class GuessRequest(BaseModel):
    guess: Literal["heads", "tails"]

@app.get("/")
def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/stats")
def get_stats():
    accuracy = (stats["right"] / stats["total"]) if stats["total"] > 0 else 0
    return {**stats, "accuracy": accuracy}

@app.post("/flip")
def flip_coin(req: GuessRequest):
    result = random.choice(["heads", "tails"])
    correct = (req.guess == result)

    stats["total"] += 1
    stats["last_result"] = result
    if correct:
        stats["right"] += 1
    else:
        stats["wrong"] += 1

    accuracy = stats["right"] / stats["total"]
    return {
        "your_guess": req.guess,
        "coin_result": result,
        "correct": correct,
        "stats": {**stats, "accuracy": accuracy},
    }

@app.post("/reset")
def reset_stats():
    stats["right"] = 0
    stats["wrong"] = 0
    stats["total"] = 0
    stats["last_result"] = None
    return {"ok": True, "stats": stats}


@app.get("/ui")
def ui(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
