import os
import json
from openai import OpenAI


client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


MODEL = os.getenv(
    "OPENAI_MODEL",
    "gpt-6-luna"
)


def evaluate_answer(
    question,
    answer,
    role,
    interview_type,
    difficulty
):

    prompt = f"""
You are an expert technical and HR interviewer.

Evaluate the candidate's answer.

Candidate Role:
{role}

Interview Type:
{interview_type}

Difficulty:
{difficulty}

Question:
{question}

Candidate Answer:
{answer}


Evaluate the answer using these categories:

1. Accuracy
2. Relevance
3. Clarity
4. Completeness

Give each category a score from 0 to 10.

Then calculate an overall score from 0 to 10.

Provide:

- accuracy_score
- relevance_score
- clarity_score
- completeness_score
- overall_score
- feedback
- strengths
- improvements

Return ONLY valid JSON.

Expected format:

{{
    "accuracy_score": 0,
    "relevance_score": 0,
    "clarity_score": 0,
    "completeness_score": 0,
    "overall_score": 0,
    "feedback": "Short explanation",
    "strengths": [
        "Strength 1",
        "Strength 2"
    ],
    "improvements": [
        "Improvement 1",
        "Improvement 2"
    ]
}}
"""


    response = client.responses.create(
        model=MODEL,
        input=prompt
    )


    text = response.output_text.strip()


    # Remove markdown code fences if AI adds them

    if text.startswith("```"):
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()


    return json.loads(text)