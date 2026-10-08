import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  Pencil,
  Trash2,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [adding, setAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewDeleting, setReviewDeleting] = useState(false);

  const [message, setMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [editingReviewId, setEditingReviewId] = useState(null);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(`/products/${id}`);

      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      setMessage("Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH REVIEWS
  // =========================================================

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewError("");

      const response = await api.get(
        `/reviews/product/${id}`
      );

      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviewError("Unable to load reviews.");
    } finally {
      setReviewsLoading(false);
    }
  };

  // =========================================================
  // ADD TO CART
  // =========================================================

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login to add items to cart.");
      return;
    }

    try {
      setAdding(true);
      setMessage("");

      await api.post("/cart/items", {
        productId: product.id,
        quantity: quantity,
      });

      setMessage("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);

      if (error.response?.status === 401) {
        setMessage("Please login again.");
      } else {
        setMessage(
          error.response?.data?.message ||
            "Failed to add to cart."
        );
      }
    } finally {
      setAdding(false);
    }
  };

  // =========================================================
  // ADD TO WISHLIST
  // =========================================================

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlistMessage(
        "Please login to use wishlist."
      );
      return;
    }

    try {
      setWishlistLoading(true);
      setWishlistMessage("");

      await api.post(
        `/wishlist/products/${product.id}`
      );

      setWishlistMessage("Added to wishlist!");
    } catch (error) {
      console.error(
        "Error adding to wishlist:",
        error
      );

      if (error.response?.status === 401) {
        setWishlistMessage("Please login again.");
      } else {
        setWishlistMessage(
          error.response?.data?.message ||
            "Failed to add to wishlist."
        );
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  // =========================================================
  // SUBMIT / UPDATE REVIEW
  // =========================================================

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setReviewError(
        "Please login to write a review."
      );
      return;
    }

    if (!comment.trim()) {
      setReviewError("Please write a comment.");
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError("");

      if (editingReviewId) {
        await api.put(
          `/reviews/${editingReviewId}`,
          {
            productId: Number(id),
            rating: rating,
            comment: comment.trim(),
          }
        );

        alert("Review updated successfully.");
      } else {
        await api.post("/reviews", {
          productId: Number(id),
          rating: rating,
          comment: comment.trim(),
        });

        alert("Review submitted successfully.");
      }

      setComment("");
      setRating(5);
      setEditingReviewId(null);

      await fetchReviews();
    } catch (error) {
      console.error(
        "Error saving review:",
        error
      );

      if (error.response?.status === 401) {
        setReviewError("Please login again.");
      } else {
        setReviewError(
          error.response?.data?.message ||
            "Failed to save review."
        );
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  // =========================================================
  // EDIT REVIEW
  // =========================================================

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setComment(review.comment || "");
    setReviewError("");

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  // =========================================================
  // CANCEL REVIEW EDIT
  // =========================================================

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setRating(5);
    setComment("");
    setReviewError("");
  };

  // =========================================================
  // DELETE REVIEW
  // =========================================================

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setReviewDeleting(true);
      setReviewError("");

      await api.delete(`/reviews/${reviewId}`);

      alert("Review deleted successfully.");

      if (editingReviewId === reviewId) {
        handleCancelEdit();
      }

      await fetchReviews();
    } catch (error) {
      console.error(
        "Error deleting review:",
        error
      );

      if (error.response?.status === 401) {
        setReviewError("Please login again.");
      } else {
        setReviewError(
          error.response?.data?.message ||
            "Failed to delete review."
        );
      }
    } finally {
      setReviewDeleting(false);
    }
  };

  // =========================================================
  // CHECK MY REVIEW
  // =========================================================

  const isMyReview = (review) => {
    if (!user) {
      return false;
    }

    return (
      review.userId === user.id ||
      review.user?.id === user.id
    );
  };

  // =========================================================
  // CALCULATE RATING
  // =========================================================

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 mt-4 font-medium">
            Loading product...
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // PRODUCT NOT FOUND
  // =========================================================

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

        <div className="text-center">

          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle
              size={28}
              className="text-gray-500"
            />
          </div>

          <p className="text-red-500 mt-5 mb-5">
            Product not found.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-lg font-semibold hover:bg-black transition"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>

        </div>

      </div>
    );
  }

  const isOutOfStock =
    product.stockQuantity <= 0;

  const isLowStock =
    product.stockQuantity > 0 &&
    product.stockQuantity <= 5;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          BREADCRUMB
      ====================================================== */}
      <div className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
          >
            <ArrowLeft size={16} />
            Back to Products
          </Link>

        </div>

      </div>

      {/* =====================================================
          PRODUCT SECTION
      ====================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-10">

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* =================================================
                IMAGE
            ================================================== */}
            <div className="bg-gray-50 min-h-[400px] lg:min-h-[600px] flex items-center justify-center relative">

              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full max-h-[600px] object-contain p-8 sm:p-12"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-5xl mb-3">
                    📦
                  </div>
                  <p>No Image Available</p>
                </div>
              )}

              {/* Stock badge */}
              <div className="absolute top-5 left-5">

                {isOutOfStock ? (
                  <span className="bg-gray-900 text-white text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-lg">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="bg-white border border-gray-200 text-gray-900 text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-lg shadow-sm">
                    Only {product.stockQuantity} Left
                  </span>
                ) : (
                  <span className="bg-white border border-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wide px-3 py-2 rounded-lg shadow-sm">
                    In Stock
                  </span>
                )}

              </div>

            </div>

            {/* =================================================
                PRODUCT INFORMATION
            ================================================== */}
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">

              {/* Category */}
              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                {product.categoryName ||
                  "D Store Collection"}
              </p>

              {/* Product name */}
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-3 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mt-5">

                <div className="flex items-center gap-1">

                  {[1, 2, 3, 4, 5].map(
                    (value) => (
                      <Star
                        key={value}
                        size={17}
                        className={
                          value <=
                          Math.round(
                            Number(averageRating)
                          )
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                        fill={
                          value <=
                          Math.round(
                            Number(averageRating)
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />
                    )
                  )}

                </div>

                <span className="text-sm font-semibold text-gray-700">
                  {averageRating}
                </span>

                <span className="text-sm text-gray-400">
                  ({reviews.length}{" "}
                  {reviews.length === 1
                    ? "review"
                    : "reviews"})
                </span>

              </div>

              {/* Description */}
              <p className="text-gray-600 mt-6 leading-7">
                {product.description ||
                  "No description available."}
              </p>

              {/* Price */}
              <div className="mt-7">

                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  Price
                </p>

                <span className="text-3xl sm:text-4xl font-black text-gray-900">
                  ₹
                  {Number(
                    product.price
                  ).toLocaleString("en-IN")}
                </span>

              </div>

              {/* Stock */}
              <div className="mt-3">

                {isOutOfStock ? (
                  <p className="text-sm text-red-500 font-medium">
                    Currently unavailable
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {product.stockQuantity} units available
                  </p>
                )}

              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-7" />

              {/* Quantity */}
              <div>

                <p className="text-sm font-semibold text-gray-800 mb-3">
                  Quantity
                </p>

                <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.max(
                          1,
                          quantity - 1
                        )
                      )
                    }
                    disabled={quantity <= 1}
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:text-gray-300 transition"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="w-12 h-11 flex items-center justify-center border-x border-gray-200 font-semibold text-gray-900">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          product.stockQuantity,
                          quantity + 1
                        )
                      )
                    }
                    disabled={
                      isOutOfStock ||
                      quantity >=
                        product.stockQuantity
                    }
                    className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:text-gray-300 transition"
                  >
                    <Plus size={17} />
                  </button>

                </div>

              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={
                    adding ||
                    isOutOfStock
                  }
                  className="flex-1 bg-gray-900 text-white py-3.5 rounded-lg hover:bg-black transition flex items-center justify-center gap-2 font-bold disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={19} />

                  {isOutOfStock
                    ? "Out of Stock"
                    : adding
                    ? "Adding..."
                    : "Add to Cart"}
                </button>

                <button
                  type="button"
                  onClick={
                    handleAddToWishlist
                  }
                  disabled={
                    wishlistLoading
                  }
                  title="Add to Wishlist"
                  className="w-12 shrink-0 border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 hover:border-gray-500 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  <Heart
                    size={20}
                    className={
                      wishlistLoading
                        ? "animate-pulse"
                        : ""
                    }
                  />
                </button>

              </div>

              {/* Cart message */}
              {message && (
                <div
                  className={`flex items-center justify-center gap-2 text-sm mt-4 ${
                    message.includes(
                      "Added"
                    )
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {message.includes(
                    "Added"
                  ) ? (
                    <CheckCircle
                      size={16}
                    />
                  ) : (
                    <AlertCircle
                      size={16}
                    />
                  )}

                  {message}
                </div>
              )}

              {/* Wishlist message */}
              {wishlistMessage && (
                <div
                  className={`flex items-center justify-center gap-2 text-sm mt-2 ${
                    wishlistMessage.includes(
                      "Added"
                    )
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {wishlistMessage.includes(
                    "Added"
                  ) ? (
                    <CheckCircle
                      size={16}
                    />
                  ) : (
                    <AlertCircle
                      size={16}
                    />
                  )}

                  {wishlistMessage}
                </div>
              )}

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-gray-200">

                <div className="text-center">

                  <Truck
                    size={20}
                    className="mx-auto text-gray-700"
                  />

                  <p className="text-[11px] text-gray-500 mt-2">
                    Fast Delivery
                  </p>

                </div>

                <div className="text-center">

                  <ShieldCheck
                    size={20}
                    className="mx-auto text-gray-700"
                  />

                  <p className="text-[11px] text-gray-500 mt-2">
                    Secure Payment
                  </p>

                </div>

                <div className="text-center">

                  <RotateCcw
                    size={20}
                    className="mx-auto text-gray-700"
                  />

                  <p className="text-[11px] text-gray-500 mt-2">
                    Easy Returns
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            REVIEWS
        ====================================================== */}
        <section className="mt-8">

          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 md:p-9">

            {/* Review Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

              <div>

                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                  Customer Feedback
                </p>

                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
                  Customer Reviews
                </h2>

                <p className="text-gray-500 mt-1 text-sm">
                  See what customers think about this product.
                </p>

              </div>

              {reviews.length > 0 && (
                <div className="flex items-center gap-3">

                  <div className="text-3xl font-black text-gray-900">
                    {averageRating}
                  </div>

                  <div>

                    <div className="flex gap-0.5">

                      {[1, 2, 3, 4, 5].map(
                        (value) => (
                          <Star
                            key={value}
                            size={15}
                            className={
                              value <=
                              Math.round(
                                Number(
                                  averageRating
                                )
                              )
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }
                            fill={
                              value <=
                              Math.round(
                                Number(
                                  averageRating
                                )
                              )
                                ? "currentColor"
                                : "none"
                            }
                          />
                        )
                      )}

                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {reviews.length}{" "}
                      {reviews.length === 1
                        ? "review"
                        : "reviews"}
                    </p>

                  </div>

                </div>
              )}

            </div>

            {/* =================================================
                REVIEW FORM
            ================================================== */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6 mb-8">

              <h3 className="text-lg font-bold text-gray-900 mb-5">
                {editingReviewId
                  ? "Edit Your Review"
                  : "Write a Review"}
              </h3>

              <form
                onSubmit={
                  handleSubmitReview
                }
              >

                {/* Rating */}
                <div className="mb-5">

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Rating
                  </label>

                  <div className="flex items-center gap-1">

                    {[1, 2, 3, 4, 5].map(
                      (value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setRating(
                              value
                            )
                          }
                          className="p-0.5 hover:scale-110 transition"
                        >
                          <Star
                            size={25}
                            className={
                              value <=
                              rating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }
                            fill={
                              value <=
                              rating
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>
                      )
                    )}

                    <span className="ml-2 text-sm font-semibold text-gray-600">
                      {rating}/5
                    </span>

                  </div>

                </div>

                {/* Comment */}
                <div className="mb-5">

                  <label
                    htmlFor="reviewComment"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Your Review
                  </label>

                  <textarea
                    id="reviewComment"
                    value={comment}
                    onChange={(event) =>
                      setComment(
                        event.target.value
                      )
                    }
                    rows="4"
                    placeholder="Share your experience with this product..."
                    className="w-full border border-gray-200 bg-white rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-400 transition resize-none"
                  />

                </div>

                {reviewError && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mb-4">
                    <AlertCircle
                      size={16}
                    />
                    {reviewError}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">

                  <button
                    type="submit"
                    disabled={
                      reviewSubmitting
                    }
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {reviewSubmitting
                      ? "Saving..."
                      : editingReviewId
                      ? "Update Review"
                      : "Submit Review"}
                  </button>

                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={
                        handleCancelEdit
                      }
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-white transition"
                    >
                      Cancel
                    </button>
                  )}

                </div>

              </form>

            </div>

            {/* =================================================
                EXISTING REVIEWS
            ================================================== */}
            {reviewsLoading ? (

              <div className="py-10 text-center">

                <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />

                <p className="text-sm text-gray-500 mt-3">
                  Loading reviews...
                </p>

              </div>

            ) : reviews.length === 0 ? (

              <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">

                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Star
                    size={23}
                    className="text-gray-400"
                  />
                </div>

                <h3 className="font-bold text-gray-800 mt-4">
                  No reviews yet
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Be the first customer to review this product.
                </p>

              </div>

            ) : (

              <div className="space-y-0">

                {reviews.map((review) => (

                  <div
                    key={review.id}
                    className="py-6 border-b border-gray-100 last:border-b-0"
                  >

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                      <div>

                        <h3 className="font-bold text-gray-900">
                          {review.userName ||
                            "Customer"}
                        </h3>

                        <div className="flex items-center gap-2 mt-1">

                          <div className="flex">

                            {Array.from({
                              length: 5,
                            }).map(
                              (_, index) => (
                                <Star
                                  key={
                                    index
                                  }
                                  size={15}
                                  className={
                                    index <
                                    review.rating
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  }
                                  fill={
                                    index <
                                    review.rating
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              )
                            )}

                          </div>

                          <span className="text-xs text-gray-500">
                            {review.rating}/5
                          </span>

                        </div>

                      </div>

                      {review.createdAt && (
                        <span className="text-xs text-gray-400">
                          {new Date(
                            review.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )}
                        </span>
                      )}

                    </div>

                    <p className="text-gray-600 text-sm leading-6 mt-4">
                      {review.comment}
                    </p>

                    {/* Edit / Delete */}
                    {isMyReview(review) && (
                      <div className="flex gap-4 mt-4">

                        <button
                          type="button"
                          onClick={() =>
                            handleEditReview(
                              review
                            )
                          }
                          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition"
                        >
                          <Pencil
                            size={14}
                          />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteReview(
                              review.id
                            )
                          }
                          disabled={
                            reviewDeleting
                          }
                          className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition disabled:text-gray-300"
                        >
                          <Trash2
                            size={14}
                          />

                          {reviewDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>
                    )}

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default ProductDetails;