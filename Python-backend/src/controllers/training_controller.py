from flask import request, jsonify
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import joblib  # for loading the trained model

# Load model for sentence embeddings
model = SentenceTransformer("all-MiniLM-L6-v2")

# ✅ Load the trained ML model from file
ml_model = joblib.load("../models/effectiveness_model.pkl") 

def embed_skills(skills):
    if not skills:
        return np.zeros(384)  # embedding size for all-MiniLM-L6-v2
    return model.encode([" ".join(skills)])[0]

def handle_training():
    data = request.get_json()

    consultants = data.get("consultants", [])
    required_skills_map = data.get("required_skills_map", {})
    completed_trainings_map = data.get("completed_trainings_map", {})

    report_data = []

    for consultant in consultants:
        user_id = consultant.get("userId")
        if isinstance(user_id, dict) and "$oid" in user_id:
            user_id = user_id["$oid"]

        skills = consultant.get("skills", [])
        current_skills = [s.get("name", "") for s in skills]
        years_experience = sum(s.get("yearsOfExperience", 0) for s in skills)
        certifications = len([s.get("certification") for s in skills if s.get("certification")])
        endorsements = sum(s.get("endorsements", 0) for s in skills)

        required_skills = required_skills_map.get(user_id, [])
        trainings = completed_trainings_map.get(user_id, [])

        required_vec = embed_skills(required_skills)
        trained_vec = embed_skills(trainings)
        current_vec = embed_skills(current_skills)

        trained_score = float(cosine_similarity([trained_vec], [required_vec])[0][0])
        current_score = float(cosine_similarity([current_vec], [required_vec])[0][0])

        features = np.array([[years_experience, certifications, endorsements, trained_score, current_score]])
        effectiveness_score = float(ml_model.predict(features)[0])

        gaps = list(set(required_skills) - set(trainings) - set(current_skills))

        report_data.append({
            "userId": user_id,
            "trained_vs_required": round(trained_score, 2),
            "current_vs_required": round(current_score, 2),
            "effectiveness_score": round(effectiveness_score, 2),
            "required_skills": required_skills,
            "trainings": trainings,
            "gaps": gaps
        })

    return jsonify({
        "message": "Training report generated successfully with AI/ML insights",
        "report_data": report_data
    })
