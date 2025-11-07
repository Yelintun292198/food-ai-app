// app/api/api.ts
import axios from "axios";

// ✅ Use .env URL from Expo (defined in mobile/.env)
const baseURL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL,         // now dynamic ✅
  timeout: 30000,  // 30s for Hugging Face latency
});

// ✅ Helper function to send image to FastAPI
export const analyzeImage = (formData: FormData) => {
  return api.post("/predict", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default api;
