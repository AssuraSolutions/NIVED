import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust the path to your prisma client

export async function GET() {
  try {
    const clothingTypes = await prisma.clothingTypes.findMany();
    return NextResponse.json(clothingTypes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch clothing types" },
      { status: 500 }
    );
  }
}
