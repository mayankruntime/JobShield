import pandas as pd
import joblib
import re


# ==========================================
# TEXT CLEANING
# ==========================================

def clean_text(text):

    text = str(text)

    text = re.sub(
        r"<[^>]+>",
        " ",
        text
    )

    text = re.sub(
        r"http\S+|www\S+|https\S+",
        " URL ",
        text
    )

    text = re.sub(
        r"\S+@\S+",
        " EMAIL ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.lower().strip()


# ==========================================
# LOAD MODEL
# ==========================================

print("Loading model...")

model = joblib.load(
    "models/job_model.pkl"
)

vectorizer = joblib.load(
    "models/tfidf_vectorizer.pkl"
)


# ==========================================
# LOAD TEST DATA
# ==========================================

print("Loading test dataset...")

test_df = pd.read_csv(
    "data/test.csv"
)

test_df["text"] = (
    test_df["text"]
    .fillna("")
    .apply(clean_text)
)

X_test = test_df["text"]

y_test = test_df["fraudulent"]


# ==========================================
# TRANSFORM DATA
# ==========================================

print("Running predictions...")

X_test_tfidf = vectorizer.transform(
    X_test
)

predictions = model.predict(
    X_test_tfidf
)

probabilities = model.predict_proba(
    X_test_tfidf
)


# ==========================================
# FIND FALSE POSITIVES
# Actual = Legitimate (0)
# Predicted = Fraudulent (1)
# ==========================================

false_positives = test_df[
    (y_test == 0) &
    (predictions == 1)
].copy()

false_positive_indexes = false_positives.index


# ==========================================
# FIND FALSE NEGATIVES
# Actual = Fraudulent (1)
# Predicted = Legitimate (0)
# ==========================================

false_negatives = test_df[
    (y_test == 1) &
    (predictions == 0)
].copy()

false_negative_indexes = false_negatives.index


# ==========================================
# ADD PROBABILITIES
# ==========================================

false_positives["fraud_probability"] = [
    probabilities[index][1]
    for index in false_positive_indexes
]

false_positives["legitimate_probability"] = [
    probabilities[index][0]
    for index in false_positive_indexes
]


false_negatives["fraud_probability"] = [
    probabilities[index][1]
    for index in false_negative_indexes
]

false_negatives["legitimate_probability"] = [
    probabilities[index][0]
    for index in false_negative_indexes
]


# ==========================================
# PRINT SUMMARY
# ==========================================

print("\n==========================================")
print("JOBSHIELD ERROR ANALYSIS")
print("==========================================")

print(
    "False Positives:",
    len(false_positives)
)

print(
    "False Negatives:",
    len(false_negatives)
)


# ==========================================
# PRINT FALSE POSITIVES
# ==========================================

print("\n==========================================")
print("FALSE POSITIVES")
print("Legitimate jobs predicted as Fraudulent")
print("==========================================")

for index, row in false_positives.iterrows():

    print("\n------------------------------------------")

    print("Index:", index)

    print(
        "Fraud Probability:",
        round(
            row["fraud_probability"],
            4
        )
    )

    print(
        "\nText:"
    )

    print(
        row["text"][:1000]
    )

    print("\n------------------------------------------")


# ==========================================
# PRINT FALSE NEGATIVES
# ==========================================

print("\n==========================================")
print("FALSE NEGATIVES")
print("Fraudulent jobs predicted as Legitimate")
print("==========================================")

for index, row in false_negatives.iterrows():

    print("\n------------------------------------------")

    print("Index:", index)

    print(
        "Fraud Probability:",
        round(
            row["fraud_probability"],
            4
        )
    )

    print(
        "\nText:"
    )

    print(
        row["text"][:1000]
    )

    print("\n------------------------------------------")


# ==========================================
# SAVE RESULTS
# ==========================================

false_positives.to_csv(
    "false_positives.csv",
    index=False
)

false_negatives.to_csv(
    "false_negatives.csv",
    index=False
)


print("\n==========================================")
print("ANALYSIS COMPLETED")
print("==========================================")

print(
    "Saved: false_positives.csv"
)

print(
    "Saved: false_negatives.csv"
)