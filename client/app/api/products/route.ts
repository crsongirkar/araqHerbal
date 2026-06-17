import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "products.json");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const products = JSON.parse(data);
    // Ensure stock field defaults
    const withStock = products.map((p: any) => ({
      stock: 100,
      rating: 4.5,
      reviewCount: 20,
      ...p,
    }));
    return NextResponse.json(withStock);
  } catch {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await fs.readFile(filePath, "utf-8");
    const products = JSON.parse(data);

    const nextId = products.reduce((max: number, p: any) => (p.id > max ? p.id : max), 0) + 1;

    const newProduct = {
      id: nextId,
      name: body.name,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : undefined,
      category: body.category || "Body Care",
      image: body.image,
      description: body.description || "",
      stock: body.stock !== undefined ? parseInt(body.stock) : 100,
      rating: body.rating ? parseFloat(body.rating) : 4.5,
      reviewCount: body.reviewCount ? parseInt(body.reviewCount) : Math.floor(Math.random() * 80) + 20,
    };

    products.push(newProduct);
    await fs.writeFile(filePath, JSON.stringify(products, null, 2), "utf-8");

    return NextResponse.json(newProduct, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updatedFields } = body;
    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    const data = await fs.readFile(filePath, "utf-8");
    const products = JSON.parse(data);

    const index = products.findIndex((p: any) => p.id === parseInt(id));
    if (index === -1) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    products[index] = {
      ...products[index],
      ...updatedFields,
      price: updatedFields.price !== undefined ? parseFloat(updatedFields.price) : products[index].price,
      originalPrice: updatedFields.originalPrice !== undefined
        ? (updatedFields.originalPrice ? parseFloat(updatedFields.originalPrice) : undefined)
        : products[index].originalPrice,
      stock: updatedFields.stock !== undefined ? parseInt(updatedFields.stock) : products[index].stock,
    };

    await fs.writeFile(filePath, JSON.stringify(products, null, 2), "utf-8");

    return NextResponse.json(products[index]);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    const data = await fs.readFile(filePath, "utf-8");
    const products = JSON.parse(data);
    const filtered = products.filter((p: any) => p.id !== parseInt(id));

    if (products.length === filtered.length) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(filtered, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
