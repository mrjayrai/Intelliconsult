from flask import request
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import re
import traceback


def clean_text(text):
    """Lowercase, remove special characters, and normalize whitespace"""
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text.lower())
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def handle_opportunity():
    try:
        # ---------- Step 1: Load and Validate Input ----------
        data = request.get_json()
        consultants = data.get("consultants", [])
        opportunities = data.get("opportunities", [])
        print("Received consultants:", consultants)
        print("Received opportunities:", opportunities)

        if not consultants or not opportunities:
            return {
                "status": "failure",
                "error": "Missing consultants or opportunities data."
            }, 400

        # ---------- Step 2: Preprocess Opportunity Texts ----------
        texts = [clean_text(opp["text"]) for opp in opportunities]
        dates = [opp.get("date", "N/A") for opp in opportunities]

        # ---------- Step 3: Load Embedding Model ----------
        model = SentenceTransformer("all-MiniLM-L6-v2")

        # ---------- Step 4: Cluster Opportunities ----------
        tfidf_vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = tfidf_vectorizer.fit_transform(texts)

        max_clusters = min(len(texts), 5)
        kmeans = KMeans(n_clusters=max_clusters, random_state=42)
        clusters = kmeans.fit_predict(tfidf_matrix)

        # ---------- Step 5: Encode Opportunity Embeddings ----------
        opportunity_embeddings = model.encode(texts)

        # ---------- Step 6: Match Consultants Based on Skills ----------
        consultant_matches = []
        for consultant in consultants:
            skill_names = []
            for skill in consultant.get("skills", []):
                weight = skill.get("yearsOfExperience", 0) + skill.get("endorsements", 0)
                if weight > 0:
                    skill_names.extend([skill["name"]] * weight)

            if not skill_names:
                continue  # Skip consultants with no strong skills

            skill_text = clean_text(" ".join(skill_names))
            skill_embedding = model.encode(skill_text)

            scores = cosine_similarity([skill_embedding], opportunity_embeddings)[0]

            matched = [
                {
                    "text": opportunities[i]["text"],
                    "date": dates[i],
                    "score": round(float(scores[i]), 2)
                }
                for i in range(len(scores)) if scores[i] > 0.25
            ]

            consultant_matches.append({
                "userId": consultant.get("userId"),
                "matched_opportunities": matched
            })

        # ---------- Step 7: Group Opportunities by Cluster ----------
        cluster_output = {}
        for i in range(max_clusters):
            cluster_output[f"Cluster {i + 1}"] = [
                {
                    "text": opportunities[j]["text"],
                    "date": dates[j]
                }
                for j, label in enumerate(clusters) if label == i
            ]

        # ---------- Step 8: Return Results ----------
        return {
            "status": "success",
            "consultant_matches": consultant_matches,
            "clustered_opportunities": cluster_output
        }

    except Exception as e:
        return {
            "status": "failure",
            "error": str(e),
            "trace": traceback.format_exc()
        }, 500
