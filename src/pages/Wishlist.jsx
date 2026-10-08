import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  ShoppingBag,
  Heart,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";

function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.get("/wishlist");
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);

      if (error.response?.status === 401) {
        setError("Please login to view your wishlist.");
      } else if (error.response?.status === 404) {
        setWishlist({
          products: [],
        });
      } else {
        setError("Failed to load wishlist.");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await api.delete(
        `/wishlist/products/${productId}`
      );

      setWishlist(response.data);
    } catch (error) {
      console.error("Error removing from wishlist:", error);

      alert(
        error.response?.data?.message ||
          "Failed to remove product."
      );
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-sm text-gray-500">
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
            <Heart
              size={28}
              className="text-gray-400"
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            Wishlist unavailable
          </h2>

          <p className="text-sm text-gray-500 mt-2 mb-7">
            {error}
          </p>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-[#1f1f1f] text-white px-7 py-3 rounded-xl text-sm font-medium hover:bg-black transition"
          >
            Login to Continue
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    );
  }

  const products = wishlist?.products || [];

  /* ---------------- MAIN UI ---------------- */

  return (
    <div className="min-h-screen bg-[#f7f7f5] py-8 sm:py-12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="mb-8 sm:mb-10">

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
              <Heart
                size={19}
                className="text-gray-800"
              />
            </div>

            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
              Saved Items
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#181818]">
                My Wishlist
              </h1>

              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Products you love, saved for later.
              </p>
            </div>

            {products.length > 0 && (
              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>{" "}
                {products.length === 1 ? "item" : "items"}
              </div>
            )}

          </div>
        </div>

        {/* ================= EMPTY WISHLIST ================= */}

        {products.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

            <div className="px-6 py-16 sm:py-20 text-center">

              <div className="w-20 h-20 mx-auto rounded-full bg-[#f4f4f2] flex items-center justify-center mb-6">
                <Heart
                  size={34}
                  strokeWidth={1.5}
                  className="text-gray-500"
                />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900">
                Your wishlist is empty
              </h2>

              <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                Save the products you love and come back
                whenever you're ready to shop.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-8 bg-[#1f1f1f] text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-black transition"
              >
                <ShoppingBag size={18} />
                Browse Products
                <ArrowRight size={17} />
              </Link>

            </div>

            {/* Empty wishlist benefits */}

            <div className="border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3">

              <div className="flex items-center justify-center gap-3 px-5 py-5 text-sm text-gray-600 border-b sm:border-b-0 sm:border-r border-gray-100">
                <Heart size={18} className="text-gray-400" />
                Save your favorites
              </div>

              <div className="flex items-center justify-center gap-3 px-5 py-5 text-sm text-gray-600 border-b sm:border-b-0 sm:border-r border-gray-100">
                <ShoppingBag size={18} className="text-gray-400" />
                Shop whenever you're ready
              </div>

              <div className="flex items-center justify-center gap-3 px-5 py-5 text-sm text-gray-600">
                <ShieldCheck size={18} className="text-gray-400" />
                Secure shopping
              </div>

            </div>

          </div>

        ) : (

          <>
            {/* ================= PRODUCT GRID ================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">

              {products.map((product) => (

                <div
                  key={product.id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-black/5 transition-all duration-300"
                >

                  {/* Product Image */}

                  <Link to={`/products/${product.id}`}>

                    <div className="relative h-64 sm:h-72 bg-[#f3f3f1] overflow-hidden">

                      {product.imageUrl ? (

                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <ShoppingBag
                              size={30}
                              className="mx-auto text-gray-300 mb-2"
                            />

                            <span className="text-sm text-gray-400">
                              No Image
                            </span>
                          </div>
                        </div>

                      )}

                      {/* Wishlist Badge */}

                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-[11px] font-semibold text-gray-700">
                          <Heart
                            size={12}
                            className="fill-current"
                          />
                          Saved
                        </span>
                      </div>

                      {/* Hover Overlay */}

                      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-black/85 backdrop-blur-sm text-white rounded-xl py-3 text-center text-sm font-medium">
                          View Product
                        </div>
                      </div>

                    </div>

                  </Link>

                  {/* Product Information */}

                  <div className="p-5">

                    <Link to={`/products/${product.id}`}>

                      <h2 className="font-semibold text-gray-900 text-base sm:text-lg truncate group-hover:text-gray-600 transition">
                        {product.name}
                      </h2>

                    </Link>

                    <div className="flex items-center justify-between gap-3 mt-3">

                      <p className="text-lg font-semibold text-gray-900">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>

                      <span className="text-xs text-gray-400">
                        D Store
                      </span>

                    </div>

                    {/* Actions */}

                    <div className="flex gap-2 mt-5">

                      <Link
                        to={`/products/${product.id}`}
                        className="flex-1 bg-[#1f1f1f] text-white py-2.5 rounded-xl hover:bg-black transition flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <ShoppingBag size={17} />
                        View Product
                      </Link>

                      <button
                        onClick={() =>
                          removeFromWishlist(product.id)
                        }
                        title="Remove from wishlist"
                        className="w-11 border border-gray-200 rounded-xl text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            {/* ================= BOTTOM SHOPPING PROMO ================= */}

            <div className="mt-10 bg-[#202020] rounded-2xl px-6 sm:px-8 py-8 sm:py-9 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold">
                  Keep exploring
                </p>

                <h3 className="text-xl sm:text-2xl font-semibold mt-2">
                  Find something new for your collection.
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                  Discover more products from D Store.
                </p>
              </div>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition shrink-0"
              >
                Continue Shopping
                <ArrowRight size={17} />
              </Link>

            </div>

          </>

        )}

      </div>
    </div>
  );
}

export default Wishlist;