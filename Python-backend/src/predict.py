import joblib

# # Load the trained model
# model = joblib.load('../models/model.pkl')

# # Example skill sets or resume snippets
# test_inputs = [
#     """Skills: Python, scikit-learn, pandas, matplotlib, seaborn, NLP, sentiment analysis, machine learning, topic modeling""",
#     """Skills: HTML, CSS, JavaScript, React, Bootstrap, Tailwind, frontend development, responsive design""",
#     """Skills: MySQL, MongoDB, ETL, Java, JEE, JDBC, Hibernate, Swagger, RESTful APIs, Spring Boot, microservices, ReactJS, Redux, NextJS"""
# ]

# # Make predictions
# predictions = model.predict(test_inputs)

# # Show predictions
# for i, text in enumerate(test_inputs):
#     print(f"\n🧠 Input {i+1}:")
#     print(f"{text}\n➡️ Predicted Category: {predictions[i]}")

def predict_from_category():
    # Load the reverse model
    model1 = joblib.load('../models/reverse_model.pkl')

    # Example categories
    test_categories = ["Data Scientist", "Frontend Developer", "HR"]

    for category in test_categories:
        predicted_resume = model1.predict([category])[0]
        print(f"\n📂 Category: {category}\n📝 Predicted Resume Snippet:\n{predicted_resume[:500]}...")

if __name__ == "__main__":
    predict_from_category()
