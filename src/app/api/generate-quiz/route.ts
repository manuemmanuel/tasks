import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import pdfParse from "pdf-parse"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const topic = formData.get("topic") as string
    const description = formData.get("description") as string
    const pdfFile = formData.get("pdf") as File

    let content = ""

    // If PDF is provided, extract text from it
    if (pdfFile) {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const data = await pdfParse(Buffer.from(arrayBuffer))
      content = data.text
    }

    // If topic is provided, add it to the content
    if (topic) {
      content = `Topic: ${topic}\n${content}`
    }

    // If description is provided, add it to the content
    if (description) {
      content = `${content}\nAdditional Context: ${description}`
    }

    // Generate quiz using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    const prompt = `Generate a comprehensive quiz based on the following content. 
    Create 10 multiple-choice questions with 4 options each. 
    Format the response as a JSON object with the following structure:
    {
      "title": "Quiz title",
      "description": "Brief description",
      "questions": [
        {
          "question": "Question text",
          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
          "correctAnswer": 0
        }
      ]
    }
    
    Content: ${content}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const quizData = JSON.parse(response.text())

    // Save quiz to database (you'll need to implement this part)
    // For now, we'll just return the generated quiz
    return NextResponse.json(quizData)
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    )
  }
} 