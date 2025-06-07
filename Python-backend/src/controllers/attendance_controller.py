import pandas as pd
from transformers import pipeline
from datetime import datetime
import nltk
import io
import warnings

warnings.filterwarnings("ignore")

def handle_attendance(file):
    try:
        # Step 1: Validate the file
        if not file or not file.filename.endswith(".csv"):
            return {
                "error": "Please upload a valid CSV file.",
                "status": "failure"
            }

        # Step 2: Read CSV content into DataFrame
        content = file.read()  # FIXED HERE
        df = pd.read_csv(io.StringIO(content.decode("utf-8")))

        # Step 3: Parse time columns
        df['Join Time'] = pd.to_datetime(df['Join Time'])
        df['Leave Time'] = pd.to_datetime(df['Leave Time'])
        df['Actual Duration (mins)'] = (df['Leave Time'] - df['Join Time']).dt.total_seconds() / 60

        # Step 4: Group and summarize
        summary = df.groupby('Full Name').agg({
            'Actual Duration (mins)': 'sum',
            'Email': 'first',
            'Role': 'first'
        }).reset_index()

        total_meeting_duration = summary['Actual Duration (mins)'].max()
        summary['Attendance %'] = round(
            (summary['Actual Duration (mins)'] / total_meeting_duration) * 100, 2
        )

        # Step 5: Compose text for summarization
        summary_text = ""
        for _, row in summary.iterrows():
            summary_text += f"{row['Full Name']} ({row['Role']}) attended {row['Attendance %']}% of the meeting.\n"
        avg_attendance = summary['Attendance %'].mean()
        summary_text += f"\nAverage attendance across all participants: {avg_attendance:.2f}%"

        # Step 6: AI summarization
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

        # Step 7: Return JSON response
        return {
            "summary": ai_summary,
            "data": summary.to_dict(orient="records")
        }

    except Exception as e:
        return {
            "error": str(e),
            "status": "failure"
        }
