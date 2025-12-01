# ==============================================
# ✅ Load environment variables FIRST
# ==============================================
from pathlib import Path
from dotenv import load_dotenv
import os

env_path = Path(__file__).resolve().parent / ".env"
print(f"🔍 Loading .env from: {env_path}")
load_dotenv(dotenv_path=env_path)

print("DEBUG — testing .env load:")
print("MYSQL_USER =", os.getenv("MYSQL_USER"))
print("MYSQL_PASSWORD =", os.getenv("MYSQL_PASSWORD"))
print("MYSQL_DB =", os.getenv("MYSQL_DB"))
print("MYSQL_HOST =", os.getenv("MYSQL_HOST"))

# ==============================================
# ✅ Imports
# ==============================================
from backend import models, database
from backend.routers import auth
from backend.routers import auth_google
from backend.routers import posts

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

import requests
from PIL import Image
from io import BytesIO

# ==============================================
# 🌐 DeepL Translation
# ==============================================
DEEPL_API_KEY = os.getenv("DEEPL_API_KEY")

def translate_to_japanese(text: str) -> str:
    try:
        if not text:
            return ""
        url = "https://api-free.deepl.com/v2/translate"
        params = {
            "auth_key": DEEPL_API_KEY,
            "text": text,
            "target_lang": "JA"
        }
        response = requests.post(url, data=params)
        data = response.json()
        return data["translations"][0]["text"]
    except Exception as e:
        print("❌ Translation error:", e)
        return text


# ==============================================
# 🚀 FastAPI Setup
# ==============================================
app = FastAPI(title="🍣 Food AI + Spoonacular + Auth + JP Translation")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "http://localhost:8081"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Keys
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
HUGGINGFACE_MODEL = os.getenv("HUGGINGFACE_MODEL")
SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")

# Load DB tables
models.Base.metadata.create_all(bind=database.engine)

# Routers
app.include_router(posts.router)
app.include_router(auth.router)
app.include_router(auth_google.router)

# ==============================================
# 🧠 Predict endpoint
# ==============================================
@app.post("/predict")
async def predict_food(file: UploadFile = File(...)):
    try:
        # Resize
        image_bytes = await file.read()
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        image.thumbnail((512, 512))
        buf = BytesIO()
        image.save(buf, format="JPEG", quality=85)
        img_final = buf.getvalue()

        # HuggingFace Prediction
        hf_url = f"https://router.huggingface.co/hf-inference/models/{HUGGINGFACE_MODEL}"
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
            "Content-Type": "image/jpeg",
        }

        print("🚀 Sending image to HuggingFace...")
        res = requests.post(hf_url, headers=headers, data=img_final, timeout=60)

        try:
            pred = res.json()
        except:
            return {"error": "Invalid HuggingFace response", "recipe_found": False}

        if not pred or not isinstance(pred, list):
            return {"error": "No prediction", "recipe_found": False}

        food_name = pred[0]["label"].lower()
        confidence = pred[0]["score"]

        # Translate food name
        food_name_jp = translate_to_japanese(food_name)

        # Spoonacular Search
        search_queries = [
            food_name,
            food_name.replace("_", " "),
            f"{food_name} recipe",
            f"how to make {food_name}",
        ]

        recipe_id = None
        for q in search_queries:
            search_url = (
                f"https://api.spoonacular.com/recipes/complexSearch"
                f"?query={q}&number=1&apiKey={SPOONACULAR_API_KEY}"
            )
            res2 = requests.get(search_url, timeout=15)
            search_data = res2.json()
            if search_data.get("results"):
                recipe_id = search_data["results"][0]["id"]
                break

        if not recipe_id:
            return {
                "predicted_food_en": food_name,
                "predicted_food_jp": food_name_jp,
                "confidence": confidence,
                "recipe_found": False,
                "recipe": None,
            }

        # Get full recipe
        info_url = (
            f"https://api.spoonacular.com/recipes/{recipe_id}/information"
            f"?apiKey={SPOONACULAR_API_KEY}"
        )
        info_res = requests.get(info_url, timeout=20)
        info = info_res.json()

        # Extract English data
        title_en = info.get("title", "")
        instructions_en = info.get("instructions", "No instructions available.")
        ingredients_raw = info.get("extendedIngredients", [])

        # Translate
        title_jp = translate_to_japanese(title_en)
        instructions_jp = translate_to_japanese(instructions_en)
        ingredients_jp = [
            translate_to_japanese(ing.get("name", "")) 
            for ing in ingredients_raw
        ]

        recipe = {
            "name_en": title_en,
            "name_jp": title_jp,
            "image": info.get("image"),
            "instructions_en": instructions_en,
            "instructions_jp": instructions_jp,
            "ingredients_en": [
                {
                    "ingredient": ing.get("name"),
                    "measure": f"{ing.get('amount', '')} {ing.get('unit', '')}".strip()
                }
                for ing in ingredients_raw
            ],
            "ingredients_jp": ingredients_jp,
            "sourceUrl": info.get("sourceUrl"),
        }

        return {
            "predicted_food_en": food_name,
            "predicted_food_jp": food_name_jp,
            "confidence": confidence,
            "recipe_found": True,
            "recipe": recipe,
        }

    except Exception as e:
        print("❌ ERROR:", e)
        return {"error": str(e), "recipe_found": False}


@app.get("/")
def home():
    return {"message": "Food AI backend running with JP translation!"}
