import { useEffect, useRef, useState } from "react";
import {
  Users,
  Package,
  ShoppingCart,
  IndianRupee,
  LayoutDashboard,
  Boxes,
  Tags,
  ClipboardList,
  ArrowRight,
  RefreshCw,
  TrendingUp,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Download,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Bulk CSV upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // =========================
  // FETCH DASHBOARD DATA
  // =========================
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        productsResponse,
        categoriesResponse,
        ordersResponse,
        usersResponse,
      ] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/admin/orders"),
        api.get("/admin/users"),
      ]);

      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.data || []);
      setOrders(ordersResponse.data || []);
      setUsers(usersResponse.data || []);
    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CSV FILE SELECTION
  // =========================
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setUploadResult(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setSelectedFile(null);

      setUploadResult({
        success: false,
        message: "Please select a CSV file.",
        errors: [],
      });

      event.target.value = "";
      return;
    }

    if (file.size === 0) {
      setSelectedFile(null);

      setUploadResult({
        success: false,
        message: "The selected CSV file is empty.",
        errors: [],
      });

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);

      setUploadResult({
        success: false,
        message: "The CSV file must not exceed 5 MB.",
        errors: [],
      });

      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // =========================
  // DOWNLOAD CSV TEMPLATE
  // =========================
  const downloadCsvTemplate = () => {
    const csvContent = [
      "name,description,price,stockQuantity,imageUrl,categoryId",
      'Sample Smartphone,Smartphone description,15999.00,10,https://example.com/phone.jpg,1',
      'Sample Mouse,Wireless mouse description,599.00,20,https://example.com/mouse.jpg,4',
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "d-store-products-template.csv";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  // =========================
  // BULK PRODUCT UPLOAD
  // =========================
  const handleBulkUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadResult({
        success: false,
        message: "Please select a CSV file before uploading.",
        errors: [],
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      setUploadResult(null);

      const response = await api.post(
        "/products/bulk-upload",
        formData
      );

      const result = response.data;

      setUploadResult(result);

      if (result.success) {
        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        await fetchDashboardData();
      }
    } catch (err) {
      console.error("Bulk upload error:", err);

      const responseData = err.response?.data;

      setUploadResult({
        success: false,
        message:
          responseData?.message ||
          (err.response?.status === 401
            ? "Your session has expired. Please log in again."
            : err.response?.status === 403
            ? "Administrator permission is required to upload products."
            : "Upload failed. Please check your connection and try again."),
        errors: responseData?.errors || [],
      });
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // STATISTICS
  // =========================
  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.totalAmount || 0),
    0
  );

  const placedOrders = orders.filter(
    (order) => order.status === "PLACED"
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "CONFIRMED"
  ).length;

  const shippedOrders = orders.filter(
    (order) => order.status === "SHIPPED"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  const cancelledOrders = orders.filter(
    (order) => order.status === "CANCELLED"
  ).length;

  const activeOrders = orders.filter(
    (order) =>
      order.status !== "DELIVERED" &&
      order.status !== "CANCELLED"
  ).length;

  // =========================
  // MAIN STAT CARDS
  // =========================
  const statCards = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      label: "Registered customers",
    },
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      label: "Products in store",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      label: "Orders received",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      label: "Gross order value",
    },
  ];

  // =========================
  // MANAGEMENT CARDS
  // =========================
  const managementCards = [
    {
      title: "Products",
      description: "Add, edit and manage store products.",
      icon: Boxes,
      path: "/admin/products",
    },
    {
      title: "Categories",
      description: "Organize products into categories.",
      icon: Tags,
      path: "/admin/categories",
    },
    {
      title: "Orders",
      description: "Review and update customer orders.",
      icon: ClipboardList,
      path: "/admin/orders",
    },
  ];

  // =========================
  // ORDER STATUS
  // =========================
  const statusCards = [
    {
      title: "Placed",
      value: placedOrders,
      icon: Clock3,
    },
    {
      title: "Confirmed",
      value: confirmedOrders,
      icon: CheckCircle2,
    },
    {
      title: "Shipped",
      value: shippedOrders,
      icon: Truck,
    },
    {
      title: "Delivered",
      value: deliveredOrders,
      icon: CheckCircle2,
    },
    {
      title: "Cancelled",
      value: cancelledOrders,
      icon: XCircle,
    },
  ];

  // =========================
  // STATUS STYLE
  // =========================
  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "bg-gray-100 text-gray-700";

      case "CONFIRMED":
        return "bg-amber-50 text-amber-700";

      case "SHIPPED":
        return "bg-slate-100 text-slate-700";

      case "DELIVERED":
        return "bg-green-50 text-green-700";

      case "CANCELLED":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center mx-auto">
            <RefreshCw size={25} className="animate-spin" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            Loading dashboard
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Preparing your store overview...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-md shadow-sm">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <LayoutDashboard size={25} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            Dashboard Error
          </h2>

          <p className="text-sm text-red-600 mt-2">{error}</p>

          <button
            onClick={fetchDashboardData}
            className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-black transition"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================
  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-9">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">
              <LayoutDashboard size={15} />
              D Store Admin
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
              Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Monitor your store performance and manage daily operations.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="self-start sm:self-auto inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-800 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition shadow-sm"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* MANAGEMENT SHORTCUTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {managementCards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.path}
                onClick={() => navigate(card.path)}
                className="group bg-white border border-gray-200 rounded-2xl p-5 text-left hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition">
                      <Icon size={21} />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        {card.title}
                      </h2>

                      <p className="text-xs text-gray-500 mt-1">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* BULK CSV UPLOAD */}
        <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-7 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 shrink-0 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <FileSpreadsheet size={24} />
              </div>

              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Bulk Product Upload
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Import multiple products into your store using a CSV file.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={downloadCsvTemplate}
              className="inline-flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <Download size={16} />
              Download CSV Template
            </button>
          </div>

          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 md:p-7">
            <form onSubmit={handleBulkUpload}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
                id="bulk-product-csv"
              />

              <label
                htmlFor="bulk-product-csv"
                className="flex flex-col items-center justify-center text-center cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 mb-3">
                  <Upload size={22} />
                </div>

                <span className="text-sm font-bold text-gray-900">
                  Choose a CSV file
                </span>

                <span className="text-xs text-gray-500 mt-1">
                  Click to browse · Maximum file size: 5 MB
                </span>
              </label>

              {selectedFile && (
                <div className="mt-5 max-w-xl mx-auto flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileSpreadsheet
                      size={22}
                      className="text-emerald-600 shrink-0"
                    />

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {selectedFile.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setUploadResult(null);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 transition"
                    aria-label="Remove selected file"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              <div className="flex justify-center mt-5">
                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 transition"
                >
                  {uploading ? (
                    <>
                      <RefreshCw size={17} className="animate-spin" />
                      Uploading Products...
                    </>
                  ) : (
                    <>
                      <Upload size={17} />
                      Upload Products
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* UPLOAD RESULT */}
          {uploadResult && (
            <div
              className={`mt-5 rounded-xl border p-4 ${
                uploadResult.success
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {uploadResult.success ? (
                  <CheckCircle
                    size={21}
                    className="text-emerald-600 shrink-0 mt-0.5"
                  />
                ) : (
                  <AlertCircle
                    size={21}
                    className="text-red-600 shrink-0 mt-0.5"
                  />
                )}

                <div className="min-w-0">
                  <h3
                    className={`text-sm font-bold ${
                      uploadResult.success
                        ? "text-emerald-800"
                        : "text-red-800"
                    }`}
                  >
                    {uploadResult.success
                      ? "Upload Successful"
                      : "Upload Failed"}
                  </h3>

                  <p
                    className={`text-sm mt-1 break-words ${
                      uploadResult.success
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    {uploadResult.message}
                  </p>

                  {uploadResult.success && (
                    <p className="text-sm font-semibold text-emerald-800 mt-2">
                      Products uploaded: {uploadResult.uploadedCount ?? 0}
                    </p>
                  )}

                  {Array.isArray(uploadResult.errors) &&
                    uploadResult.errors.length > 0 && (
                      <ul className="mt-3 space-y-1 list-disc pl-5">
                        {uploadResult.errors.map((item, index) => (
                          <li
                            key={`${index}-${item}`}
                            className="text-sm text-red-700 break-words"
                          >
                            {typeof item === "string"
                              ? item
                              : JSON.stringify(item)}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-5">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Required CSV columns
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "name",
                "description",
                "price",
                "stockQuantity",
                "imageUrl",
                "categoryId",
              ].map((column) => (
                <span
                  key={column}
                  className="rounded-md bg-gray-100 border border-gray-200 px-2.5 py-1 text-xs font-mono text-gray-600"
                >
                  {column}
                </span>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Use existing category IDs. The backend validates the CSV before
              saving the products.
            </p>
          </div>
        </section>

        {/* MAIN STATISTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                      {card.title}
                    </p>

                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
                      {card.value}
                    </h2>

                    <p className="text-xs text-gray-500 mt-2">
                      {card.label}
                    </p>
                  </div>

                  <div className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* QUICK OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Categories */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                  Categories
                </p>

                <p className="text-3xl font-black text-gray-900 mt-2">
                  {categories.length}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Product categories
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
                <Tags size={21} />
              </div>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                  Active Orders
                </p>

                <p className="text-3xl font-black text-gray-900 mt-2">
                  {activeOrders}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Orders in progress
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
                <ShoppingCart size={21} />
              </div>
            </div>
          </div>

          {/* Delivered */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                  Delivered
                </p>

                <p className="text-3xl font-black text-gray-900 mt-2">
                  {deliveredOrders}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Successfully completed
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
                <TrendingUp size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* ORDER STATUS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Order Status
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Current distribution of customer orders.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statusCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-500">
                      {card.title}
                    </p>

                    <Icon size={17} className="text-gray-400" />
                  </div>

                  <p className="text-2xl font-black text-gray-900 mt-3">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 md:px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Recent Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest customer orders received by D Store.
              </p>
            </div>

            <button
              onClick={() => navigate("/admin/orders")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-gray-500 transition"
            >
              View All
              <ArrowRight size={17} />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <ShoppingCart size={24} className="text-gray-400" />
              </div>

              <p className="text-gray-500 text-sm mt-4">
                No orders found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">
                      Order ID
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">
                      Customer
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">
                      Total
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">
                          #{order.id}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {order.userName || order.user?.name || "Customer"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">
                          ₹
                          {Number(
                            order.totalAmount || 0
                          ).toLocaleString("en-IN")}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;