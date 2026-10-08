import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Store,
  ChevronRight,
} from "lucide-react";

function AdminSidebar({ onNavigate }) {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: Tags,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);

    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">

      {/* Brand */}
      <div className="px-6 py-7 border-b border-gray-100">
        <button
          onClick={() => handleNavigation("/admin")}
          className="text-left"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
            D Store
          </p>

          <h1 className="text-2xl font-semibold tracking-tight text-gray-950 mt-1">
            Admin
          </h1>

          <p className="text-xs text-gray-400 mt-1">
            Store Management
          </p>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
          Management
        </p>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gray-950 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${
                          isActive
                            ? "bg-white/10 text-white"
                            : "bg-gray-100 text-gray-500 group-hover:text-gray-900"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                    </div>

                    <ChevronRight
                      size={15}
                      className={`transition-transform ${
                        isActive
                          ? "text-white"
                          : "text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
          <p className="text-xs font-semibold text-gray-800">
            D Store Admin
          </p>

          <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
            Manage your products, categories and customer orders.
          </p>
        </div>

        <button
          onClick={() => handleNavigation("/")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-950 hover:text-white hover:border-gray-950 transition-all duration-200"
        >
          <Store size={17} />
          Back to Store
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;