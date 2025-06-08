import os
import tempfile
import pandas as pd
import spacy
import docx
import pdfplumber
from flask import jsonify
from sentence_transformers import SentenceTransformer, util

# Load NLP tools
nlp = spacy.load("en_core_web_sm")
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# Load skill list from CSV
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
SKILL_CSV_PATH = os.path.join(BASE_DIR, 'uploads', 'tech_skills.csv')
skills_df = pd.read_csv(SKILL_CSV_PATH)
tech_skills_set = set(skill.lower().strip() for skill in skills_df['skill'].dropna())

# === File Extractors ===
def extract_text_from_pdf(path):
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def extract_text_from_docx(path):
    doc = docx.Document(path)
    return "\n".join(para.text for para in doc.paragraphs)

def get_text_from_file(path):
    if path.endswith(".pdf"):
        return extract_text_from_pdf(path)
    elif path.endswith(".docx"):
        return extract_text_from_docx(path)
    else:
        raise ValueError("Unsupported file type. Use PDF or DOCX.")

# === Extract entities ===
def extract_entities(text):
    doc = nlp(text)
    return [ent.text.strip() for ent in doc.ents]

# === Match skills from dictionary ===
def extract_skills(text):
    tokens = [token.text.lower().strip() for token in nlp(text) if not token.is_stop and token.is_alpha]
    matched_skills = list(set(token for token in tokens if token in tech_skills_set))
    return matched_skills

# === Main Handler ===
def handle_resume_add(file):
    try:
        filename = file.filename
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(filename)[1]) as temp_file:
            temp_path = temp_file.name
            file.save(temp_path)

        # Extract text from resume
        text = get_text_from_file(temp_path)

        # Extract skills and entities
        skills = extract_skills(text)
        entities = extract_entities(text)

        # Clean up temp file
        os.remove(temp_path)

        return jsonify({
            "filename": filename,
            "skills": skills,
            "entities": entities,
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "failure"
        }), 500
