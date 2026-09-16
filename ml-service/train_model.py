
import pandas as pd
import re
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.calibration import CalibratedClassifierCV

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix
)


# ==========================================
# TEXT CLEANING
# ==========================================

def clean_text(text):

    text = str(text)

    # Remove HTML tags
    text = re.sub(r"<[^>]+>", " ", text)

    # Replace URLs
    text = re.sub(
        r"http\S+|www\S+|https\S+",
        " URL ",
        text
    )

    # Replace email addresses
    text = re.sub(
        r"\S+@\S+",
        " EMAIL ",
        text
    )

    # Remove extra whitespace
    text = re.sub(
        r"\s+",
        " ",
        text
    )

    # Convert to lowercase
    text = text.lower().strip()

    return text


# ==========================================
# LOAD DATA
# ==========================================

train_path = "data/train.csv"
test_path = "data/test.csv"

train_df = pd.read_csv(train_path)
test_df = pd.read_csv(test_path)

print("Training samples:", len(train_df))
print("Testing samples :", len(test_df))


# ==========================================
# DETECT COLUMNS
# ==========================================

text_column = "text"
label_column = "fraudulent"


X_train = train_df[text_column].fillna("").apply(clean_text)
y_train = train_df[label_column]

X_test = test_df[text_column].fillna("").apply(clean_text)
y_test = test_df[label_column]


# ==========================================
# TF-IDF VECTORIZATION
# ==========================================

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

print(
    "TF-IDF training shape:",
    X_train_tfidf.shape
)

print(
    "TF-IDF testing shape :",
    X_test_tfidf.shape
)


# ==========================================
# TRAIN LINEAR SVM
# ==========================================

print("\nTraining Linear SVM...")

base_model = LinearSVC(
    C=1.5,
    class_weight="balanced"
)


# ==========================================
# PROBABILITY CALIBRATION
# ==========================================

print("Calibrating SVM probabilities...")

model = CalibratedClassifierCV(
    estimator=base_model,
    method="sigmoid",
    cv=3
)

model.fit(
    X_train_tfidf,
    y_train
)

print("Probability calibration completed.")


# ==========================================
# PREDICTIONS
# ==========================================

y_pred = model.predict(X_test_tfidf)


# ==========================================
# MODEL EVALUATION
# ==========================================

accuracy = accuracy_score(
    y_test,
    y_pred
)

precision = precision_score(
    y_test,
    y_pred
)

recall = recall_score(
    y_test,
    y_pred
)

f1 = f1_score(
    y_test,
    y_pred
)

cm = confusion_matrix(
    y_test,
    y_pred
)


print("\n==========================================")
print("MODEL PERFORMANCE")
print("==========================================")

print(
    "Accuracy :",
    round(accuracy, 4)
)

print(
    "Precision:",
    round(precision, 4)
)

print(
    "Recall   :",
    round(recall, 4)
)

print(
    "F1 Score :",
    round(f1, 4)
)

print("\nConfusion Matrix:")
print(cm)


# ==========================================
# SAMPLE PROBABILITIES
# ==========================================

print("\nSample probabilities:")

sample_probabilities = model.predict_proba(
    X_test_tfidf[:5]
)

for index, probabilities in enumerate(
    sample_probabilities,
    start=1
):

    legitimate_probability = probabilities[0]
    fraud_probability = probabilities[1]

    print(
        f"Sample {index}: "
        f"Legitimate={legitimate_probability:.4f}, "
        f"Fraudulent={fraud_probability:.4f}"
    )


# ==========================================
# SAVE MODEL
# ==========================================

joblib.dump(
    model,
    "models/job_model.pkl"
)

joblib.dump(
    vectorizer,
    "models/tfidf_vectorizer.pkl"
)

print("\nModel saved successfully.")

