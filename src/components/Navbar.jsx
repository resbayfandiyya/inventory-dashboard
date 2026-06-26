import { useState, useRef, useEffect } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { darkMode, setDarkMode } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout berhasil");
    navigate("/");
  };

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lowStock, setLowStock] = useState([]);
  const notificationsDropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const response = await api.get("/notifications");
      setNotifications(response.data);
      if (response.data.lowStock) {
        setLowStock(response.data.lowStock);
      } else {
        setLowStock(
          response.data.filter(
            (item) => item.type === "low-stock" || item.lowStock
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));

  // Handling outside click for profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Handling outside click for notification dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  return (
    <div
      className="
        container
        navbar
        h-16
        flex items-center
        px-6 gap-4
        relative
        bg-white/80
        dark:bg-slate-900/80
        backdrop-blur-xl
        border-b border-slate-200 dark:border-slate-800
        "
      style={{ zIndex: 100 }} // make sure Navbar is above other content
    >
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
        >
          <FaBars className="text-slate-900 dark:text-slate-100" />
        </button>
      )}
      <div className="flex items-center flex-1">
        <span className="text-slate-900 dark:text-slate-100 text-2xl font-bold tracking-wide drop-shadow-lg hidden sm:block">
          <span className="inline-block align-middle">
            <svg
              className="w-8 h-8 mr-2 inline-block align-middle text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 32 32"
            >
              <rect
                x="5"
                y="5"
                width="22"
                height="22"
                rx="6"
                fill="currentColor"
              />
              <rect
                x="12"
                y="12"
                width="8"
                height="8"
                rx="2"
                fill={darkMode ? "#0f172a" : "#fff"}
              />
            </svg>
          </span>
          Inventory
          <span className="font-extrabold text-yellow-400 dark:text-yellow-300">Pro</span> <span className="text-slate-800 dark:text-blue-100">Dashboard</span>
        </span>
      </div>
      <div className="flex items-center gap-6">
        {/* Dark mode toggle button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-2xl px-2 transition"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <span className="transition-colors duration-200">☀️</span>
          ) : (
            <span className="transition-colors duration-200">🌙</span>
          )}
        </button>
        {/* Notification Bell with Dropdown - FIXED Dropdown */}
        <div className="relative" style={{ zIndex: 105 }}>
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative text-blue-700 dark:text-yellow-300 text-2xl hover:text-yellow-600 dark:hover:text-yellow-400 transition"
          >
            <FaBell />
            {notifications.length > 0 && (
              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-red-500
                  text-white
                  text-xs
                  rounded-full
                  px-2
                  border border-white dark:border-slate-900
                  shadow-sm
                "
              >
                {notifications.length}
              </span>
            )}
          </button>
          {/* Notifications Dropdown */}
          {showNotifications && (
            // Use portal-like effect: position: fixed, overlay for closing
            <>
              {/* Overlay for closing when click outside */}
              <div
                className="fixed inset-0 z-[104]"
                style={{ background: "transparent" }}
              />

              <div
                ref={notificationsDropdownRef}
                className={`
                  fixed
                  right-8
                  top-20
                  w-80
                  bg-white dark:bg-slate-800
                  rounded-xl
                  shadow-lg
                  border border-slate-200 dark:border-slate-700
                  z-[105]
                  animate-dropdown-fade
                `}
                style={{ minWidth: "18rem" }}
              >
                <div className="p-4 font-bold text-blue-700 dark:text-yellow-300">
                  Notifications
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-slate-600 dark:text-slate-200">
                    Tidak ada notifikasi
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className="
                        px-4
                        py-3
                        border-t border-gray-100 dark:border-slate-700
                      "
                    >
                      <p className="text-slate-800 dark:text-slate-100 font-medium">{item.name}</p>
                      <p className="text-red-500 dark:text-red-300 text-sm">
                        Stock tersisa {item.stock}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
        {/* User Info + Dropdown */}
        <div
          className="flex items-center gap-3 relative"
          ref={dropdownRef}
        >
          <span className="font-semibold text-base text-slate-900 dark:text-blue-100 drop-shadow-sm hidden md:block">
            {user?.name}
            <span className="block text-xs text-blue-500 dark:text-yellow-300 font-normal uppercase tracking-wide">
              {user?.role}
            </span>
          </span>
          <div>
            <img
              src={
                user?.avatar
                  ? `http://localhost:5000/uploads/${user.avatar}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user?.name || "User"
                    )}&background=2563eb&color=fff&size=128&rounded=true`
              }
              alt="avatar"
              className="w-11 h-11 rounded-full border-2 border-white dark:border-slate-700 shadow-sm cursor-pointer object-cover ring-2 ring-blue-500 dark:ring-yellow-400 hover:ring-4 hover:scale-105 transition-all duration-200"
              onClick={() => setDropdownOpen((v) => !v)}
              tabIndex={0}
            />
            {dropdownOpen && (
              <div className="absolute right-0 top-14 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 animate-dropdown-fade overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex flex-col items-center bg-blue-50 dark:bg-slate-800">
                  <img
                    src={
                      user?.avatar
                        ? `http://localhost:5000/uploads/${user.avatar}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.name || "User"
                          )}&background=2563eb&color=fff&size=64&rounded=true`
                    }
                    alt="avatar"
                    className="w-11 h-11 rounded-full object-cover border mb-2 ring-2 ring-blue-500 dark:ring-yellow-400"
                  />
                  <div className="font-semibold text-slate-700 dark:text-slate-100">
                    {user?.name}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-yellow-300 uppercase">
                    {user?.role}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900 transition rounded-b-xl"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LOW STOCK ALERT */}
      {lowStock && lowStock.length > 0 && (
        <div
          className="
            bg-red-50 dark:bg-red-900
            border border-red-200 dark:border-red-400
            rounded-2xl
            p-6
            mb-6
            absolute
            left-1/2
            transform -translate-x-1/2
            top-16
            z-50
            w-full
            max-w-2xl
            shadow-xl
          "
        >
          <h2 className="text-red-600 dark:text-yellow-300 font-bold mb-3">
            Low Stock Alert
          </h2>
          {lowStock.map((item) => (
            <div
              key={item.id}
              className="flex justify-between py-2"
            >
              <span className="text-slate-900 dark:text-slate-100">{item.name}</span>
              <span className="text-red-500 dark:text-red-300">{item.stock}</span>
            </div>
          ))}
        </div>
      )}

      <style>
        {`
          @keyframes dropdown-fade {
            0% { opacity: 0; transform: translateY(-8px);}
            100% { opacity: 1; transform: translateY(0);}
          }
          .animate-dropdown-fade {
            animation: dropdown-fade 0.2s ease;
          }
        `}
      </style>
    </div>
  );
}

