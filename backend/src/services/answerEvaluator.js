const { analyzeSentiment } = require("../analysis/sentiment");
const { countFillerWords, calculateFillerPenalty } = require("../analysis/fillerDetection");
const { calculateSimilarity } = require("../analysis/semanticScore");

const SEMANTIC_WEIGHT = 0.72;
const CONFIDENCE_WEIGHT = 0.28;

// ── Feedback ──────────────────────────────────────────
function buildFeedback(score, semanticScore, confidenceScore, fillerCount) {
  let tone;
  if (score >= 80) {
    tone = "Excellent answer overall.";
  } else if (score >= 65) {
    tone = "Solid answer with a good foundation.";
  } else if (score >= 50) {
    tone = "Promising answer, but it needs sharper delivery.";
  } else {
    tone = "The answer needs more clarity and structure.";
  }

  const details = [];

  if (semanticScore >= 75) {
    details.push("Your response stayed technically aligned with the question.");
  } else if (semanticScore < 55) {
    details.push("It would benefit from more concrete technical depth.");
  }

  if (confidenceScore >= 70) {
    details.push("The tone reads as confident.");
  } else if (confidenceScore < 55) {
    details.push("The tone feels hesitant in places.");
  }

  if (fillerCount >= 4) {
    details.push("Too many filler words are weakening the delivery.");
  } else if (fillerCount === 0) {
    details.push("Your delivery sounds clean and composed.");
  }

  return [tone, ...details].join(" ").trim();
}

// ── Suggestions ───────────────────────────────────────
function buildSuggestions(semanticScore, confidenceScore, fillerCount) {
  const suggestions = [];

  if (semanticScore < 60) {
    suggestions.push(
      "Add one concrete example or implementation detail to make the answer feel more technical."
    );
  }

  if (confidenceScore < 60) {
    suggestions.push(
      "Lead with a direct statement before expanding so the answer sounds more confident."
    );
  }

  if (fillerCount >= 3) {
    suggestions.push(
      "Pause briefly instead of filling silence with words like 'um' or 'like'."
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Keep this structure: direct answer first, then support it with specifics."
    );
  }

  return suggestions;
}

// ── Tags ──────────────────────────────────────────────
function buildTags(semanticScore, confidenceScore, fillerCount) {
  const tags = [];

  if (semanticScore >= 75) tags.push("technical_depth_strong");
  else if (semanticScore < 55) tags.push("technical_depth_low");

  if (confidenceScore >= 70) tags.push("confidence_strong");
  else if (confidenceScore < 55) tags.push("confidence_low");

  if (fillerCount >= 4) tags.push("too_many_fillers");
  else if (fillerCount === 0) tags.push("clean_delivery");

  return tags;
}

// ── Main evaluator ────────────────────────────────────
function evaluateAnswer(question, answer) {
  const referenceAnswer = (question || "").trim();
  const candidateAnswer = (answer || "").trim();

  const semanticScore = calculateSimilarity(candidateAnswer, referenceAnswer);
  const sentimentResult = analyzeSentiment(candidateAnswer);
  const confidenceScore = sentimentResult.confidence_score;
  const fillerCount = countFillerWords(candidateAnswer);
  const fillerPenalty = calculateFillerPenalty(fillerCount);

  const weighted =
    semanticScore * SEMANTIC_WEIGHT + confidenceScore * CONFIDENCE_WEIGHT;
  const finalScore =
    Math.round(Math.max(0.0, Math.min(weighted - fillerPenalty, 100.0)) * 100) / 100;

  const feedback = buildFeedback(finalScore, semanticScore, confidenceScore, fillerCount);
  const suggestions = buildSuggestions(semanticScore, confidenceScore, fillerCount);
  const tags = buildTags(semanticScore, confidenceScore, fillerCount);

  return {
    score: finalScore,
    feedback,
    suggestions,
    tags,
    breakdown: {
      semantic_score: semanticScore,
      confidence_score: confidenceScore,
      sentiment_label: sentimentResult.label,
      filler_count: fillerCount,
      filler_penalty: fillerPenalty,
    },
  };
}

module.exports = { evaluateAnswer };
