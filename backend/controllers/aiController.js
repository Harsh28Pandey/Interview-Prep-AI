const { GoogleGenAI } = require("@google/genai")
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts.js")

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// @desc  generate interview questions and answers using gemini
// @route  POST /api/ai/generate-questions
// @access  private
const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body

        if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({
                message: "Missing Required Fields"
            })
        }

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions)

        const response = await ai.models.generateContent({
            model: "models/gemini-flash-latest",
            contents: prompt,
        })

        let rawText = response.text

        // clean it: remove ```json and ``` from beginning and end
        const cleanedText = rawText
            .replace(/^```json\s*/, "")  // remove starting ```json
            .replace(/```$/, "")  // remove ending ```
            .trim()  // remove extra spaces

        // now safe to parse
        const data = JSON.parse(cleanedText)

        res.status(200).json(data)

    } catch (error) {
        res.status(500).json({
            message: "Failed to Generate Questions",
            error: error.message
        })
    }
}

// @desc  generate explains a interview question
// @route  POST /api/ai/generate-explanation
// @access  private
const generateConceptExplanation = async (req, res) => {
    try {
        const { question } = req.body

        if (!question) {
            return res.status(400).json({
                message: "Missing Required Fields"
            })
        }

        const prompt = conceptExplainPrompt(question)

        const response = await ai.models.generateContent({
            model: "models/gemini-flash-latest",
            contents: prompt
        })

        let rawText = response.text

        // clean it: remove ```json and ``` from beginning and end
        const cleanedText = rawText
            .replace(/^```json\s*/, "")  // remove starting ```json
            .replace(/```$/, "")  // remove ending ```
            .trim()  // remove extra spaces

        // now safe to parse
        const data = JSON.parse(cleanedText)

        res.status(200).json(data)

    } catch (error) {
        res.status(500).json({
            message: "Failed to Generate Questions",
            error: error.message
        })
    }
}

module.exports = { generateInterviewQuestions, generateConceptExplanation }