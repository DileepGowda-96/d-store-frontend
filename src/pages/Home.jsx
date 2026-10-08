import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Star,
  ArrowRight,
  Package,
  Heart,
  Sparkles,
  Tag,
  Headphones,
  RotateCcw,
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

          <div className="relative overflow-hidden rounded-3xl bg-gray-950 text-white">

            {/* Decorative elements */}
            <div className="absolute -top-32 -right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-yellow-500/10 blur-3xl" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">

              {/* Hero Content */}
              <div className="flex flex-col justify-center px-7 sm:px-10 md:px-14 py-12 md:py-16">

                {/* Small Badge */}
                <div className="inline-flex items-center gap-2 w-fit bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-6">
                  <Sparkles size={16} className="text-yellow-400" />

                  <span className="text-xs sm:text-sm font-medium text-gray-200">
                    Welcome to D Store
                  </span>
                </div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">

                  Everything You Want.

                  <span className="block text-gray-400 mt-2">
                    All in One Store.
                  </span>

                </h1>

                {/* Description */}
                <p className="text-gray-400 text-base sm:text-lg max-w-xl mt-6 leading-relaxed">
                  Discover quality products, great deals and a
                  smooth shopping experience designed for you.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">

                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 bg-white text-gray-950 px-7 py-3.5 rounded-xl font-bold hover:bg-gray-100 transition"
                  >
                    Shop Now
                    <ArrowRight size={19} />
                  </Link>

                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition"
                  >
                    Explore Collection
                  </Link>

                </div>

              </div>

              {/* Hero Visual */}
              <div className="hidden lg:flex items-center justify-center relative p-10">

                <div className="relative w-80 h-80">

                  {/* Main circle */}
                  <div className="absolute inset-0 rounded-full border border-white/10" />

                  <div className="absolute inset-8 rounded-full border border-white/10" />

                  {/* Center */}
                  <div className="absolute inset-16 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center">

                    <ShoppingBag
                      size={70}
                      strokeWidth={1.2}
                      className="text-white"
                    />

                    <p className="text-xl font-bold mt-4">
                      D Store
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Shop Smart
                    </p>

                  </div>

                  {/* Floating offer */}
                  <div className="absolute -top-3 right-0 bg-yellow-400 text-gray-950 px-4 py-3 rounded-xl shadow-xl rotate-3">
                    <p className="text-[10px] uppercase font-bold">
                      Special
                    </p>

                    <p className="text-lg font-black">
                      Deals
                    </p>
                  </div>

                  {/* Floating quality */}
                  <div className="absolute bottom-2 -left-5 bg-white text-gray-900 px-4 py-3 rounded-xl shadow-xl -rotate-3">
                    <div className="flex items-center gap-2">
                      <Star
                        size={17}
                        className="fill-yellow-400 text-yellow-400"
                      />

                      <span className="text-sm font-bold">
                        Quality
                      </span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          QUICK BENEFITS
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-white border border-gray-200 rounded-2xl grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100 overflow-hidden">

          {/* Delivery */}
          <div className="p-5 sm:p-6 flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Truck size={21} className="text-gray-800" />
            </div>

            <div>
              <p className="font-bold text-sm">
                Fast Delivery
              </p>

              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                Quick & reliable
              </p>
            </div>

          </div>

          {/* Secure */}
          <div className="p-5 sm:p-6 flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={21} className="text-gray-800" />
            </div>

            <div>
              <p className="font-bold text-sm">
                Secure Shopping
              </p>

              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                Safe checkout
              </p>
            </div>

          </div>

          {/* Quality */}
          <div className="p-5 sm:p-6 flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Star size={21} className="text-gray-800" />
            </div>

            <div>
              <p className="font-bold text-sm">
                Quality Products
              </p>

              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                Products you trust
              </p>
            </div>

          </div>

          {/* Support */}
          <div className="p-5 sm:p-6 flex items-center gap-3 col-span-2 lg:col-span-1">

            <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Headphones size={21} className="text-gray-800" />
            </div>

            <div>
              <p className="font-bold text-sm">
                Customer Support
              </p>

              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                We're here to help
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          SHOP BY CATEGORY
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">

        <div className="flex items-end justify-between mb-7">

          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400">
              Explore
            </p>

            <h2 className="text-2xl sm:text-3xl font-black mt-2">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-black"
          >
            View All
            <ArrowRight size={16} />
          </Link>

        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

          {/* Electronics */}
          <Link
            to="/products?category=Electronics"
            className="group bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 text-center hover:border-gray-400 hover:shadow-md transition"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition">
              <Package size={28} />
            </div>

            <h3 className="font-semibold text-sm mt-4">
              Electronics
            </h3>
          </Link>

          {/* Mobiles */}
          <Link
            to="/products?category=Mobiles"
            className="group bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 text-center hover:border-gray-400 hover:shadow-md transition"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition">
              <ShoppingBag size={28} />
            </div>

            <h3 className="font-semibold text-sm mt-4">
              Mobiles
            </h3>
          </Link>

          {/* Fashion */}
          <Link
            to="/products?category=Fashion"
            className="group bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 text-center hover:border-gray-400 hover:shadow-md transition"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition">
              <Heart size={28} />
            </div>

            <h3 className="font-semibold text-sm mt-4">
              Fashion
            </h3>
          </Link>

          {/* Accessories */}
          <Link
            to="/products"
            className="group bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 text-center hover:border-gray-400 hover:shadow-md transition"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition">
              <Star size={28} />
            </div>

            <h3 className="font-semibold text-sm mt-4">
              Accessories
            </h3>
          </Link>

          {/* Deals */}
          <Link
            to="/products"
            className="group bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 text-center hover:border-gray-400 hover:shadow-md transition"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition">
              <Tag size={28} />
            </div>

            <h3 className="font-semibold text-sm mt-4">
              Best Deals
            </h3>
          </Link>

          {/* New Arrivals */}
          <Link
            to="/products"
            className="group bg-white border border-gray-200 rounded-2xl p-5 sm:p-7 text-center hover:border-gray-400 hover:shadow-md transition"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-900 group-hover:text-white transition">
              <Sparkles size={28} />
            </div>

            <h3 className="font-semibold text-sm mt-4">
              New Arrivals
            </h3>
          </Link>

        </div>

      </section>

      {/* =====================================================
          DEALS BANNER
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">

        <div className="rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">

          <div className="grid grid-cols-1 md:grid-cols-2">

            <div className="p-8 sm:p-10 md:p-14 flex flex-col justify-center">

              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gray-500">
                <Tag size={15} />
                D Store Deals
              </div>

              <h2 className="text-3xl sm:text-4xl font-black mt-4 leading-tight">
                Great products.
                <span className="block text-gray-500">
                  Better prices.
                </span>
              </h2>

              <p className="text-gray-500 mt-4 max-w-md leading-relaxed">
                Discover products you'll love at prices that make
                shopping even better.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex items-center gap-2 w-fit bg-gray-900 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-black transition"
              >
                Shop Deals
                <ArrowRight size={18} />
              </Link>

            </div>

            <div className="min-h-[280px] md:min-h-[360px] bg-gray-900 flex items-center justify-center relative overflow-hidden">

              <div className="absolute w-64 h-64 rounded-full border border-white/10" />
              <div className="absolute w-80 h-80 rounded-full border border-white/5" />

              <div className="relative text-center text-white">

                <Tag
                  size={60}
                  strokeWidth={1.2}
                  className="mx-auto text-yellow-400"
                />

                <p className="text-4xl sm:text-5xl font-black mt-5">
                  DEALS
                </p>

                <p className="text-gray-400 mt-2 text-sm">
                  Shop your favorites
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          WHY D STORE
      ====================================================== */}
      <section className="bg-white border-y border-gray-200">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">

          <div className="text-center max-w-2xl mx-auto mb-12">

            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-400">
              Why D Store
            </p>

            <h2 className="text-3xl sm:text-4xl font-black mt-3">
              Shopping made simple
            </h2>

            <p className="text-gray-500 mt-4 leading-relaxed">
              Everything you need for a smooth and convenient
              online shopping experience.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Selection */}
            <div className="border border-gray-200 rounded-2xl p-7 hover:shadow-md transition">

              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Package size={23} />
              </div>

              <h3 className="text-xl font-bold mt-6">
                Wide Selection
              </h3>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Explore products across multiple categories and
                find the right products for your needs.
              </p>

            </div>

            {/* Wishlist */}
            <div className="border border-gray-200 rounded-2xl p-7 hover:shadow-md transition">

              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Heart size={23} />
              </div>

              <h3 className="text-xl font-bold mt-6">
                Save What You Love
              </h3>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Add your favorite products to your wishlist and
                come back whenever you're ready to shop.
              </p>

            </div>

            {/* Secure */}
            <div className="border border-gray-200 rounded-2xl p-7 hover:shadow-md transition">

              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <ShieldCheck size={23} />
              </div>

              <h3 className="text-xl font-bold mt-6">
                Secure Shopping
              </h3>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Secure authentication, protected accounts and
                easy access to your orders.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">

        <div className="bg-gray-950 rounded-3xl text-white text-center px-6 py-12 sm:px-10 sm:py-16">

          <div className="w-14 h-14 mx-auto rounded-full bg-white/10 flex items-center justify-center">
            <ShoppingBag size={25} />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black mt-6">
            Ready to shop?
          </h2>

          <p className="text-gray-400 max-w-xl mx-auto mt-4 leading-relaxed">
            Explore our collection and discover something you'll
            love.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-white text-gray-950 px-7 py-3.5 rounded-xl font-bold mt-7 hover:bg-gray-100 transition"
          >
            Start Shopping
            <ArrowRight size={19} />
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;