const https = require("https");
const http = require("http");
const { JSDOM } = require("jsdom");

const REQUEST_HEADERS = {
  "User-Agent": "AI-Interview-Simulator/1.0",
};

/**
 * Fetch interview questions for a skill from GeeksForGeeks.
 * Returns up to 5 questions.
 * @param {string} skill
 * @returns {Promise<string[]>}
 */
async function fetchQuestionsFromWeb(skill) {
  const slug = skill.replace(/\s+/g, "-");
  const url = `https://www.geeksforgeeks.org/${slug}-interview-questions/`;

  return new Promise((resolve) => {
    const mod = url.startsWith("https") ? https : http;

    const req = mod.get(url, { headers: REQUEST_HEADERS, timeout: 10000 }, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const dom = new JSDOM(body);
          const items = dom.window.document.querySelectorAll("li");
          const questions = [];

          items.forEach((li) => {
            const text = (li.textContent || "").trim();
            if (text.includes("?")) {
              questions.push(text);
            }
          });

          resolve(questions.slice(0, 5));
        } catch {
          resolve([]);
        }
      });
    });

    req.on("error", () => resolve([]));
    req.on("timeout", () => {
      req.destroy();
      resolve([]);
    });
  });
}

module.exports = { fetchQuestionsFromWeb };
