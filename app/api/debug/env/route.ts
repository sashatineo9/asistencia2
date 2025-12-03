import { NextResponse } from 'next/server'

export async function GET() {
  // Solo mostrar información básica, no valores completos por seguridad
  const envInfo: Record<string, string> = {
    NODE_ENV: process.env.NODE_ENV || '',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
    GOOGLE_SHEETS_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '',
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY || '',
  }

  return NextResponse.json(envInfo)
}

