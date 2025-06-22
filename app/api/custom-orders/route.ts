import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate order number
    const orderNumber = `CO-${Date.now().toString().slice(-6)}`;

    const order = await prisma.customOrder.create({
      data: {
        orderNumber,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        customerPhone: body.customerPhone,
        productType: body.productType,
        size: body.size,
        color: body.color,
        quantity: Number.parseInt(body.quantity) || 1,
        designNotes: body.designNotes,
        designFileUrl: Array.isArray(body.designFiles)
          ? body.designFiles
          : Array.isArray(body.designFileUrl)
          ? body.designFileUrl
          : [], // ✅ ensure it's always an array
        totalPrice: body.totalPrice ? Number.parseFloat(body.totalPrice) : null,
        status: "PENDING",
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating custom order:", error);
    return NextResponse.json(
      { error: "Failed to create custom order" },
      { status: 500 }
    );
  }
}


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const [orders, totalCount] = await Promise.all([
      prisma.customOrder.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customOrder.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      orders,
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
    console.error("Error in custom orders API:", error);
    return NextResponse.json(
      { error: "Failed to fetch custom orders" },
      { status: 500 }
    );
  }
}
