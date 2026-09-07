import joblib


# ==========================================
# Load Model and Vectorizer
# ==========================================

model = joblib.load("models/job_model.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")


# ==========================================
# Prediction Function
# ==========================================

def predict_text(text):

    text_tfidf = vectorizer.transform([text])

    prediction = model.predict(text_tfidf)[0]

    decision_score = model.decision_function(text_tfidf)[0]

    return prediction, decision_score


# ==========================================
# Test
# ==========================================

if __name__ == "__main__":

    text = """
    Work from home and earn $5000 per week.
    No experience required.
    You must pay a registration fee of $200
    before joining.
    Send your bank account details and contact us
    on WhatsApp immediately.
    """

    prediction, score = predict_text(text)

    print("\n===================================")
    print("JOB ANALYSIS RESULT")
    print("===================================")

    print("Prediction:", prediction)
    print("Decision Score:", score)

    if prediction == 1:
        print("Result: FRAUDULENT / SCAM")
    else:
        print("Result: LEGITIMATE")