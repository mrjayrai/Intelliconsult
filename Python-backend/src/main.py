import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import joblib
from sklearn.linear_model import SGDClassifier  # Or use other models
from sklearn.preprocessing import LabelEncoder

# def train():
#     # Load the dataset
#     df = pd.read_csv('../data/UpdatedResumeDataSet.csv')

#     # Input (features) and target
#     X = df['Resume']
#     y = df['Category']

#     # Create pipeline: TF-IDF + Random Forest
#     pipeline = Pipeline([
#         ('tfidf', TfidfVectorizer(stop_words='english', max_features=5000)),
#         ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
#     ])

#     # Train the model
#     pipeline.fit(X, y)

#     # Save the trained pipeline
#     joblib.dump(pipeline, '../models/model.pkl')
#     print("✅ Model trained and saved to ../models/model.pkl")

def train_reverse_model():
    # Load the dataset
    df = pd.read_csv('../data/UpdatedResumeDataSet.csv')

    # Drop missing or empty resumes/categories
    df.dropna(subset=['Resume', 'Category'], inplace=True)

    # INPUT: Category (as text)
    X = df['Category']

    # OUTPUT: Resume text
    y = df['Resume']

    # Encode category labels as strings (optional if already string)
    # No need for LabelEncoder here because we're using category text directly

    # Create pipeline: Category -> Resume prediction (simplified as classification)
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer()),           # Convert category (short text) into vectors
        ('clf', SGDClassifier(loss='log_loss', max_iter=1000, random_state=42))  # Probabilistic output
    ])

    # Train the model
    pipeline.fit(X, y)

    # Save the trained pipeline
    joblib.dump(pipeline, '../models/reverse_model.pkl')
    print("✅ Reverse model trained and saved to ../models/reverse_model.pkl")

if __name__ == "__main__":
    train_reverse_model()
