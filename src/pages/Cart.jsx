import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Package,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import api from "../services/api";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [removingItemId, setRemovingItemId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  // =========================================================
  // FETCH CART
  // =========================================================

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);

      if (error.response?.status === 401) {
        setError("Please login to view your cart.");
      } else if (error.response?.status === 404) {
        setCart({
          items: [],
          totalPrice: 0,
        });
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load cart."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UPDATE QUANTITY
  // =========================================================

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      setUpdatingItemId(itemId);
      setError("");

      const response = await api.put(
        `/cart/items/${itemId}`,
        {
          quantity: quantity,
        }
      );

      setCart(response.data);
    } catch (error) {
      console.error(
        "Error updating cart:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update quantity."
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const removeItem = async (itemId) => {
    try {
      setRemovingItemId(itemId);
      setError("");

      const response = await api.delete(
        `/cart/items/${itemId}`
      );

      setCart(response.data);
    } catch (error) {
      console.error(
        "Error removing item:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to remove item."
      );
    } finally {
      setRemovingItemId(null);
    }
  };

  // =========================================================
  // PLACE ORDER
  // =========================================================

  const handlePlaceOrder = async () => {
    if (!cart?.items?.length) {
      return;
    }

    try {
      setPlacingOrder(true);
      setError("");

      const response = await api.post("/orders");

      const order = response.data;

      alert(
        `Order placed successfully! Order ID: ${order.id}`
      );

      navigate("/orders");
    } catch (error) {
      console.error(
        "Error placing order:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to place order."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

        <div className="text-center">

          <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto" />

          <p className="text-gray-600 font-medium mt-4">
            Loading your cart...
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR WITHOUT CART
  // =========================================================

  if (error && !cart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-md w-full">

          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <ShoppingCart
              size={28}
              className="text-gray-600"
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            Cart Unavailable
          </h2>

          <p className="text-red-500 mt-2">
            {error}
          </p>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 mt-6 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-black transition font-semibold"
          >
            Login
          </Link>

        </div>

      </div>
    );
  }

  const items = cart?.items || [];

  const totalPrice = Number(
    cart?.totalPrice || 0
  );

  const totalQuantity = items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // =========================================================
  // MAIN CART
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          HEADER
      ====================================================== */}
      <section className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-9">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">
                D Store
              </p>

              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
                Shopping Cart
              </h1>

              {items.length > 0 && (
                <p className="text-gray-500 mt-2">
                  {totalQuantity}{" "}
                  {totalQuantity === 1
                    ? "item"
                    : "items"}{" "}
                  ready for checkout
                </p>
              )}

            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft size={17} />
              Continue Shopping
            </Link>

          </div>

        </div>

      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-10">

        {/* ===================================================
            ERROR MESSAGE
        ==================================================== */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* ===================================================
            EMPTY CART
        ==================================================== */}
        {items.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-2xl p-12 md:p-20 text-center">

            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingCart
                size={34}
                className="text-gray-500"
              />
            </div>

            <h2 className="text-2xl font-black text-gray-900 mt-6">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2 max-w-md mx-auto">
              Looks like you haven't added
              anything to your cart yet.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-black transition mt-7"
            >
              <ShoppingCart size={18} />
              Start Shopping
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-7">

            {/* =================================================
                CART ITEMS
            ================================================== */}
            <section>

              <div className="flex items-center justify-between mb-4">

                <div>

                  <h2 className="text-lg font-bold text-gray-900">
                    Your Items
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Review your products before
                    placing the order.
                  </p>

                </div>

                <span className="hidden sm:block text-sm text-gray-400">
                  {items.length}{" "}
                  {items.length === 1
                    ? "product"
                    : "products"}
                </span>

              </div>

              <div className="space-y-3">

                {items.map((item) => (

                  <article
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-gray-300 transition"
                  >

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">

                      {/* Product Image */}
                      <Link
                        to={`/products/${item.productId}`}
                        className="w-full sm:w-28 h-28 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden shrink-0"
                      >

                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-contain p-2 hover:scale-105 transition-transform"
                          />
                        ) : (
                          <Package
                            size={34}
                            className="text-gray-300"
                          />
                        )}

                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">

                        <Link
                          to={`/products/${item.productId}`}
                        >
                          <h3 className="font-bold text-gray-900 hover:text-gray-600 transition line-clamp-2">
                            {item.productName}
                          </h3>
                        </Link>

                        <p className="text-sm text-gray-500 mt-1">
                          ₹
                          {Number(
                            item.price || 0
                          ).toLocaleString("en-IN")}{" "}
                          each
                        </p>

                        {/* Quantity */}
                        <div className="flex flex-wrap items-center gap-3 mt-4">

                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Quantity
                          </span>

                          <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                updatingItemId ===
                                  item.id
                              }
                              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="w-10 h-9 flex items-center justify-center border-x border-gray-200 text-sm font-bold text-gray-900">

                              {updatingItemId ===
                              item.id ? (
                                <RefreshCw
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : (
                                item.quantity
                              )}

                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                updatingItemId ===
                                item.id
                              }
                              className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition"
                            >
                              <Plus size={15} />
                            </button>

                          </div>

                        </div>

                      </div>

                      {/* Price + Remove */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 sm:min-w-[120px]">

                        <div className="sm:text-right">

                          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                            Subtotal
                          </p>

                          <p className="text-lg font-black text-gray-900 mt-1">
                            ₹
                            {Number(
                              item.subtotal || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(item.id)
                          }
                          disabled={
                            removingItemId ===
                            item.id
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition disabled:text-gray-300"
                        >

                          {removingItemId ===
                          item.id ? (
                            <>
                              <RefreshCw
                                size={14}
                                className="animate-spin"
                              />
                              Removing...
                            </>
                          ) : (
                            <>
                              <Trash2 size={14} />
                              Remove
                            </>
                          )}

                        </button>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            </section>

            {/* =================================================
                ORDER SUMMARY
            ================================================== */}
            <aside>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 lg:sticky lg:top-24">

                <div className="flex items-center justify-between">

                  <h2 className="text-xl font-black text-gray-900">
                    Order Summary
                  </h2>

                  <CreditCard
                    size={20}
                    className="text-gray-400"
                  />

                </div>

                {/* Price breakdown */}
                <div className="space-y-3 mt-6">

                  <div className="flex justify-between text-sm text-gray-500">

                    <span>
                      Items ({totalQuantity})
                    </span>

                    <span className="font-medium text-gray-700">
                      ₹
                      {totalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm text-gray-500">

                    <span>
                      Delivery
                    </span>

                    <span className="font-semibold text-green-600">
                      FREE
                    </span>

                  </div>

                </div>

                {/* Total */}
                <div className="border-t border-gray-200 mt-5 pt-5 flex items-end justify-between">

                  <div>

                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="text-2xl font-black text-gray-900 mt-1">
                      ₹
                      {totalPrice.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                  <span className="text-xs text-gray-400 pb-1">
                    Inclusive
                  </span>

                </div>

                {/* Place Order */}
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-bold mt-7 hover:bg-black transition disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >

                  {placingOrder ? (
                    <>
                      <RefreshCw
                        size={18}
                        className="animate-spin"
                      />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Place Order
                    </>
                  )}

                </button>

                <p className="text-[11px] text-gray-400 text-center mt-3">
                  Secure checkout • Free delivery
                </p>

                {/* Trust features */}
                <div className="border-t border-gray-100 mt-6 pt-5 space-y-4">

                  <div className="flex items-start gap-3">

                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <ShieldCheck
                        size={18}
                        className="text-gray-700"
                      />
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-800">
                        Secure Checkout
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Your account is protected
                      </p>

                    </div>

                  </div>

                  <div className="flex items-start gap-3">

                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <Truck
                        size={18}
                        className="text-gray-700"
                      />
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-800">
                        Reliable Delivery
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Fast and safe delivery
                      </p>

                    </div>

                  </div>

                  <div className="flex items-start gap-3">

                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                      <Package
                        size={18}
                        className="text-gray-700"
                      />
                    </div>

                    <div>

                      <p className="text-sm font-semibold text-gray-800">
                        Quality Products
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Shop with confidence
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </aside>

          </div>

        )}

      </main>

    </div>
  );
}

export default Cart;