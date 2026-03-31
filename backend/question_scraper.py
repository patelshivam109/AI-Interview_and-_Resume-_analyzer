import requests
from bs4 import BeautifulSoup

REQUEST_HEADERS = {
    "User-Agent": "AI-Interview-Simulator/1.0",
}


def fetch_questions_from_web(skill):

    url = f"https://www.geeksforgeeks.org/{skill.replace(' ', '-')}-interview-questions/"

    questions = []

    try:
        response = requests.get(url, headers=REQUEST_HEADERS, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        for li in soup.find_all("li"):
            text = li.get_text(" ", strip=True)

            if "?" in text:
                questions.append(text.strip())

    except requests.RequestException:
        return []

    return questions[:5]
