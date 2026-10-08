import { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Tags,
  RefreshCw,
  Search,
  FolderOpen,
} from "lucide-react";

import api from "../../services/api";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");

  // =========================
  // FETCH CATEGORIES
  // =========================
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories");

      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADD FORM
  // =========================
  const openAddForm = () => {
    setEditingCategory(null);
    setName("");
    setShowForm(true);
  };

  // =========================
  // EDIT FORM
  // =========================
  const openEditForm = (category) => {
    setEditingCategory(category);
    setName(category.name || "");
    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================
  const closeForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setName("");
  };

  // =========================
  // SAVE CATEGORY
  // =========================
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter a category name.");
      return;
    }

    try {
      if (editingCategory) {
        await api.put(
          `/categories/${editingCategory.id}`,
          {
            name: name.trim(),
          }
        );

        alert("Category updated successfully.");
      } else {
        await api.post("/categories", {
          name: name.trim(),
        });

        alert("Category added successfully.");
      }

      closeForm();
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save category."
      );
    }
  };

  // =========================
  // DELETE CATEGORY
  // =========================
  const handleDelete = async (categoryId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/categories/${categoryId}`);

      alert("Category deleted successfully.");

      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete category."
      );
    }
  };

  // =========================
  // FILTER
  // =========================
  const filteredCategories = categories.filter((category) =>
    category.name
      ?.toLowerCase()
      .includes(searchText.toLowerCase().trim())
  );

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
            Loading categories
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Preparing your category list...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5]">

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-7 md:py-9">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">
              <Tags size={15} />
              D Store Admin
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">
              Categories
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Organize and manage your store product categories.
            </p>

          </div>

          <button
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-black transition"
          >
            <Plus size={18} />
            Add Category
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
              onClick={fetchCategories}
              className="text-sm font-semibold underline"
            >
              Retry
            </button>

          </div>
        )}

        {/* =====================================================
            SUMMARY + SEARCH
        ====================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 mb-6">

          {/* TOTAL */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                  Total Categories
                </p>

                <p className="text-3xl font-black text-gray-900 mt-2">
                  {categories.length}
                </p>

              </div>

              <div className="w-11 h-11 rounded-xl bg-gray-900 text-white flex items-center justify-center">
                <Tags size={21} />
              </div>

            </div>

          </div>

          {/* SEARCH */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4">

            <div className="relative">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchText}
                onChange={(event) =>
                  setSearchText(event.target.value)
                }
                placeholder="Search categories..."
                className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:border-gray-400 transition"
              />

            </div>

          </div>

        </div>

        {/* =====================================================
            CATEGORY LIST
        ====================================================== */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          <div className="px-5 md:px-6 py-5 border-b border-gray-200 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Category List
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredCategories.length} categor
                {filteredCategories.length !== 1 ? "ies" : "y"} displayed
              </p>

            </div>

            <button
              onClick={fetchCategories}
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
              title="Refresh categories"
            >
              <RefreshCw size={17} />
            </button>

          </div>

          {filteredCategories.length === 0 ? (

            <div className="p-12 text-center">

              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <FolderOpen
                  size={25}
                  className="text-gray-400"
                />
              </div>

              <h3 className="font-semibold text-gray-900 mt-4">
                No categories found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Try another search or create a new category.
              </p>

              <button
                onClick={openAddForm}
                className="mt-5 inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-black transition"
              >
                <Plus size={17} />
                Add Category
              </button>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[600px]">

                <thead>

                  <tr className="bg-gray-50 border-b border-gray-200">

                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-bold text-gray-500">
                      ID
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

                  {filteredCategories.map((category) => (

                    <tr
                      key={category.id}
                      className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                    >

                      {/* ID */}
                      <td className="px-6 py-5">

                        <span className="text-sm font-semibold text-gray-500">
                          #{category.id}
                        </span>

                      </td>

                      {/* CATEGORY */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center">
                            <Tags size={19} />
                          </div>

                          <div>

                            <p className="font-bold text-gray-900">
                              {category.name}
                            </p>

                            <p className="text-xs text-gray-400 mt-0.5">
                              Store category
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-5">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() =>
                              openEditForm(category)
                            }
                            title="Edit Category"
                            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(category.id)
                            }
                            title="Delete Category"
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

        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">

          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

            {/* MODAL HEADER */}
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  D Store Admin
                </p>

                <h2 className="text-xl font-bold text-gray-900 mt-1">
                  {editingCategory
                    ? "Edit Category"
                    : "Add New Category"}
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
              className="p-6"
            >

              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Category Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter category name"
                required
                autoFocus
                className="w-full h-12 border border-gray-200 rounded-xl px-4 text-sm text-gray-900 bg-gray-50 outline-none focus:bg-white focus:border-gray-400 transition"
              />

              {/* BUTTONS */}
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6 pt-5 border-t border-gray-200">

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
                  {editingCategory
                    ? "Update Category"
                    : "Add Category"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminCategories;