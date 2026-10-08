import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Package,
  RefreshCw,
  Search,
  Image as ImageIcon,
  Boxes,
} from "lucide-react";

import api from "../../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    imageUrl: "",
    categoryId: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // =========================
  // FORM HANDLING
  // =========================
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      stockQuantity: "",
      imageUrl: "",
      categoryId: "",
    });

    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      stockQuantity: product.stockQuantity || "",
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId || "",
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // =========================
  // SAVE PRODUCT
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        imageUrl: formData.imageUrl,
        categoryId: Number(formData.categoryId),
      };

      if (editingProduct) {
        await api.put(
          `/products/${editingProduct.id}`,
          productData
        );

        alert("Product updated successfully.");
      } else {
        await api.post("/products", productData);

        alert("Product added successfully.");
      }

      closeForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save product."
      );
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);

      alert("Product deleted successfully.");

      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // =========================
  // FILTER PRODUCTS
  // =========================
  const filteredProducts = products.filter((product) => {
    const search = searchText.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      product.name?.toLowerCase().includes(search) ||
      product.description?.toLowerCase().includes(search) ||
      product.categoryName?.toLowerCase().includes(search) ||
      product.category?.name?.toLowerCase().includes(search)
    );
  });

  // =========================
  // STOCK HELPERS
  // =========================
  const getStockLabel = (quantity) => {
    if (quantity === 0) {
      return "Out of stock";
    }

    if (quantity <= 5) {
      return "Low stock";
    }

    return "In stock";
  };

  const getStockClass = (quantity) => {
    if (quantity === 0) {
      return "bg-red-50 text-red-700";
    }

    if (quantity <= 5) {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-green-50 text-green-700";
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-6">

        <div className="text-center">

          <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center mx-auto">
            <RefreshCw
              size={25}
              className="animate-spin"
            />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-gray-900">
            Loading products
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Preparing your product inventory...
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // PAGE
  // =========================
  return (
    <div className="min-h-screen bg-[#f7f7f5]">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-9">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">
              <Package size={15} />
              D Store Admin
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
              Products
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Add, edit and manage your store inventory.
            </p>

          </div>

          <button
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-black transition"
          >
            <Plus size={18} />
            Add Product
          </button>

        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between gap-4">

            <p className="text-sm">
              {error}
            </p>

            <button
              onClick={fetchProducts}
              className="text-sm font-semibold underline"
            >
              Retry
            </button>

          </div>
        )}

        {/* =====================================================
            SUMMARY + SEARCH
        ====================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 mb-6">

          {/* Product Count */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                  Total Products
                </p>

                <p className="text-3xl font-black text-gray-900 mt-2">
                  {products.length}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                <Boxes size={21} />
              </div>

            </div>

          </div>

          {/* Search */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">

            <div className="relative">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search products, descriptions or categories..."
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-gray-400 transition"
              />

            </div>

          </div>

        </div>

        {/* =====================================================
            PRODUCT TABLE
        ====================================================== */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          <div className="px-5 md:px-6 py-5 border-b border-gray-200 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Product Inventory
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""} displayed
              </p>

            </div>

            <button
              onClick={fetchProducts}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
              title="Refresh products"
            >
              <RefreshCw size={17} />
            </button>

          </div>

          {filteredProducts.length === 0 ? (

            <div className="p-12 text-center">

              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <Package
                  size={25}
                  className="text-gray-400"
                />
              </div>

              <h3 className="font-semibold text-gray-900 mt-4">
                No products found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Try another search or add a new product.
              </p>

              <button
                onClick={openAddForm}
                className="mt-5 inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition"
              >
                <Plus size={17} />
                Add Product
              </button>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr className="bg-gray-50 border-b border-gray-200">

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">
                      Product
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">
                      Price
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">
                      Stock
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">
                      Category
                    </th>

                    <th className="text-center px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredProducts.map((product) => (

                    <tr
                      key={product.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                    >

                      {/* PRODUCT */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-4">

                          <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">

                            {product.imageUrl ? (

                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";
                                }}
                              />

                            ) : (

                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon size={21} />
                              </div>

                            )}

                          </div>

                          <div className="min-w-0">

                            <p className="font-bold text-gray-900 truncate max-w-[280px]">
                              {product.name}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              Product ID: #{product.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PRICE */}
                      <td className="px-6 py-4">

                        <span className="font-bold text-gray-900">
                          ₹
                          {Number(product.price || 0).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </td>

                      {/* STOCK */}
                      <td className="px-6 py-4">

                        <div className="flex flex-col items-start gap-1">

                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${getStockClass(
                              product.stockQuantity
                            )}`}
                          >
                            {getStockLabel(
                              product.stockQuantity
                            )}
                          </span>

                          <span className="text-xs text-gray-500">
                            {product.stockQuantity} units
                          </span>

                        </div>

                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-4">

                        <span className="text-sm text-gray-600">
                          {product.categoryName ||
                            product.category?.name ||
                            "N/A"}
                        </span>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              openEditForm(product)
                            }
                            title="Edit Product"
                            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(product.id)
                            }
                            title="Delete Product"
                            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}
      {showForm && (

        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-6">

          <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden">

            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  D Store Admin
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-1">
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h2>

              </div>

              <button
                type="button"
                onClick={closeForm}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 overflow-y-auto max-h-[calc(92vh-82px)]"
            >

              {/* PRODUCT NAME */}
              <div>

                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                  className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm text-gray-900 bg-gray-50 outline-none focus:bg-white focus:border-gray-400 transition"
                />

              </div>

              {/* DESCRIPTION */}
              <div>

                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="4"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-gray-50 outline-none focus:bg-white focus:border-gray-400 transition resize-none"
                />

              </div>

              {/* PRICE + STOCK */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Price
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      required
                      className="w-full h-12 border border-gray-200 rounded-xl pl-9 pr-4 text-sm text-gray-900 bg-gray-50 outline-none focus:bg-white focus:border-gray-400 transition"
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="Enter stock quantity"
                    min="0"
                    required
                    className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm text-gray-900 bg-gray-50 outline-none focus:bg-white focus:border-gray-400 transition"
                  />

                </div>

              </div>

              {/* CATEGORY */}
              <div>

                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Category
                </label>

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm text-gray-900 bg-gray-50 outline-none focus:bg-white focus:border-gray-400 transition"
                >

                  <option value="">
                    Select Category
                  </option>

                  {categories.map((category) => (

                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>

                  ))}

                </select>

              </div>

              {/* IMAGE URL */}
              <div>

                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Image URL
                </label>

                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/product.jpg"
                  required
                  className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm text-gray-900 bg-gray-50 outline-none focus:bg-white focus:border-gray-400 transition"
                />

              </div>

              {/* IMAGE PREVIEW */}
              {formData.imageUrl && (

                <div className="border border-gray-200 rounded-xl p-4">

                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Image Preview
                  </p>

                  <div className="w-full h-44 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">

                    <img
                      src={formData.imageUrl}
                      alt="Product preview"
                      className="w-full h-full object-contain"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                  </div>

                </div>

              )}

              {/* BUTTONS */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-5 border-t border-gray-200">

                <button
                  type="button"
                  onClick={closeForm}
                  className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition"
                >
                  {editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminProducts;