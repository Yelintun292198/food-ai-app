// app/api/api.ts
import axios from "axios";

// ✅ FastAPI backend base URL (make sure backend runs with --host 0.0.0.0)
const api = axios.create({
  baseURL: "http://192.168.0.37:8000",  // ✅ your PC’s IPv4
  timeout: 20000,                       // ⏳ 20 seconds for slower networks
});

// ✅ Helper function to send image to FastAPI
export const analyzeImage = (formData: FormData) => {
  // FastAPI expects multipart/form-data (file upload)
  return api.post("/predict", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default api;
