import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { leads } from '@/lib/db/schema'
import { z } from 'zod'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = registerSchema.parse(body)

    // Create Supabase auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        }
      }
    })

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    // Create lead record for tracking
    if (data.user) {
      await db.insert(leads).values({
        name,
        email,
        status: 'registered',
        source: 'student_portal',
      })
    }

    return NextResponse.json({
      success: true,
      user: data.user,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 400 }
    )
  }
}