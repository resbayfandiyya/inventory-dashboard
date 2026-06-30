import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login berhasil");

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1024 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.16 }}
        >
          <circle cx="200" cy="150" r="160" fill="#2563eb" />
          <circle cx="900" cy="600" r="210" fill="#60a5fa" />
          <ellipse cx="800" cy="200" rx="110" ry="60" fill="#2563eb" />
          <ellipse cx="400" cy="700" rx="120" ry="80" fill="#60a5fa" />
        </svg>
      </div>
      <form
        onSubmit={handleSubmit}
        className="relative bg-white bg-opacity-90 p-10 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in"
        style={{
          boxShadow:
            "0 8px 40px rgba(37,99,235,0.15), 0 2px 8px rgba(16,30,54,0.08)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="bg-blue-600 text-white w-16 h-16 flex items-center justify-center rounded-full shadow-lg mb-2">
            <svg
              className="w-10 h-10"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 drop-shadow-lg text-center">
            Selamat Datang
          </h1>
          <p className="text-base text-gray-600 text-center max-w-[80%]">
            Masuk ke akun InventoryPro Anda
          </p>
        </div>

        {/* Demo Credentials Box */}
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 shadow flex flex-col items-start">
            <div className="font-semibold text-blue-800 mb-2 text-sm tracking-wide">
              Demo Credentials
            </div>
            <div className="text-sm text-blue-900">
              <div className="flex items-center gap-1">
                <span className="w-16 inline-block font-medium text-blue-700">Email:</span>
                <span className="font-mono select-all">admin@gmail.com</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-16 inline-block font-medium text-blue-700">Password:</span>
                <span className="font-mono select-all">123456</span>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-green-700 text-xs">
              <svg className="inline w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 6.293a1 1 0 01.083 1.32l-.083.094-7.003 7.004a1 1 0 01-1.32.083l-.094-.083-3.003-3.003a1 1 0 011.32-1.497l.094.083 2.296 2.297 6.296-6.297a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Feel free to explore the application.</span>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <label className="block mb-2 font-medium text-blue-900">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200/40 outline-none rounded-xl px-4 py-3 transition shadow-sm bg-blue-50/40 placeholder:text-blue-400"
            required
            placeholder="nama@email.com"
            autoComplete="email"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-blue-900">
            Password
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-blue-200 focus:border-blue-400 focus:ring focus:ring-blue-200/40 outline-none rounded-xl px-4 py-3 transition shadow-sm bg-blue-50/40 placeholder:text-blue-400"
            required
            placeholder="********"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white font-bold py-3 rounded-xl shadow hover:scale-105 hover:from-blue-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Loading...
            </span>
          ) : (
            "Login"
          )}
        </button>
        <div className="mt-6 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} InventoryPro by YourCompany
        </div>
      </form>
    </div>
  );
}
