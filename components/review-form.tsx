"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star } from "lucide-react";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({
  productId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    title: "",
    comment: "",
    customerName: "",
    customerEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast({
        title: "Please select a rating",
        description:
          "You need to select a star rating before submitting your review.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.customerName.trim() || !formData.customerEmail.trim()) {
      toast({
        title: "Please fill in required fields",
        description: "Name and email are required to submit a review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          productId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      toast({
        title: "Review submitted successfully!",
        description:
          "Thank you for your feedback. Your review will help other customers.",
      });

      // Reset form
      setFormData({
        rating: 0,
        title: "",
        comment: "",
        customerName: "",
        customerEmail: "",
      });

      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error submitting review",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-50 p-6 rounded-lg"
    >
      <h3 className="text-lg font-bold">Write a Review</h3>

      <div>
        <Label className="text-sm font-medium mb-2 block">Your Rating *</Label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setFormData({ ...formData, rating: star })}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= formData.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {formData.rating > 0
              ? `${formData.rating} star${formData.rating > 1 ? "s" : ""}`
              : "Select rating"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Your Name *</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <Label htmlFor="customerEmail">Your Email *</Label>
          <Input
            id="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) =>
              setFormData({ ...formData, customerEmail: e.target.value })
            }
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="title">Review Title (Optional)</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Summarize your review in a few words"
        />
      </div>

      <div>
        <Label htmlFor="comment">Your Review (Optional)</Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
          placeholder="Tell others about your experience with this product..."
          rows={4}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#c9a55c] hover:bg-[#b08d4a] text-white"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Review...
          </>
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
}
