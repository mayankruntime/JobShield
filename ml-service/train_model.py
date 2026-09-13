import pandas as pd
import joblib
import os
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)


# ==========================================
# 1. Text Cleaning
# ==========================================

def clean_text(text):

    text = str(text)

    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)

    # Replace URLs
    text = re.sub(r"https?://\S+|www\.\S+", " URL ", text)

    # Replace email addresses
    text = re.sub(
        r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
        " EMAIL ",
        text
    )

    # Remove extra spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip().lower()


# ==========================================
# 2. Load Dataset
# ==========================================

print("Loading dataset...")

train_df = pd.read_csv("data/train.csv")
test_df = pd.read_csv("data/test.csv")

train_df["text"] = train_df["text"].fillna("").apply(clean_text)
test_df["text"] = test_df["text"].fillna("").apply(clean_text)

X_train = train_df["text"]
y_train = train_df["fraudulent"]

X_test = test_df["text"]
y_test = test_df["fraudulent"]

print("Training samples:", len(X_train))
print("Testing samples :", len(X_test))


# ==========================================
# 3. TF-IDF Vectorization
# ==========================================

print("\nCreating improved TF-IDF features...")

vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    ngram_range=(1, 2),
    max_features=70000,
    sublinear_tf=True,
    min_df=2,
    max_df=0.98
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

print("TF-IDF training shape:", X_train_tfidf.shape)
print("TF-IDF testing shape :", X_test_tfidf.shape)


# ==========================================
# 4. Train Linear SVM
# ==========================================

print("\nTraining Linear SVM...")

model = LinearSVC(
    C=1.5,
    class_weight="balanced"
)

model.fit(X_train_tfidf, y_train)


# ==========================================
# 5. Evaluate Model
# ==========================================

predictions = model.predict(X_test_tfidf)

accuracy = accuracy_score(y_test, predictions)

precision = precision_score(
    y_test,
    predictions,
    zero_division=0
)

recall = recall_score(
    y_test,
    predictions,
    zero_division=0
)

f1 = f1_score(
    y_test,
    predictions,
    zero_division=0
)

cm = confusion_matrix(y_test, predictions)


print("\n==========================================")
print("JOBSHIELD ML MODEL RESULTS")
print("==========================================")

print("Accuracy :", round(accuracy, 4))
print("Precision:", round(precision, 4))
print("Recall   :", round(recall, 4))
print("F1 Score :", round(f1, 4))

print("\nConfusion Matrix:")
print(cm)

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions,
        target_names=[
            "Legitimate",
            "Fraudulent"
        ],
        zero_division=0
    )
)


# ==========================================
# 6. Save Models
# ==========================================

os.makedirs("models", exist_ok=True)

model_path = "models/job_model.pkl"
vectorizer_path = "models/tfidf_vectorizer.pkl"

joblib.dump(model, model_path)
joblib.dump(vectorizer, vectorizer_path)


# ==========================================
# 7. Final Output
# ==========================================

print("\n==========================================")
print("MODEL TRAINING COMPLETED")
print("==========================================")

print("Model saved to:")
print(model_path)

print("\nVectorizer saved to:")
print(vectorizer_path)

print("\nJobShield ML model is ready!")