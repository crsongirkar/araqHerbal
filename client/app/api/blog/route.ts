import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "blog.json");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const posts = JSON.parse(data);

    const nextId = posts.reduce((max: number, p: any) => (p.id > max ? p.id : max), 0) + 1;
    const slug = body.slug || body.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const newPost = {
      id: nextId,
      title: body.title.trim(),
      slug,
      excerpt: body.excerpt || "",
      content: body.content || "",
      image: body.image || "",
      author: body.author || "Admin",
      category: body.category || "General",
      tags: body.tags || [],
      status: body.status || "draft",
      date: new Date().toISOString().split("T")[0],
    };

    posts.push(newPost);
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2), "utf-8");

    return NextResponse.json(newPost, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const data = await fs.readFile(filePath, "utf-8");
    const posts = JSON.parse(data);
    const idx = posts.findIndex((p: any) => p.id === parseInt(id));
    if (idx === -1) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    posts[idx] = { ...posts[idx], ...fields };
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2), "utf-8");

    return NextResponse.json(posts[idx]);
  } catch {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const data = await fs.readFile(filePath, "utf-8");
    const posts = JSON.parse(data);
    const filtered = posts.filter((p: any) => p.id !== parseInt(id));
    if (filtered.length === posts.length) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(filtered, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
