import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '')

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    console.log('Received request to /api/chat')
    
    if (!process.env.GOOGLE_AI_KEY) {
      console.error('GOOGLE_API_KEY is not set')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const { message, context } = await req.json()
    console.log('Processing message:', message)

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
    
    // Format the conversation history
    const formattedContext = context.map((msg: any) => 
      `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
    ).join('\n')

    // Create the prompt with context
    const prompt = `${formattedContext}\nHuman: ${message}\nAssistant:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ message: text })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process chat message' },
      { status: 500 }
    )
  }
} 