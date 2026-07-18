const express = require("express");
const { evaluateAnswer } = require("../services/answerEvaluator");

const router = express.Router();

// POST /evaluate_answer
router.post("/evaluate_answer", (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: "question and answer are required" });
    }

    const result = evaluateAnswer(question, answer);
    return res.json(result);
  } catch (err) {
    console.error("evaluate_answer error:", err);
    return res.status(500).json({ error: "Failed to evaluate answer" });
  }
});

module.exports = router;
