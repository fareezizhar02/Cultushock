import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { Product } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const productsCollection = await getCollection<Product>("products");
    const product = await productsCollection.findOne({ slug: params.slug });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      product: product,
    });
  } catch (error) {
    console.error("Product API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
      },
      { status: 500 },
    );
  }
}
