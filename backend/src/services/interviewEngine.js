const fs = require("fs");
const path = require("path");
const { fetchQuestionsFromWeb } = require("./questionScraper");

const HISTORY_FILE = path.join(__dirname, "..", "..", "asked_questions.json");

// Ensure the history file exists
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, "[]", "utf-8");
}

function loadHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveHistory(questions) {
  const old = loadHistory();
  old.push(...questions);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(old), "utf-8");
}

function removeOldQuestions(questions) {
  const old = new Set(loadHistory());
  return questions.filter((q) => !old.has(q));
}

/**
 * Generate interview questions based on extracted skills.
 * Mirrors the Python interview_engine.generate_questions exactly.
 * @param {string[]} skills
 * @returns {Promise<string[]>}
 */
async function generateQuestions(skills) {
  if (!skills || skills.length === 0) {
    return [
      "Tell me about yourself and the kind of work you enjoy most.",
      "Describe a project you are proud of and why it mattered.",
      "What is one technical challenge you solved recently?",
      "How do you approach learning a new tool or framework quickly?",
      "What does strong collaboration look like to you on a team?",
    ];
  }

  const allQuestions = [];

  for (const skill of skills) {
    const webQuestions = await fetchQuestionsFromWeb(skill);
    allQuestions.push(...webQuestions);
  }

  // Deduplicate preserving order
  const unique = [...new Map(allQuestions.map((q) => [q, q])).values()];

  let filtered = removeOldQuestions(unique);

  // Fallback if everything was already asked
  if (filtered.length === 0) {
    for (const skill of skills) {
      filtered.push(`Explain ${skill} in detail.`);
      filtered.push(`What are advanced concepts in ${skill}?`);
    }
  }

  const final = filtered.slice(0, 10);
  saveHistory(final);

  return final;
}

module.exports = { generateQuestions };
