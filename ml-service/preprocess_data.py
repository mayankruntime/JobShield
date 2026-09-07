
import pandas as pd
from sklearn.model_selection import train_test_split


# ==========================================
# 1. Load Dataset
# ==========================================

DATA_PATH = "data/DataSet.csv"

df = pd.read_csv(DATA_PATH)

print("Original dataset shape:", df.shape)


# ==========================================
# 2. Select Useful Text Columns
# ==========================================

text_columns = [
    "title",
    "company_profile",
    "description",
    "requirements",
    "benefits"
]


# Replace missing values with empty strings
for column in text_columns:
    df[column] = df[column].fillna("")


# ==========================================
# 3. Combine Text Columns
# ==========================================

df["text"] = (
    df["title"] + " "
    + df["company_profile"] + " "
    + df["description"] + " "
    + df["requirements"] + " "
    + df["benefits"]
)


# ==========================================
# 4. Convert Target Label
# ==========================================

df["fraudulent"] = df["fraudulent"].map({
    "f": 0,
    "t": 1
})


# Remove rows where label could not be converted
df = df.dropna(subset=["fraudulent"])

df["fraudulent"] = df["fraudulent"].astype(int)


# ==========================================
# 5. Keep Only Required Columns
# ==========================================

processed_df = df[
    ["text", "fraudulent"]
].copy()


# ==========================================
# 6. Remove Empty Text
# ==========================================

processed_df["text"] = processed_df["text"].str.strip()

processed_df = processed_df[
    processed_df["text"] != ""
]


# ==========================================
# 7. Train/Test Split
# ==========================================

X = processed_df["text"]
y = processed_df["fraudulent"]


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ==========================================
# 8. Save Processed Data
# ==========================================

train_df = pd.DataFrame({
    "text": X_train,
    "fraudulent": y_train
})

test_df = pd.DataFrame({
    "text": X_test,
    "fraudulent": y_test
})


train_df.to_csv(
    "data/train.csv",
    index=False
)

test_df.to_csv(
    "data/test.csv",
    index=False
)


# ==========================================
# 9. Display Information
# ==========================================

print("\nPreprocessing completed!")

print("Processed dataset shape:", processed_df.shape)

print("\nClass distribution:")
print(processed_df["fraudulent"].value_counts())

print("\nTraining set:", train_df.shape)
print("Testing set:", test_df.shape)

print("\nTraining class distribution:")
print(train_df["fraudulent"].value_counts())

print("\nTesting class distribution:")
print(test_df["fraudulent"].value_counts())

print("\nFiles created:")
print("data/train.csv")
print("data/test.csv")

