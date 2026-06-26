import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBox,
  FaChartLine,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";
import { FaCashRegister } from "react-icons/fa";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const menus = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    ...(user?.role === "Admin"
      ? [
          {
            name: "Users",
            path: "/users",
            icon: <FaUsers />,
          },
        ]
      : []),
    {
      name: "Inventory",
      path: "/inventory",
      icon: <FaBox />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <FaChartLine />,
    },
    {
      name: "Sales",
      path: "/sales",
      icon: <FaCashRegister />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUserCircle />,
    },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40
        w-64 h-screen
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-800
        shadow-xl
        flex flex-col
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Branding & Close Button */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/70">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-200 to-sky-400 bg-clip-text text-transparent">
          InventoryPro
        </h1>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-red-400"
        >
          <FaTimes />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menus.map((menu) => {
          const isActive = location.pathname === menu.path;
          return (
            <Link
              key={menu.path}
              to={menu.path}
              className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-150 font-semibold text-base
                ${
                  isActive
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
                focus:outline-none focus:ring-2 focus:ring-blue-400
              `}
            >
              <span
                className={`text-xl transition-all duration-200`}
              >
                {menu.icon}
              </span>
              <span
                className="transition-colors duration-200"
              >
                {menu.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
