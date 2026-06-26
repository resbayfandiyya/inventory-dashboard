import { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaCheckCircle,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

/**
 * Users Page: Super Indah, Rapi, Support Dark Mode Sempurna, dan Pagination Cantik
 *
 * Pagination kini mengikuti gaya Sales.jsx: state page, pageSize,
 * totalRows, load state, tombol <<, >>, angka, ... dst.
 */

export default function Users() {
  const { darkMode } = useTheme ? useTheme() : { darkMode: false };

  // Data & UI state
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form States
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    status: "Active",
  });

  const [editForm, setEditForm] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    role: "",
    status: "Active",
  });

  // --- Data fetch, search dan auto pagination ---
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleSearch(searchTerm, 1);
    // eslint-disable-next-line
  }, [users, searchTerm]);

  // Jika filteredUsers berubah, update totalRows
  useEffect(() => {
    setTotalRows(filteredUsers.length);
  }, [filteredUsers]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  // Search handler analog Sales.jsx
  const handleSearch = (value, gotoPage) => {
    setSearchTerm(value);
    const lowerValue = value?.toLowerCase?.() || "";
    const filtered =
      users.filter((user) =>
        (user.name && user.name.toLowerCase().includes(lowerValue)) ||
        (user.email && user.email.toLowerCase().includes(lowerValue)) ||
        (user.role && user.role.toLowerCase().includes(lowerValue)) ||
        (user.status && user.status.toLowerCase().includes(lowerValue)) ||
        (user.id && String(user.id).toLowerCase().includes(lowerValue))
      ) || [];
    setFilteredUsers(filtered);
    // Default page ke 1 jika search berubah, kecuali explicit set
    setPage(typeof gotoPage === "number" ? gotoPage : 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", form);
      setShowModal(false);
      setForm({
        name: "",
        email: "",
        password: "",
        role: "",
        status: "Active",
      });
      setShowSuccess(true);
      await fetchUsers();
      setTimeout(() => setShowSuccess(false), 2200);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${selectedId}`);
      setShowDeleteModal(false);
      setSelectedId(null);
      await fetchUsers();
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 1400);
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus user");
    }
  };

  const openEditModal = (user) => {
    setEditForm({
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        status: editForm.status,
      };
      if (editForm.password) payload.password = editForm.password;
      await api.put(`/users/${editForm.id}`, payload);
      await fetchUsers();
      setShowEditModal(false);
      setEditForm({
        id: null,
        name: "",
        email: "",
        password: "",
        role: "",
        status: "Active",
      });
      setShowEditSuccess(true);
      setTimeout(() => setShowEditSuccess(false), 1600);
    } catch (error) {
      console.error(error);
      alert("Gagal mengupdate user");
    }
  };

  // --- Pagination logic Sales Style ---
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  // pageData mirip di Sales.jsx
  const pageData = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

  // Pagination array builder seperti Sales.jsx ('...', N, N+1)
  function getPaginationRange(curr, last) {
    let delta = 2; // how many pages beside
    const range = [];
    let l;
    for (
      let i = 1;
      i <= last;
      i++
    ) {
      if (
        i === 1 ||
        i === last ||
        (i >= curr - delta && i <= curr + delta)
      ) {
        range.push(i);
      }
    }
    // Insert dots
    let rangeWithDots = [];
    let prev;
    for (let i of range) {
      if (prev) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }
    return rangeWithDots;
  }

  // --- Styling
  const bgMain = darkMode
    ? "bg-gradient-to-tr from-[#212939] via-[#232a38] to-[#101622]"
    : "bg-gradient-to-tr from-blue-50 via-[#f9fafb] to-blue-100";

  const cardShadow =
    darkMode
      ? "shadow-xl border border-cyan-900/20 bg-gradient-to-tr from-[#151b28]/75 to-[#212b37]/90"
      : "shadow-md border border-blue-100 bg-white/95";

  const mainHeaderText = darkMode ? "text-cyan-200" : "text-blue-700";
  const subHeaderText = darkMode ? "text-cyan-300/90" : "text-slate-500";
  const thBg = darkMode
    ? "bg-gradient-to-tr from-cyan-900/60 to-blue-900/30 text-cyan-200 border-b border-cyan-900/20"
    : "bg-blue-100/70 text-blue-900";
  const rowEven = darkMode ? "bg-cyan-900/10" : "bg-blue-50/20";
  const rowOdd = darkMode ? "bg-[#222737]" : "bg-white";
  const addButton =
    darkMode
      ? "bg-gradient-to-tr from-cyan-700 via-cyan-600 to-sky-700 text-cyan-50 shadow-cyan-700/20 hover:bg-cyan-900"
      : "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-blue-300/25 hover:bg-blue-700";
  const warningButton =
    darkMode
      ? "bg-yellow-600 text-yellow-50 hover:bg-yellow-700"
      : "bg-yellow-400 text-white hover:bg-yellow-500";
  const dangerButton =
    darkMode
      ? "bg-rose-700 text-white hover:bg-red-800"
      : "bg-red-500 text-white hover:bg-red-600";

  // Status badge style
  const statusBadge = (status) =>
    status === "Active"
      ? darkMode
        ? "bg-teal-700/20 text-teal-200 border border-teal-700/50"
        : "bg-green-100 text-green-700 border border-green-200"
      : darkMode
      ? "bg-red-800/10 text-red-300 border border-red-800/35"
      : "bg-red-100 text-red-700 border border-red-200";

  // Pagination beauty classes (dari Sales)
  const pagBase = "inline-flex min-w-[34px] items-center justify-center mx-0.5 rounded-lg border font-bold text-base h-9 transition active:scale-95 select-none";
  const pagActive = darkMode
    ? "bg-cyan-700 text-white border-cyan-600 shadow-cyan-700/20"
    : "bg-blue-500 text-white border-blue-400 shadow-blue-400/10";
  const pagNormal = darkMode
    ? "bg-[#181c28] text-cyan-200 border-cyan-800 hover:bg-cyan-800/20"
    : "bg-white text-blue-800 border-blue-200 hover:bg-blue-100";
  const pagDisabled = darkMode
    ? "opacity-40 cursor-not-allowed bg-[#232a38] border-cyan-900"
    : "opacity-40 cursor-not-allowed bg-blue-50 border-blue-100";

  const searchBarBg = darkMode
    ? "bg-[#23293c]/90 border-cyan-900/50 text-cyan-100 placeholder:text-cyan-500 focus:ring-cyan-400 focus:border-cyan-500"
    : "bg-white/90 border-blue-200 text-slate-700 placeholder:text-blue-300 focus:ring-blue-400 focus:border-blue-400";

  const inputClasses =
    "w-full rounded-xl px-4 py-3 font-medium text-base outline-none shadow transition";
  const inputBorder =
    darkMode
      ? "border border-cyan-900/40 text-cyan-100 bg-[#222839] placeholder:text-cyan-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
      : "border border-blue-200 text-blue-900 bg-white placeholder:text-blue-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-400";

  // --- Render ---
  return (
    <div
      className={`min-h-[92vh] ${bgMain} pb-14 pt-8 px-4 md:px-8 transition-all duration-300`}
      style={
        darkMode
          ? { backgroundBlendMode: "normal, lighten" }
          : undefined
      }
    >
      {/* Success Animations */}
      <SuccessAnimation
        show={showSuccess}
        title="Success!"
        message="Data berhasil disimpan 🎉"
        darkMode={darkMode}
      />
      <SuccessAnimation
        show={showDeleteSuccess}
        title="Deleted!"
        message="User berhasil dihapus 🗑️"
        circleColor="red"
        textColor={darkMode ? "text-red-300" : "text-red-700"}
        iconColor="text-white"
        circleBg={darkMode ? "bg-red-700" : "bg-red-500"}
        circleStroke="#ef4444"
        outerGlow={darkMode ? "bg-red-800/40" : "bg-red-400/30"}
        darkMode={darkMode}
      />
      <SuccessAnimation
        show={showEditSuccess}
        title="Updated!"
        message="User berhasil diedit ✏️"
        circleColor="yellow"
        textColor={darkMode ? "text-yellow-200" : "text-yellow-800"}
        iconColor={darkMode ? "text-yellow-300" : "text-yellow-600"}
        circleBg={darkMode ? "bg-yellow-600" : "bg-yellow-300"}
        circleStroke="#eab308"
        outerGlow={darkMode ? "bg-yellow-700/60" : "bg-yellow-200/50"}
        darkMode={darkMode}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-8">
        <div>
          <h1
            className={`text-4xl font-black tracking-tight mb-1 flex items-center gap-2 drop-shadow-[0_2px_3px_rgba(34,80,180,0.07)] ${mainHeaderText} transition-colors duration-300`}
          >
            <FaUsersHeader darkMode={darkMode} />
            <span>
              Users Management
            </span>
          </h1>
          <p className={`text-base font-medium ${subHeaderText} transition-colors duration-300`}>
            Manage and organize your team's users
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold drop-shadow hover:scale-105 hover:drop-shadow-xl transition active:scale-95 ${addButton}`}
        >
          <FaPlus />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className={`rounded-2xl px-4 py-2 mb-7 mx-auto max-w-2xl shadow-lg ${darkMode ? "bg-[#222839]/90" : "bg-white/90"}`}>
        <div className="relative">
          <FaSearch
            className={`absolute left-4 top-3.5 text-lg pointer-events-none ${darkMode ? "text-cyan-500" : "text-blue-300"}`}
          />
          <input
            type="text"
            placeholder="Cari nama, email, atau peran..."
            className={`${inputClasses} pl-12 transition ${inputBorder}`}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            style={{ background: darkMode ? "#1a1e2c" : undefined }}
          />
        </div>
      </div>

      {/* Table Card */}
      <div className={`overflow-hidden rounded-3xl ${cardShadow}`}>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <Th className={thBg}>No</Th>
                <Th className={thBg}>Name</Th>
                <Th className={thBg}>Email</Th>
                <Th className={thBg}>Role</Th>
                <Th className={thBg}>Status</Th>
                <Th className={thBg + " text-center"}>Action</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className={`py-12 text-center font-semibold text-lg ${darkMode ? "text-cyan-400" : "text-blue-400"}`}>
                    Loading...
                  </td>
                </tr>
              ) : pageData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className={`py-12 text-center font-semibold text-lg ${darkMode ? "text-cyan-400" : "text-blue-400"}`}
                  >
                    No users found. <span className="text-2xl">😶‍🌫️</span>
                  </td>
                </tr>
              ) : (
                pageData.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`border-b last:border-b-0 transition ${
                      idx % 2 === 0 ? rowEven : rowOdd
                    } border-blue-100/50 dark:border-cyan-900/20`}
                  >
                    <td className={`px-6 py-4 font-semibold ${darkMode ? "text-cyan-100" : "text-slate-700"}`}>
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold flex items-center gap-3">
                      <FakeAvatar name={user.name} darkMode={darkMode} />
                      <span className={darkMode ? "text-cyan-200" : undefined}>{user.name}</span>
                    </td>
                    <td className={`px-6 py-4 ${darkMode ? "text-cyan-300" : "text-slate-600"}`}>{user.email}</td>
                    <td className={darkMode ? "px-6 py-4 text-cyan-300" : "px-6 py-4"}>{user.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold transition-all ${statusBadge(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2 items-center">
                        <button
                          onClick={() => openEditModal(user)}
                          aria-label="Edit"
                          className={`p-2 rounded-lg shadow hover:scale-110 transition active:scale-95 ${warningButton}`}
                          style={darkMode ? { boxShadow: "0 3px 12px #facc1511" } : undefined}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedId(user.id);
                            setShowDeleteModal(true);
                          }}
                          aria-label="Delete"
                          className={`p-2 rounded-lg shadow hover:scale-110 transition active:scale-95 ${dangerButton}`}
                          style={darkMode ? { boxShadow: "0 3px 12px #f0002011" } : undefined}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={6}
                  className={`px-8 py-6 ${
                    darkMode
                      ? "bg-[#1d2435]"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Info */}
                    <div
                      className={`font-medium ${
                        darkMode
                          ? "text-cyan-200"
                          : "text-slate-600"
                      }`}
                    >
                      Halaman <b>{page}</b> dari{" "}
                      <b>{totalPages}</b>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center gap-2">
                      {/* First */}
                      <button
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        className={`w-12 h-12 rounded-xl font-bold transition
                        ${
                          page === 1
                            ? "opacity-40 cursor-not-allowed"
                            : darkMode
                            ? "bg-[#26345d] hover:bg-cyan-600 text-cyan-200"
                            : "bg-blue-100 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        ≪
                      </button>
                      {/* Prev */}
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className={`w-12 h-12 rounded-xl font-bold transition
                        ${
                          page === 1
                            ? "opacity-40 cursor-not-allowed"
                            : darkMode
                            ? "bg-[#26345d] hover:bg-cyan-600 text-cyan-200"
                            : "bg-blue-100 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        <FaAngleLeft />
                      </button>
                      {getPaginationRange(page, totalPages).map(
                        (item, i) =>
                          item === "..." ? (
                            <span
                              key={i}
                              className={`px-2 ${
                                darkMode
                                  ? "text-cyan-300"
                                  : "text-slate-500"
                              }`}
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={item}
                              onClick={() =>
                                setPage(item)
                              }
                              className={`w-12 h-12 rounded-xl font-bold transition
                              ${
                                page === item
                                  ? darkMode
                                    ? "bg-cyan-600 text-white shadow-lg shadow-cyan-700/40"
                                    : "bg-blue-600 text-white shadow-lg shadow-blue-300"
                                  : darkMode
                                  ? "bg-[#26345d] text-cyan-200 hover:bg-cyan-600"
                                  : "bg-blue-100 hover:bg-blue-500 hover:text-white"
                              }`}
                            >
                              {item}
                            </button>
                          )
                      )}
                      {/* Next */}
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className={`w-12 h-12 rounded-xl font-bold transition
                        ${
                          page === totalPages
                            ? "opacity-40 cursor-not-allowed"
                            : darkMode
                            ? "bg-[#26345d] hover:bg-cyan-600 text-cyan-200"
                            : "bg-blue-100 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        <FaAngleRight />
                      </button>
                      {/* Last */}
                      <button
                        onClick={() =>
                          setPage(totalPages)
                        }
                        disabled={page === totalPages}
                        className={`w-12 h-12 rounded-xl font-bold transition
                        ${
                          page === totalPages
                            ? "opacity-40 cursor-not-allowed"
                            : darkMode
                            ? "bg-[#26345d] hover:bg-cyan-600 text-cyan-200"
                            : "bg-blue-100 hover:bg-blue-500 hover:text-white"
                        }`}
                      >
                        ≫
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title="Add User" darkMode={darkMode}>
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              darkMode={darkMode}
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              darkMode={darkMode}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              darkMode={darkMode}
            />
            <Select
              label="Role"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              options={[
                { label: "Pilih Role", value: "", disabled: true },
                { label: "Admin", value: "Admin" },
                { label: "Staff", value: "Staff" },
                { label: "Manager", value: "Manager" },
              ]}
              required
              darkMode={darkMode}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
              darkMode={darkMode}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="border" onClick={() => setShowModal(false)} darkMode={darkMode}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" darkMode={darkMode}>
                Save
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)} title="Edit User" darkMode={darkMode}>
          <form onSubmit={handleUpdate} className="space-y-5 mt-2">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter name"
              value={editForm.name}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              required
              darkMode={darkMode}
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter email"
              value={editForm.email}
              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
              required
              darkMode={darkMode}
            />
            <Input
              label="New Password"
              type="password"
              placeholder="Leave blank to keep current"
              value={editForm.password}
              onChange={e => setEditForm({ ...editForm, password: e.target.value })}
              darkMode={darkMode}
            />
            <Select
              label="Role"
              value={editForm.role}
              onChange={e => setEditForm({ ...editForm, role: e.target.value })}
              options={[
                { label: "Pilih Role", value: "", disabled: true },
                { label: "Admin", value: "Admin" },
                { label: "Staff", value: "Staff" },
                { label: "Manager", value: "Manager" },
              ]}
              required
              darkMode={darkMode}
            />
            <Select
              label="Status"
              value={editForm.status}
              onChange={e => setEditForm({ ...editForm, status: e.target.value })}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
              darkMode={darkMode}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="border" onClick={() => setShowEditModal(false)} darkMode={darkMode}>
                Cancel
              </Button>
              <Button type="submit" variant="warning" darkMode={darkMode}>
                Update
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <Modal
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedId(null);
          }}
          title="Hapus User"
          darkMode={darkMode}
        >
          <div className="py-2">
            <p className={darkMode ? "text-cyan-200 mb-6" : "text-slate-500 mb-6"}>
              Apakah Anda yakin ingin menghapus user ini?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="border"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedId(null);
                }}
                darkMode={darkMode}
              >
                Batal
              </Button>
              <Button variant="danger" onClick={handleDelete} darkMode={darkMode}>
                Hapus
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Custom Scrollbar */}
      <style>
        {`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: ${darkMode ? "#38bdf8 #222939" : "#60a5fa #e0e7ef"};
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${darkMode ? "#38bdf8" : "#60a5fa"};
            border-radius: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: ${darkMode ? "#222939" : "#e0e7ef"};
            border-radius: 8px;
          }
        `}
      </style>
    </div>
  );
}

