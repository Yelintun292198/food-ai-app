# ==============================================
# ✅ Load environment variables FIRST
# ==============================================
from pathlib import Path
from dotenv import load_dotenv
import os

# ✅ Load .env inside backend folder
env_path = Path(__file__).resolve().parent / ".env"
print(f"🔍 Loading .env from: {env_path}")
load_dotenv(dotenv_path=env_path)


# Debug check to confirm .env variables are loaded
print("DEBUG — testing .env load:")
print("MYSQL_USER =", os.getenv("MYSQL_USER"))
print("MYSQL_PASSWORD =", os.getenv("MYSQL_PASSWORD"))
print("MYSQL_DB =", os.getenv("MYSQL_DB"))
print("MYSQL_HOST =", os.getenv("MYSQL_HOST"))

# ==============================================
# ✅ Import dependencies AFTER loading .env
# ==============================================
from backend import models, database
from backend.routers import auth
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import requests
from PIL import Image
from io import BytesIO


# ==============================================
# 🚀 FastAPI app setup
# ==============================================
app = FastAPI(title="🍣 Food AI + Spoonacular + Auth Backend")

# ==============================================
# ✅ CORS Setup
# ==============================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "https://cautiously-mesocratic-albert.ngrok-free.dev",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================
# 🔑 API Keys
# ==============================================
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
HUGGINGFACE_MODEL = os.getenv("HUGGINGFACE_MODEL")
SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")

# ==============================================
# 🧱 Database setup
# ==============================================
models.Base.metadata.create_all(bind=database.engine)

# ==============================================
# 🧩 Routers
# ==============================================
app.include_router(auth.router)

# ==============================================
# 🧠 Predict + Fetch Recipe
# ==============================================
@app.post("/predict")
async def predict_food(file: UploadFile = File(...)):
    """Classify food image with Hugging Face → get recipe from Spoonacular"""
    try:
        # 🖼️ Read & resize image
        image_bytes = await file.read()
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        image.thumbnail((512, 512))
        buffer = BytesIO()
        image.save(buffer, format="JPEG", quality=85)
        small_image_bytes = buffer.getvalue()

        # ======================================
        # 1️⃣ Predict food name from Hugging Face
        # ======================================
        hf_url = f"https://router.huggingface.co/hf-inference/models/{HUGGINGFACE_MODEL}"
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
            "Content-Type": "image/jpeg",
        }
        print("🚀 Sending image to Hugging Face model...")
        response = requests.post(hf_url, headers=headers, data=small_image_bytes, timeout=60)
        print("HF response status:", response.status_code)

        try:
            result = response.json()
        except Exception:
            print("❌ Invalid JSON from Hugging Face:", response.text)
            return {"error": "Invalid Hugging Face response", "recipe_found": False}

        if response.status_code != 200:
            return {"error": result.get("error", "HF request failed"), "recipe_found": False}

        if not isinstance(result, list) or len(result) == 0:
            return {"error": "No prediction returned", "recipe_found": False}

        food_name = result[0].get("label", "unknown").lower()
        confidence = result[0].get("score", 0)
        print(f"🍣 Predicted food: {food_name} ({confidence:.2f})")

        # ======================================
        # 2️⃣ Search recipe from Spoonacular
        # ======================================
        search_url = (
            f"https://api.spoonacular.com/recipes/complexSearch"
            f"?query={food_name}&number=1&apiKey={SPOONACULAR_API_KEY}"
        )
        search_res = requests.get(search_url, timeout=20)
        search_data = search_res.json()

        if not search_data.get("results"):
            return {
                "predicted_food": food_name,
                "confidence": confidence,
                "recipe_found": False,
                "message": f"No recipe found for {food_name}",
            }

        recipe_id = search_data["results"][0]["id"]

        # ======================================
        # 3️⃣ Get full recipe details
        # ======================================
        info_url = (
            f"https://api.spoonacular.com/recipes/{recipe_id}/information"
            f"?apiKey={SPOONACULAR_API_KEY}"
        )
        info_res = requests.get(info_url, timeout=20)
        info_data = info_res.json()

        recipe = {
            "name": info_data.get("title", "Unknown Recipe"),
            "image": info_data.get("image"),
            "instructions": info_data.get("instructions", "No instructions available."),
            "ingredients": [
                {
                    "ingredient": ing.get("name"),
                    "measure": f"{ing.get('amount', '')} {ing.get('unit', '')}".strip(),
                }
                for ing in info_data.get("extendedIngredients", [])
            ],
            "sourceUrl": info_data.get("sourceUrl"),
        }

        return {
            "predicted_food": food_name,
            "confidence": confidence,
            "recipe_found": True,
            "recipe": recipe,
        }

    except Exception as e:
        print("❌ Backend error:", e)
        return {"error": str(e), "recipe_found": False}


# ==============================================
# 🏠 Root endpoint
# ==============================================
@app.get("/")
def home():
    return {"message": "🍣 Spoonacular-powered Food AI backend with JWT auth running!"}
