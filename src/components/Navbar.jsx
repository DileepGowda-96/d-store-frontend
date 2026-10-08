import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  Package,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Search,
  ChevronDown,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMobileMenuOpen(false);

    navigate("/login");
  };

  // =========================
  // SEARCH
  // =========================
  const handleSearch = (event) => {
    event.preventDefault();

    const search = searchText.trim();

    if (!search) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(search)}`);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">

        {/* =====================================================
            TOP HEADER
        ====================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-[70px] flex items-center gap-4">

            {/* =========================
                MOBILE MENU
            ========================== */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>

            {/* =========================
                LOGO
            ========================== */}
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-shrink-0"
            >
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                D Store
              </div>

              <div className="hidden sm:block text-[10px] uppercase tracking-[0.25em] text-gray-400 font-medium">
                Shop Smart
              </div>
            </Link>

            {/* =========================
                SEARCH
            ========================== */}
            <form
              onSubmit={handleSearch}
              className="hidden sm:flex flex-1 max-w-2xl mx-auto"
            >
              <div className="relative w-full">

                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search products, brands and more"
                  className="w-full h-11 bg-gray-100 border border-transparent rounded-lg pl-4 pr-12 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:bg-white focus:border-gray-300 transition"
                />

                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-700 hover:text-black transition"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

              </div>
            </form>

            {/* =========================
                DESKTOP ACTIONS
            ========================== */}
            <div className="hidden lg:flex items-center gap-1">

              {/* LOGIN / PROFILE */}
              {token ? (
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center">
                    <User size={16} />
                  </div>

                  <div className="leading-tight text-left">
                    <p className="text-sm font-semibold text-gray-900 max-w-24 truncate">
                      {user?.name || "Customer"}
                    </p>

                    <p className="text-[10px] uppercase tracking-wide text-gray-400">
                      {user?.role || "CUSTOMER"}
                    </p>
                  </div>

                  <ChevronDown
                    size={15}
                    className="text-gray-400"
                  />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black transition"
                >
                  Login
                </Link>
              )}

              {/* WISHLIST */}
              {token && (
                <Link
                  to="/wishlist"
                  title="Wishlist"
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 hover:text-red-500 transition"
                >
                  <Heart size={20} />
                </Link>
              )}

              {/* ORDERS */}
              {token && (
                <Link
                  to="/orders"
                  title="Orders"
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  <Package size={20} />
                </Link>
              )}

              {/* CART */}
              {token && (
                <Link
                  to="/cart"
                  title="Shopping Cart"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-900 hover:bg-gray-100 transition"
                >
                  <ShoppingCart size={21} />

                  <span className="text-sm font-semibold">
                    Cart
                  </span>
                </Link>
              )}

              {/* LOGOUT */}
              {token && (
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                >
                  <LogOut size={20} />

                  <span className="text-sm font-semibold">
                    Logout
                  </span>
                </button>
              )}

            </div>

            {/* =========================
                MOBILE ACTIONS
            ========================== */}
            <div className="flex lg:hidden items-center gap-1 ml-auto">

              {/* MOBILE CART */}
              {token && (
                <Link
                  to="/cart"
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-800 hover:bg-gray-100"
                  aria-label="Cart"
                >
                  <ShoppingCart size={21} />
                </Link>
              )}

              {/* MOBILE PROFILE */}
              {token && (
                <Link
                  to="/profile"
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-800 hover:bg-gray-100"
                  aria-label="Profile"
                >
                  <User size={21} />
                </Link>
              )}

              {/* MOBILE LOGIN */}
              {!token && (
                <Link
                  to="/login"
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Login
                </Link>
              )}

            </div>

          </div>

          {/* =====================================================
              MOBILE SEARCH
          ====================================================== */}
          <form
            onSubmit={handleSearch}
            className="sm:hidden pb-3"
          >
            <div className="relative">

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search for products..."
                className="w-full h-11 bg-gray-100 border border-transparent rounded-lg pl-4 pr-12 text-sm text-gray-900 placeholder:text-gray-500 outline-none focus:bg-white focus:border-gray-300 transition"
              />

              <button
                type="submit"
                className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-gray-700"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

            </div>
          </form>

        </div>

        {/* =====================================================
            CATEGORY / NAVIGATION BAR
        ====================================================== */}
        <div className="hidden lg:block border-t border-gray-100">

          <div className="max-w-7xl mx-auto px-8">

            <div className="h-11 flex items-center justify-between">

              <Link
                to="/"
                className="text-sm font-medium text-gray-700 hover:text-black transition"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="text-sm font-medium text-gray-700 hover:text-black transition"
              >
                Shop
              </Link>

              <Link
                to="/products?category=Electronics"
                className="text-sm font-medium text-gray-700 hover:text-black transition"
              >
                Electronics
              </Link>

              <Link
                to="/products?category=Fashion"
                className="text-sm font-medium text-gray-700 hover:text-black transition"
              >
                Fashion
              </Link>

              <Link
                to="/products?category=Mobiles"
                className="text-sm font-medium text-gray-700 hover:text-black transition"
              >
                Mobiles
              </Link>

              <Link
                to="/products?category=Computers"
                className="text-sm font-medium text-gray-700 hover:text-black transition"
              >
                Computers
              </Link>

              <Link
                to="/products"
                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition"
              >
                New Arrivals
              </Link>

              <Link
                to="/products"
                className="text-sm font-semibold text-gray-900 hover:text-gray-600 transition"
              >
                Best Deals
              </Link>

              {/* ADMIN */}
              {token && user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:text-gray-500 transition"
                >
                  <LayoutDashboard size={17} />
                  Admin
                </Link>
              )}

            </div>

          </div>

        </div>

      </nav>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-[84%] max-w-sm h-full bg-white shadow-2xl overflow-y-auto">

            {/* Drawer Header */}
            <div className="px-5 py-6 border-b border-gray-200">

              {token ? (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >

                  <div className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center">
                    <User size={21} />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {user?.name || "Customer"}
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {user?.email || ""}
                    </p>
                  </div>

                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-semibold"
                >
                  <User size={18} />
                  Login
                </Link>
              )}

            </div>

            {/* Mobile Navigation */}
            <div className="py-2">

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-5 py-4 text-gray-800 font-medium hover:bg-gray-50"
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-5 py-4 text-gray-800 font-medium hover:bg-gray-50"
              >
                Shop All
              </Link>

              <Link
                to="/products?category=Electronics"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-5 py-4 text-gray-700 hover:bg-gray-50"
              >
                Electronics
              </Link>

              <Link
                to="/products?category=Fashion"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-5 py-4 text-gray-700 hover:bg-gray-50"
              >
                Fashion
              </Link>

              <Link
                to="/products?category=Mobiles"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-5 py-4 text-gray-700 hover:bg-gray-50"
              >
                Mobiles
              </Link>

              <Link
                to="/products?category=Computers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-5 py-4 text-gray-700 hover:bg-gray-50"
              >
                Computers
              </Link>

              <div className="border-t border-gray-200 my-2" />

              {/* USER LINKS */}
              {token && (
                <>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gray-50"
                  >
                    <Heart size={20} />
                    Wishlist
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gray-50"
                  >
                    <Package size={20} />
                    My Orders
                  </Link>

                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gray-50"
                  >
                    <ShoppingCart size={20} />
                    My Cart
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-5 py-4 text-gray-700 hover:bg-gray-50"
                  >
                    <User size={20} />
                    My Profile
                  </Link>
                </>
              )}

              {/* ADMIN */}
              {token && user?.role === "ADMIN" && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 text-gray-900 font-semibold bg-gray-50"
                >
                  <LayoutDashboard size={20} />
                  Admin Dashboard
                </Link>
              )}

              {/* LOGOUT */}
              {token && (
                <>
                  <div className="border-t border-gray-200 my-2" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-4 text-red-600 hover:bg-red-50 font-medium text-left"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              )}

            </div>

            {/* Drawer Footer */}
            <div className="border-t border-gray-200 mt-4 p-5">

              <p className="text-xs text-gray-400 uppercase tracking-widest">
                D Store
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Shop smart. Shop better.
              </p>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Navbar;