// --- UI Helpers/Components ---

/**
 * Table header cell styled
 */
function Th({ children, className = "" }) {
  return (
    <th
      className={
        "text-left px-6 py-4 font-bold uppercase text-sm tracking-widest transition " +
        className
      }
    >
      {children}
    </th>
  );
}

/**
 * Modal component indah dengan dark mode
 */
// ... (NO CHANGE, same as before)
function Modal({ onClose, title, children, darkMode }) {
  const modalBg = darkMode
    ? "bg-gradient-to-br from-[#181b24] via-[#232a38] to-[#223456] border border-cyan-900/30"
    : "bg-white border border-blue-200";
  const textTitle = darkMode ? "text-cyan-200" : "text-blue-700";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#161b22]/80 via-[#221d3b]/70 to-[#1e293b]/60 backdrop-blur-sm">
      <div className={`relative animate-scale-modal ${modalBg} rounded-2xl shadow-2xl max-w-md w-full`}>
        <button
          aria-label="Close"
          onClick={onClose}
          className={`absolute right-4 top-4 ${darkMode ? "text-cyan-400 hover:text-cyan-100" : "text-blue-400 hover:text-blue-700"} text-2xl font-bold p-1 focus:outline-none`}
        >
          &times;
        </button>
        <div className="px-7 py-7">
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${textTitle}`}>{title}</h2>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes scale-modal {
          0% {transform:scale(.65); opacity:0;}
          80% {transform:scale(1.05);}
          100% {transform:scale(1); opacity:1;}
        }
        .animate-scale-modal {animation: scale-modal 0.48s cubic-bezier(.55,-0.1,.77,1.4);}
      `}</style>
    </div>
  );
}

