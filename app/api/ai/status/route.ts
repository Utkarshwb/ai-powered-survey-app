import { NextResponse } from "next/server"
import { isAIEnabled } from "@/lib/gemini"

export async function GET() {
  try {
    const status = {
      aiEnabled: isAIEnabled,
      hasApiKey: !!process.env.GEMINI_API_KEY,
      apiKeyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0,
      apiKeyPreview: process.env.GEMINI_API_KEY ? 
        process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'Not set'
    }
    
    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check AI status' }, { status: 500 })
  }
}
