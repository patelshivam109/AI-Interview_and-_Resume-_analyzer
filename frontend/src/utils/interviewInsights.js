export const TAG_LABELS = {
  clean_delivery: "Clean delivery",
  confidence_low: "Low confidence",
  confidence_strong: "Confident delivery",
  technical_depth_low: "Needs more technical depth",
  technical_depth_strong: "Strong technical depth",
  too_many_fillers: "Too many fillers",
};

function average(values) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function humanizeTag(tag) {
  return TAG_LABELS[tag] ?? tag.replaceAll("_", " ");
}

export function buildInterviewInsights(state) {
  const feedbackItems = state.feedback.filter(Boolean);
  const scores = state.scores.filter((score) => typeof score === "number");
  const semanticScores = feedbackItems.map((item) => item.breakdown.semantic_score);
  const confidenceScores = feedbackItems.map((item) => item.breakdown.confidence_score);
  const fillerCounts = feedbackItems.map((item) => item.breakdown.filler_count);
  const tagCounts = {};

  feedbackItems.forEach((item) => {
    item.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    });
  });

  const topTags = Object.entries(tagCounts)
    .sort((left, right) => right[1] - left[1])
    .map(([tag, count]) => ({
      tag,
      label: humanizeTag(tag),
      count,
    }));

  const averageScore = Math.round(average(scores));
  const averageSemantic = Math.round(average(semanticScores));
  const averageConfidence = Math.round(average(confidenceScores));
  const averageFillers = Number(average(fillerCounts).toFixed(1));

  const strengths = [];
  const weaknesses = [];

  if (averageSemantic >= 72) {
    strengths.push("Your answers stayed well aligned with the interview prompts.");
  } else {
    weaknesses.push("Technical explanations need more specifics or clearer examples.");
  }

  if (averageConfidence >= 65) {
    strengths.push("Your tone came across as composed and confident.");
  } else {
    weaknesses.push("A more direct opening would make answers sound more confident.");
  }

  if (averageFillers <= 2) {
    strengths.push("You kept filler words under control, which improves polish.");
  } else {
    weaknesses.push("Reducing filler words would noticeably improve delivery quality.");
  }

  const suggestions = Array.from(
    new Set(feedbackItems.flatMap((item) => item.suggestions || [])),
  );

  if (!suggestions.length) {
    suggestions.push("Keep leading with your core answer, then support it with one concrete detail.");
  }

  return {
    averageConfidence,
    averageFillers,
    averageScore,
    averageSemantic,
    strengths,
    suggestions,
    topTags,
    weaknesses,
  };
}
