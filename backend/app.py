from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os


# --------------------------------------------------
# LOAD ENVIRONMENT VARIABLES
# --------------------------------------------------

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

ENV_FILE = os.path.join(
    BASE_DIR,
    ".env"
)

load_dotenv(ENV_FILE)


# --------------------------------------------------
# AI IMPORTS
# --------------------------------------------------

from ai.interviewer import generate_question
from ai.evaluator import evaluate_answer

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")


app = Flask(__name__)
CORS(app)


# --------------------------------------------------
# FRONTEND
# --------------------------------------------------

@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/<path:path>")
def frontend_files(path):
    return send_from_directory(FRONTEND_DIR, path)


# --------------------------------------------------
# START INTERVIEW
# --------------------------------------------------

@app.route("/api/start-interview", methods=["POST"])
def start_interview():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No interview configuration received."
        }), 400


    role = data.get("role")
    experience = data.get("experience")
    interview_type = data.get("interviewType")
    difficulty = data.get("difficulty")


    if not all([
        role,
        experience,
        interview_type,
        difficulty
    ]):
        return jsonify({
            "error": "Missing interview configuration."
        }), 400


    try:

        previous_questions = data.get(
    "previousQuestions",
    []
)
        question = generate_question(
    role=role,
    experience=experience,
    interview_type=interview_type,
    difficulty=difficulty,
    previous_questions=previous_questions
)


        return jsonify({
            "success": True,
            "question": question
        })


    except Exception as e:

        print("AI ERROR:", e)

        return jsonify({
            "success": False,
            "error": "Unable to generate interview question."
        }), 500


# --------------------------------------------------
# EVALUATE ANSWER
# --------------------------------------------------

@app.route("/api/evaluate", methods=["POST"])
def evaluate():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "No answer received."
        }), 400


    question = data.get("question")
    answer = data.get("answer")
    role = data.get("role")
    interview_type = data.get("interviewType")
    difficulty = data.get("difficulty")


    if not all([
        question,
        answer,
        role,
        interview_type,
        difficulty
    ]):
        return jsonify({
            "error": "Missing evaluation data."
        }), 400


    try:

        result = evaluate_answer(
            question=question,
            answer=answer,
            role=role,
            interview_type=interview_type,
            difficulty=difficulty
        )


        return jsonify({
            "success": True,
            "evaluation": result
        })


    except Exception as e:

        print("EVALUATION ERROR:", e)

        return jsonify({
            "success": False,
            "error": "Unable to evaluate answer."
        }), 500


# --------------------------------------------------
# RUN SERVER
# --------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )