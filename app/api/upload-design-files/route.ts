import { type NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Customer name and phone are required" },
        { status: 400 }
      );
    }

    // Create the customOrders directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "customOrders");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, that's fine
    }

    const uploadedFiles: string[] = [];

    // Clean customer name and phone for filename (remove special characters)
    const cleanCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, "");
    const cleanCustomerPhone = customerPhone.replace(/[^0-9]/g, "");

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file.type.startsWith("image/")) {
        continue; // Skip non-image files
      }

      // Get file extension
      const fileExtension = path.extname(file.name) || ".jpg";

      // Create filename: customerName-phoneNumber-index.extension
      const fileName = `${cleanCustomerName}-${cleanCustomerPhone}-${
        i + 1
      }${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filePath, buffer);

      // Store the public URL path
      uploadedFiles.push(`/customOrders/${fileName}`);
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length} files uploaded successfully`,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Failed to upload files" },
      { status: 500 }
    );
  }
}
