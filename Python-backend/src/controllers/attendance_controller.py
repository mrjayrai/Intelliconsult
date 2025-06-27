import pandas as pd
from transformers import pipeline
import nltk
import warnings
import numpy as np

warnings.filterwarnings("ignore")

def handle_attendance_json(consultant_data):
    try:
        if not isinstance(consultant_data, list):
            return {
                "error": "Expected a list of consultant objects.",
                "status": "failure"
            }

        attendance_rows = []
        enriched_insights = []

        for user in consultant_data:
            user_id = user.get("userId", "UnknownUser")
            name = user.get("name", "N/A")
            email = user.get("email", "N/A")
            city = user.get("city", "N/A")
            doj = user.get("doj", "N/A")
            resume_skills = set(map(str.lower, user.get("resumeDetails", {}).get("skills", [])))
            skills_obj = user.get("skills", [])
            attendance_sheet = user.get("attendanceSheet", [])
            trainings_completed = user.get("trainingsCompleted", [])
            assigned_trainings = user.get("trainingsAssigned", [])
            projects = user.get("projects", [])

            # Skill Analysis
            endorsed_skills = [s for s in skills_obj if s.get("endorsements", 0) > 0]
            certified_skills = [s for s in skills_obj if s.get("certification", "").lower() == "true"]
            skill_names = set(s.get("name", "").lower() for s in skills_obj)
            skill_match_pct = round(len(resume_skills & skill_names) / max(1, len(resume_skills)) * 100, 2)

            # Attendance Analysis
            total_days = total_present = 0
            training_attendance_list = []

            for entry in attendance_sheet:
                training = entry.get("trainingAttended", "Unknown")
                total = entry.get("totalDaysInWeek", 0)
                present = len(entry.get("daysPresent", []))

                total_days += total
                total_present += present

                attendance_rows.append({
                    "User ID": user_id,
                    "Training": training,
                    "Total Days": total,
                    "Days Present": present,
                    "Attendance %": round((present / total) * 100, 2) if total else 0.0
                })

                training_attendance_list.append({
                    "Training": training,
                    "Days Present": present,
                    "Total Days": total,
                    "Attendance %": round((present / total) * 100, 2) if total else 0.0
                })

            overall_attendance = round((total_present / total_days) * 100, 2) if total_days else 0.0

            # Status Logic
            if overall_attendance >= 90 and len(certified_skills) >= 2 and len(projects) >= 2:
                status = "Deployment Ready"
            elif overall_attendance >= 75:
                status = "Needs Further Evaluation"
            else:
                status = "Training Needed"

            enriched_insights.append({
                "userId": user_id,
                "name": name,
                "email": email,
                "city": city,
                "dateOfJoining": doj,
                "totalTrainings": len(training_attendance_list),
                "totalDays": total_days,
                "daysPresent": total_present,
                "overallAttendance": overall_attendance,
                "resumeSkillMatchPercent": skill_match_pct,
                "certifiedSkills": len(certified_skills),
                "endorsedSkills": len(endorsed_skills),
                "projectCount": len(projects),
                "remark": status,
                "trainings": training_attendance_list
            })

        # Convert for summary generation
        df = pd.DataFrame(attendance_rows)

        summary_text = ""
        for insight in enriched_insights:
            summary_text += (
                f"{insight['name']} ({insight['userId']}) from {insight['city']} "
                f"attended {insight['daysPresent']}/{insight['totalDays']} days "
                f"with overall attendance {insight['overallAttendance']}%, "
                f"skill match {insight['resumeSkillMatchPercent']}%, "
                f"{insight['certifiedSkills']} certified skills, {insight['projectCount']} project(s). "
                f"Remark: {insight['remark']}.\n"
            )

        # Overall stats
        avg_attendance = round(df["Attendance %"].mean(), 2) if not df.empty else 0.0
        summary_text += f"\nOverall average attendance across all consultants: {avg_attendance}%."

        # AI Summary
        try:
            summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
            ai_summary = summarizer(summary_text[:1024], max_length=100, min_length=30, do_sample=False)[0]['summary_text']
        except:
            nltk.download('punkt')
            from sumy.summarizers.lsa import LsaSummarizer
            from sumy.parsers.plaintext import PlaintextParser
            from sumy.nlp.tokenizers import Tokenizer

            parser = PlaintextParser.from_string(summary_text, Tokenizer("english"))
            summarizer_model = LsaSummarizer()
            summary_sentences = summarizer_model(parser.document, 3)
            ai_summary = ' '.join(str(sentence) for sentence in summary_sentences)

        return {
            "status": "success",
            "summary": ai_summary,
            "insights": enriched_insights
        }

    except Exception as e:
        return {
            "status": "failure",
            "error": str(e)
        }
