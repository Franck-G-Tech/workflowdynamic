import { NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar que el webhook sea de Sanity
    if (body._type) {
      // Trigger sync en Convex
      await convex.mutation(api.sync.triggerSync)({})
      
      return NextResponse.json(
        { success: true, message: "Sync triggered" },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { error: "Invalid webhook payload" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}