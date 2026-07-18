const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const SentimentAnalyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;

const analyzer = new SentimentAnalyzer("English", stemmer, "afinn");

/**
 * Analyze sentiment of a text.
 * Returns a label, compound score, and confidence_score
 * designed to match the Python VADER-based output shape.
 *
 * @param {string} text
 * @returns {{ label: string, compound: number, confidence_score: number }}
 */
function analyzeSentiment(text) {
  const tokens = tokenizer.tokenize((text || "").toLowerCase());
  if (!tokens || tokens.length === 0) {
    return { label: "Neutral", compound: 0, confidence_score: 50.0 };
  }

  // natural returns a value roughly in [-1, 1]
  const rawScore = analyzer.getSentiment(tokens);

  // Clamp to [-1, 1]
  const compound = Math.max(-1, Math.min(parseFloat(rawScore.toFixed(4)), 1));

  let label;
  if (compound >= 0.2) {
    label = "Positive";
  } else if (compound <= -0.2) {
    label = "Negative";
  } else {
    label = "Neutral";
  }

  const confidenceScore = Math.round((compound + 1) * 50 * 100) / 100;

  return { label, compound, confidence_score: confidenceScore };
}

module.exports = { analyzeSentiment };
