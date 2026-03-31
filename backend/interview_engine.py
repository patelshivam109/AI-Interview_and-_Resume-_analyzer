import json
from pathlib import Path

try:
    from .question_scraper import fetch_questions_from_web
except ImportError:
    from question_scraper import fetch_questions_from_web


QUESTION_HISTORY_FILE = Path(__file__).with_name("asked_questions.json")


# ensure question history file exists
if not QUESTION_HISTORY_FILE.exists():
    with QUESTION_HISTORY_FILE.open("w", encoding="utf-8") as f:
        json.dump([], f)


def remove_old_questions(questions):

    with QUESTION_HISTORY_FILE.open("r", encoding="utf-8") as f:
        old_questions = json.load(f)

    new_questions = []

    for q in questions:
        if q not in old_questions:
            new_questions.append(q)

    return new_questions


def save_questions(questions):

    with QUESTION_HISTORY_FILE.open("r", encoding="utf-8") as f:
        old = json.load(f)

    old.extend(questions)

    with QUESTION_HISTORY_FILE.open("w", encoding="utf-8") as f:
        json.dump(old, f)


def generate_questions(skills):
    if not skills:
        return [
            "Tell me about yourself and the kind of work you enjoy most.",
            "Describe a project you are proud of and why it mattered.",
            "What is one technical challenge you solved recently?",
            "How do you approach learning a new tool or framework quickly?",
            "What does strong collaboration look like to you on a team?",
        ]

    all_questions = []

    for skill in skills:

        web_questions = fetch_questions_from_web(skill)

        all_questions.extend(web_questions)

    unique_questions = list(dict.fromkeys(all_questions))

    filtered_questions = remove_old_questions(unique_questions)

    # if everything removed, generate fallback questions
    if len(filtered_questions) == 0:

        for skill in skills:
            filtered_questions.append(f"Explain {skill} in detail.")
            filtered_questions.append(f"What are advanced concepts in {skill}?")

    final_questions = filtered_questions[:10]

    save_questions(final_questions)

    return final_questions
