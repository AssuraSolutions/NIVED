import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;


    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get reviews with pagination
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    });

    // Get total count
    const totalCount = await prisma.review.count({
      where: { productId },
    });

    // Get average rating
    const avgRatingResult = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ["rating"],
      where: { productId },
      _count: { rating: true },
      orderBy: { rating: "desc" },
    });

    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        limit,
      },
      stats: {
        averageRating: avgRatingResult._avg.rating || 0,
        totalReviews: avgRatingResult._count.rating || 0,
        ratingDistribution: ratingDistribution.reduce((acc, curr) => {
          acc[curr.rating] = curr._count.rating;
          return acc;
        }, {} as Record<number, number>),
      },
    };

    console.log("Reviews response:", {
      reviewCount: reviews.length,
      totalCount,
      avgRating: avgRatingResult._avg.rating,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch reviews",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("POST /api/reviews - body:", body);

    // Validate required fields
    const requiredFields = [
      "productId",
      "rating",
      "customerName",
      "customerEmail",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Validate rating range
    const rating = Number.parseInt(body.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: body.productId },
    });

    if (!product) {
      console.error("Product not found:", body.productId);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId: body.productId,
        rating: rating,
        comment: body.comment || null,
        title: body.title || null,
        customerName: body.customerName.trim(),
        customerEmail: body.customerEmail.trim().toLowerCase(),
        isVerified: body.isVerified || false,
      },
    });

    console.log("Review created:", review.id);
    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      {
        error: "Failed to create review",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
