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
from fastapi import FastAPI, File, UploadFile, Body
from fastapi.middleware.cors import CORSMiddleware

import models
import database
from routers import auth, auth_google, posts

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
app = FastAPI(title="🍣 Food AI Backend")

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

# Include routers
app.include_router(posts.router)
app.include_router(auth.router)
app.include_router(auth_google.router)


# ==============================================
# ⭐ NEW — Get food image from Spoonacular
# ==============================================
def get_food_image(food_name: str):
    try:
        search_url = (
            f"https://api.spoonacular.com/recipes/complexSearch"
            f"?query={food_name}&number=1&apiKey={SPOONACULAR_API_KEY}"
        )
        res = requests.get(search_url, timeout=10).json()

        if res.get("results"):
            return res["results"][0].get("image")

    except Exception as e:
        print("❌ Image fetch error:", e)

    return None  # fallback


# ==============================================
# 🧠 Predict endpoint
# ==============================================
@app.post("/predict")
async def predict_food(file: UploadFile = File(...)):
    try:
        # Resize image
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

        # Translate to Japanese
        food_name_jp = translate_to_japanese(food_name)

        # Try multiple queries to Spoonacular
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

        # Fetch full recipe info
        info_url = (
            f"https://api.spoonacular.com/recipes/{recipe_id}/information"
            f"?apiKey={SPOONACULAR_API_KEY}"
        )
        info_res = requests.get(info_url, timeout=20)
        info = info_res.json()

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


# ============================================================
# ⭐ NEW: Fetch Recipe by Name (Fix for Home → Recipe)
# ============================================================
@app.get("/recipe/{food_name}")
def get_recipe_by_name(food_name: str):
    try:
        search_queries = [
            food_name,
            food_name.replace("_", " "),
            f"{food_name} recipe",
            f"how to make {food_name}",
        ]

        recipe_id = None

        # Search Spoonacular
        for q in search_queries:
            search_url = (
                f"https://api.spoonacular.com/recipes/complexSearch"
                f"?query={q}&number=1&apiKey={SPOONACULAR_API_KEY}"
            )
            search_data = requests.get(search_url).json()

            if search_data.get("results"):
                recipe_id = search_data["results"][0]["id"]
                break

        if not recipe_id:
            return {"detail": "Not Found", "recipe": None}

        # Fetch complete recipe
        info_url = (
            f"https://api.spoonacular.com/recipes/{recipe_id}/information"
            f"?apiKey={SPOONACULAR_API_KEY}"
        )
        info = requests.get(info_url).json()

        title_en = info.get("title", "")
        instructions_en = info.get("instructions", "")
        ingredients_raw = info.get("extendedIngredients", [])

        # Translate
        title_jp = translate_to_japanese(title_en)
        instructions_jp = translate_to_japanese(instructions_en)
        ingredients_jp = [
            translate_to_japanese(ing.get("name", "")) for ing in ingredients_raw
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
                    "measure": f"{ing.get('amount', '')} {ing.get('unit', '')}".strip(),
                }
                for ing in ingredients_raw
            ],
            "ingredients_jp": ingredients_jp,
            "sourceUrl": info.get("sourceUrl"),
        }

        return {"recipe": recipe}

    except Exception as e:
        return {"error": str(e), "recipe": None}



# ============================================================
# ⭐ Save user preferences
# ============================================================
@app.post("/users/{user_id}/preferences")
def save_preferences(user_id: int, prefs: dict = Body(...)):
    foods = prefs.get("foods", [])
    foods_str = ",".join(foods)

    try:
        conn = database.engine.raw_connection()
        cur = conn.cursor()

        cur.execute(
            "UPDATE users SET favorite_foods=%s WHERE id=%s",
            (foods_str, user_id)
        )
        conn.commit()

        cur.close()
        conn.close()
        return {"status": "ok", "saved": foods}

    except Exception as e:
        return {"error": str(e)}


# ============================================================
# ⭐ UPDATED — Get Recommendations with Images
# ============================================================
@app.get("/recommendations/name/{username}")
def get_recommendations_by_name(username: str):
    try:
        conn = database.engine.raw_connection()
        cur = conn.cursor()

        cur.execute("SELECT favorite_foods FROM users WHERE name=%s", (username,))
        row = cur.fetchone()

        cur.close()
        conn.close()

        # No preferences
        if not row or not row[0]:
            return {"items": []}

        foods = row[0].split(",")

        # ⭐ Return food name + image
        results = [
            {"name": f, "image": get_food_image(f)}
            for f in foods
        ]

        return {"items": results}

    except Exception as e:
        return {"error": str(e)}


# ==============================================
# 🏠 Home Route
# ==============================================
@app.get("/")
def home():
    return {"message": "Food AI backend running!"}
