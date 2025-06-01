import joblib

# Load the trained model
model = joblib.load('../models/model.pkl')

# Example skill sets or resume snippets
test_inputs = [
    """Skills: Python, scikit-learn, pandas, matplotlib, seaborn, NLP, sentiment analysis, machine learning, topic modeling""",
    """Skills: HTML, CSS, JavaScript, React, Bootstrap, Tailwind, frontend development, responsive design""",
    """Skills: MySQL, MongoDB, ETL, Java, JEE, JDBC, Hibernate, Swagger, RESTful APIs, Spring Boot, microservices, ReactJS, Redux, NextJS"""
]

# Make predictions
predictions = model.predict(test_inputs)

# Show predictions
for i, text in enumerate(test_inputs):
    print(f"\n🧠 Input {i+1}:")
    print(f"{text}\n➡️ Predicted Category: {predictions[i]}")
