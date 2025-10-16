import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("SPOONACULAR_API_KEY")

BASE_URL = "https://api.spoonacular.com"

def classify_food_image(file):
    """Send image to Spoonacular to classify food type"""
    url = f"{BASE_URL}/food/images/classify?apiKey={API_KEY}"
    files = {"file": (file.filename, file.file, file.content_type)}
    response = requests.post(url, files=files)
    return response.json()

def search_recipes(food_name):
    """Search recipes based on food name"""
    url = f"{BASE_URL}/recipes/complexSearch"
    params = {"apiKey": API_KEY, "query": food_name, "number": 5}
    response = requests.get(url, params=params)
    return response.json()
