import pandas as pd
import joblib
from sklearn.metrics import classification_report, confusion_matrix

# Load model and vectorizer
model = joblib.load("models/job_model.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

# Load test data
df = pd.read_csv("data/test.csv")

X = df["text"].fillna("")
y = df["fraudulent"]

# Convert text to TF-IDF
X_tfidf = vectorizer.transform(X)

# Predictions
predictions = model.predict(X_tfidf)

print("\n===================================")
print("JOBSHIELD MODEL VALIDATION")
print("===================================")

print("\nClassification Report:")
print(classification_report(
    y,
    predictions,
    target_names=["LEGITIMATE", "FRAUDULENT"]
))

print("\nConfusion Matrix:")
print(confusion_matrix(y, predictions))

# Fraudulent samples
fraud_df = df[df["fraudulent"] == 1].copy()

print("\n===================================")
print("FRAUDULENT SAMPLE CHECK")
print("===================================")

fraud_text = fraud_df["text"].fillna("")
fraud_tfidf = vectorizer.transform(fraud_text)

fraud_predictions = model.predict(fraud_tfidf)

correct = (fraud_predictions == 1).sum()
total = len(fraud_predictions)

print(f"Actual fraudulent samples : {total}")
print(f"Correctly detected        : {correct}")
print(f"Missed fraudulent samples : {total - correct}")

if total > 0:
    print(
        f"Fraud detection rate      : "
        f"{(correct / total) * 100:.2f}%"
    )

# Show a few actual fraudulent examples
print("\n===================================")
print("SAMPLE FRAUDULENT JOBS")
print("===================================")

for i, (_, row) in enumerate(fraud_df.head(5).iterrows(), start=1):

    text = row["text"]

    prediction = model.predict(
        vectorizer.transform([text])
    )[0]

    print(f"\n--- Sample {i} ---")
    print(text[:500].replace("\n", " "))
    print(
        "Prediction:",
        "FRAUDULENT" if prediction == 1 else "LEGITIMATE"
    )