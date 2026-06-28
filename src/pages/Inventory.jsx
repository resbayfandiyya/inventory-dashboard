import { useEffect, useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

// PAGINATION ala Sales.jsx
function FancyPagination({ page, setPage, totalPages, dark }) {
  if (totalPages === 0) return null;

  // Algoritma halaman dinamis (similar ke Sales.jsx)
  let pages = [];
  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (page <= 4) {
    pages = [1, 2, 3, 4, 5, "...", totalPages];
  } else if (page >= totalPages - 3) {
    pages = [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  } else {
    pages = [
      1,
      "...",
      page - 1,
      page,
      page + 1,
      "...",
      totalPages,
    ];
  }

  const btnClass = base =>
    "transition border px-2 py-2 md:px-3 md:py-2 rounded-lg text-base font-semibold shadow " +
    base +
    (dark
      ? " bg-[#101c2e] border-cyan-900 text-cyan-200 hover:bg-cyan-800/40"
      : " bg-white border-blue-100 text-blue-800 hover:bg-sky-200/50");

  return (
    <nav className="select-none mt-6 pb-8 flex items-center justify-center gap-1 md:gap-2">
      <button
        aria-label="Halaman Pertama"
        disabled={page === 1}
        className={
          btnClass("") +
          (page === 1
            ? " cursor-not-allowed opacity-40"
            : dark
            ? " hover:text-cyan-300"
            : " hover:text-blue-600")
        }
        onClick={() => setPage(1)}
      >
        <FaAngleDoubleLeft />
      </button>
      <button
        aria-label="Sebelumnya"
        disabled={page === 1}
        className={
          btnClass("") +
          (page === 1
            ? " cursor-not-allowed opacity-40"
            : dark
            ? " hover:text-cyan-400"
            : " hover:text-blue-600")
        }
        onClick={() => setPage(page - 1)}
      >
        <FaAngleLeft />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className={
              "mx-1.5 px-0.5 font-black text-lg md:text-xl tracking-wider " +
              (dark ? "text-cyan-300/40" : "text-blue-400/50")
            }
            style={{ userSelect: "none", pointerEvents: "none" }}
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            aria-current={p === page ? "page" : undefined}
            className={
              btnClass(
                p === page
                  ? dark
                    ? " !bg-cyan-700 text-white border-cyan-600 ring-2 ring-cyan-400/15 shadow-lg scale-105 font-extrabold"
                    : " !bg-sky-100 text-blue-900 border-sky-400 ring-2 ring-sky-400/15 shadow-lg scale-105 font-extrabold"
                  : ""
              )
            }
            onClick={() => setPage(p)}
            disabled={p === page}
            style={{
              minWidth: "2.45rem",
              outline: p === page ? "none" : undefined,
            }}
          >
            {p}
          </button>
        )
      )}
      <button
        aria-label="Berikutnya"
        disabled={page === totalPages}
        className={
          btnClass("") +
          (page === totalPages
            ? " cursor-not-allowed opacity-40"
            : dark
            ? " hover:text-cyan-300"
            : " hover:text-blue-600")
        }
        onClick={() => setPage(page + 1)}
      >
        <FaAngleRight />
      </button>
      <button
        aria-label="Halaman Terakhir"
        disabled={page === totalPages}
        className={
          btnClass("") +
          (page === totalPages
            ? " cursor-not-allowed opacity-40"
            : dark
            ? " hover:text-cyan-400"
            : " hover:text-blue-600")
        }
        onClick={() => setPage(totalPages)}
      >
        <FaAngleDoubleRight />
      </button>
    </nav>
  );
}

