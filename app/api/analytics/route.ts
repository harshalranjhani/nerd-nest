import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    // Here you would typically send this data to your analytics service
    // For example: await sendToAnalyticsService(data)
    console.log("Analytics data:", data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json(
      { error: "Failed to process analytics" },
      { status: 500 }
    )
  }
} 