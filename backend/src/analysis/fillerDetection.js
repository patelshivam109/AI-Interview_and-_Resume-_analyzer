const FILLER_PATTERNS = [
  /\bum\b/gi,
  /\buh\b/gi,
  /\blike\b/gi,
  /\byou know\b/gi,
  /\bbasically\b/gi,
  /\bactually\b/gi,
];

/**
 * Count filler words in text.
 * @param {string} text
 * @returns {number}
 */
function countFillerWords(text) {
  if (!text) return 0;

  const lower = text.toLowerCase();
  let total = 0;
  for (const pattern of FILLER_PATTERNS) {
    const matches = lower.match(pattern);
    if (matches) total += matches.length;
  }
  return total;
}

/**
 * Calculate a score penalty based on filler count.
 * @param {number} fillerCount
 * @returns {number}
 */
function calculateFillerPenalty(fillerCount) {
  if (fillerCount <= 0) return 0.0;
  return Math.round(Math.min(fillerCount * 4.5, 20.0) * 100) / 100;
}

module.exports = { countFillerWords, calculateFillerPenalty };
