from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import random
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="AI Doctor API")
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class WaitlistCreate(BaseModel):
    name: Optional[str] = None
    email: EmailStr
    year: Optional[str] = None
    exam: Optional[str] = None


class Waitlist(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: Optional[str] = None
    email: EmailStr
    year: Optional[str] = None
    exam: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ReviewCreate(BaseModel):
    name: str
    role: str
    rating: int = 5
    text: str


class Review(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    rating: int = 5
    text: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


SEED_REVIEWS = [
    {"name": "Aisha Rahman", "role": "MBBS Year 3 · India", "rating": 5,
     "text": "The Clinical Case Solver is unreal. It walks through differentials the exact way our OSCE examiners want. Genuinely changed how I revise."},
    {"name": "Daniel Okoro", "role": "USMLE Step 1 prep", "rating": 5,
     "text": "Turned my messy pharmacology notes into flashcards in seconds. The drug mnemonics stick way better than anything I made myself."},
    {"name": "Sofia Martinez", "role": "PLAB candidate · UK", "rating": 5,
     "text": "Exam Prep Mode gives answers in proper PLAB format. Feels like having a tutor at 2am the night before a viva."},
    {"name": "Ryan Chen", "role": "Nursing student", "rating": 5,
     "text": "Pathology explanations are clear without being dumbed down. The exam cram high-yield lists saved me before finals."},
    {"name": "Priya Nair", "role": "MBBS Year 2", "rating": 5,
     "text": "Anatomy explainer with clinical correlations is chef's kiss. Blood supply, nerve supply, relations — all in one clean answer."},
    {"name": "Tomiwa Bello", "role": "Medical intern", "rating": 5,
     "text": "I use the Quiz Mode daily. USMLE-style MCQs with explanations for every option. My scores jumped within two weeks."},
]


@api_router.get("/")
async def root():
    return {"message": "AI Doctor API online"}


@api_router.get("/stats")
async def get_stats():
    joined_base = 89
    joined_extra = await db.waitlist.count_documents({})
    cards_doc = await db.counters.find_one({"_id": "cards_today"})
    cards = (cards_doc or {}).get("value", 312)
    return {
        "studying_now": random.randint(6, 17),
        "cards_today": cards,
        "students_joined": joined_base + joined_extra,
    }


@api_router.post("/waitlist", response_model=Waitlist)
async def join_waitlist(payload: WaitlistCreate):
    obj = Waitlist(**payload.model_dump())
    await db.waitlist.insert_one(obj.model_dump())
    # bump the "cards generated today" vanity counter
    await db.counters.update_one(
        {"_id": "cards_today"}, {"$inc": {"value": random.randint(2, 6)}}, upsert=True
    )
    return obj


@api_router.get("/reviews", response_model=List[Review])
async def list_reviews():
    docs = await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return [Review(**d) for d in docs]


@api_router.post("/reviews", response_model=Review)
async def create_review(payload: ReviewCreate):
    if not payload.text.strip() or not payload.name.strip():
        raise HTTPException(status_code=400, detail="Name and review text are required")
    rating = max(1, min(5, payload.rating))
    obj = Review(**{**payload.model_dump(), "rating": rating})
    await db.reviews.insert_one(obj.model_dump())
    return obj


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def seed_reviews():
    if await db.reviews.count_documents({}) == 0:
        for r in SEED_REVIEWS:
            await db.reviews.insert_one(Review(**r).model_dump())
        logger.info("Seeded %d reviews", len(SEED_REVIEWS))
    if await db.counters.count_documents({"_id": "cards_today"}) == 0:
        await db.counters.insert_one({"_id": "cards_today", "value": 312})


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
