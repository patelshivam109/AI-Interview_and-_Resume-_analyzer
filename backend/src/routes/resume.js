const express = require("express");
const multer = require("multer");
const { extractTextFromPdf, extractSkills } = require("../services/resumeParser");
const { generateQuestions } = require("../services/interviewEngine");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload_resume
router.post("/upload_resume", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const text = await extractTextFromPdf(req.file.buffer);
    const skills = extractSkills(text);
    const questions = await generateQuestions(skills);

    return res.json({
      extracted_skills: skills,
      interview_questions: questions,
    });
  } catch (err) {
    console.error("upload_resume error:", err);
    return res.status(500).json({ error: "Failed to process resume" });
  }
});

module.exports = router;
