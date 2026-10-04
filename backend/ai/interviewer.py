import os
from openai import OpenAI


client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

MODEL = os.getenv(
    "OPENAI_MODEL",
    "gpt-6-luna"
)


def generate_question(
    role,
    experience,
    interview_type,
    difficulty,
    previous_questions=None
):

    if previous_questions is None:
        previous_questions = []


    previous_text = "\n".join(
        f"- {question}"
        for question in previous_questions
    )


    prompt = f"""
You are an expert professional interviewer.

Generate ONE NEW interview question.

Candidate information:

Job Role: {role}
Experience Level: {experience}
Interview Type: {interview_type}
Difficulty: {difficulty}


Previously asked questions:
{previous_text if previous_text else "None"}


IMPORTANT RULES:

1. Generate exactly ONE question.
2. The question MUST be different from every previously asked question.
3. Do not repeat the same concept using slightly different wording.
4. Cover a different topic whenever possible.
5. Match the candidate's job role.
6. Match the requested difficulty.
7. For technical interviews, ask technical questions relevant to the role.
8. For HR interviews, ask behavioral or HR questions.
9. For mixed interviews, alternate between technical and behavioral topics.
10. Do not provide the answer.
11. Do not provide explanations.
12. Return ONLY the question.


Interview question:
"""


    response = client.responses.create(
        model=MODEL,
        input=prompt
    )


    return response.output_text.strip()