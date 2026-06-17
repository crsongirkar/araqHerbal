import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "settings.json");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data = await fs.readFile(filePath, "utf-8");
    const current = JSON.parse(data);
    const updated = { ...current, ...body };
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf-8");
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
