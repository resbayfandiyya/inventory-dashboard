import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { FaCamera } from "react-icons/fa";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

export default function Profile() {
  const { darkMode } = useTheme();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const [preview, setPreview] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile");
      setForm({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        password: "",
      });
      setPreview(
        response.data.avatar
          ? `http://localhost:5000/uploads/${response.data.avatar}`
          : ""
      );
    } catch (error) {
      toast.error("Gagal mengambil profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarLoading(true);
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
    setTimeout(() => setAvatarLoading(false), 400);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);

      if (avatar) {
        formData.append("avatar", avatar);
      }

      const response = await api.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("Profil berhasil diperbarui!");
      setForm(f => ({ ...f, password: "" }));
      fetchProfile();
    } catch (error) {
      toast.error("Gagal update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={[
          "min-h-[calc(100vh-6rem)] flex items-center justify-center py-8 transition-colors duration-300",
          "bg-gradient-to-br",
          darkMode
            ? "from-gray-900 via-gray-950 to-blue-950"
            : "from-blue-100 via-white to-blue-50"
        ].join(" ")}
      >
        <div
          className={[
            "relative w-full max-w-2xl rounded-3xl shadow-2xl p-8 md:p-12 border",
            darkMode
              ? "bg-[#161f2f] border-blue-900/60"
              : "bg-white border-blue-100",
            "transition-colors duration-300"
          ].join(" ")}
        >
          {/* Header */}
          <div className="mb-10 flex flex-col items-center gap-1">
            <h1
              className={[
                "text-3xl md:text-4xl font-bold tracking-tight drop-shadow-sm text-center mb-1",
                darkMode ? "text-blue-200" : "text-blue-800"
              ].join(" ")}
            >
              Pengaturan Profil
            </h1>
            <p
              className={[
                "text-center text-base",
                darkMode ? "text-blue-300/70" : "text-gray-500"
              ].join(" ")}
            >
              Kelola informasi pribadi & keamanan akun Anda.
            </p>
          </div>

          {/* Avatar Upload */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="relative group">
              <img
                src={
                  preview ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(form.name || "User") +
                    `&background=${darkMode ? "181E2A" : "2563eb"}&color=${darkMode ? "bde0fe" : "fff"}&size=160&rounded=true`
                }
                alt="avatar"
                className={[
                  "w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 shadow-lg select-none",
                  avatarLoading && "opacity-60 grayscale blur-[1px]",
                  darkMode
                    ? "border-blue-900/40 bg-blue-950"
                    : "border-blue-100 bg-white"
                ].join(" ")}
                style={{ transition: "all .27s cubic-bezier(.5,1.9,.5,.7)" }}
              />
              <button
                type="button"
                onClick={handleAvatarClick}
                className={[
                  "absolute bottom-2 right-2 p-2 rounded-full shadow-xl border-2 transition duration-200",
                  "group-hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2",
                  darkMode
                    ? "bg-gradient-to-tr from-sky-700 to-blue-900 text-blue-100 border-blue-800 hover:bg-blue-800"
                    : "bg-blue-600 text-white border-blue-300 hover:bg-blue-700"
                ].join(" ")}
                title="Ubah Foto Profil"
                aria-label="Ubah foto"
              >
                <FaCamera size={20} />
              </button>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />
            </div>
            <span className={
                [
                  "text-xs italic mt-1 select-none transition-colors duration-200",
                  avatar
                    ? darkMode
                      ? "text-blue-200"
                      : "text-blue-700"
                    : darkMode
                      ? "text-blue-300/80"
                      : "text-gray-400"
                ].join(" ")
              }>
              {avatar ? avatar.name : "Format: JPEG, PNG. Maks 2MB."}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 animate-fadein-fast">
            <div>
              <label
                className={[
                  "block mb-2 font-semibold transition-colors duration-150",
                  darkMode ? "text-blue-300" : "text-blue-700"
                ].join(" ")}
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={[
                  "w-full border rounded-xl px-4 py-3 outline-none transition-colors duration-200",
                  darkMode
                    ? "bg-blue-950/60 border-blue-900 text-blue-100 focus:ring-2 focus:ring-blue-900/30 placeholder:text-blue-100/50"
                    : "bg-blue-50/40 border-blue-200 text-blue-900 focus:ring-2 focus:ring-blue-200"
                ].join(" ")}
                disabled={loading}
                required
              />
            </div>
            <div>
              <label
                className={[
                  "block mb-2 font-semibold transition-colors duration-150",
                  darkMode ? "text-blue-300" : "text-blue-700"
                ].join(" ")}
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={[
                  "w-full border rounded-xl px-4 py-3 outline-none transition-colors duration-200",
                  darkMode
                    ? "bg-blue-950/60 border-blue-900 text-blue-100 focus:ring-2 focus:ring-blue-900/30 placeholder:text-blue-100/60"
                    : "bg-blue-50/40 border-blue-200 text-blue-900 focus:ring-2 focus:ring-blue-200"
                ].join(" ")}
                disabled={loading}
                required
              />
            </div>
            <div>
              <label
                className={[
                  "block mb-2 font-semibold transition-colors duration-150",
                  darkMode ? "text-blue-300" : "text-blue-700"
                ].join(" ")}
              >
                Role
              </label>
              <input
                value={form.role}
                disabled
                className={[
                  "w-full border rounded-xl px-4 py-3 select-none transition-colors duration-200",
                  darkMode
                    ? "bg-gray-900 border-blue-900 text-blue-300 placeholder:text-blue-300/70"
                    : "bg-slate-100 border-blue-200 text-gray-400"
                ].join(" ")}
              />
            </div>
            <div>
              <label
                className={[
                  "block mb-2 font-semibold transition-colors duration-150",
                  darkMode ? "text-blue-300" : "text-blue-700"
                ].join(" ")}
              >
                Password Baru
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Kosongkan jika tidak ingin mengubah password"
                className={[
                  "w-full border rounded-xl px-4 py-3 outline-none transition-all duration-200",
                  darkMode
                    ? "bg-blue-950/60 border-blue-900 text-blue-100 focus:ring-2 focus:ring-blue-900/30 placeholder:text-blue-100/40"
                    : "bg-blue-50/40 border-blue-200 text-blue-900 focus:ring-2 focus:ring-blue-200"
                ].join(" ")}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className={[
                "w-full mt-2 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300",
                loading && "opacity-50 cursor-not-allowed",
                darkMode
                  ? "bg-gradient-to-r from-blue-800 to-sky-900 text-blue-100 hover:from-blue-900 hover:to-sky-800 hover:shadow-xl"
                  : "bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:from-blue-700 hover:to-sky-600 hover:shadow-xl"
              ].join(" ")}
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
        <style>
          {`
            @keyframes fadein-fast {
              from { opacity: 0; transform: translateY(15px);}
              to { opacity: 1; transform: translateY(0);}
            }
            .animate-fadein-fast {
              animation: fadein-fast 0.42s cubic-bezier(.32,1.72,.47,.99);
            }
          `}
        </style>
      </div>
    </>
  );
}