/**
 * Fancy Input beautiful & support dark mode
 */
// ... (NO CHANGE)
function Input({ label, darkMode, ...props }) {
  const inputCls =
    "w-full rounded-xl px-4 py-3 font-medium text-base outline-none shadow transition";
  const borderCls = darkMode
    ? "border border-cyan-900/40 text-cyan-100 bg-[#222839] placeholder:text-cyan-600 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
    : "border border-blue-200 text-blue-900 bg-white placeholder:text-blue-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-400";
  const labelCls = darkMode
    ? "block text-cyan-200 font-semibold mb-1"
    : "block text-slate-700 font-semibold mb-1";
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        {...props}
        className={`${inputCls} ${borderCls}`}
        style={darkMode ? { background: "#232442" } : undefined}
      />
    </div>
  );
}

/**
 * Fancy Select beautiful & support dark mode
 */
// ... (NO CHANGE)
function Select({
  label,
  options,
  darkMode,
  ...props
}) {
  const selectCls =
    "w-full rounded-xl px-4 py-3 font-medium text-base outline-none shadow transition";
  const borderCls = darkMode
    ? "border border-cyan-900/40 text-cyan-100 bg-[#222839] focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
    : "border border-blue-200 text-blue-900 bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-400";
  const labelCls = darkMode
    ? "block text-cyan-200 font-semibold mb-1"
    : "block text-slate-700 font-semibold mb-1";
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <select
        {...props}
        className={`${selectCls} ${borderCls}`}
        style={darkMode ? { background: "#222839" } : undefined}
      >
        {options.map((opt, i) => (
          <option
            key={opt.value + i}
            value={opt.value}
            disabled={!!opt.disabled}
            className={darkMode ? "bg-[#212938]" : ""}
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Button with indah color + dark/light adaptation
 */
// ... (NO CHANGE)
function Button({ children, variant = "primary", darkMode, ...props }) {
  const base =
    "px-5 py-3 rounded-xl font-bold shadow disabled:opacity-40 active:scale-95 transition";
  let style = "";
  if (variant === "primary")
    style = darkMode
      ? "bg-cyan-700 text-cyan-100 hover:bg-cyan-800"
      : "bg-blue-600 text-white hover:bg-blue-700";
  else if (variant === "danger")
    style = darkMode
      ? "bg-red-700 text-white hover:bg-red-800"
      : "bg-red-600 text-white hover:bg-red-700";
  else if (variant === "warning")
    style = darkMode
      ? "bg-yellow-600 text-yellow-50 hover:bg-yellow-700"
      : "bg-yellow-400 text-white hover:bg-yellow-500";
  else if (variant === "border")
    style = darkMode
      ? "border border-cyan-700 text-cyan-200 bg-transparent hover:bg-cyan-800/10"
      : "border border-blue-200 text-blue-700 bg-white hover:bg-blue-50";
  else style = "";
  return (
    <button className={`${base} ${style}`} {...props}>
      {children}
    </button>
  );
}

/**
 * Avatar initials with pastel bg (and dark mode fix)
 */
// ... (NO CHANGE)
function FakeAvatar({ name = "", darkMode }) {
  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++)
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    // Luminance tweaks for dark/light:
    const lum = darkMode ? "72%" : "88%";
    const color = `hsl(${Math.abs(hash) % 360}, 70%, ${lum})`;
    return color;
  }
  const initials =
    (name?.split(" ").length > 1
      ? name
          .split(" ")
          .slice(0, 2)
          .map((n) => n[0])
          .join("")
      : name?.slice(0, 2)
    )?.toUpperCase() || "?";
  return (
    <span
      className={`inline-flex items-center justify-center w-9 h-9 rounded-full font-bold text-blue-800 text-sm shadow border ${darkMode ? "bg-opacity-75 border-cyan-700/20 text-cyan-100" : "border-blue-200"}`}
      style={{ background: stringToColor(name) }}
      title={name}
    >
      {initials}
    </span>
  );
}

/**
 * Icon header with soft shadow and darkmode tint
 */
// ... (NO CHANGE)
function FaUsersHeader({ darkMode }) {
  return (
    <span
      className={`inline-block rounded-full p-1.5 shadow border mr-1 ${
        darkMode
          ? "bg-cyan-900/50 border-cyan-900/30"
          : "bg-blue-100/80 border-blue-100"
      }`}
    >
      <svg
        height={22}
        width={22}
        className={`${darkMode ? "text-cyan-400" : "text-blue-600"}`}
        fill="currentColor"
        viewBox="0 0 22 22"
      >
        <path d="M7 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM15 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM1 17.5c0-2.21 2.69-4 6-4s6 1.79 6 4v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1zm11 0c0-1.02-.46-1.95-1.25-2.65C11.48 15.68 12 16.78 12 18v.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5V18c0-.98-.41-1.86-1.06-2.59C16.71 15.92 17 16.67 17 17.5v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-1z"/>
      </svg>
    </span>
  );
}

/**
 * Animasi sukses Indah & Penuh Semangat (darkmode ready)
 */
// ... (NO CHANGE)
function SuccessAnimation({
  show = false,
  title = "Success!",
  message = "Data berhasil disimpan 🎉",
  iconColor = "text-white",
  textColor = "text-green-700",
  circleBg = "bg-green-500",
  circleStroke = "#22c55e",
  outerGlow = "bg-green-400/30",
  darkMode = false,
}) {
  if (!show) return null;

  const modalBg = darkMode ? "bg-black/50" : "bg-black/40";
  const finalText =
    textColor === "text-green-700"
      ? darkMode
        ? "text-green-200"
        : "text-green-900"
      : textColor === "text-yellow-800"
      ? darkMode
        ? "text-yellow-100"
        : "text-yellow-700"
      : darkMode
      ? "text-red-200"
      : "text-red-900";

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center z-[110] ${modalBg}`}>
      <div className="pointer-events-none fixed top-0 left-0 w-full h-full z-[115]">
        <ConfettiAnimation darkMode={darkMode} />
      </div>
      <div className="relative flex flex-col items-center z-[120]">
        {/* Glowing Success/Deleted Circle */}
        <div className="relative animate-pop">
          <div className={`absolute inset-0 blur-3xl rounded-full animate-success-glow ${outerGlow}`}></div>
          <div className={`flex items-center justify-center w-32 h-32 rounded-full shadow-2xl border-8 border-white animate-scale-drop ${circleBg}`}>
            <FaCheckCircle className={`${iconColor} text-7xl drop-shadow-2xl animate-bounceIn`} />
          </div>
          <svg className="absolute inset-0 w-full h-full pointer-events-none animate-success-stroke z-10" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="44"
              fill="none"
              stroke={circleStroke}
              strokeWidth="8"
              strokeDasharray="276"
              strokeDashoffset="0"
              style={{
                strokeDashoffset: 0,
                animation: "circleReveal 0.8s cubic-bezier(.6,-0.28,.74,.05) forwards"
              }}
            />
          </svg>
        </div>
        <div className={`mt-6 text-3xl font-extrabold drop-shadow-lg animate-fadeInDown ${textColor}`}>
          {title}
        </div>
        <div className={`text-lg animate-fadeInUp mt-2 ${finalText}`}>
          {message}
        </div>
      </div>
      <style>
        {`
          @keyframes pop {
            0%   { transform: scale(0.6) rotate(-15deg);}
            70%  { transform: scale(1.08) rotate(6deg);}
            80%  { transform: scale(0.98) rotate(-3deg);}
            100% { transform: scale(1) rotate(0);}
          }
          .animate-pop { animation: pop 0.7s cubic-bezier(.58,1.5,.56,1.03); }
          @keyframes success-glow {
            0%   { opacity: 0.65; }
            70%  { opacity: 0.88; }
            100% { opacity: 0.42; }
          }
          .animate-success-glow { animation: success-glow 1.2s cubic-bezier(.84,0,.16,1); }
          @keyframes scale-drop {
            0%   { transform: scale(0.7); }
            70%  { transform: scale(1.07);}
            100% { transform: scale(1); }
          }
          .animate-scale-drop { animation: scale-drop 0.62s cubic-bezier(.38,1.6,.48,.96); }
          @keyframes bounceIn {
            0% { opacity:0; transform: scale(0.7); }
            70% { opacity:1; transform: scale(1.14);}
            100% { transform: scale(1);}
          }
          .animate-bounceIn { animation: bounceIn 0.6s 0.08s cubic-bezier(.51,.92,.24,1.3) both; }
          @keyframes circleReveal {
            from { stroke-dashoffset: 276; }
            to { stroke-dashoffset: 0; }
          }
          .animate-success-stroke circle {
            animation: circleReveal 0.8s 0.25s cubic-bezier(.87,-0.41,.19,1.13) forwards;
          }
          @keyframes fadeInDown {
            from { opacity:0; transform: translateY(-32px);}
            to { opacity:1; transform: translateY(0);}
          }
          .animate-fadeInDown { animation: fadeInDown 0.38s 0.53s cubic-bezier(.52,1.87,.52,.93) both; }
          @keyframes fadeInUp {
            from { opacity:0; transform: translateY(24px);}
            to { opacity:1; transform: translateY(0);}
          }
          .animate-fadeInUp { animation: fadeInUp 0.44s 0.75s cubic-bezier(.27,1.34,.65,1.08) both; }
        `}
      </style>
    </div>
  );
}

/**
 * Confetti beautiful for both light and dark mode
 */
// ... (NO CHANGE)
function ConfettiAnimation({ darkMode }) {
  const bags = Array.from({ length: 40 });
  return (
    <div style={{ pointerEvents: 'none', position: 'absolute', width: '100vw', height: '100vh', top: 0, left: 0, zIndex: 99 }}>
      {bags.map((_, idx) => {
        const left = Math.random() * 94 + 2;
        const duration = 1.38 + Math.random() * 1.7;
        const delay = Math.random() * 0.9;
        const rotate = Math.random() * 360;
        const size = Math.random() * 11 + 13;
        const darkColors = [
          "#06b6d4", "#818cf8", "#fbbf24", "#f87171",
          "#38bdf8", "#f59e42", "#ef4444", "#fde68a", "#d1fae5"
        ];
        const lightColors = [
          "#38bdf8", "#4ade80", "#fbbf24", "#f43f5e",
          "#a21caf", "#2563eb", "#f59e42", "#ef4444", "#1e293b"
        ];
        const colorArr = darkMode ? darkColors : lightColors;
        const color = colorArr[Math.floor(Math.random() * colorArr.length)];
        const style = {
          position: 'absolute',
          top: '-18px',
          left: `${left}%`,
          width: `${size}px`,
          height: `${size * 0.73}px`,
          background: color,
          borderRadius: `${Math.random() > 0.53 ? "50%" : "9px"}`,
          opacity: 0.95,
          transform: `rotate(${rotate}deg)`,
          zIndex: 999,
          animation: `dropConfetti ${duration}s ${delay}s cubic-bezier(.31,.83,.57,.96) forwards`,
          boxShadow: `0 0 7px 0 ${darkMode ? '#38bdf855' : 'rgba(0,0,0,0.13)'}`,
        };
        return <div key={idx} style={style}></div>;
      })}
      <style>
        {`
          @keyframes dropConfetti {
            0% {
              opacity:1;
              transform:translateY(-20px) rotate(0deg) scale(1);
            }
            65% { opacity:1;}
            100% {
              opacity:0.41;
              transform:translateY(98vh) rotate(390deg) scale(.89);
            }
          }
        `}
      </style>
    </div>
  );

}



