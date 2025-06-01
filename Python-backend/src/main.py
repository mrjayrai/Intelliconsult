import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import joblib

def train():
    # Load the dataset
    df = pd.read_csv('../data/UpdatedResumeDataSet.csv')

    # Input (features) and target
    X = df['Resume']
    y = df['Category']

    # Create pipeline: TF-IDF + Random Forest
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english', max_features=5000)),
        ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    # Train the model
    pipeline.fit(X, y)

    # Save the trained pipeline
    joblib.dump(pipeline, '../models/model.pkl')
    print("✅ Model trained and saved to ../models/model.pkl")

if __name__ == "__main__":
    train()
