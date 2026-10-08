import { Link } from "react-router-dom";
import {
  User,
  Mail,
  ShieldCheck,
  Package,
  Heart,
  ShoppingCart,
  ArrowRight,
  CheckCircle2,
  Store,
} from "lucide-react";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="min-h-screen bg-[#f7f7f5] py-8 sm:py-10 lg:py-12">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center">
              <User
                size={19}
                className="text-gray-800"
              />
            </div>

            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
              Account
            </span>

          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#181818]">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Manage your account information and D Store activity.
          </p>

        </div>

        {/* ================= PROFILE CARD ================= */}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          {/* Premium Banner */}

          <div className="relative h-32 sm:h-40 bg-[#202020] overflow-hidden">

            <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full border border-white/10" />

            <div className="absolute -bottom-24 -left-12 w-52 h-52 rounded-full border border-white/10" />

            <div className="absolute inset-0 flex items-center justify-end px-6 sm:px-10">

              <div className="text-right">

                <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gray-500 font-semibold">
                  D Store
                </p>

                <p className="text-white/80 text-sm mt-1">
                  Your account
                </p>

              </div>

            </div>

          </div>

          {/* Profile Information */}

          <div className="px-5 sm:px-7 lg:px-8 pb-8">

            {/* Avatar */}

            <div className="-mt-12 sm:-mt-14 mb-5 relative">

              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-2 border border-gray-200 shadow-lg">

                <div className="w-full h-full rounded-full bg-[#f1f1ef] text-gray-700 flex items-center justify-center">

                  <User
                    size={40}
                    strokeWidth={1.5}
                  />

                </div>

              </div>

            </div>

            {/* Name & Role */}

            <div className="mb-8">

              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                {user?.name || "Customer"}
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-3">

                <span className="inline-flex items-center gap-1.5 bg-[#f3f3f1] border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                  <ShieldCheck size={14} />
                  {user?.role || "CUSTOMER"}
                </span>

                <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                  <CheckCircle2 size={14} />
                  Active Account
                </span>

              </div>

            </div>

            {/* ================= ACCOUNT INFORMATION ================= */}

            <div>

              <div className="flex items-end justify-between mb-4">

                <div>

                  <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold">
                    Personal Details
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-1">
                    Account Information
                  </h3>

                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Full Name */}

                <div className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition">

                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-xl bg-[#f3f3f1] text-gray-700 flex items-center justify-center flex-shrink-0">
                      <User size={20} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                        Full Name
                      </p>

                      <p className="font-semibold text-gray-900 mt-1 truncate">
                        {user?.name || "Not available"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Email */}

                <div className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition">

                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-xl bg-[#f3f3f1] text-gray-700 flex items-center justify-center flex-shrink-0">
                      <Mail size={20} />
                    </div>

                    <div className="min-w-0">

                      <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                        Email Address
                      </p>

                      <p className="font-semibold text-gray-900 mt-1 break-all">
                        {user?.email || "Not available"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Account Type */}

                <div className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition">

                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-xl bg-[#f3f3f1] text-gray-700 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={20} />
                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                        Account Type
                      </p>

                      <p className="font-semibold text-gray-900 mt-1">
                        {user?.role || "CUSTOMER"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Account Status */}

                <div className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition">

                  <div className="flex items-center gap-4">

                    <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 size={20} />
                    </div>

                    <div>

                      <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                        Account Status
                      </p>

                      <p className="font-semibold text-green-600 mt-1">
                        Active
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================= QUICK ACCESS ================= */}

        <div className="mt-8">

          <div className="mb-4">

            <p className="text-xs uppercase tracking-[0.15em] text-gray-400 font-semibold">
              Store Activity
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-1">
              Quick Access
            </h3>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Orders */}

            <Link
              to="/orders"
              className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
            >

              <div className="flex items-center justify-between">

                <div className="w-11 h-11 rounded-xl bg-[#f3f3f1] text-gray-700 flex items-center justify-center">
                  <Package size={21} />
                </div>

                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#1f1f1f] group-hover:border-[#1f1f1f] transition">

                  <ArrowRight
                    size={16}
                    className="text-gray-400 group-hover:text-white transition"
                  />

                </div>

              </div>

              <h4 className="font-semibold text-gray-900 mt-5">
                My Orders
              </h4>

              <p className="text-sm text-gray-500 mt-1">
                View and track your orders
              </p>

            </Link>

            {/* Wishlist */}

            <Link
              to="/wishlist"
              className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
            >

              <div className="flex items-center justify-between">

                <div className="w-11 h-11 rounded-xl bg-[#f3f3f1] text-gray-700 flex items-center justify-center">
                  <Heart size={21} />
                </div>

                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#1f1f1f] group-hover:border-[#1f1f1f] transition">

                  <ArrowRight
                    size={16}
                    className="text-gray-400 group-hover:text-white transition"
                  />

                </div>

              </div>

              <h4 className="font-semibold text-gray-900 mt-5">
                Wishlist
              </h4>

              <p className="text-sm text-gray-500 mt-1">
                View your saved products
              </p>

            </Link>

            {/* Cart */}

            <Link
              to="/cart"
              className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
            >

              <div className="flex items-center justify-between">

                <div className="w-11 h-11 rounded-xl bg-[#f3f3f1] text-gray-700 flex items-center justify-center">
                  <ShoppingCart size={21} />
                </div>

                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#1f1f1f] group-hover:border-[#1f1f1f] transition">

                  <ArrowRight
                    size={16}
                    className="text-gray-400 group-hover:text-white transition"
                  />

                </div>

              </div>

              <h4 className="font-semibold text-gray-900 mt-5">
                Shopping Cart
              </h4>

              <p className="text-sm text-gray-500 mt-1">
                Review your cart items
              </p>

            </Link>

          </div>

        </div>

        {/* ================= ACCOUNT FOOTER ================= */}

        <div className="mt-6 bg-[#202020] rounded-2xl px-6 sm:px-8 py-7 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center">
              <Store size={20} />
            </div>

            <div>

              <p className="font-semibold">
                Welcome to D Store
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Everything you need, in one place.
              </p>

            </div>

          </div>

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-gray-100 transition"
          >
            Explore Store
            <ArrowRight size={16} />
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Profile;