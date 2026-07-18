const natural = require("natural");

const TfIdf = natural.TfIdf;

/**
 * Calculate semantic similarity between two texts.
 *
 * Uses TF-IDF cosine similarity as a lightweight alternative
 * to the Python sentence-transformers model.
 *
 * @param {string} answer
 * @param {string} reference
 * @returns {number} – score from 0 to 100
 */
function calculateSimilarity(answer, reference) {
  if (!answer || !reference) return 0.0;

  const tfidf = new TfIdf();
  tfidf.addDocument(answer.toLowerCase());
  tfidf.addDocument(reference.toLowerCase());

  // Build term vectors
  const terms = new Set();
  tfidf.listTerms(0).forEach((t) => terms.add(t.term));
  tfidf.listTerms(1).forEach((t) => terms.add(t.term));

  const termArr = [...terms];

  const vecA = termArr.map((term) => {
    let val = 0;
    tfidf.tfidfs(term, (i, measure) => {
      if (i === 0) val = measure;
    });
    return val;
  });

  const vecB = termArr.map((term) => {
    let val = 0;
    tfidf.tfidfs(term, (i, measure) => {
      if (i === 1) val = measure;
    });
    return val;
  });

  // Cosine similarity
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < termArr.length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) return 0.0;

  const similarity = dot / (magA * magB);
  const bounded = Math.max(0.0, Math.min(similarity, 1.0));

  return Math.round(bounded * 100 * 100) / 100;
}

module.exports = { calculateSimilarity };
