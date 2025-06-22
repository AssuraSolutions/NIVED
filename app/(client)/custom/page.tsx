"use client";

import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, Check, Loader2 } from "lucide-react";
import { sendToWhatsApp } from "@/lib/whatsapp";
import { createCustomOrder } from "@/lib/custom-orders";

type DesignFile = {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
};

const PRODUCT_TYPES = ["T-Shirt", "Hoodie", "Sweatshirt", "Cap", "Tote Bag"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const COLORS = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Navy Blue", value: "#000080" },
  { name: "Red", value: "#FF0000" },
  { name: "Green", value: "#008000" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Gray", value: "#808080" },
];

interface FormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productType: string;
  size: string;
  color: string;
  quantity: number;
  designNotes: string;
}

export default function CustomPrintPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [designFiles, setDesignFiles] = useState<DesignFile[]>([]);

  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    productType: "",
    size: "",
    color: "",
    quantity: 1,
    designNotes: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 1;
    setFormData((prev) => ({ ...prev, quantity: Math.max(1, value) }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      const invalidFiles = newFiles.filter(
        (file) => !file.type.startsWith("image/")
      );
      if (invalidFiles.length > 0) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files (JPEG, PNG, etc.)",
          variant: "destructive",
        });
        return;
      }

      // Check file sizes (max 10MB each)
      const oversizedFiles = newFiles.filter(
        (file) => file.size > 10 * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 10MB each",
          variant: "destructive",
        });
        return;
      }

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newDesignFile: DesignFile = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: event.target?.result as string,
            name: file.name,
            size: file.size,
          };
          setDesignFiles((prev) => [...prev, newDesignFile]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (id: string) => {
    setDesignFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const validateForm = (): boolean => {
    if (!formData.customerName.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.customerEmail.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.customerPhone.trim()) {
      toast({
        title: "Error",
        description: "Phone number is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.productType) {
      toast({
        title: "Error",
        description: "Please select a product type",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.size) {
      toast({
        title: "Error",
        description: "Please select a size",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.color) {
      toast({
        title: "Error",
        description: "Please select a color",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.designNotes.trim()) {
      toast({
        title: "Error",
        description: "Please provide design notes",
        variant: "destructive",
      });
      return false;
    }
    if (designFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one design file",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const uploadDesignFiles = async (): Promise<string[]> => {
    if (designFiles.length === 0) return [];

    setIsUploadingFiles(true);

    try {
      const uploadFormData = new FormData();

      // Add customer info for filename generation
      uploadFormData.append("customerName", formData.customerName);
      uploadFormData.append("customerPhone", formData.customerPhone);

      // Add all files
      designFiles.forEach((designFile) => {
        uploadFormData.append("files", designFile.file);
      });

      const response = await fetch("/api/upload-design-files", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload files");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to upload files");
      }

      toast({
        title: "Files uploaded successfully",
        description: `${result.files.length} design files uploaded`,
      });

      return result.files;
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload design files. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // First, upload the design files
      const uploadedFileUrls = await uploadDesignFiles();

      const orderData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        productType: formData.productType,
        size: formData.size,
        color: formData.color,
        quantity: formData.quantity,
        designNotes: formData.designNotes,
        designFiles: uploadedFileUrls,
        totalPrice: formData.quantity * 25,
      };

      const order = await createCustomOrder(orderData);

      const message = `🎨 New Custom Print Order!
      
Order #: ${order.id}
Customer: ${formData.customerName}
Email: ${formData.customerEmail}
Phone: ${formData.customerPhone}

Product Details:
• Type: ${formData.productType}
• Size: ${formData.size}
• Color: ${formData.color}
• Quantity: ${formData.quantity}

Design Notes:
${formData.designNotes}

Design Files: ${uploadedFileUrls.length} file(s) uploaded
${uploadedFileUrls.map((url, index) => `File ${index + 1}: ${url}`).join("\n")}


We'll review your order and contact you within 24 hours with a quote and timeline.`;

      await sendToWhatsApp(message);

      toast({
        title: "Order submitted successfully!",
        description: `Your order #${order.id} has been received. We'll contact you soon!`,
      });

      // Reset form
      setFormData({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        productType: "",
        size: "",
        color: "",
        quantity: 1,
        designNotes: "",
      });
      setDesignFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-playfair text-gray-900 mb-4">
              Custom Print Service
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bring your designs to life! Upload your artwork and we'll create
              custom printed apparel just for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-4 border-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair">
                  Customer Information
                </CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email Address *</Label>
                    <Input
                      id="customerEmail"
                      name="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    name="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-4 border-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair">
                  Product Details
                </CardTitle>
                <CardDescription>
                  Choose your product specifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Product Type *</Label>
                    <Select
                      value={formData.productType}
                      onValueChange={(value) =>
                        handleSelectChange("productType", value)
                      }
                    >
                      <SelectTrigger className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Size *</Label>
                    <Select
                      value={formData.size}
                      onValueChange={(value) =>
                        handleSelectChange("size", value)
                      }
                    >
                      <SelectTrigger className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px]">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Color *</Label>
                  <RadioGroup
                    value={formData.color}
                    onValueChange={(value) =>
                      handleSelectChange("color", value)
                    }
                    className="flex flex-wrap gap-4 mt-2"
                  >
                    {COLORS.map((color) => (
                      <div
                        key={color.name}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={color.name}
                          id={color.name}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={color.name}
                          className={`flex items-center gap-2 px-4 py-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-2 cursor-pointer transition-all ${
                            formData.color === color.name
                              ? "border-[#c9a55c] bg-[#c9a55c]/10"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div
                            className="w-6 h-6 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: color.value }}
                          />
                          <span className="text-sm font-medium">
                            {color.name}
                          </span>
                          {formData.color === color.name && (
                            <Check className="w-4 h-4 text-[#c9a55c]" />
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] max-w-32"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-4 border-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-playfair">
                  Design Upload
                </CardTitle>
                <CardDescription>
                  Upload your design files and provide instructions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Design Files *</Label>
                  <div className="mt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-gray-300 hover:border-[#c9a55c] transition-colors"
                      disabled={isUploadingFiles}
                    >
                      <div className="text-center">
                        {isUploadingFiles ? (
                          <>
                            <Loader2 className="mx-auto h-8 w-8 text-gray-400 mb-2 animate-spin" />
                            <p className="text-sm text-gray-600">
                              Uploading files...
                            </p>
                          </>
                        ) : (
                          <>
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                              Click to upload design files or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF up to 10MB each
                            </p>
                          </>
                        )}
                      </div>
                    </Button>
                  </div>

                  {designFiles.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">
                        Uploaded Files ({designFiles.length})
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        {designFiles.map((file) => (
                          <div key={file.id} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                              <Image
                                src={file.preview || "/placeholder.svg"}
                                alt={`Design ${file.name}`}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeFile(file.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <div className="mt-1">
                              <p
                                className="text-xs text-gray-600 truncate"
                                title={file.name}
                              >
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="designNotes">
                    Design Notes & Instructions *
                  </Label>
                  <Textarea
                    id="designNotes"
                    name="designNotes"
                    value={formData.designNotes}
                    onChange={handleInputChange}
                    className="rounded-[255px_15px_225px_15px/15px_225px_15px_255px] min-h-[120px]"
                    placeholder="Please provide detailed instructions for your design. Include placement, size, colors, and any special requirements..."
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                type="submit"
                disabled={isSubmitting || isUploadingFiles}
                className="bg-[#c9a55c] hover:bg-[#b8944a] text-white px-12 py-3 text-lg font-semibold rounded-[255px_15px_225px_15px/15px_225px_15px_255px] border-4 border-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting Order...
                  </>
                ) : isUploadingFiles ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Uploading Files...
                  </>
                ) : (
                  "Submit Custom Order"
                )}
              </Button>
              <p className="text-sm text-gray-600 mt-4">
                We'll review your order and contact you within 24 hours with a
                quote and timeline.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
