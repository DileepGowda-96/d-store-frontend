import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  CalendarDays,
  CheckCircle2,
  Truck,
  CircleCheck,
  XCircle,
  Clock,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import api from "../services/api";

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/orders/${orderId}/details`);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);

      if (error.response?.status === 401) {
        setError("Please login to view this order.");
      } else if (error.response?.status === 404) {
        setError("Order not found.");
      } else {
        setError("Failed to load order details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");

      const response = await api.put(`/orders/${orderId}/cancel`);

      setOrder(response.data);

      window.alert("Order cancelled successfully.");
    } catch (error) {
      console.error("Error cancelling order:", error);

      setError(
        error.response?.data?.message ||
          "Failed to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "PLACED":
        return {
          label: "Order Placed",
          className:
            "bg-gray-100 text-gray-700 border-gray-200",
          icon: Clock,
        };

      case "CONFIRMED":
        return {
          label: "Confirmed",
          className:
            "bg-stone-100 text-stone-700 border-stone-200",
          icon: CheckCircle2,
        };

      case "SHIPPED":
        return {
          label: "Shipped",
          className:
            "bg-amber-50 text-amber-700 border-amber-200",
          icon: Truck,
        };

      case "DELIVERED":
        return {
          label: "Delivered",
          className:
            "bg-green-50 text-green-700 border-green-200",
          icon: CircleCheck,
        };

      case "CANCELLED":
        return {
          label: "Cancelled",
          className:
            "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
        };

      default:
        return {
          label: status,
          className:
            "bg-gray-100 text-gray-700 border-gray-200",
          icon: Package,
        };
    }
  };

  const statusSteps = [
    {
      status: "PLACED",
      label: "Order Placed",
      icon: Clock,
    },
    {
      status: "CONFIRMED",
      label: "Confirmed",
      icon: CheckCircle2,
    },
    {
      status: "SHIPPED",
      label: "Shipped",
      icon: Truck,
    },
    {
      status: "DELIVERED",
      label: "Delivered",
      icon: CircleCheck,
    },
  ];

  const getStepState = (stepStatus) => {
    if (!order) return "inactive";

    const statusOrder = {
      PLACED: 1,
      CONFIRMED: 2,
      SHIPPED: 3,
      DELIVERED: 4,
      CANCELLED: 0,
    };

    if (order.status === "CANCELLED") {
      return "cancelled";
    }

    if (
      statusOrder[stepStatus] <=
      statusOrder[order.status]
    ) {
      return "completed";
    }

    return "inactive";
  };

  const canCancel =
    order &&
    (order.status === "PLACED" ||
      order.status === "CONFIRMED");

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-gray-500">
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */

  if (error && !order) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center max-w-md w-full">

          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <XCircle
              size={30}
              className="text-red-500"
            />
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mt-5">
            Unable to Load Order
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {error}
          </p>

          <Link
            to="/orders"
            className="inline-flex items-center gap-2 mt-7 bg-[#1f1f1f] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-black transition"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </Link>

        </div>
      </div>
    );
  }

  const status = getStatusConfig(order.status);
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-[#f7f7f5] py-7 sm:py-10">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= BACK ================= */}

        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        {/* ================= HEADER ================= */}

        <div className="mt-6 mb-7">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                  <Package
                    size={21}
                    className="text-gray-800"
                  />
                </div>

                <div>

                  <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold">
                    Order Details
                  </p>

                  <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 mt-1">
                    #{order.id}
                  </h1>

                </div>

              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
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
              className={`inline-flex items-center gap-2 self-start md:self-auto border px-4 py-2.5 rounded-full text-sm font-semibold ${status.className}`}
            >
              <StatusIcon size={17} />
              {status.label}
            </div>

          </div>

        </div>

        {/* ================= INLINE ERROR ================= */}

        {error && order && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* ================= ORDER PROGRESS ================= */}

        {order.status !== "CANCELLED" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 mb-6">

            <div className="flex items-center justify-between mb-7">

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold">
                  Delivery Progress
                </p>

                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-1">
                  Track Your Order
                </h2>
              </div>

              <Truck
                size={22}
                className="text-gray-400"
              />

            </div>

            <div className="grid grid-cols-4 gap-1 sm:gap-3">

              {statusSteps.map((step, index) => {

                const Icon = step.icon;
                const state = getStepState(step.status);

                return (
                  <div
                    key={step.status}
                    className="relative text-center"
                  >

                    {/* Connector */}

                    {index <
                      statusSteps.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-px ${
                          getStepState(
                            statusSteps[index + 1]
                              .status
                          ) === "completed"
                            ? "bg-gray-900"
                            : "bg-gray-200"
                        }`}
                      />
                    )}

                    {/* Icon */}

                    <div className="relative z-10 flex justify-center">

                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 ${
                          state === "completed"
                            ? "bg-[#1f1f1f] text-white border-[#1f1f1f]"
                            : "bg-white text-gray-300 border-gray-200"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                    </div>

                    <p
                      className={`text-[10px] sm:text-xs mt-3 font-medium ${
                        state === "completed"
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>

                  </div>
                );
              })}

            </div>

          </div>
        )}

        {/* ================= CANCELLED ================= */}

        {order.status === "CANCELLED" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 sm:p-6 mb-6 flex items-start gap-4">

            <div className="w-11 h-11 rounded-full bg-white border border-red-200 text-red-500 flex items-center justify-center flex-shrink-0">
              <XCircle size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-red-800">
                Order Cancelled
              </h3>

              <p className="text-sm text-red-600 mt-1">
                This order has been cancelled successfully.
              </p>
            </div>

          </div>
        )}

        {/* ================= ORDERED PRODUCTS ================= */}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {/* Section Header */}

          <div className="px-5 sm:px-7 py-5 border-b border-gray-100">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-[#f3f3f1] flex items-center justify-center">
                  <ShoppingBag
                    size={18}
                    className="text-gray-700"
                  />
                </div>

                <div>

                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Purchase
                  </p>

                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Ordered Products
                  </h2>

                </div>

              </div>

              <span className="text-xs sm:text-sm text-gray-400">
                {order.items?.length || 0}{" "}
                {(order.items?.length || 0) === 1
                  ? "item"
                  : "items"}
              </span>

            </div>

          </div>

          {/* Items */}

          <div className="px-5 sm:px-7 py-5">

            <div className="space-y-4">

              {order.items?.map((item) => (

                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-gray-100 last:border-b-0 last:pb-0"
                >

                  <div className="flex items-center gap-4 min-w-0">

                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#f3f3f1] border border-gray-100 flex items-center justify-center flex-shrink-0">
                      <Package
                        size={22}
                        className="text-gray-500"
                      />
                    </div>

                    <div className="min-w-0">

                      <h3 className="font-semibold text-gray-900 truncate">
                        {item.productName}
                      </h3>

                      <div className="text-sm text-gray-500 mt-1 space-y-0.5">

                        <p>
                          Quantity:{" "}
                          <span className="text-gray-700">
                            {item.quantity}
                          </span>
                        </p>

                        <p>
                          Price per item: ₹
                          {Number(
                            item.price || 0
                          ).toLocaleString("en-IN")}
                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="sm:text-right pl-16 sm:pl-0">

                    <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                      Subtotal
                    </p>

                    <p className="font-semibold text-gray-900 text-lg mt-1">
                      ₹
                      {Number(
                        item.subtotal || 0
                      ).toLocaleString("en-IN")}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            {/* Total */}

            <div className="border-t border-gray-200 mt-6 pt-6 flex items-center justify-between gap-4">

              <div>

                <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                  Total Amount
                </p>

                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1">
                  ₹
                  {Number(
                    order.totalAmount || 0
                  ).toLocaleString("en-IN")}
                </p>

              </div>

              <div className="hidden sm:flex w-11 h-11 rounded-full bg-[#f3f3f1] items-center justify-center">
                <ShieldCheck
                  size={21}
                  className="text-gray-500"
                />
              </div>

            </div>

          </div>

          {/* ================= CANCEL ACTION ================= */}

          {canCancel && (
            <div className="px-5 sm:px-7 py-5 bg-[#fafaf9] border-t border-gray-100">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <p className="font-semibold text-gray-800 text-sm">
                    Need to cancel this order?
                  </p>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Cancellation is available before the order is shipped.
                  </p>

                </div>

                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="inline-flex items-center justify-center gap-2 border border-red-200 bg-white text-red-600 px-6 py-3 rounded-xl text-sm font-medium hover:bg-red-50 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
                >
                  <XCircle size={17} />

                  {cancelling
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>

              </div>

            </div>
          )}

        </div>

        {/* ================= BOTTOM NAVIGATION ================= */}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">

          <Link
            to="/orders"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-800 px-5 py-3.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            <ArrowLeft size={17} />
            My Orders
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-[#1f1f1f] text-white px-5 py-3.5 rounded-xl text-sm font-medium hover:bg-black transition"
          >
            <ShoppingBag size={17} />
            Continue Shopping
            <ChevronRight size={16} />
          </Link>

        </div>

      </div>
    </div>
  );
}

export default OrderDetails;