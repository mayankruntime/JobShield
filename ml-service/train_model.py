import pandas as pd
import joblib
import os

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report
)


# ==========================================
# 1. Load Dataset
# ==========================================

train_df = pd.read_csv("data/train.csv")
test_df = pd.read_csv("data/test.csv")

X_train = train_df["text"]
y_train = train_df["fraudulent"]

X_test = test_df["text"]
y_test = test_df["fraudulent"]


print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))


# ==========================================
# 2. TF-IDF Vectorization
# ==========================================

print("\nCreating TF-IDF features...")

vectorizer = TfidfVectorizer(
    lowercase=True,
    stop_words="english",
    ngram_range=(1, 2),
    max_features=50000,
    sublinear_tf=True
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

print("TF-IDF training shape:", X_train_tfidf.shape)
print("TF-IDF testing shape:", X_test_tfidf.shape)


# ==========================================
# 3. Train Linear SVM
# ==========================================

print("\nTraining Linear SVM...")

model = LinearSVC(
    class_weight="balanced"
)

model.fit(X_train_tfidf, y_train)


# ==========================================
# 4. Evaluate Model
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


print("\n==========================================")
print("LINEAR SVM RESULTS")
print("==========================================")

print("Accuracy :", round(accuracy, 4))
print("Precision:", round(precision, 4))
print("Recall   :", round(recall, 4))
print("F1 Score :", round(f1, 4))

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
# 5. Create Models Folder
# ==========================================

os.makedirs("models", exist_ok=True)


# ==========================================
# 6. Save Model
# ==========================================

model_path = "models/job_model.pkl"

joblib.dump(
    model,
    model_path
)


# ==========================================
# 7. Save TF-IDF Vectorizer
# ==========================================

vectorizer_path = "models/tfidf_vectorizer.pkl"

joblib.dump(
    vectorizer,
    vectorizer_path
)


# ==========================================
# 8. Final Message
# ==========================================

print("\n==========================================")
print("MODEL SAVING COMPLETED")
print("==========================================")

print("Model saved to:")
print(model_path)

print("\nVectorizer saved to:")
print(vectorizer_path)