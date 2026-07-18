const pdfParse = require("pdf-parse");

const SKILLS_DB = [
  "python",
  "java",
  "c++",
  "machine learning",
  "deep learning",
  "sql",
  "javascript",
  "react",
  "node",
  "tensorflow",
  "pytorch",
  "nlp",
  "data science",
  "flask",
  "fastapi",
];

/**
 * Extract raw text from a PDF buffer.
 * @param {Buffer} buffer – the uploaded file buffer
 * @returns {Promise<string>}
 */
async function extractTextFromPdf(buffer) {
  const data = await pdfParse(buffer);
  return (data.text || "").toLowerCase();
}

/**
 * Match known skills inside the extracted text.
 * @param {string} text
 * @returns {string[]}
 */
function extractSkills(text) {
  if (!text) return [];

  const found = new Set();
  for (const skill of SKILLS_DB) {
    if (text.includes(skill)) {
      found.add(skill);
    }
  }
  return [...found];
}

module.exports = { extractTextFromPdf, extractSkills };
