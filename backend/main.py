from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import requests
import time
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO

# ==============================================
# ✅ Load environment variables
# ==============================================
load_dotenv()

app = FastAPI(title="🍣 Food AI + Spoonacular Backend")

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
        headers = {
            "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
            "Content-Type": "image/jpeg",
        }

        print("🚀 Sending image to Hugging Face model...")
        response = requests.post(
            HUGGINGFACE_MODEL,
            headers=headers,
            data=small_image_bytes,  # ✅ send raw bytes
            timeout=60,
        )

        try:
            result = response.json()
        except Exception:
            print("❌ Invalid JSON from Hugging Face:", response.text)
            return {"error": "Invalid Hugging Face response", "recipe_found": False}

        print("🧩 Raw Hugging Face response:", result)

        # 🧩 Handle cold start or unexpected result
        if isinstance(result, dict) and "error" in result:
            print("⚠️ Hugging Face returned error:", result["error"])
            if "loading" in result["error"].lower():
                print("⏳ Model is loading... retrying in 15 seconds...")
                time.sleep(15)
                response = requests.post(
                    HUGGINGFACE_MODEL,
                    headers=headers,
                    data=small_image_bytes,
                    timeout=60,
                )
                result = response.json()
                print("🔁 Retry result:", result)

        if not isinstance(result, list) or len(result) == 0:
            print("❌ Invalid Hugging Face response:", result)
            return {"error": "No prediction returned", "recipe_found": False}

        # ======================================
        # ✅ Extract prediction
        # ======================================
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
            print(f"❌ No recipe found for {food_name}")
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

        # ======================================
        # 4️⃣ Extract key data
        # ======================================
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

        # ======================================
        # ✅ Final JSON response
        # ======================================
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
# 🏠 Root route
# ==============================================
@app.get("/")
def home():
    return {"message": "🍣 Spoonacular-powered Food AI backend running!"}
