import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { Product } from "@/lib/types";

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const slug = searchParams.get("slug");

    const productsCollection = await getCollection<Product>("products");

    // Build query
    let query: any = {};
    if (collection) query.collection = collection;
    if (category) query.category = category;
    if (featured === "true") query.featured = true;
    if (slug) query.slug = slug;

    const products = await productsCollection.find(query).toArray();

    return NextResponse.json({
      success: true,
      data: products,
      products: products,
      count: products.length,
    });
  } catch (error: any) {
    console.error("Products API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || String(error),
        name: error?.name,
      },
      { status: 500 },
    );
  }
}
