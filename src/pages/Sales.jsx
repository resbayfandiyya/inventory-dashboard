import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  FaTrash,
  FaEye,
  FaPrint,
  FaFileExcel,
  FaSearch,
} from "react-icons/fa";
import generateInvoice from "../utils/generateInvoice";
import exportSalesExcel from "../utils/exportSalesExcel";
import { useTheme } from "../context/ThemeContext";

// Sangat percantik: Serasikan light & dark mode dengan penggunaan className dinamis/tailwind dark:, warna lembut, accent indah.
export default function Sales() {
  // --- State setup ---
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    customer_name: "",
    payment_method: "Cash",
    items: [],
  });
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Success animation for add transaction
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);

  // Detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [saleDetail, setSaleDetail] = useState(null);

  // Pakai dark mode dari useTheme (context)
  const { darkMode } = useTheme();

  // Fetchers
  const fetchSales = async () => {
    try {
      const response = await api.get("/sales", {
        params: {
          page,
          limit: 10,
          search,
          startDate,
          endDate,
        },
      });
      setSales(response.data?.data || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      console.error(error);
      setSales([]);
      setTotalPages(1);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/inventory");
      setProducts(response.data || []);
    } catch (error) {
      console.error(error);
      setProducts([]);
    }
  };

  // Effects
  useEffect(() => {
    fetchSales();
    // eslint-disable-next-line
  }, [page, search, startDate, endDate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Item Add & Remove
  const addItem = () => {
    if (!selectedProduct) return;
    const product = products.find(
      (p) => String(p.id) === String(selectedProduct)
    );
    if (!product) return;
    const existingItem = form.items.find(
      (item) => String(item.product_id) === String(product.id)
    );
    if (existingItem) {
      alert("Produk sudah ditambahkan");
      return;
    }
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          product_id: product.id,
          name: product.name,
          quantity,
          price: Number(product.price),
        },
      ],
    });
    setSelectedProduct("");
    setQuantity(1);
  };

  const removeItem = (productId) => {
    setForm({
      ...form,
      items: form.items.filter(
        (item) => String(item.product_id) !== String(productId)
      ),
    });
  };

  const totalAmount = form.items.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.items.length === 0) {
      alert("Tambah minimal 1 produk");
      return;
    }
    try {
      await api.post("/sales", {
        customer_name: form.customer_name,
        payment_method: form.payment_method,
        items: form.items,
      });
      fetchSales();
      setShowModal(false);
      setShowAddSuccess(true);
      setTimeout(() => {
        setShowAddSuccess(false);
      }, 1800);
      setForm({
        customer_name: "",
        payment_method: "Cash",
        items: [],
      });
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan transaksi");
    }
  };

  const openDeleteModal = (sale) => {
    setSelectedSale(sale);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/sales/${selectedSale?.id}`);
      fetchSales();
      setShowDeleteModal(false);
      setSelectedSale(null);
      setShowDeleteSuccess(true);
      setTimeout(() => {
        setShowDeleteSuccess(false);
      }, 2000);
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus transaksi");
    }
  };

  const openDetailModal = async (id) => {
    try {
      const response = await api.get(`/sales/${id}`);
      setSaleDetail(response.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Pagination Helper

  const getPaginationNumbers = () => {
    // Always show first, last, and 2 before/after current
    const visibleRange = 2;
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - visibleRange && i <= page + visibleRange)
      ) {
        pages.push(i);
      }
    }
    let pagination = [];
    let prev = 0;
    for (let p of pages) {
      if (prev && p - prev > 1) pagination.push("...");
      pagination.push(p);
      prev = p;
    }
    return pagination;
  };
  // Gradient backgrounds
  const bgGradient = darkMode
    ? "bg-gradient-to-br from-slate-900 via-blue-950 to-neutral-900"
    : "bg-gradient-to-br from-blue-100 via-white to-blue-50";

  const accentGradient = darkMode
    ? "from-blue-900/30 to-indigo-950/40"
    : "from-blue-300/30 to-white/40";

  const cardBg = darkMode
    ? "bg-gradient-to-br from-blue-900/60 to-blue-950/80 border-blue-900/40"
    : "bg-gradient-to-br from-white/90 to-blue-50/90 border-blue-100";

  // --- UI ---
  return (
    <div
      className={`relative min-h-screen transition-all duration-300 ${bgGradient} ${
        darkMode ? "text-slate-100" : ""
      }`}
      style={{
        overflow: "hidden",
      }}
    >
      {/* Animated SVG background, dark mode colors */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none select-none -z-10"
        height="380"
        style={{ opacity: darkMode ? 0.13 : 0.12 }}
      >
        <circle
          cx="180"
          cy="160"
          r="140"
          fill={darkMode ? "#2563eb" : "#3b82f6"}
        />
        <ellipse
          cx="960"
          cy="90"
          rx="120"
          ry="70"
          fill={darkMode ? "#0ea5e9" : "#2563eb"}
        />
        <ellipse
          cx="760"
          cy="260"
          rx="100"
          ry="44"
          fill={darkMode ? "#818cf8" : "#60a5fa"}
        />
        <ellipse
          cx="1100"
          cy="340"
          rx="110"
          ry="64"
          fill={darkMode ? "#475569" : "#a5b4fc"}
        />
      </svg>

      <div className="max-w-[1200px] mx-auto py-6 px-2 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1
              className={`text-3xl md:text-4xl font-extrabold mb-1 drop-shadow-sm ${
                darkMode ? "text-sky-100" : "text-blue-900"
              }`}
            >
              Data Transaksi Penjualan
            </h1>
            <p
              className={`${
                darkMode
                  ? "text-blue-100/80"
                  : "text-slate-500"
              } text-md tracking-wide`}
            >
              Kelola & pantau riwayat transaksi penjualan Anda.
            </p>
          </div>
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={() => exportSalesExcel(sales)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white px-4 py-2.5 rounded-xl shadow-lg font-semibold transition-all active:scale-95 focus:outline-none"
            >
              <FaFileExcel />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-600 via-blue-500 to-indigo-700 hover:from-blue-800 hover:to-sky-700 text-white px-4 py-2.5 rounded-xl shadow-lg font-semibold transition-all active:scale-95 focus:outline-none"
            >
              <span className="text-2xl pb-1">＋</span>
              <span className="hidden sm:inline">Transaksi Baru</span>
            </button>
          </div>
        </div>

        {/* --- Filter, date, Export, Add Transaction --- */}
        <div
          className={`flex flex-wrap items-center gap-3 md:gap-5 p-4 rounded-2xl shadow ${
            darkMode
              ? "bg-blue-900/35 border border-blue-900/30"
              : "bg-blue-50/50 border border-blue-100"
          } mb-7`}
        >
          <div className="flex items-center gap-2 relative">
            <FaSearch
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                darkMode ? "text-blue-400/80" : "text-slate-400"
              }`}
            />
            <input
              type="text"
              placeholder="Cari invoice atau customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className={`border rounded-xl px-9 py-2 focus:outline-none transition w-[210px] text-sm ${
                darkMode
                  ? "border-blue-900/60 bg-blue-950/70 text-blue-100 placeholder-blue-300/70 focus:border-sky-400"
                  : "border-blue-200 bg-white/70 text-blue-900 placeholder-blue-400 focus:border-blue-400"
              }`}
            />
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            className={`border rounded-xl px-4 py-2 focus:outline-none transition text-sm ${
              darkMode
                ? "border-blue-900/60 bg-blue-950/70 text-blue-100 focus:border-sky-400"
                : "border-blue-200 bg-white/60 text-blue-800 focus:border-blue-400"
            }`}
          />
          <span
            className={`text-sm ${
              darkMode ? "text-sky-300/80" : "text-slate-400"
            }`}
          >
            s/d
          </span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            className={`border rounded-xl px-4 py-2 focus:outline-none transition text-sm ${
              darkMode
                ? "border-blue-900/60 bg-blue-950/70 text-blue-100 focus:border-sky-400"
                : "border-blue-200 bg-white/60 text-blue-800 focus:border-blue-400"
            }`}
          />
          <button
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setPage(1);
            }}
            className={`px-3 py-2 border font-semibold rounded-xl text-sm transition ${
              darkMode
                ? "border-sky-900 bg-blue-900/30 text-sky-200 hover:bg-blue-900/60"
                : "border-blue-200 bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
          >
            Reset
          </button>
        </div>

        <div
          className={`backdrop-blur-[2.5px] rounded-3xl shadow-2xl overflow-x-auto relative transition-all duration-300 ${
            cardBg
          }`}
        >
          {/* Decorative Accent */}
          <div
            className={`absolute right-0 bottom-0 m-4 w-20 h-20 rounded-full blur-2xl pointer-events-none -z-10 ${
              darkMode
                ? "bg-gradient-to-br from-blue-700/25 to-cyan-800/10"
                : "bg-gradient-to-br from-blue-200/30 to-blue-50/80"
            }`}
          />
          <table className="w-full min-w-[950px] text-sm">
            <thead>
              <tr>
                <th
                  className={`p-5 text-left font-bold tracking-wider uppercase ${
                    darkMode
                      ? "bg-blue-900 text-sky-200"
                      : "bg-blue-50 text-slate-700"
                  }`}
                >
                  No
                </th>
                <th
                  className={`p-5 text-left font-bold tracking-wider uppercase ${
                    darkMode
                      ? "bg-blue-900 text-sky-200"
                      : "bg-blue-50 text-slate-700"
                  }`}
                >
                  Invoice
                </th>
                <th
                  className={`p-5 text-left font-bold tracking-wider uppercase ${
                    darkMode
                      ? "bg-blue-900 text-sky-200"
                      : "bg-blue-50 text-slate-700"
                  }`}
                >
                  Produk
                </th>
                <th
                  className={`p-5 text-left font-bold tracking-wider uppercase ${
                    darkMode
                      ? "bg-blue-900 text-sky-200"
                      : "bg-blue-50 text-slate-700"
                  }`}
                >
                  Customer
                </th>
                <th
                  className={`p-5 text-left font-bold tracking-wider uppercase ${
                    darkMode
                      ? "bg-blue-900 text-sky-200"
                      : "bg-blue-50 text-slate-700"
                  }`}
                >
                  Payment
                </th>
                <th
                  className={`p-5 text-left font-bold tracking-wider uppercase ${
                    darkMode
                      ? "bg-blue-900 text-sky-200"
                      : "bg-blue-50 text-slate-700"
                  }`}
                >
                  Total
                </th>
                <th
                  className={`p-5 text-left font-bold tracking-wider uppercase ${
                    darkMode
                      ? "bg-blue-900 text-sky-200"
                      : "bg-blue-50 text-slate-700"
                  }`}
                >
                  Tanggal
                </th>
                <th
                  className={`p-5 text-center font-bold tracking-wider uppercase ${
                    darkMode
                      ? "bg-blue-900 text-sky-200"
                      : "bg-blue-50 text-slate-700"
                  }`}
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className={`py-16 text-center font-bold text-lg tracking-wider ${
                      darkMode
                        ? "text-blue-200/70"
                        : "text-blue-300"
                    }`}
                  >
                    Tidak ada transaksi.
                  </td>
                </tr>
              ) : (
                sales.map((sale, index) => (
                  <tr
                    key={sale.id}
                    className={`border-t transition-all duration-150 ${
                      index % 2 === 0
                        ? darkMode
                          ? "bg-blue-950/60"
                          : "bg-white/95"
                        : darkMode
                        ? "bg-blue-900/60"
                        : "bg-blue-50/80"
                    } hover:bg-sky-50/40 dark:hover:bg-sky-900/40`}
                  >
                    <td
                      className={`p-5 font-semibold ${
                        darkMode
                          ? "text-sky-200"
                          : "text-blue-800"
                      }`}
                    >
                      {(page - 1) * 10 + index + 1}
                    </td>
                    <td
                      className={`p-5 font-mono ${
                        darkMode
                          ? "text-blue-200"
                          : "text-slate-700"
                      }`}
                    >
                      {sale.invoice_number}
                    </td>
                    <td className="p-5">
                      <span className="block whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]">
                        {Array.isArray(sale.products)
                          ? sale.products.map((p) => p.name).join(", ")
                          : typeof sale.products === "string"
                          ? sale.products
                          : "-"}
                      </span>
                    </td>
                    <td
                      className={`p-5 ${
                        darkMode
                          ? "text-blue-100"
                          : ""
                      }`}
                    >
                      {sale.customer_name}
                    </td>
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-2xl font-bold text-xs shadow-md select-none transition ${
                          sale.payment_method === "Cash"
                            ? darkMode
                              ? "bg-gradient-to-r from-emerald-900/60 to-green-900/60 text-emerald-200"
                              : "bg-gradient-to-r from-green-100 to-green-200 text-green-700"
                            : sale.payment_method === "Transfer"
                            ? darkMode
                              ? "bg-gradient-to-r from-sky-900/50 to-cyan-900/50 text-sky-200"
                              : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700"
                            : darkMode
                            ? "bg-gradient-to-r from-purple-950/60 to-violet-900/80 text-violet-200"
                            : "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700"
                        }`}
                      >
                        {sale.payment_method}
                      </span>
                    </td>
                    <td
                      className={`p-5 font-bold ${
                        darkMode
                          ? "text-sky-200"
                          : "text-blue-700"
                      }`}
                    >
                      Rp {Number(sale.total_amount).toLocaleString("id-ID")}
                    </td>
                    <td className="p-5">
                      <span
                        className={`inline-block rounded-md px-2 text-xs font-semibold shadow ${
                          darkMode
                            ? "bg-blue-900/60 text-blue-100"
                            : "bg-blue-50/80 text-blue-500"
                        }`}
                      >
                        {sale.created_at
                          ? new Date(sale.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "-"}
                      </span>
                    </td>
                    <td className="p-5 text-center flex gap-1 justify-center">
                      <button
                        onClick={() => openDeleteModal(sale)}
                        className={`group transition p-2 rounded-full focus:outline-none border border-transparent ${
                          darkMode
                            ? "hover:bg-red-900/30 hover:border-red-900/30"
                            : "hover:bg-red-50 hover:border-red-200"
                        }`}
                        title="Hapus"
                      >
                        <FaTrash
                          className={`transition text-lg ${
                            darkMode
                              ? "text-red-400 group-hover:text-red-500"
                              : "text-red-500 group-hover:text-red-700"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => openDetailModal(sale.id)}
                        className={`group transition p-2 rounded-full focus:outline-none border border-transparent ${
                          darkMode
                            ? "hover:bg-blue-800/30 hover:border-blue-900/20"
                            : "hover:bg-blue-50 hover:border-blue-200"
                        }`}
                        title="Detail"
                      >
                        <FaEye
                          className={`transition text-lg ${
                            darkMode
                              ? "text-sky-300 group-hover:text-sky-100"
                              : "text-blue-600 group-hover:text-blue-900"
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* --- INDAH PAGINATION --- */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-7 px-4 pb-5 gap-3">
            <p
              className={`text-sm mb-2 md:mb-0 tracking-wide ${
                darkMode ? "text-blue-100/80" : "text-slate-500"
              }`}
            >
              Halaman{" "}
              <span className="font-bold">{page}</span> dari{" "}
              <span className="font-bold">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1 md:gap-2 select-none">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-3 py-2 rounded-lg border text-sm font-bold shadow transition disabled:opacity-60 disabled:cursor-not-allowed ${
                  darkMode
                    ? "border-blue-900 bg-blue-900/45 text-sky-300 hover:bg-sky-900/60"
                    : "border-slate-200 bg-white text-blue-600 hover:bg-blue-100"
                }`}
              >
                &laquo;
              </button>
              {getPaginationNumbers().map((p, idx) =>
                p === "..." ? (
                  <span
                    key={`dots-${idx}`}
                    className={`px-2 py-2 select-none font-bold ${
                      darkMode ? "text-blue-700/50" : "text-slate-400"
                    }`}
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-lg border text-sm font-bold shadow transition ${
                      p === page
                        ? darkMode
                          ? "bg-gradient-to-r from-sky-900 to-sky-700 border-sky-700 text-white"
                          : "bg-gradient-to-r from-blue-700 to-blue-500 border-blue-500 text-white"
                        : darkMode
                        ? "border-blue-900 bg-blue-950 text-sky-200 hover:bg-blue-900/70"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-blue-50"
                    }`}
                    style={
                      p === page
                        ? {
                            boxShadow:
                              "0 2px 8px 0 rgba(37, 99, 235, 0.18)",
                          }
                        : {}
                    }
                  >
                    {p}
                  </button>
                )
              )}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-3 py-2 rounded-lg border text-sm font-bold shadow transition disabled:opacity-60 disabled:cursor-not-allowed ${
                  darkMode
                    ? "border-blue-900 bg-blue-900/45 text-sky-300 hover:bg-sky-900/60"
                    : "border-slate-200 bg-white text-blue-600 hover:bg-blue-100"
                }`}
              >
                &raquo;
              </button>
            </div>
          </div>
        </div>

        {/* --- MODAL UNTUK ADD TRANSAKSI --- */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-all"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <div
              className={`rounded-3xl p-8 w-full max-w-2xl shadow-2xl animate-fadein-fast border transition-all duration-300 ${
                darkMode
                  ? "bg-gradient-to-br from-blue-950 to-slate-900 border-blue-900/40"
                  : "bg-white border-blue-100"
              }`}
            >
              <h2
                className={`text-3xl font-bold mb-7 tracking-tight text-center drop-shadow transition ${
                  darkMode ? "text-sky-200" : "text-blue-700"
                }`}
              >
                Tambah Transaksi
              </h2>
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                autoComplete="off"
              >
                <input
                  type="text"
                  placeholder="Nama Customer"
                  value={form.customer_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customer_name: e.target.value,
                    })
                  }
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition shadow placeholder:font-medium placeholder:tracking-wide font-medium ${
                    darkMode
                      ? "border-blue-900/60 bg-blue-900/30 text-blue-100 placeholder:text-sky-300/60 focus:border-sky-400"
                      : "border-blue-200 bg-blue-50/70 text-blue-700 placeholder:text-blue-300/80 focus:border-blue-500"
                  }`}
                  required
                />

                <select
                  value={form.payment_method}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      payment_method: e.target.value,
                    })
                  }
                  className={`w-full border rounded-xl px-4 py-3 focus:outline-none transition shadow font-medium ${
                    darkMode
                      ? "bg-blue-900/30 border-blue-900/60 text-blue-100 focus:border-sky-400"
                      : "bg-blue-50/70 border-blue-200 text-blue-700 focus:border-blue-500"
                  }`}
                >
                  <option value="Cash">Cash</option>
                  <option value="Transfer">Transfer</option>
                  <option value="QRIS">QRIS</option>
                </select>

                <div className="grid grid-cols-3 gap-4">
                  {/* Pilih Produk Select - dark mode menyesuaikan */}
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className={`border rounded-xl px-4 py-3 focus:outline-none transition shadow cursor-pointer ${
                      darkMode
                        ? "bg-blue-900/20 border-blue-900/50 text-blue-100 focus:border-sky-400"
                        : "bg-blue-50/70 border-blue-200 text-blue-700 focus:border-blue-500"
                    }`}
                    style={
                      darkMode
                        ? {
                            backgroundColor: "#151f3a",
                            color: "#dbeafe",
                            borderColor: "#1e293b",
                          }
                        : {}
                    }
                  >
                    <option
                      value=""
                      className={darkMode ? "bg-blue-900 text-blue-100" : ""}
                    >
                      Pilih Produk
                    </option>
                    {products.map((product) => (
                      <option
                        key={product.id}
                        value={product.id}
                        className={darkMode ? "bg-[#151f3a] text-blue-100" : ""}
                        style={
                          darkMode
                            ? {
                                backgroundColor: "#151f3a",
                                color: "#dbeafe",
                              }
                            : {}
                        }
                      >
                        {product.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className={`border rounded-xl px-4 py-3 focus:outline-none transition shadow ${
                      darkMode
                        ? "bg-blue-900/20 border-blue-900/50 text-blue-100 focus:border-sky-400"
                        : "bg-blue-50/70 border-blue-200 text-blue-700 focus:border-blue-500"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-800 transition text-white rounded-xl shadow font-bold"
                  >
                    Tambah
                  </button>
                </div>

                {/* Table with remove button */}
                <div
                  className={`border rounded-xl overflow-hidden shadow transition ${
                    darkMode
                      ? "bg-blue-950/40 border-blue-900/40"
                      : "bg-white/75 border-blue-100"
                  }`}
                >
                  <table
                    className={`w-full ${
                      darkMode ? "text-blue-100" : "text-blue-700"
                    }`}
                  >
                    <thead>
                      <tr>
                        <th
                          className={`p-3 bg-blue-100 font-bold text-left ${
                            darkMode
                              ? "bg-blue-950/60 text-blue-200"
                              : "bg-blue-50 text-slate-600"
                          }`}
                        >
                          Produk
                        </th>
                        <th
                          className={`p-3 bg-blue-100 font-bold text-center ${
                            darkMode
                              ? "bg-blue-950/60 text-blue-200"
                              : "bg-blue-50 text-slate-600"
                          }`}
                        >
                          Qty
                        </th>
                        <th
                          className={`p-3 bg-blue-100 font-bold text-right ${
                            darkMode
                              ? "bg-blue-950/60 text-blue-200"
                              : "bg-blue-50 text-slate-600"
                          }`}
                        >
                          Harga
                        </th>
                        <th
                          className={`p-3 bg-blue-100 font-bold text-right ${
                            darkMode
                              ? "bg-blue-950/60 text-blue-200"
                              : "bg-blue-50 text-slate-600"
                          }`}
                        >
                          Subtotal
                        </th>
                        <th
                          className={`p-3 bg-blue-100 font-bold text-center ${
                            darkMode
                              ? "bg-blue-950/60 text-blue-200"
                              : "bg-blue-50 text-slate-600"
                          }`}
                        >
                          Hapus
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.items.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className={`py-4 text-center font-semibold italic ${
                              darkMode
                                ? "text-blue-200/60"
                                : "text-blue-300"
                            }`}
                          >
                            Belum ada produk ditambahkan.
                          </td>
                        </tr>
                      ) : (
                        form.items.map((item) => (
                          <tr
                            key={item.product_id}
                            className={`border-t ${
                              darkMode
                                ? "border-blue-900/30"
                                : ""
                            }`}
                          >
                            <td className="p-3">{item.name}</td>
                            <td className="p-3 text-center">
                              {item.quantity}
                            </td>
                            <td className="p-3 text-right">
                              Rp {Number(item.price).toLocaleString("id-ID")}
                            </td>
                            <td className="p-3 text-right font-medium">
                              Rp
                              {(
                                Number(item.price) * Number(item.quantity)
                              ).toLocaleString("id-ID")}
                            </td>
                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(item.product_id)
                                }
                                className={`group transition p-2 rounded-full border border-transparent ${
                                  darkMode
                                    ? "hover:bg-red-900/25 hover:border-red-900/40"
                                    : "hover:bg-red-50 hover:border-red-200"
                                }`}
                                title="Hapus produk dari keranjang"
                              >
                                <FaTrash
                                  className={`transition text-lg ${
                                    darkMode
                                      ? "text-red-400 group-hover:text-red-600"
                                      : "text-red-400 group-hover:text-red-600"
                                  }`}
                                />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div
                  className={`text-right text-2xl font-extrabold mt-5 ${
                    darkMode ? "text-blue-100" : "text-blue-700"
                  }`}
                >
                  Total: Rp {totalAmount.toLocaleString("id-ID")}
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`px-4 py-2 border rounded-xl transition shadow font-semibold ${
                      darkMode
                        ? "border-blue-900 bg-blue-900/40 text-blue-100 hover:bg-blue-900/70"
                        : "border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100"
                    }`}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-700 shadow-lg text-white rounded-xl font-extrabold transition hover:from-blue-800 hover:to-sky-600"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <div
              className={`rounded-2xl p-7 w-full max-w-md shadow-2xl animate-fadein-fast border transition-all duration-300 ${
                darkMode
                  ? "bg-gradient-to-br from-red-900/30 to-blue-950 border-red-900/40"
                  : "bg-white border-red-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaTrash
                  className={`text-2xl ${darkMode ? "text-red-400" : "text-red-600"}`}
                />
                <h2
                  className={`text-xl font-extrabold mb-0 ${
                    darkMode ? "text-red-100" : "text-red-600"
                  }`}
                >
                  Konfirmasi Hapus Transaksi
                </h2>
              </div>
              <p
                className={`mt-3 mb-7 text-md ${
                  darkMode ? "text-blue-200" : "text-slate-600"
                }`}
              >
                Yakin ingin menghapus transaksi
                <span className={`font-bold pl-1 ${
                  darkMode ? "text-sky-100" : "text-blue-700"
                }`}>
                  {selectedSale?.invoice_number}
                </span>
                ?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className={`px-4 py-2 border rounded-xl transition font-semibold ${
                    darkMode
                      ? "border-blue-900 bg-blue-900/30 text-blue-100 hover:bg-blue-900/60"
                      : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className={`px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-bold transition hover:from-red-700 hover:to-red-800 shadow`}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DETAIL TRANSAKSI */}
        {showDetailModal && saleDetail && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            style={{ backdropFilter: "blur(2px)" }}
          >
            <div
              className={`rounded-3xl w-full max-w-3xl p-8 border shadow-2xl animate-fadein-fast transition-all duration-300 ${
                darkMode
                  ? "bg-gradient-to-br from-blue-950 to-slate-900 border-blue-900/40"
                  : "bg-white border-blue-100"
              }`}
            >
              <div className="flex justify-between items-center mb-7">
                <h2
                  className={`text-3xl font-bold tracking-tight drop-shadow ${
                    darkMode ? "text-sky-200" : "text-blue-700"
                  }`}
                >
                  Detail Transaksi
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => generateInvoice(saleDetail)}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 shadow-md hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl transition font-semibold"
                  >
                    <FaPrint /> Cetak PDF
                  </button>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className={`text-2xl font-bold px-3 py-1 rounded-full transition ${
                      darkMode
                        ? "text-blue-400 hover:text-blue-100 hover:bg-blue-900/40"
                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                    title="Tutup"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className={`${
                    darkMode ? "text-blue-300/80" : "text-slate-400"
                  }`}>
                    Invoice
                  </p>
                  <p
                    className={`font-bold ${
                      darkMode ? "text-blue-200" : "text-blue-800"
                    }`}
                  >
                    {saleDetail.invoice_number}
                  </p>
                </div>
                <div>
                  <p className={`${
                    darkMode ? "text-blue-300/80" : "text-slate-400"
                  }`}>
                    Customer
                  </p>
                  <p
                    className={`font-bold ${
                      darkMode ? "text-blue-200" : "text-blue-800"
                    }`}
                  >
                    {saleDetail.customer_name}
                  </p>
                </div>
                <div>
                  <p className={`${
                    darkMode ? "text-blue-300/80" : "text-slate-400"
                  }`}>
                    Payment
                  </p>
                  <p
                    className={`font-bold ${
                      darkMode ? "text-blue-200" : "text-blue-800"
                    }`}
                  >
                    {saleDetail.payment_method}
                  </p>
                </div>
                <div>
                  <p className={`${
                    darkMode ? "text-blue-300/80" : "text-slate-400"
                  }`}>
                    Tanggal
                  </p>
                  <p
                    className={`font-bold ${
                      darkMode ? "text-blue-200" : "text-blue-800"
                    }`}
                  >
                    {saleDetail.created_at
                      ? new Date(saleDetail.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "-"}
                  </p>
                </div>
              </div>

              <table
                className={`w-full border rounded-xl overflow-hidden mb-3 ${
                  darkMode
                    ? "bg-blue-900/30 border-blue-900"
                    : "bg-blue-50/60 border-blue-100"
                }`}
              >
                <thead
                  className={`${
                    darkMode
                      ? "bg-blue-950/60"
                      : "bg-blue-100"
                  }`}
                >
                  <tr>
                    <th
                      className={`p-3 text-left font-bold ${
                        darkMode ? "text-blue-100" : "text-blue-800"
                      }`}
                    >
                      Produk
                    </th>
                    <th
                      className={`p-3 text-left font-bold ${
                        darkMode ? "text-blue-100" : "text-blue-800"
                      }`}
                    >
                      Kategori
                    </th>
                    <th
                      className={`p-3 text-center font-bold ${
                        darkMode ? "text-blue-100" : "text-blue-800"
                      }`}
                    >
                      Qty
                    </th>
                    <th
                      className={`p-3 text-right font-bold ${
                        darkMode ? "text-blue-100" : "text-blue-800"
                      }`}
                    >
                      Harga
                    </th>
                    <th
                      className={`p-3 text-right font-bold ${
                        darkMode ? "text-blue-100" : "text-blue-800"
                      }`}
                    >
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {saleDetail.items &&
                    saleDetail.items.map((item) => (
                      <tr
                        key={item.id || item.product_id}
                        className={`border-t ${
                          darkMode ? "border-blue-900/40" : "border-blue-100"
                        }`}
                      >
                        <td className="p-3">{item.product_name}</td>
                        <td className="p-3">{item.category || "-"}</td>
                        <td className="p-3 text-center">
                          {item.quantity}
                        </td>
                        <td className="p-3 text-right">
                          Rp {Number(item.price).toLocaleString("id-ID")}
                        </td>
                        <td className="p-3 text-right">
                          Rp
                          {Number(
                            item.subtotal ||
                              item.price * item.quantity
                          ).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div
                className={`text-right mt-6 text-2xl font-extrabold ${
                  darkMode ? "text-blue-100" : "text-blue-700"
                }`}
              >
                Total: Rp{" "}
                {Number(saleDetail.total_amount).toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        )}

        {/* Success Animation Modal (Delete) */}
        {showDeleteSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className={`relative rounded-2xl flex flex-col items-center p-8 w-full max-w-xs animate-slide-scale shadow-lg overflow-hidden border transition-all duration-300 ${
                darkMode
                  ? "bg-gradient-to-br from-green-900/60 to-slate-900 border-green-800"
                  : "bg-white border-green-300"
              }`}
            >
              <div className="absolute -top-5 -left-5 w-24 h-24 rounded-full border-4 border-green-400 opacity-40 animate-glow-blur pointer-events-none"></div>
              <svg
                className="mb-4 text-green-500 animate-bounce-in"
                width="70"
                height="70"
                fill="none"
                viewBox="0 0 70 70"
              >
                <circle
                  cx="35"
                  cy="35"
                  r="33"
                  stroke="#22C55E"
                  strokeWidth="4"
                  fill={darkMode ? "#25d396" : "#dcfce7"}
                />
                <path
                  d="M23 37.5l10 10 18-18"
                  stroke="#22C55E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className={`text-lg font-bold animate-text-pop ${
                  darkMode ? "text-emerald-200" : "text-green-600"
                }`}
              >
                Data berhasil dihapus!
              </span>
            </div>
            <style>
              {`
              @keyframes fadein-fast {
                from { opacity: 0; transform: translateY(10px);}
                to { opacity: 1; transform: translateY(0);}
              }
              .animate-fadein-fast {
                animation: fadein-fast 0.28s;
              }
              @keyframes slide-scale {
                from {
                  opacity: 0;
                  transform: scale(0.95) translateY(40px);
                }
                70% {
                  transform: scale(1.02) translateY(-5px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
              .animate-slide-scale {
                animation: slide-scale 0.47s cubic-bezier(.34,1.56,.64,1);
              }
              @keyframes text-pop {
                from {transform: scale(0.95);}
                75% {transform: scale(1.07);}
                to {transform: scale(1);}
              }
              .animate-text-pop {
                animation: text-pop 0.22s 0.23s both;
              }
              @keyframes bounce-in {
                0% {
                  transform: scale(0.7);
                  opacity: 0;
                }
                50% {
                  transform: scale(1.15);
                  opacity: 1;
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              .animate-bounce-in {
                animation: bounce-in 0.37s cubic-bezier(.68,-0.55,.27,1.55);
              }
              @keyframes glow-blur {
                0%, 100% { opacity: 0.25; filter: blur(15px);}
                50% { opacity: 0.5; filter: blur(21px);}
              }
              .animate-glow-blur {
                animation: glow-blur 1.24s infinite alternate;
              }
              `}
            </style>
          </div>
        )}

        {/* Success Animation Modal (Add) */}
        {showAddSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className={`relative rounded-2xl flex flex-col items-center p-8 w-full max-w-xs animate-slide-scale shadow-lg overflow-hidden border transition-all duration-300 ${
                darkMode
                  ? "bg-gradient-to-br from-blue-900/60 to-slate-900 border-sky-800"
                  : "bg-white border-blue-300"
              }`}
            >
              <div className="absolute -top-5 -left-5 w-24 h-24 rounded-full border-4 border-blue-400 opacity-40 animate-glow-blur pointer-events-none"></div>
              <svg
                className="mb-4 text-blue-500 animate-bounce-in"
                width="70"
                height="70"
                fill="none"
                viewBox="0 0 70 70"
              >
                <circle
                  cx="35"
                  cy="35"
                  r="33"
                  stroke="#2563eb"
                  strokeWidth="4"
                  fill={darkMode ? "#0ea5e9" : "#dbeafe"}
                />
                <path
                  d="M23 37.5l10 10 18-18"
                  stroke="#2563eb"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span
                className={`text-lg font-bold animate-text-pop ${
                  darkMode ? "text-sky-200" : "text-blue-600"
                }`}
              >
                Transaksi berhasil ditambahkan!
              </span>
            </div>
            <style>
              {`
              @keyframes fadein-fast {
                from { opacity: 0; transform: translateY(10px);}
                to { opacity: 1; transform: translateY(0);}
              }
              .animate-fadein-fast {
                animation: fadein-fast 0.24s;
              }
              @keyframes slide-scale {
                from {
                  opacity: 0;
                  transform: scale(0.95) translateY(40px);
                }
                70% {
                  transform: scale(1.02) translateY(-5px);
                }
                to {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
              .animate-slide-scale {
                animation: slide-scale 0.5s cubic-bezier(.34,1.56,.64,1);
              }
              @keyframes text-pop {
                from {transform: scale(0.95);}
                75% {transform: scale(1.07);}
                to {transform: scale(1);}
              }
              .animate-text-pop {
                animation: text-pop 0.21s 0.22s both;
              }
              @keyframes bounce-in {
                0% {
                  transform: scale(0.7);
                  opacity: 0;
                }
                50% {
                  transform: scale(1.15);
                  opacity: 1;
                }
                100% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              .animate-bounce-in {
                animation: bounce-in 0.38s cubic-bezier(.68,-0.55,.27,1.55);
              }
              @keyframes glow-blur {
                0%, 100% { opacity: 0.25; filter: blur(15px);}
                50% { opacity: 0.48; filter: blur(19px);}
              }
              .animate-glow-blur {
                animation: glow-blur 1.29s infinite alternate;
              }
              `}
            </style>
          </div>
        )}
      </div>
    </div>
  );
}

