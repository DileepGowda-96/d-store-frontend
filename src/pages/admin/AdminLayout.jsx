import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f7f5]">

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="h-16 px-4 flex items-center justify-between">

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              D Store
            </p>

            <h1 className="text-lg font-semibold text-gray-950">
              Admin Panel
            </h1>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl bg-gray-950 text-white flex items-center justify-center hover:bg-gray-800 transition"
            aria-label="Open admin menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] lg:min-h-screen">

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Sidebar */}
            <div
              className="relative w-72 max-w-[85vw] h-full bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute right-3 top-3 z-10">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition"
                  aria-label="Close admin menu"
                >
                  <X size={18} />
                </button>
              </div>

              <AdminSidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;