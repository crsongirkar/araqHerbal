import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "homepage.json");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const slides = JSON.parse(data);
    return NextResponse.json(slides);
  } catch (error) {
    console.error("Failed to read homepage slides:", error);
    return NextResponse.json({ error: "Failed to load homepage slides" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const slides = await request.json();
    if (!Array.isArray(slides)) {
      return NextResponse.json({ error: "Slides must be a valid array" }, { status: 400 });
    }

    await fs.writeFile(filePath, JSON.stringify(slides, null, 2), "utf-8");
    return NextResponse.json(slides);
  } catch (error) {
    console.error("Failed to update homepage slides:", error);
    return NextResponse.json({ error: "Failed to save homepage slides" }, { status: 500 });
  }
}
