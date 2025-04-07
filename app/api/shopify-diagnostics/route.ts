import { NextResponse } from "next/server"
import { diagnoseShopifyConnection, testCartCreation } from "@/lib/shopify-diagnostics"

export async function GET() {
  try {
    const connectionDiagnostics = await diagnoseShopifyConnection()
    const cartTest = await testCartCreation()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      connectionDiagnostics,
      cartTest,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to run diagnostics",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

