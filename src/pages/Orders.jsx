import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ArrowRight,
  ShoppingBag,
  RefreshCw,
  CalendarDays,
  ChevronRight,
  CheckCircle2,
  Truck,
  XCircle,
  Clock3,
} from "lucide-react";
import api from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");
      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);

      if (error.response?.status === 401) {
        setError("Please login to view your orders.");
      } else {
        setError("Failed to load orders.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "PLACED":
        return {
          label: "Order Placed",
          className: "bg-gray-100 text-gray-700 border-gray-200",
          icon: Clock3,
        };

      case "CONFIRMED":
        return {
          label: "Confirmed",
          className: "bg-stone-100 text-stone-700 border-stone-200",
          icon: CheckCircle2,
        };

      case "SHIPPED":
        return {
          label: "Shipped",
          className: "bg-amber-50 text-amber-700 border-amber-200",
          icon: Truck,
        };

      case "DELIVERED":
        return {
          label: "Delivered",
          className: "bg-green-50 text-green-700 border-green-200",
          icon: CheckCircle2,
        };

      case "CANCELLED":
        return {
          label: "Cancelled",
          className: "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
        };

      default:
        return {
          label: status,
          className: "bg-gray-100 text-gray-700 border-gray-200",
          icon: Package,
        };
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-gray-500">
            Loading your orders...
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

          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <Package
              size={30}
              className="text-red-500"
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mt-5">
            Unable to Load Orders
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {error}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">

            <button
              onClick={fetchOrders}
              className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-800 px-5 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-[#1f1f1f] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-black transition"
            >
              Login
              <ArrowRight size={16} />
            </Link>

          </div>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
    <div className="min-h-screen bg-[#f7f7f5] py-8 sm:py-10 lg:py-12">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="mb-8 sm:mb-10">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
              <Package
                size={19}
                className="text-gray-800"
              />
            </div>

            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
              Your Shopping
            </span>

          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

            <div>

              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#181818]">
                My Orders
              </h1>

              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                Track and manage your D Store orders.
              </p>

            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition"
            >
              <ShoppingBag size={17} />
              Continue Shopping
              <ChevronRight size={16} />
            </Link>

          </div>

        </div>

        {/* ================= ORDER COUNT ================= */}

        {orders.length > 0 && (
          <div className="mb-5 text-sm text-gray-500">
            <span className="font-semibold text-gray-900">
              {orders.length}
            </span>{" "}
            {orders.length === 1 ? "order" : "orders"} in your account
          </div>
        )}

        {/* ================= EMPTY STATE ================= */}

        {orders.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

            <div className="px-6 py-16 sm:py-20 text-center">

              <div className="w-20 h-20 mx-auto rounded-full bg-[#f3f3f1] flex items-center justify-center">
                <Package
                  size={36}
                  strokeWidth={1.5}
                  className="text-gray-500"
                />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mt-6">
                No orders yet
              </h2>

              <p className="text-sm sm:text-base text-gray-500 mt-3 max-w-md mx-auto">
                Your orders will appear here once you
                complete your first purchase.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-8 bg-[#1f1f1f] text-white px-7 py-3.5 rounded-xl text-sm font-medium hover:bg-black transition"
              >
                <ShoppingBag size={18} />
                Start Shopping
                <ArrowRight size={17} />
              </Link>

            </div>

            <div className="border-t border-gray-100 px-6 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">
                D Store
              </span>

              <span className="hidden sm:block text-gray-300">
                •
              </span>

              <span>
                Simple shopping. Reliable delivery.
              </span>
            </div>

          </div>

        ) : (

          /* ================= ORDERS ================= */

          <div className="space-y-5">

            {orders.map((order) => {

              const status = getStatusConfig(order.status);
              const StatusIcon = status.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
                >

                  {/* ================= ORDER HEADER ================= */}

                  <div className="px-5 sm:px-6 py-5 border-b border-gray-100">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div>

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-xl bg-[#f3f3f1] flex items-center justify-center">
                            <Package
                              size={18}
                              className="text-gray-700"
                            />
                          </div>

                          <div>

                            <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                              Order
                            </p>

                            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                              #{order.id}
                            </h2>

                          </div>

                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-3 ml-1">

                          <CalendarDays size={15} />

                          <span>
                            {order.orderDate
                              ? new Date(
                                  order.orderDate
                                ).toLocaleString()
                              : "Date unavailable"}
                          </span>

                        </div>

                      </div>

                      {/* Status */}

                      <div
                        className={`inline-flex items-center gap-2 self-start sm:self-auto border px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold ${status.className}`}
                      >
                        <StatusIcon size={15} />
                        {status.label}
                      </div>

                    </div>

                  </div>

                  {/* ================= ORDER ITEMS ================= */}

                  <div className="px-5 sm:px-6 py-5">

                    <div className="flex items-center justify-between mb-4">

                      <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold">
                        Order Items
                      </p>

                      <span className="text-xs text-gray-400">
                        {order.items?.length || 0}{" "}
                        {(order.items?.length || 0) === 1
                          ? "item"
                          : "items"}
                      </span>

                    </div>

                    <div className="space-y-3">

                      {order.items?.map((item) => (

                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 bg-[#fafaf9] border border-gray-100 rounded-xl px-4 py-3"
                        >

                          <div className="flex items-center gap-3 min-w-0">

                            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                              <ShoppingBag
                                size={17}
                                className="text-gray-500"
                              />
                            </div>

                            <div className="min-w-0">

                              <p className="font-medium text-gray-900 text-sm truncate">
                                {item.productName}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                Quantity: {item.quantity}
                              </p>

                            </div>

                          </div>

                          <p className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                            ₹
                            {Number(
                              item.subtotal || 0
                            ).toLocaleString("en-IN")}
                          </p>

                        </div>

                      ))}

                    </div>

                  </div>

                  {/* ================= ORDER FOOTER ================= */}

                  <div className="px-5 sm:px-6 py-5 border-t border-gray-100 bg-[#fafaf9]">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                      <div>

                        <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                          Order Total
                        </p>

                        <p className="text-2xl font-semibold text-gray-900 mt-1">
                          ₹
                          {Number(
                            order.totalAmount || 0
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                      <Link
                        to={`/orders/${order.id}`}
                        className="inline-flex items-center justify-center gap-2 bg-[#1f1f1f] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-black transition"
                      >
                        View Order
                        <ArrowRight size={17} />
                      </Link>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>
    </div>
  );
}

export default Orders;