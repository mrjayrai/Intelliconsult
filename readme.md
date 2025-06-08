# 🚀 Intelliconsultant

AI-powered platform for managing consultants, trainings, opportunities, resumes, and attendance.

---

## 🗂️ Project Structure

```
Intelliconsultant/
├── Node-Backend/         # 🚦 Node.js + Express + MongoDB backend
│   ├── Controllers/      # 🧩 API logic (users, skills, trainings, etc.)
│   ├── Models/           # 🗃️ Mongoose schemas
│   ├── Routes/           # 🛣️ Express routes
│   ├── Config/           # ⚙️ DB config
│   ├── middleware/       # 🛡️ File upload, etc.
│   ├── uploads/          # 📁 Uploaded files
│   ├── index.js
│   ├── package.json
│   └── .env
└── Python-backend/       # 🤖 Python + Flask + ML backend
    ├── src/
    │   ├── controllers/  # 🧠 AI/ML logic (resume, attendance, training)
    │   ├── routes/       # 🛣️ Flask routes
    │   ├── templates/    # 🖼️ HTML templates
    │   ├── main.py
    │   └── run.py
    ├── data/
    ├── models/
    ├── uploads/
    ├── requirements.txt
    └── .env
```

---

## ✨ Features

### Node-Backend (Express + MongoDB)
- 👤 User registration & login
- 📄 Resume upload & skill extraction
- 🛠️ Skill set & project management
- 💼 Opportunity creation & management
- 🎓 Training creation, assignment, completion tracking
- 📊 Attendance upload & AI-powered summary
- 🔗 RESTful API endpoints
- 📥 File uploads (resumes, attendance sheets)

### Python-backend (Flask + ML/NLP)
- 🧾 Resume parsing (PDF/DOCX), skill & entity extraction
- 📈 Attendance CSV analysis & AI summary
- 🏆 Training effectiveness scoring using ML
- 🔗 REST API endpoints

---

## ⚡ Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) (v14+)
- [Python](https://www.python.org/) (3.8+)
- [MongoDB](https://www.mongodb.com/)

### 1️⃣ Node Backend

```sh
cd Node-Backend
npm install
```
- Configure `.env`:
  ```
  MONGO_URI=mongodb://localhost:27017/intelliconsultant
  flaskserver=http://localhost:5000/
  PORT=4000
  ```
- Start server:
  ```sh
  npm start
  ```

### 2️⃣ Python Backend

```sh
cd Python-backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```
- Start Flask server:
  ```sh
  cd src
  python run.py
  ```

---

## 🔌 API Overview

- Node.js API: `http://localhost:4000/api/`
- Python API: `http://localhost:5000/api/`

#### Example Endpoints

| Endpoint                        | Description                       |
|----------------------------------|-----------------------------------|
| `POST /api/users/register`       | Register a new user               |
| `POST /api/users/login`          | User login                        |
| `POST /api/users/add-resume`     | Upload resume (skill extraction)  |
| `POST /api/skills/add-skill-set` | Add/update user skills            |
| `POST /api/opportunities/add`    | Create a new opportunity          |
| `POST /api/trainings/add-training` | Create a new training           |
| `POST /api/trainings/assign-training` | Assign training to user      |
| `POST /api/trainings/add-completed-training` | Mark training as completed |
| `POST /api/trainings/get-training-score` | Get AI/ML training score   |
| `POST /api/attendance/upload`    | Upload attendance CSV for summary |

---

## 📁 File Uploads

- All uploaded files (resumes, attendance sheets) are stored in the `uploads/` directory in each backend.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📜 License

This project is for educational and demonstration purposes.

---

## 👨‍💻 Authors

- Rai Pritesh
- Daksh Yadav
- Vidushi Upadhyay
- Anand Salokiya


_Node.js backend author field:_
```json
"author": "Rai Pritesh, Daksh Yadav , Anand Salokiya, Vidushi Upadhyay",
```

---

## 🙏 Acknowledgements

- [Express.js](https://expressjs.com/)
- [Flask](https://flask.palletsprojects.com/)
- [spaCy](https://spacy.io/)
- [transformers](https://huggingface.co/transformers/)
- [MongoDB](https://www.mongodb.com/)
