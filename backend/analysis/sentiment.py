from functools import lru_cache

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


@lru_cache(maxsize=1)
def get_analyzer():
    return SentimentIntensityAnalyzer()


def analyze_sentiment(text):
    analyzer = get_analyzer()
    score = analyzer.polarity_scores(text or "")
    compound_score = float(score["compound"])

    if compound_score >= 0.2:
        label = "Positive"
    elif compound_score <= -0.2:
        label = "Negative"
    else:
        label = "Neutral"

    confidence_score = round((compound_score + 1) * 50, 2)

    return {
        "label": label,
        "compound": compound_score,
        "confidence_score": confidence_score,
    }
