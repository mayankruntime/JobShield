from fastapi import FastAPI
from pydantic import BaseModel
import joblib


# ==========================================
# Load Model and Vectorizer
# ==========================================

model = joblib.load("models/job_model.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")


# ==========================================
# FastAPI
# ==========================================

app = FastAPI(
    title="JobShield ML Service",
    version="1.0.0"
)


# ==========================================
# Request Model
# ==========================================

class JobRequest(BaseModel):
    text: str


# ==========================================
# Prediction Function
# ==========================================

def predict_text(text):

    text_tfidf = vectorizer.transform([text])

    prediction = model.predict(text_tfidf)[0]

    decision_score = model.decision_function(text_tfidf)[0]

    return prediction, decision_score


# ==========================================
# Home
# ==========================================

@app.get("/")
def home():

    return {
        "message": "JobShield ML Service is running"
    }


# ==========================================
# Prediction API
# ==========================================

@app.post("/predict")
def predict_job(request: JobRequest):

    prediction, score = predict_text(request.text)

    print("\nReceived text:")
    print(request.text)

    print("Prediction:", prediction)
    print("Decision Score:", score)

    if prediction == 1:
        result = "FRAUDULENT"
    else:
        result = "LEGITIMATE"

    return {
        "prediction": result,
        "decisionScore": round(float(score), 4)
    }