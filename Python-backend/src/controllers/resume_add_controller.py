import os
import tempfile
import pdfplumber
import docx
from flask import jsonify
from werkzeug.utils import secure_filename
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer, util
import spacy

# Load models
nlp = spacy.load("en_core_web_sm")
kw_model = KeyBERT()
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# --- File Handlers ---
def extract_text_from_pdf(path):
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(path):
    doc = docx.Document(path)
    return "\n".join([para.text for para in doc.paragraphs])

def get_text_from_file(path):
    if path.endswith(".pdf"):
        return extract_text_from_pdf(path)
    elif path.endswith(".docx"):
        return extract_text_from_docx(path)
    else:
        raise ValueError("Unsupported file type. Only PDF or DOCX allowed.")

# --- Main Controller Function ---
def handle_resume_add(file):
    try:
        if not file:
            return jsonify({"error": "No file uploaded", "status": "failure"}), 400

        filename = secure_filename(file.filename)
        suffix = os.path.splitext(filename)[1]

        # Save temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
            file.save(temp_file.name)
            temp_file_path = temp_file.name

        # Extract text
        text = get_text_from_file(temp_file_path)

        # Extract skills and entities
        skills = [kw[0] for kw in kw_model.extract_keywords(
            text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=10)]

        doc = nlp(text)
        entities = [ent.text for ent in doc.ents if ent.label_ in ['ORG', 'SKILL', 'PERSON', 'DATE', 'NORP']]

        # Optional: compute embedding for future similarity
        resume_embedding = embedder.encode(text)

        # Delete temp file
        os.remove(temp_file_path)

        # Return result
        return {
            "filename": filename,
            "skills": skills,
            "entities": entities,
            "status": "success"
        }

    except Exception as e:
        return {
            "error": str(e),
            "status": "failure"
        }, 500
