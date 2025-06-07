from flask import request
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
import re
import traceback


def clean_text(text):
    """Lowercase, remove special characters, extra spaces"""
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text.lower())
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def handle_opportunity():
    try:
        # ---------- Step 1: Load and Validate Input ----------
        data = request.get_json()
        consultants = data.get("consultants", [])
        opportunities = data.get("opportunities", [])

        if not consultants or not opportunities:
            return {
                "error": "Missing consultants or opportunities data.",
                "status": "failure"
            }, 400

        # ---------- Step 2: Preprocess Text ----------
        texts = [clean_text(opp["text"]) for opp in opportunities]
        dates = [opp.get("date", "N/A") for opp in opportunities]

        # ---------- Step 3: Load Sentence Transformer ----------
        model = SentenceTransformer("all-MiniLM-L6-v2")

        # ---------- Step 4: TF-IDF Clustering ----------
        tfidf_vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = tfidf_vectorizer.fit_transform(texts)

        # Adjust clusters to avoid crash
        max_clusters = min(len(texts), 5)
        kmeans = KMeans(n_clusters=max_clusters, random_state=42)
        clusters = kmeans.fit_predict(tfidf_matrix)

        # ---------- Step 5: Encode Opportunity Texts ----------
        opportunity_embeddings = model.encode(texts)

        # ---------- Step 6: Match Consultants ----------
        consultant_matches = []
        for consultant in consultants:
            # Combine and clean skill names
            skill_names = [skill["name"] for skill in consultant.get("skills", [])]
            skill_text = clean_text(" ".join(skill_names))
            skill_embedding = model.encode(skill_text)

            # Compute similarity
            scores = cosine_similarity([skill_embedding], opportunity_embeddings)[0]

            # Match threshold (lowered to 0.3 to allow more matches)
            matched = [
                {
                    "text": opportunities[i]["text"],
                    "date": dates[i],
                    "score": round(float(scores[i]), 2)
                }
                for i in range(len(texts)) if scores[i] > 0.3
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

        # ---------- Step 8: Return JSON Response ----------
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
