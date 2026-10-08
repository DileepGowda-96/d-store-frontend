import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LogIn,
  Mail,
  LockKeyhole,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Store,
} from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password,
      });

      localStorage.setItem("token", response.data.token);

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      navigate("/products");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError(
          error.response?.data?.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center px-4 py-10 sm:py-14">

      <div className="w-full max-w-md">

        {/* ================= BRAND ================= */}

        <div className="text-center mb-7">

          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight text-[#181818]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#1f1f1f] text-white flex items-center justify-center">
              <ShoppingBag size={19} />
            </div>

            D Store
          </Link>

          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold mt-3">
            Welcome back
          </p>

        </div>

        {/* ================= LOGIN CARD ================= */}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          <div className="p-6 sm:p-8">

            {/* Header */}

            <div className="mb-7">

              <div className="w-11 h-11 rounded-xl bg-[#f3f3f1] flex items-center justify-center mb-4">
                <LogIn
                  size={21}
                  className="text-gray-800"
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                Welcome back
              </h1>

              <p className="text-sm text-gray-500 mt-2">
                Sign in to continue shopping at D Store.
              </p>

            </div>

            {/* ================= ERROR ================= */}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                {error}
              </div>
            )}

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full border border-gray-200 bg-[#fafaf9] rounded-xl px-4 py-3.5 pl-11 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:bg-white transition"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Password
                  </label>

                </div>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full border border-gray-200 bg-[#fafaf9] rounded-xl px-4 py-3.5 pl-11 pr-12 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:bg-white transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition"
                    title={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              {/* Security */}

              <div className="flex items-center gap-2.5 bg-[#fafaf9] border border-gray-100 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-500">

                <ShieldCheck
                  size={17}
                  className="text-green-600 flex-shrink-0"
                />

                <span>
                  Your account information is securely protected.
                </span>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1f1f1f] text-white py-3.5 rounded-xl font-semibold hover:bg-black transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >

                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Login
                  </>
                )}

              </button>

            </form>

            {/* ================= REGISTER ================= */}

            <div className="text-center mt-7 pt-6 border-t border-gray-100">

              <p className="text-sm text-gray-500">
                Don't have an account?
              </p>

              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-gray-900 hover:text-gray-500 transition"
              >
                Create an account
                <ArrowRight size={15} />
              </Link>

            </div>

          </div>

          {/* ================= CARD FOOTER ================= */}

          <div className="border-t border-gray-100 bg-[#fafaf9] px-6 py-4">

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">

              <Store size={14} />

              <span>
                Shop confidently with D Store
              </span>

            </div>

          </div>

        </div>

        {/* ================= BACK TO STORE ================= */}

        <div className="text-center mt-6">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
          >
            ← Back to Store
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;