function ConfettiAnimation({ dark }) {
  const bags = Array.from({ length: 40 });
  const randoms = Array.from({ length: 40 }, () => [
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
    Math.random(),
  ]);

  return (
    <div
      style={{
        pointerEvents: "none",
        position: "fixed",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: 99,
      }}
    >
      {bags.map((_, idx) => {
        const [rand1, rand2, rand3, rand4, rand5] = randoms[idx];
        const left = rand1 * 98 + 1;
        const duration = 1.3 + rand2 * 1.8;
        const delay = rand3 * 1.3;
        const rotate = rand4 * 360;
        const size = rand5 * 15 + 10;
        const colorsDark = [
          "#06b6d4",
          "#818cf8",
          "#10b981",
          "#c026d3",
          "#fde68a",
          "#38bdf8",
          "#ff6bcb",
          "#64748b",
          "#f472b6",
        ];
        const colorsLight = [
          "#5bcefa",
          "#b6e0fe",
          "#fbbf24",
          "#d1d5db",
          "#be185d",
          "#818cf8",
          "#16a34a",
        ];
        const color = (dark ? colorsDark : colorsLight)[
          Math.floor(rand1 * (dark ? colorsDark.length : colorsLight.length))
        ];
        const style = {
          position: "absolute",
          top: "-30px",
          left: `${left}%`,
          width: `${size}px`,
          height: `${size * 0.6}px`,
          background: color,
          borderRadius: rand2 > 0.5 ? "50%" : "8px",
          opacity: dark ? 0.96 : 0.68,
          transform: `rotate(${rotate}deg)`,
          zIndex: 999,
          animation: `dropConfetti ${duration}s ${delay}s ease-out forwards`,
          boxShadow: dark
            ? "0 0 12px 0 rgba(56,189,248,0.17)"
            : "0 0 8px 0 rgba(39,123,221,0.08)",
        };
        return <div key={idx} style={style}></div>;
      })}
      <style>{`
        @keyframes dropConfetti {
          0% { opacity: 1; transform: translateY(-15px) rotate(0deg) scale(1);}
          75% { opacity: 1;}
          100% { opacity: 0.61; transform: translateY(89vh) rotate(351deg) scale(.99);}
        }
      `}</style>
    </div>
  );
}

function ModalWrapper({ children, onClose }) {
  const { darkMode: dark } = useTheme();
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200]">
      <div
        className={
          "absolute inset-0 transition-all duration-200 z-[201] " +
          (dark
            ? "bg-gradient-to-br from-[#0e162b]/85 via-[#0c172f]/90 to-slate-900/92 backdrop-blur-[3px]"
            : "bg-black/10 backdrop-blur-[1.4px]")
        }
        onClick={onClose}
      />
      <div className="relative z-[202]">{children}</div>
    </div>
  );
}

function FancyInput({ className, ...props }) {
  const { darkMode: dark } = useTheme();
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl px-5 py-3 transition outline-none " +
        (dark
          ? "border border-blue-900 bg-[#191f38] text-blue-100 placeholder:text-blue-400 focus:border-cyan-400 focus:bg-[#232a50] focus:ring-2 focus:ring-cyan-400/40 shadow-sm "
          : "border border-sky-200 bg-white text-blue-900 placeholder:text-slate-400 focus:border-sky-400 focus:bg-blue-50 focus:ring-2 focus:ring-sky-400/40 shadow-sm ") +
        (className || "")
      }
    />
  );
}
function FancyButton({ children, className, ...props }) {
  return (
    <button
      className={
        "transition px-5 py-3 rounded-xl font-semibold focus:outline-none hover:scale-[1.035] active:scale-[.985] shadow " +
        (className ?? "")
      }
      {...props}
    >
      {children}
    </button>
  );
}
function StatusPill({ children, color }) {
  const { darkMode: dark } = useTheme();
  let styles =
    "px-3 py-1 rounded-full text-xs font-bold tracking-wide inline-block whitespace-nowrap transition ";
  switch (color) {
    case "red":
      styles += dark
        ? "bg-red-800/60 text-red-200 border border-red-600"
        : "bg-red-100 text-red-800 border border-red-400";
      break;
    case "yellow":
      styles += dark
        ? "bg-yellow-900/40 text-yellow-100 border border-yellow-600"
        : "bg-yellow-50 text-yellow-800 border border-yellow-300";
      break;
    case "green":
      styles += dark
        ? "bg-green-800/40 text-green-200 border border-green-600"
        : "bg-green-100 text-green-800 border border-green-500";
      break;
    default:
      styles += dark
        ? "bg-slate-800/55 text-blue-100 border border-blue-900"
        : "bg-blue-100 text-blue-800 border border-blue-200";
  }
  return <span className={styles}>{children}</span>;
}
function Label({ children }) {
  const { darkMode: dark } = useTheme();
  return (
    <label
      className={
        "block mb-1 font-medium text-sm transition " +
        (dark ? "text-blue-100" : "text-blue-900")
      }
    >
      {children}
    </label>
  );
}

