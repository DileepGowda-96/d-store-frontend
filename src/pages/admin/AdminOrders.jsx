import { useEffect, useMemo, useState } from "react";
import {
  Package,
  RefreshCw,
  ShoppingCart,
  Search,
  X,
  ChevronDown,
  CheckCircle2,
  Clock3,
  Truck,
  Ban,
} from "lucide-react";
import api from "../../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/orders");
      setOrders(response.data || []);
    } catch (err) {
      console.error("Error fetching admin orders:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      setError("");

      const response = await api.put(
        `/orders/${orderId}/status?status=${newStatus}`
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: response.data.status,
              }
            : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getNextStatuses = (currentStatus) => {
    switch (currentStatus) {
      case "PLACED":
        return ["CONFIRMED"];

      case "CONFIRMED":
        return ["SHIPPED"];

      case "SHIPPED":
        return ["DELIVERED"];

      case "DELIVERED":
      case "CANCELLED":
      default:
        return [];
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "CONFIRMED":
        return "bg-sky-50 text-sky-700 border-sky-200";

      case "SHIPPED":
        return "bg-violet-50 text-violet-700 border-violet-200";

      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PLACED":
        return <Clock3 size={14} />;

      case "CONFIRMED":
        return <CheckCircle2 size={14} />;

      case "SHIPPED":
        return <Truck size={14} />;

      case "DELIVERED":
        return <CheckCircle2 size={14} />;

      case "CANCELLED":
        return <Ban size={14} />;

      default:
        return <Package size={14} />;
    }
  };

  const activeOrders = orders.filter(
    (order) =>
      order.status !== "DELIVERED" &&
      order.status !== "CANCELLED"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED"
  ).length;

  const placedOrders = orders.filter(
    (order) => order.status === "PLACED"
  ).length;

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.totalAmount || 0),
    0
  );

  const filteredOrders = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return orders.filter((order) => {
      const customerName = (
        order.user?.name ||
        order.userName ||
        "Customer"
      ).toLowerCase();

      const orderId = String(order.id || "").toLowerCase();

      const matchesSearch =
        !search ||
        orderId.includes(search) ||
        customerName.includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const formatDate = (order) => {
    const dateValue = order.createdAt || order.orderDate;

    if (!dateValue) {
      return "-";
    }

    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-sm text-gray-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-2">
              D Store Admin
            </p>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-950">
              Order Management
            </h1>

            <p className="text-gray-500 mt-2 max-w-xl">
              Monitor customer orders and manage their fulfillment status.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-950 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition"
          >
            <RefreshCw size={17} />
            Refresh Orders
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <p className="text-sm">{error}</p>

            <button
              onClick={() => setError("")}
              className="text-red-500 hover:text-red-700"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">

          {/* Total */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Total Orders
                </p>

                <p className="text-3xl font-semibold text-gray-950 mt-2">
                  {orders.length}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-800">
                <ShoppingCart size={20} />
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Active
                </p>

                <p className="text-3xl font-semibold text-gray-950 mt-2">
                  {activeOrders}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <Clock3 size={20} />
              </div>
            </div>
          </div>

          {/* Delivered */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Delivered
                </p>

                <p className="text-3xl font-semibold text-gray-950 mt-2">
                  {deliveredOrders}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

          {/* Cancelled */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Cancelled
                </p>

                <p className="text-3xl font-semibold text-gray-950 mt-2">
                  {cancelledOrders}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-700">
                <Ban size={20} />
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gray-950 text-white rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  Revenue
                </p>

                <p className="text-2xl font-semibold mt-2">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white font-semibold">
                ₹
              </div>
            </div>
          </div>
        </div>

        {/* Main Orders Card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {/* Toolbar */}
          <div className="p-5 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

              <div>
                <h2 className="text-xl font-semibold text-gray-950">
                  All Orders
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredOrders.length} of {orders.length} orders
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">

                {/* Search */}
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Search order or customer..."
                    value={searchTerm}
                    onChange={(event) =>
                      setSearchTerm(event.target.value)
                    }
                    className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value)
                    }
                    className="appearance-none w-full sm:w-44 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
                  >
                    <option value="ALL">All Status</option>
                    <option value="PLACED">Placed</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* No Orders */}
          {orders.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                <Package size={28} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                No orders found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Customer orders will appear here.
              </p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                <Search size={26} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                No matching orders
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Try changing your search or status filter.
              </p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("ALL");
                }}
                className="mt-5 px-4 py-2 bg-gray-950 text-white rounded-lg text-sm hover:bg-gray-800 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Order
                      </th>

                      <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Customer
                      </th>

                      <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Date
                      </th>

                      <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Total
                      </th>

                      <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Status
                      </th>

                      <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredOrders.map((order) => {
                      const nextStatuses = getNextStatuses(order.status);
                      const isUpdating =
                        updatingOrderId === order.id;

                      return (
                        <tr
                          key={order.id}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition"
                        >
                          {/* Order */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
                                <Package size={18} />
                              </div>

                              <div>
                                <p className="font-semibold text-gray-900">
                                  #{order.id}
                                </p>

                                <p className="text-xs text-gray-400 mt-0.5">
                                  Order
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Customer */}
                          <td className="px-6 py-5">
                            <p className="font-medium text-gray-800">
                              {order.user?.name ||
                                order.userName ||
                                "Customer"}
                            </p>

                            {order.user?.email && (
                              <p className="text-xs text-gray-400 mt-1">
                                {order.user.email}
                              </p>
                            )}
                          </td>

                          {/* Date */}
                          <td className="px-6 py-5 text-sm text-gray-600">
                            {formatDate(order)}
                          </td>

                          {/* Total */}
                          <td className="px-6 py-5">
                            <p className="font-semibold text-gray-900">
                              ₹
                              {Number(
                                order.totalAmount || 0
                              ).toLocaleString("en-IN")}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusClass(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="px-6 py-5">
                            {nextStatuses.length > 0 ? (
                              <select
                                defaultValue=""
                                disabled={isUpdating}
                                onChange={(event) => {
                                  const newStatus =
                                    event.target.value;

                                  if (!newStatus) return;

                                  updateOrderStatus(
                                    order.id,
                                    newStatus
                                  );

                                  event.target.value = "";
                                }}
                                className="border border-gray-200 bg-white rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 disabled:opacity-50"
                              >
                                <option value="">
                                  {isUpdating
                                    ? "Updating..."
                                    : "Change Status"}
                                </option>

                                {nextStatuses.map((status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-xs text-gray-400">
                                No changes
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet Cards */}
              <div className="lg:hidden divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const nextStatuses = getNextStatuses(order.status);
                  const isUpdating =
                    updatingOrderId === order.id;

                  return (
                    <div
                      key={order.id}
                      className="p-5 sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
                            <Package size={19} />
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              #{order.id}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(order)}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[11px] font-semibold ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-5">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-gray-400">
                            Customer
                          </p>

                          <p className="text-sm font-medium text-gray-800 mt-1">
                            {order.user?.name ||
                              order.userName ||
                              "Customer"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-gray-400">
                            Total
                          </p>

                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            ₹
                            {Number(
                              order.totalAmount || 0
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {nextStatuses.length > 0 && (
                        <div className="mt-5">
                          <p className="text-xs font-medium text-gray-500 mb-2">
                            Update order status
                          </p>

                          <select
                            defaultValue=""
                            disabled={isUpdating}
                            onChange={(event) => {
                              const newStatus =
                                event.target.value;

                              if (!newStatus) return;

                              updateOrderStatus(
                                order.id,
                                newStatus
                              );

                              event.target.value = "";
                            }}
                            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 disabled:opacity-50"
                          >
                            <option value="">
                              {isUpdating
                                ? "Updating..."
                                : "Select next status"}
                            </option>

                            {nextStatuses.map((status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                Move to {status}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Status Flow */}
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                Order Workflow
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Orders progress through the following fulfillment stages.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="px-3 py-1.5 rounded-full bg-amber-50 text-amber-700">
                PLACED
              </span>

              <span className="text-gray-300">→</span>

              <span className="px-3 py-1.5 rounded-full bg-sky-50 text-sky-700">
                CONFIRMED
              </span>

              <span className="text-gray-300">→</span>

              <span className="px-3 py-1.5 rounded-full bg-violet-50 text-violet-700">
                SHIPPED
              </span>

              <span className="text-gray-300">→</span>

              <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
                DELIVERED
              </span>
            </div>
          </div>
        </div>

        {/* Small summary */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full">
            {placedOrders} awaiting confirmation
          </span>

          <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full">
            {activeOrders} active orders
          </span>

          <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-full">
            {cancelledOrders} cancelled
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;