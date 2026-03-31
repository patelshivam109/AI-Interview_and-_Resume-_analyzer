import re

FILLER_PATTERNS = (
    r"\bum\b",
    r"\buh\b",
    r"\blike\b",
    r"\byou know\b",
    r"\bbasically\b",
    r"\bactually\b",
)


def count_filler_words(text):
    if not text:
        return 0

    normalized_text = text.lower()
    return sum(len(re.findall(pattern, normalized_text)) for pattern in FILLER_PATTERNS)


def calculate_filler_penalty(filler_count):
    if filler_count <= 0:
        return 0.0

    # Penalize repeated fillers without letting the deduction dominate the score.
    return round(min(filler_count * 4.5, 20.0), 2)
