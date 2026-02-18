import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { cities, keywords, mode } = await req.json();

    if (!cities?.length || !keywords?.length) {
      return NextResponse.json({ error: "Cities and keywords are required" }, { status: 400 });
    }

    if (cities.length > 300 || keywords.length > 50) {
      return NextResponse.json({ error: "Too many cities or keywords" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Scraping session initialized",
      combinations: cities.length * keywords.length,
      mode,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
