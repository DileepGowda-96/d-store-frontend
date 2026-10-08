import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  Store,
  CheckCircle2,
} from "lucide-react";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
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
            Create your account
          </p>

        </div>

        {/* ================= REGISTER CARD ================= */}

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          <div className="p-6 sm:p-8">

            {/* Header */}

            <div className="mb-7">

              <div className="w-11 h-11 rounded-xl bg-[#f3f3f1] flex items-center justify-center mb-4">
                <UserPlus
                  size={21}
                  className="text-gray-800"
                />
              </div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
                Create Account
              </h1>

              <p className="text-sm text-gray-500 mt-2">
                Join D Store and start shopping today.
              </p>

            </div>

            {/* ================= ERROR ================= */}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
                {error}
              </div>
            )}

            {/* ================= SUCCESS ================= */}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm flex items-start gap-2.5">

                <CheckCircle2
                  size={18}
                  className="flex-shrink-0 mt-0.5"
                />

                <span>{success}</span>

              </div>
            )}

            {/* ================= FORM ================= */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Full Name */}

              <div>

                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full border border-gray-200 bg-[#fafaf9] rounded-xl px-4 py-3.5 pl-11 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:bg-white transition"
                  />

                </div>

              </div>

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
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full border border-gray-200 bg-[#fafaf9] rounded-xl px-4 py-3.5 pl-11 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:bg-white transition"
                  />

                </div>

              </div>

              {/* Password */}

              <div>

                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
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

                <p className="text-xs text-gray-400 mt-2">
                  Password must contain at least 6 characters.
                </p>

              </div>

              {/* Confirm Password */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="w-full border border-gray-200 bg-[#fafaf9] rounded-xl px-4 py-3.5 pl-11 pr-12 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:bg-white transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 transition"
                    title={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
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

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1f1f1f] text-white py-3.5 rounded-xl font-semibold hover:bg-black transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >

                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create Account
                  </>
                )}

              </button>

            </form>

            {/* ================= LOGIN ================= */}

            <div className="text-center mt-7 pt-6 border-t border-gray-100">

              <p className="text-sm text-gray-500">
                Already have an account?
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-gray-900 hover:text-gray-500 transition"
              >
                Login here
                <ArrowRight size={15} />
              </Link>

            </div>

          </div>

          {/* ================= FOOTER ================= */}

          <div className="border-t border-gray-100 bg-[#fafaf9] px-6 py-4">

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">

              <Store size={14} />

              <span>
                Create your D Store account and start shopping.
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

export default Register;