export default function Inventory() {
  const { darkMode: dark } = useTheme();

  // States
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEditSuccess, setShowEditSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
  });
  const [form, setForm] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Fetch Data
  const fetchInventory = async () => {
    try {
      const response = await api.get("/inventory", {
        params: {
          page,
          limit: 10,
          search,
        },
      });

      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
    // eslint-disable-next-line
  }, [page, search]);

  // Handler
  const handleSearch = (value) => {
    setSearchValue(value);
    setSearch(value);
    setPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/inventory", {
        ...form,
        stock: Number(form.stock),
        price: Number(form.price),
      });
      await fetchInventory();
      setShowModal(false);
      setForm({ name: "", category: "", stock: "", price: "" });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2200);
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan produk");
    }
  };

  const openEditModal = (item) => {
    setEditProductId(item.id);
    setEditForm({
      name: item.name,
      category: item.category,
      stock: item.stock,
      price: item.price,
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/inventory/${editProductId}`, {
        ...editForm,
        stock: Number(editForm.stock),
        price: Number(editForm.price),
      });
      await fetchInventory();
      setShowEditModal(false);
      setEditProductId(null);
      setEditForm({ name: "", category: "", stock: "", price: "" });
      setShowEditSuccess(true);
      setTimeout(() => setShowEditSuccess(false), 2000);
    } catch (error) {
      console.error(error);
      alert("Gagal mengedit produk");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/inventory/${selectedId}`);
      await fetchInventory();
      setShowDeleteModal(false);
      setSelectedId(null);
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 1900);
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus produk");
    }
  };

  const getStatus = (stock) => {
    if (stock === 0) return "Habis";
    if (stock <= 20) return "Stok Menipis";
    return "Tersedia";
  };

  const getStatusStyle = (stock) => {
    if (stock === 0) return "red";
    if (stock <= 20) return "yellow";
    return "green";
  };

  // RENDER ---------------------------------
  return (
    <div
      className={
        "min-h-screen pb-14 px-2 md:px-4 xl:px-0 transition-colors duration-500 " +
        (dark
          ? "bg-gradient-to-tl from-blue-900 via-[#18213b] to-slate-950"
          : "bg-gradient-to-br from-[#e6f2fd] via-white to-[#f2fbff]")
      }
    >
      {(showSuccess || showEditSuccess || showDeleteSuccess) && (
        <div className="fixed inset-0 flex items-center justify-center z-[120] pointer-events-none select-none">
          <ConfettiAnimation dark={dark} />
          <div
            className={
              "flex flex-col items-center justify-center absolute inset-0 " +
              (dark
                ? "bg-blue-900/55 backdrop-blur-[2.5px]"
                : "bg-blue-100/40 backdrop-blur-[2.5px]")
            }
          >
            <div
              className={
                "rounded-2xl flex flex-col items-center px-7 md:px-10 py-7 md:py-8 border-2 animate-scalein text-center shadow-2xl " +
                (dark
                  ? "bg-gradient-to-b from-[#0b1931]/95 via-[#192958]/99 to-slate-900/96 border-cyan-800/30"
                  : "bg-gradient-to-b from-blue-100/95 via-white/98 to-blue-50/92 border-blue-200")
              }
            >
              <FaCheckCircle
                className={
                  "text-5xl md:text-6xl mb-3 md:mb-4 " +
                  (showEditSuccess
                    ? dark
                      ? "text-blue-400"
                      : "text-blue-700"
                    : showDeleteSuccess
                    ? "text-red-400"
                    : dark
                    ? "text-green-400"
                    : "text-green-600")
                }
              />
              <p
                className={
                  "text-lg font-bold tracking-wide " +
                  (showEditSuccess
                    ? dark
                      ? "text-blue-100"
                      : "text-blue-700"
                    : showDeleteSuccess
                    ? dark
                      ? "text-red-200"
                      : "text-red-600"
                    : dark
                    ? "text-green-200"
                    : "text-green-700")
                }
              >
                {showEditSuccess
                  ? "Produk Diperbarui!"
                  : showDeleteSuccess
                  ? "Produk Berhasil Dihapus!"
                  : "Produk Ditambahkan!"}
              </p>
            </div>
          </div>
          <style>{`
            .animate-scalein {
              animation: scaleinbox .43s cubic-bezier(.59,1.71,.69,.41);
            }
            @keyframes scaleinbox {
              0% {transform:scale(.8) translateY(20px) ; opacity:0;}
              100% {transform:scale(1) translateY(0); opacity:1;}
            }
          `}</style>
        </div>
      )}

      {/* Header */}
      <section className="max-w-5xl mx-auto pt-10 md:pt-14 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-2 md:px-0">
        <div>
          <h1
            className={
              "text-4xl md:text-5xl font-extrabold tracking-tight mb-1 " +
              (dark ? "text-cyan-100" : "text-sky-800")
            }
          >
            Inventory{" "}
            <span
              className={
                dark
                  ? "text-cyan-400 bg-cyan-800/30 px-2 rounded-md"
                  : "text-sky-700 bg-sky-100 px-2 rounded-md"
              }
            >
              Management
            </span>
          </h1>
          <p
            className={
              "mt-2 text-base " +
              (dark ? "text-blue-100/70" : "text-blue-800/70")
            }
          >
            Kelola daftar produk & stok barang di toko Anda dengan tampilan yang{" "}
            <span className={dark ? "font-bold" : "font-semibold"}>
              menawan
            </span>
            .
          </p>
        </div>
        <FancyButton
          onClick={() => setShowModal(true)}
          className={
            "flex items-center gap-2 shadow-xl backdrop-blur-xl !px-7 md:!px-8 !py-2.5 md:!py-3 text-md md:text-lg border border-transparent mt-4 md:mt-0 font-semibold " +
            (dark
              ? "bg-gradient-to-tr text-white from-blue-900 via-cyan-900 to-purple-700 hover:from-cyan-800 hover:to-indigo-700"
              : "bg-gradient-to-tr text-sky-800 from-blue-100 via-cyan-100 to-indigo-100 hover:from-sky-300 hover:to-indigo-200")
          }
        >
          <FaPlus className="text-xl" />
          <span className="relative font-semibold tracking-wide">
            Tambah Produk
          </span>
        </FancyButton>
      </section>

      {/* Search Bar */}
      <section className="max-w-5xl mx-auto mb-6 px-2 md:px-0">
        <div className="relative">
          <FaSearch
            className={
              "absolute left-5 top-1/2 -translate-y-1/2 text-lg transition " +
              (dark ? "text-cyan-400/60" : "text-sky-400/60")
            }
          />
          <FancyInput
            type="text"
            placeholder="Cari produk, kategori, status, atau harga..."
            value={searchValue}
            onChange={e => handleSearch(e.target.value)}
            className={
              "pl-12 !py-3.5 text-base md:text-lg font-medium shadow focus:shadow-lg " +
              (dark
                ? "bg-[#202445] text-cyan-100"
                : "bg-blue-50 text-sky-800 border-sky-200")
            }
          />
        </div>
      </section>

      {/* TABLE */}
      <section
        className={
          "max-w-5xl mx-auto rounded-3xl shadow-2xl ring-1 overflow-x-auto transition px-0 md:px-0 border " +
          (dark
            ? "bg-gradient-to-br from-[#212b40]/93 via-[#111c25]/95 to-slate-950/97 ring-cyan-900 border-cyan-900/50"
            : "bg-gradient-to-br from-blue-50/95 via-white/100 to-blue-100/90 ring-blue-200 border-blue-100/60")
        }
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                {[
                  "No",
                  "Nama Produk",
                  "Kategori",
                  "Stok",
                  "Harga",
                  "Status",
                  "Aksi",
                ].map((th, i) => (
                  <th
                    key={th}
                    className={
                      (i === 6 ? "text-center " : "text-left ") +
                      "px-4 md:px-6 py-3 md:py-4 font-bold tracking-wide text-[14px] md:text-[15px] border-b " +
                      (dark
                        ? "border-cyan-900 text-cyan-100"
                        : "border-blue-200 text-sky-900")
                    }
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr
                  key={item.id}
                  className={
                    "border-b last:border-b-0 group transition hover:bg-cyan-700/12 " +
                    (dark
                      ? "border-cyan-900"
                      : "border-blue-100 hover:bg-sky-100/35")
                  }
                >
                  <td
                    className={
                      "px-4 md:px-6 py-3 md:py-4 text-sm font-semibold " +
                      (dark ? "text-cyan-300" : "text-sky-600")
                    }
                  >
                    {(page - 1) * 10 + index + 1}
                  </td>
                  <td
                    className={
                      "px-4 md:px-6 py-3 md:py-4 font-semibold text-base " +
                      (dark ? "text-cyan-100" : "text-sky-900")
                    }
                  >
                    {item.name}
                  </td>
                  <td
                    className={
                      "px-4 md:px-6 py-3 md:py-4 text-sm " +
                      (dark ? "text-cyan-200" : "text-sky-700")
                    }
                  >
                    {item.category}
                  </td>
                  <td
                    className={
                      "px-4 md:px-6 py-3 md:py-4 font-bold text-[15px] " +
                      (item.stock <= 10
                        ? dark
                          ? "text-red-300"
                          : "text-red-600"
                        : item.stock <= 20
                        ? dark
                          ? "text-yellow-200"
                          : "text-yellow-600"
                        : dark
                        ? "text-cyan-100"
                        : "text-sky-900")
                    }
                  >
                    {item.stock}
                  </td>
                  <td
                    className={
                      "px-4 md:px-6 py-3 md:py-4 text-sm " +
                      (dark ? "text-cyan-100" : "text-sky-800")
                    }
                  >
                    <span
                      className={
                        "font-semibold " +
                        (dark
                          ? "text-cyan-400 dark:text-cyan-300"
                          : "text-cyan-700")
                      }
                    >
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <StatusPill color={getStatusStyle(item.stock)}>
                      {getStatus(item.stock)}
                    </StatusPill>
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="flex justify-center items-center gap-2 md:gap-3">
                      <button
                        className={
                          "shadow-md py-2 px-2.5 rounded-xl transition flex items-center group/action " +
                          (dark
                            ? "bg-yellow-700/80 text-yellow-100 hover:bg-yellow-600 hover:text-yellow-50"
                            : "bg-yellow-100 text-yellow-900 hover:bg-yellow-200 hover:text-yellow-700")
                        }
                        title="Edit"
                        onClick={() => openEditModal(item)}
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedId(item.id);
                          setShowDeleteModal(true);
                        }}
                        className={
                          "shadow-md py-2 px-2.5 rounded-xl transition flex items-center group/action " +
                          (dark
                            ? "bg-red-700/80 text-red-200 hover:bg-red-600 hover:text-white"
                            : "bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800")
                        }
                        title="Hapus"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className={
                      "text-center py-14 text-lg font-semibold transition " +
                      (dark ? "text-cyan-200/70" : "text-sky-700/70")
                    }
                  >
                    Tidak ada produk ditemukan <span aria-hidden>😔</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination untuk tabel */}
        <FancyPagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          dark={dark}
        />
      </section>

      {/* Add Modal */}
      {showModal && (
        <ModalWrapper onClose={() => setShowModal(false)}>
          <form
            onSubmit={handleSubmit}
            className={
              "px-7 md:px-8 py-7 md:py-8 rounded-2xl w-[95vw] max-w-sm md:max-w-md shadow-2xl border ring-1 space-y-4 animate-fadein transition-colors duration-300 " +
              (dark
                ? "bg-gradient-to-b from-cyan-950/93 via-[#151e30]/97 to-[#141c32]/90 ring-cyan-900/60 border-cyan-900"
                : "bg-gradient-to-b from-blue-50/90 via-white/98 to-blue-100/95 ring-blue-200/60 border-blue-200/80")
            }
            autoComplete="off"
            onClick={e => e.stopPropagation()}
          >
            <h2
              className={
                "text-xl md:text-2xl font-extrabold tracking-wider mb-3 flex items-center gap-2 " +
                (dark ? "text-cyan-200" : "text-sky-700")
              }
            >
              <FaPlus className={dark ? "text-cyan-300" : "text-cyan-600"} /> Tambah Produk Baru
            </h2>
            <div>
              <Label>Nama Produk</Label>
              <FancyInput
                name="name"
                type="text"
                placeholder="Contoh: Sepatu Converse"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                maxLength={50}
                autoFocus
              />
            </div>
            <div>
              <Label>Kategori</Label>
              <FancyInput
                name="category"
                type="text"
                placeholder="Contoh: Fashion"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
                maxLength={26}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Label>Stok</Label>
                <FancyInput
                  name="stock"
                  type="number"
                  min={0}
                  max={9999}
                  step={1}
                  pattern="\d+"
                  placeholder="Stok"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                  required
                />
              </div>
              <div className="flex-1">
                <Label>Harga</Label>
                <FancyInput
                  name="price"
                  type="number"
                  min={0}
                  max={100000000}
                  step={500}
                  placeholder="Harga"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <FancyButton
                type="button"
                className={
                  "border font-bold " +
                  (dark
                    ? "border-cyan-900 bg-[#181c2b] hover:bg-slate-900 text-slate-200"
                    : "border-blue-200 bg-white hover:bg-blue-50 text-blue-900")
                }
                onClick={() => setShowModal(false)}
              >
                Batal
              </FancyButton>
              <FancyButton
                type="submit"
                className={
                  "font-bold " +
                  (dark
                    ? "bg-gradient-to-tr from-blue-900 to-cyan-800 text-cyan-100 hover:from-cyan-800 hover:to-cyan-600"
                    : "bg-gradient-to-tr from-sky-100 to-cyan-100 text-sky-800 hover:from-sky-200 hover:to-cyan-200")
                }
              >
                Simpan
              </FancyButton>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <ModalWrapper
          onClose={() => {
            setShowEditModal(false);
            setEditProductId(null);
          }}
        >
          <form
            onSubmit={handleEditSubmit}
            className={
              "px-7 md:px-8 py-7 md:py-8 rounded-2xl w-[95vw] max-w-sm md:max-w-md shadow-2xl border ring-1 space-y-4 animate-fadein transition-colors duration-300 " +
              (dark
                ? "bg-gradient-to-b from-cyan-950/94 via-[#151d30]/98 to-cyan-900/92 ring-cyan-900/60 border-cyan-900"
                : "bg-gradient-to-b from-blue-50/90 via-white/98 to-blue-100/95 ring-blue-200/60 border-blue-200/80")
            }
            autoComplete="off"
            onClick={e => e.stopPropagation()}
          >
            <h2
              className={
                "text-xl md:text-2xl font-extrabold tracking-wider mb-3 flex items-center gap-2 " +
                (dark ? "text-yellow-200" : "text-yellow-700")
              }
            >
              <FaEdit className={dark ? "text-yellow-200" : "text-yellow-600"} /> Edit Produk
            </h2>
            <div>
              <Label>Nama Produk</Label>
              <FancyInput
                type="text"
                placeholder="Nama Produk"
                maxLength={50}
                value={editForm.name}
                onChange={e =>
                  handleEditFormChange("name", e.target.value)
                }
                required
                autoFocus
              />
            </div>
            <div>
              <Label>Kategori</Label>
              <FancyInput
                type="text"
                placeholder="Kategori"
                maxLength={26}
                value={editForm.category}
                onChange={e =>
                  handleEditFormChange("category", e.target.value)
                }
                required
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Label>Stok</Label>
                <FancyInput
                  type="number"
                  min={0}
                  max={9999}
                  step={1}
                  placeholder="Stok"
                  value={editForm.stock}
                  onChange={e =>
                    handleEditFormChange("stock", e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex-1">
                <Label>Harga</Label>
                <FancyInput
                  type="number"
                  min={0}
                  max={100000000}
                  step={500}
                  placeholder="Harga"
                  value={editForm.price}
                  onChange={e =>
                    handleEditFormChange("price", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <FancyButton
                type="button"
                className={
                  "border font-bold " +
                  (dark
                    ? "border-cyan-900 bg-[#181c2b] hover:bg-slate-900 text-slate-200"
                    : "border-blue-200 bg-white hover:bg-blue-50 text-blue-900")
                }
                onClick={() => {
                  setShowEditModal(false);
                  setEditProductId(null);
                }}
              >
                Batal
              </FancyButton>
              <FancyButton
                type="submit"
                className={
                  "font-bold " +
                  (dark
                    ? "bg-gradient-to-tr from-blue-900 to-cyan-800 text-cyan-100 hover:from-cyan-700 hover:to-cyan-600"
                    : "bg-gradient-to-tr from-sky-100 to-cyan-100 text-sky-800 hover:from-sky-200 hover:to-cyan-200")
                }
              >
                Update
              </FancyButton>
            </div>
          </form>
        </ModalWrapper>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <ModalWrapper
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedId(null);
          }}
        >
          <div
            className={
              "rounded-2xl p-7 md:p-8 w-[90vw] max-w-sm shadow-2xl border ring-1 animate-fadein transition-colors duration-300 " +
              (dark
                ? "bg-gradient-to-b from-cyan-950/96 via-[#0d182d]/98 to-[#192447]/91 ring-cyan-900/60 border-cyan-900"
                : "bg-gradient-to-b from-blue-50/97 via-white/98 to-blue-100/91 ring-blue-200/60 border-blue-200/80")
            }
            onClick={e => e.stopPropagation()}
          >
            <h2
              className={
                "text-lg md:text-xl font-bold mb-3 flex items-center gap-2 " +
                (dark ? "text-red-200" : "text-red-700")
              }
            >
              <FaTrash className={dark ? "text-red-200" : "text-red-600"} /> Hapus Produk
            </h2>
            <p
              className={
                "mb-7 mt-2 " + (dark ? "text-cyan-200" : "text-blue-900")
              }
            >
              Apakah Anda yakin ingin menghapus produk ini dari daftar stok?
            </p>
            <div className="flex justify-end gap-3 mt-4">
              <FancyButton
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedId(null);
                }}
                className={
                  "border font-bold " +
                  (dark
                    ? "border-cyan-900 bg-[#181c2b] hover:bg-slate-900 text-cyan-100"
                    : "border-blue-200 bg-white hover:bg-blue-50 text-blue-900")
                }
              >
                Batal
              </FancyButton>
              <FancyButton
                onClick={handleDelete}
                className={
                  "font-bold " +
                  (dark
                    ? "bg-gradient-to-tr from-red-900 via-red-700 to-pink-800 text-red-100 hover:from-red-700 hover:to-pink-600"
                    : "bg-gradient-to-r from-red-100 via-pink-100 to-pink-300 text-red-700 hover:from-red-200 hover:to-pink-200")
                }
              >
                Hapus
              </FancyButton>
            </div>
          </div>
        </ModalWrapper>
      )}
      <style jsx="true">{`
        .animate-fadein {
          animation: fadeinmodal 0.23s;
        }
        @keyframes fadeinmodal {
          from {
            opacity: 0;
            transform: scale(0.973) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @media (max-width: 545px) {
          table { font-size: 14px;}
          th, td { padding-left: 10px !important; padding-right: 10px !important; }
        }
      `}</style>
    </div>
  );



}