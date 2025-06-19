import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clothingType = searchParams.get("category"); // "category" is actually "clothingType" now
    const limit = searchParams.get("limit");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    // Build where clause
    const where: any = {
      isPublished: true,
    };

    if (featured === "true") {
      where.isFeatured = true;
    }

    // Filter by clothingType (category)
    if (clothingType && clothingType !== "all") {
      const type = await prisma.clothingTypes.findFirst({
        where: {
          name: {
            equals: clothingType,
            mode: "insensitive",
          },
        },
      });

      if (type) {
        where.clothingTypeId = type.id;
      } else {
        // If no match, return empty result
        return NextResponse.json([], { status: 200 });
      }
    }

    // Filter by search term
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      take: limit ? Number.parseInt(limit) : undefined,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        clothingType: true, // Optional: include clothing type info in the response
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error in products API:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const requiredFields = ["name", "description", "price", "clothingTypeId"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        longDescription: body.longDescription || body.description,
        price: Number.parseFloat(body.price),
        images: body.images || [],
        availableSizes: body.availableSizes || [],
        colors: body.colors || [],
        tags: body.tags || [],
        isLimited: body.isLimited ?? false,
        isPublished: body.isPublished ?? true,
        isFeatured: body.isFeatured ?? false,
        clothingTypeId: body.clothingTypeId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
