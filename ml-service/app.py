from fastapi import FastAPI
from pydantic import BaseModel
import joblib


# ==========================================
# Load Model and Vectorizer
# ==========================================

model = joblib.load("models/job_model.pkl")

vectorizer = joblib.load(
    "models/tfidf_vectorizer.pkl"
)


# ==========================================
# FastAPI
# ==========================================

app = FastAPI(
    title="JobShield ML Service",
    version="2.0.0"
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

    prediction = model.predict(
        text_tfidf
    )[0]

    probabilities = model.predict_proba(
        text_tfidf
    )[0]

    legitimate_probability = float(
        probabilities[0]
    )

    fraud_probability = float(
        probabilities[1]
    )

    return (
        prediction,
        legitimate_probability,
        fraud_probability
    )


# ==========================================
# Home
# ==========================================

@app.get("/")
def home():

    return {
        "message": "JobShield ML Service is running",
        "version": "2.0.0"
    }


# ==========================================
# Prediction API
# ==========================================

@app.post("/predict")
def predict_job(request: JobRequest):

    (
        prediction,
        legitimate_probability,
        fraud_probability
    ) = predict_text(request.text)


    print("\n==========================================")
    print("JOBSHIELD ML PREDICTION")
    print("==========================================")

    print("Received text:")
    print(request.text)

    print("\nPrediction:", prediction)

    print(
        "Legitimate Probability:",
        round(legitimate_probability, 4)
    )

    print(
        "Fraud Probability:",
        round(fraud_probability, 4)
    )

    print("==========================================\n")


    if prediction == 1:

        result = "FRAUDULENT"

    else:

        result = "LEGITIMATE"


    return {

        "prediction": result,

        "fraudProbability": round(
            fraud_probability,
            4
        ),

        "legitimateProbability": round(
            legitimate_probability,
            4
        )
    }