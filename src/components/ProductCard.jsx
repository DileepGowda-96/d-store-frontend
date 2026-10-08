import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  CheckCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useState } from "react";
import api from "../services/api";

function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [wishlistMessage, setWishlistMessage] = useState("");

  const isOutOfStock = product.stockQuantity <= 0;
  const isLowStock =
    product.stockQuantity > 0 && product.stockQuantity <= 5;

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
        quantity: 1,
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

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlistMessage("Please login to use wishlist.");
      return;
    }

    try {
      setWishlistLoading(true);
      setWishlistMessage("");

      await api.post(`/wishlist/products/${product.id}`);

      setWishlistMessage("Added to wishlist!");
    } catch (error) {
      console.error("Error adding to wishlist:", error);

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

  return (
    <article className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all duration-300">

      {/* =====================================================
          PRODUCT IMAGE
      ====================================================== */}
      <Link to={`/products/${product.id}`}>

        <div className="relative h-52 sm:h-56 bg-gray-50 overflow-hidden">

          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">

              <div className="text-center">

                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <ShoppingCart
                    size={22}
                    className="text-gray-400"
                  />
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  No Image
                </p>

              </div>

            </div>
          )}

          {/* Wishlist */}
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              handleAddToWishlist();
            }}
            disabled={wishlistLoading}
            aria-label="Add to wishlist"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-white transition-all shadow-sm disabled:opacity-50"
          >
            <Heart
              size={17}
              className={
                wishlistLoading
                  ? "animate-pulse"
                  : ""
              }
            />
          </button>

          {/* Stock Badge */}
          <div className="absolute top-3 left-3">

            {isOutOfStock ? (
              <span className="inline-flex items-center bg-gray-900 text-white text-[10px] uppercase tracking-wide font-bold px-2.5 py-1.5 rounded-md">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center bg-white text-gray-900 border border-gray-200 text-[10px] uppercase tracking-wide font-bold px-2.5 py-1.5 rounded-md shadow-sm">
                Only {product.stockQuantity} left
              </span>
            ) : (
              <span className="inline-flex items-center bg-white text-gray-700 border border-gray-200 text-[10px] uppercase tracking-wide font-bold px-2.5 py-1.5 rounded-md shadow-sm">
                In Stock
              </span>
            )}

          </div>

          {/* View Product Overlay */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">

            <div className="mb-3 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg">
              <Eye size={14} />
              View Product
            </div>

          </div>

        </div>

      </Link>

      {/* =====================================================
          PRODUCT INFORMATION
      ====================================================== */}
      <div className="p-4 sm:p-5">

        {/* Product Name */}
        <Link to={`/products/${product.id}`}>

          <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[40px] hover:text-gray-600 transition">
            {product.name}
          </h3>

        </Link>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2 min-h-[34px] leading-relaxed">
          {product.description ||
            "No description available."}
        </p>

        {/* Price */}
        <div className="mt-4 flex items-end justify-between gap-2">

          <div>

            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              Price
            </p>

            <span className="text-lg sm:text-xl font-black text-gray-900">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>

          </div>

          {!isOutOfStock && (
            <span className="text-[11px] text-gray-400 whitespace-nowrap">
              {product.stockQuantity} available
            </span>
          )}

        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 mt-4 pt-4">

          {/* Actions */}
          <div className="flex gap-2">

            {/* Add To Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={adding || isOutOfStock}
              className="flex-1 min-w-0 bg-gray-900 text-white py-2.5 px-2 rounded-lg hover:bg-black transition-all flex items-center justify-center gap-1.5 font-semibold text-xs sm:text-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={16} />

              <span className="truncate">
                {isOutOfStock
                  ? "Out of Stock"
                  : adding
                  ? "Adding..."
                  : "Add to Cart"}
              </span>

            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={handleAddToWishlist}
              disabled={wishlistLoading}
              title="Add to Wishlist"
              className="w-10 sm:w-11 shrink-0 border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <Heart
                size={18}
                className={
                  wishlistLoading
                    ? "animate-pulse"
                    : ""
                }
              />
            </button>

          </div>

        </div>

        {/* =================================================
            CART MESSAGE
        ================================================== */}
        {message && (
          <div
            className={`flex items-center justify-center gap-1.5 text-[11px] mt-3 ${
              message.includes("Added")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >

            {message.includes("Added") ? (
              <CheckCircle size={13} />
            ) : (
              <AlertCircle size={13} />
            )}

            <span>{message}</span>

          </div>
        )}

        {/* =================================================
            WISHLIST MESSAGE
        ================================================== */}
        {wishlistMessage && (
          <div
            className={`flex items-center justify-center gap-1.5 text-[11px] mt-2 ${
              wishlistMessage.includes("Added")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >

            {wishlistMessage.includes("Added") ? (
              <CheckCircle size={13} />
            ) : (
              <AlertCircle size={13} />
            )}

            <span>{wishlistMessage}</span>

          </div>
        )}

      </div>

    </article>
  );
}

export default ProductCard;