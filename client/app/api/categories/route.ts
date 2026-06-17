import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "categories.json");
const productsPath = path.join(process.cwd(), "data", "products.json");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const categories = JSON.parse(data);

    const productsData = await fs.readFile(productsPath, "utf-8");
    const products = JSON.parse(productsData);

    const withCounts = categories.map((c: any) => ({
      ...c,
      productCount: products.filter((p: any) => p.category === c.name).length,
    }));

    return NextResponse.json(withCounts);
  } catch {
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const categories = JSON.parse(data);

    const nextId = categories.reduce((max: number, c: any) => (c.id > max ? c.id : max), 0) + 1;
    const slug = body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const newCat = { id: nextId, name: body.name.trim(), slug, description: body.description || "" };
    categories.push(newCat);
    await fs.writeFile(filePath, JSON.stringify(categories, null, 2), "utf-8");

    return NextResponse.json(newCat, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const data = await fs.readFile(filePath, "utf-8");
    const categories = JSON.parse(data);
    const idx = categories.findIndex((c: any) => c.id === parseInt(id));
    if (idx === -1) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    categories[idx] = { ...categories[idx], ...fields };
    await fs.writeFile(filePath, JSON.stringify(categories, null, 2), "utf-8");

    return NextResponse.json(categories[idx]);
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const data = await fs.readFile(filePath, "utf-8");
    const categories = JSON.parse(data);
    const filtered = categories.filter((c: any) => c.id !== parseInt(id));
    if (filtered.length === categories.length) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(filtered, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
