import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    
    if (authError) {
      return NextResponse.json({ 
        authenticated: false, 
        error: authError.message 
      })
    }
    
    if (!user) {
      return NextResponse.json({ 
        authenticated: false, 
        error: "No user found" 
      })
    }
    
    return NextResponse.json({ 
      authenticated: true, 
      user: {
        id: user.id,
        email: user.email
      }
    })
    
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ 
      authenticated: false, 
      error: "Server error" 
    }, { status: 500 })
  }
}
