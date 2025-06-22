"use client";

import { useState, useEffect } from "react";
import { Rating } from "@/components/ui/rating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  title: string | null;
  customerName: string;
  customerEmail: string;
  isVerified: boolean;
  createdAt: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

interface ReviewsListProps {
  productId: string;
  refreshTrigger?: number;
}

export default function ReviewsList({
  productId,
  refreshTrigger = 0,
}: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {},
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/reviews?productId=${productId}&page=${page}&limit=5`
      );
      if (!response.ok) throw new Error("Failed to fetch reviews");

      const data = await response.json();
      setReviews(data.reviews);
      setStats(data.stats);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [productId, refreshTrigger]);

  const handlePageChange = (page: number) => {
    fetchReviews(page);
  };

  const getRatingPercentage = (rating: number) => {
    if (stats.totalReviews === 0) return 0;
    return ((stats.ratingDistribution[rating] || 0) / stats.totalReviews) * 100;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="mt-1">
            <Rating value={Math.round(stats.averageRating)} />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Based on {stats.totalReviews} reviews
          </p>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="w-8">{rating}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getRatingPercentage(rating)}%` }}
                />
              </div>
              <span className="w-8 text-gray-600">
                {stats.ratingDistribution[rating] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.customerName}</span>
                      {review.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Rating value={review.rating} />
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {review.title && (
                <h4 className="font-medium mb-2">{review.title}</h4>
              )}

              {review.comment && (
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={
                    currentPage === page ? "bg-[#c9a55c] text-white" : ""
                  }
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
