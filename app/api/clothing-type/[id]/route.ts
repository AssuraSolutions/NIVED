import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid id parameter" },
      { status: 400 }
    );
  }

  try {
    const clothingType = await prisma.clothingTypes.findUnique({
      where: { id },
    });

    if (!clothingType) {
      return NextResponse.json(
        { error: "Clothing type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(clothingType);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch clothing type" },
      { status: 500 }
    );
  }
}
