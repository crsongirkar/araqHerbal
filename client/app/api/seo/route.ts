import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "seo.json");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const seo = JSON.parse(data);
    return NextResponse.json(seo);
  } catch (error) {
    console.error("Failed to read SEO settings:", error);
    return NextResponse.json({ error: "Failed to load SEO settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const seo = {
      title: body.title,
      description: body.description,
      keywords: body.keywords || ""
    };

    await fs.writeFile(filePath, JSON.stringify(seo, null, 2), "utf-8");
    return NextResponse.json(seo);
  } catch (error) {
    console.error("Failed to update SEO settings:", error);
    return NextResponse.json({ error: "Failed to save SEO settings" }, { status: 500 });
  }
}
