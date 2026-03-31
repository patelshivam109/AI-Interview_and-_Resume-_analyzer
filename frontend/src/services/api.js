import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 120000,
});

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/upload_resume", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function evaluateAnswer(payload) {
  const { data } = await api.post("/evaluate_answer", payload);
  return data;
}

export default api;
