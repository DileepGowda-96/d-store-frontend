import { useEffect, useState } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  Package,
  RefreshCw,
  ChevronDown,
  ArrowUpDown,
  Tag,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH CATEGORIES
  // =========================

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // =========================
  // FILTER PRODUCTS
  // =========================

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "" ||
        String(product.categoryId) === String(selectedCategory);

      const matchesPrice =
        maxPrice === "" ||
        Number(product.price) <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice
      );
    })
    .sort((a, b) => {
      if (sortBy === "priceLow") {
        return Number(a.price) - Number(b.price);
      }

      if (sortBy === "priceHigh") {
        return Number(b.price) - Number(a.price);
      }

      if (sortBy === "nameAZ") {
        return (a.name || "").localeCompare(b.name || "");
      }

      if (sortBy === "nameZA") {
        return (b.name || "").localeCompare(a.name || "");
      }

      return 0;
    });

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setMaxPrice("");
    setSortBy("default");
  };

  const hasFilters =
    searchTerm !== "" ||
    selectedCategory !== "" ||
    maxPrice !== "";

  const selectedCategoryName =
    categories.find(
      (category) =>
        String(category.id) === String(selectedCategory)
    )?.name || "";

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

        <div className="text-center">

          <RefreshCw
            size={34}
            className="mx-auto text-gray-800 animate-spin"
          />

          <p className="text-gray-700 font-medium mt-4">
            Loading products...
          </p>

          <p className="text-sm text-gray-400 mt-1">
            Please wait a moment
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10 text-center max-w-md w-full">

          <div className="bg-gray-100 text-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Package size={30} />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            Unable to Load Products
          </h2>

          <p className="text-red-500 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchProducts}
            className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-black transition font-semibold"
          >
            <RefreshCw size={18} />
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =========================
  // FILTER CONTENT
  // =========================

  const FilterContent = () => (
    <div className="space-y-6">

      {/* Search */}
      <div>

        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Search
        </label>

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search products..."
            className="w-full border border-gray-200 bg-gray-50 rounded-lg pl-10 pr-10 py-3 text-sm text-gray-900 outline-none focus:bg-white focus:border-gray-400 transition"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
            >
              <X size={17} />
            </button>
          )}

        </div>

      </div>

      {/* Category */}
      <div>

        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Category
        </label>

        <select
          value={selectedCategory}
          onChange={(event) =>
            setSelectedCategory(event.target.value)
          }
          className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3.5 py-3 text-sm text-gray-800 outline-none focus:bg-white focus:border-gray-400 transition"
        >
          <option value="">
            All Categories
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

      {/* Maximum Price */}
      <div>

        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Maximum Price
        </label>

        <div className="relative">

          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
            ₹
          </span>

          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(event.target.value)
            }
            placeholder="Enter maximum price"
            className="w-full border border-gray-200 bg-gray-50 rounded-lg pl-8 pr-3.5 py-3 text-sm text-gray-800 outline-none focus:bg-white focus:border-gray-400 transition"
          />

        </div>

      </div>

      {/* Sort */}
      <div>

        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Sort By
        </label>

        <select
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value)
          }
          className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3.5 py-3 text-sm text-gray-800 outline-none focus:bg-white focus:border-gray-400 transition"
        >
          <option value="default">
            Recommended
          </option>

          <option value="priceLow">
            Price: Low to High
          </option>

          <option value="priceHigh">
            Price: High to Low
          </option>

          <option value="nameAZ">
            Name: A to Z
          </option>

          <option value="nameZA">
            Name: Z to A
          </option>

        </select>

      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold text-sm hover:bg-gray-100 transition"
        >
          <X size={17} />
          Clear All Filters
        </button>
      )}

    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <section className="bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

            <div>

              <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400">
                D Store Collection
              </p>

              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">
                Shop Products
              </h1>

              <p className="text-gray-500 mt-2">
                Discover products you'll love.
              </p>

            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">

              <Package size={18} />

              <span>
                <strong className="text-gray-900">
                  {products.length}
                </strong>{" "}
                {products.length === 1
                  ? "product"
                  : "products"}
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-10">

        {/* Mobile Filter Button */}
        <div className="lg:hidden flex gap-3 mb-6">

          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg py-3 font-semibold text-sm text-gray-800"
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>

          <div className="flex-1 relative">

            <ArrowUpDown
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-10 pr-8 py-3 text-sm font-semibold text-gray-800 outline-none"
            >
              <option value="default">
                Recommended
              </option>

              <option value="priceLow">
                Price: Low to High
              </option>

              <option value="priceHigh">
                Price: High to Low
              </option>

              <option value="nameAZ">
                Name: A-Z
              </option>
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            />

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr] gap-7">

          {/* =================================================
              DESKTOP SIDEBAR
          ================================================== */}
          <aside className="hidden lg:block">

            <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-28">

              <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-2">

                  <SlidersHorizontal size={18} />

                  <h2 className="font-bold text-gray-900">
                    Filters
                  </h2>

                </div>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-semibold text-gray-500 hover:text-gray-900"
                  >
                    Clear
                  </button>
                )}

              </div>

              <FilterContent />

            </div>

          </aside>

          {/* =================================================
              PRODUCT AREA
          ================================================== */}
          <section>

            {/* Result toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

              <div>

                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-bold text-gray-900">
                    {filteredProducts.length}
                  </span>{" "}
                  {filteredProducts.length === 1
                    ? "product"
                    : "products"}
                </p>

                {selectedCategoryName && (
                  <p className="text-xs text-gray-400 mt-1">
                    Category:{" "}
                    <span className="text-gray-700 font-medium">
                      {selectedCategoryName}
                    </span>
                  </p>
                )}

              </div>

              {/* Desktop sort */}
              <div className="hidden sm:flex items-center gap-2">

                <span className="text-sm text-gray-500">
                  Sort:
                </span>

                <div className="relative">

                  <ArrowUpDown
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />

                  <select
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(event.target.value)
                    }
                    className="appearance-none bg-white border border-gray-200 rounded-lg pl-9 pr-9 py-2.5 text-sm font-medium text-gray-800 outline-none hover:border-gray-400 transition"
                  >
                    <option value="default">
                      Recommended
                    </option>

                    <option value="priceLow">
                      Price: Low to High
                    </option>

                    <option value="priceHigh">
                      Price: High to Low
                    </option>

                    <option value="nameAZ">
                      Name: A to Z
                    </option>

                    <option value="nameZA">
                      Name: Z to A
                    </option>

                  </select>

                  <ChevronDown
                    size={15}
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
                  />

                </div>

              </div>

            </div>

            {/* Active filters */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-5">

                <span className="text-xs text-gray-400 mr-1">
                  Filters:
                </span>

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 hover:border-gray-400"
                  >
                    Search: {searchTerm}
                    <X size={13} />
                  </button>
                )}

                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("")}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 hover:border-gray-400"
                  >
                    {selectedCategoryName}
                    <X size={13} />
                  </button>
                )}

                {maxPrice && (
                  <button
                    type="button"
                    onClick={() => setMaxPrice("")}
                    className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 hover:border-gray-400"
                  >
                    Under ₹
                    {Number(maxPrice).toLocaleString("en-IN")}
                    <X size={13} />
                  </button>
                )}

              </div>
            )}

            {/* Product grid */}
            {filteredProducts.length === 0 ? (

              <div className="bg-white border border-gray-200 rounded-2xl p-12 md:p-16 text-center">

                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                  <Search size={28} className="text-gray-500" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mt-5">
                  No products found
                </h2>

                <p className="text-gray-500 mt-2 max-w-md mx-auto text-sm leading-relaxed">
                  We couldn't find products matching your
                  current filters. Try changing your search
                  or price range.
                </p>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition"
                  >
                    <X size={17} />
                    Clear Filters
                  </button>
                )}

              </div>

            ) : (

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">

                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}

              </div>

            )}

          </section>

        </div>

      </main>

      {/* =====================================================
          MOBILE FILTER DRAWER
      ====================================================== */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white shadow-2xl overflow-y-auto">

            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between z-10">

              <div className="flex items-center gap-2">

                <SlidersHorizontal size={19} />

                <h2 className="font-bold text-gray-900">
                  Filters
                </h2>

              </div>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <X size={19} />
              </button>

            </div>

            <div className="p-5">

              <FilterContent />

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-7 bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-black transition"
              >
                View {filteredProducts.length} Products
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Products;