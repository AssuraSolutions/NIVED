import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    // Filter parameters
    const clothingTypeIds = searchParams.getAll("clothingTypeIds");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sizes = searchParams.getAll("sizes");
    const colors = searchParams.getAll("colors");
    const sortBy = searchParams.get("sortBy") || "newest";

    console.log("API Filter params:", {
      page,
      limit,
      clothingTypeIds,
      search,
      minPrice,
      maxPrice,
      sizes,
      colors,
      sortBy,
    });

    // Build where clause
    const where: any = {
      isPublished: true,
    };

    if (featured === "true") {
      where.isFeatured = true;
    }

    // Clothing type filter
    if (clothingTypeIds.length > 0) {
      const numericIds = clothingTypeIds
        .map((id) => Number(id.trim()))
        .filter((id) => !isNaN(id));

      if (numericIds.length > 0) {
        where.clothingTypeId = { in: numericIds };
      }
    }

    // Search filter
    if (search && search.trim()) {
      where.OR = [
        {
          name: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search.trim(),
            mode: "insensitive",
          },
        },
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice);
      }
    }

    // Size filter
    if (sizes.length > 0) {
      where.availableSizes = {
        hasSome: sizes,
      };
    }

    // Color filter
    if (colors.length > 0) {
      where.colors = {
        hasSome: colors,
      };
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: "desc" }; // default

    switch (sortBy) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "name":
        orderBy = { name: "asc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where });

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy,
      include: {
        clothingType: true,
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        limit,
      },
    });
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
