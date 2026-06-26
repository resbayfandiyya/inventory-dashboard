import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBox,
  FaExclamationTriangle,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

// ===========================
// Percantik mode biasa (light mode enhancement)
// ===========================

export default function Dashboard() {
  const { darkMode } = useTheme();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    lowStock: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRevenue();
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/dashboard/stats");
      setStats({
        totalUsers: response.data.totalUsers || 0,
        totalProducts: response.data.totalProducts || 0,
        lowStock: response.data.lowStock || 0,
      });
    } catch (error) {
      console.error("Error fetch stats:", error);
    }
  };

  const fetchRevenue = async () => {
    try {
      setLoadingRevenue(true);
      const response = await api.get("/dashboard/revenue");
      setRevenueData(response.data);
    } catch (error) {
      console.error("Error fetch revenue:", error);
      setRevenueData([]);
    } finally {
      setLoadingRevenue(false);
    }
  };

  // Improved, brighter, and more playful/light palette for mode biasa (light mode)
  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUsers size={30} className="text-white drop-shadow" />,
      color: darkMode
        ? "from-[#21396e]/95 to-[#0e172c]/90"
        : "from-[#62dafc] via-[#4fcfcf] to-[#818cf8]", // Light blue-teal gradient
      iconBg: darkMode
        ? "bg-blue-900/50"
        : "bg-gradient-to-br from-[#3bfff3] to-[#6366f1]",
      shadow: darkMode
        ? "shadow-blue-900/70"
        : "shadow-[#bae6fd]/60",
      text: darkMode ? "text-blue-100" : "text-sky-900/95",
      border: darkMode ? "border-blue-800/60" : "border-[#e0f2fe]",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <FaBox size={30} className="text-white drop-shadow" />,
      color: darkMode
        ? "from-[#422174]/95 to-[#201739]/90"
        : "from-[#fdbae7] via-[#c7d2fe] to-[#a5b4fc]", // Soft pink/purple gradient
      iconBg: darkMode
        ? "bg-purple-900/50"
        : "bg-gradient-to-br from-[#ffd6fa] to-[#a5b4fc]",
      shadow: darkMode
        ? "shadow-purple-900/65"
        : "shadow-[#fce7f3]/55",
      text: darkMode ? "text-purple-100" : "text-fuchsia-900/90",
      border: darkMode ? "border-purple-900/30" : "border-pink-100",
    },
    {
      title: "Low Stock",
      value: stats.lowStock,
      icon: <FaExclamationTriangle size={30} className="text-white drop-shadow" />,
      color: darkMode
        ? "from-[#726201]/90 to-[#242003]/90"
        : "from-[#fae68a] via-[#fbbf24] to-[#fecaca]", // Pastel yellow to coral
      iconBg: darkMode
        ? "bg-yellow-900/50"
        : "bg-gradient-to-br from-[#ffe066] to-[#fca5a5]",
      shadow: darkMode
        ? "shadow-yellow-900/55"
        : "shadow-[#fde68a]/45",
      text: darkMode ? "text-yellow-100" : "text-yellow-900/85",
      border: darkMode ? "border-yellow-900/30" : "border-yellow-100",
    },
  ];

  return (
    <div
      className={`min-h-screen py-6 w-full transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-[#191d24] via-[#212a3c] to-[#1b2434]"
          : "bg-gradient-to-br from-cyan-50 via-white to-indigo-50"
      }`}
    >
      <div className={`mx-auto max-w-7xl w-full px-4 md:px-8 space-y-8`}>
        {/* Header */}
        <div className="mb-6 pt-2 pb-1 flex flex-col items-center">
          <h1
            className={`text-4xl md:text-5xl font-black tracking-tight leading-normal drop-shadow-lg ${
              darkMode ? "text-cyan-100" : "text-primary-600"
            }`}
            style={
              !darkMode
                ? {
                    background: "linear-gradient(90deg,#38bdf8 30%,#818cf8 60%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }
                : undefined
            }
          >
            Dashboard
          </h1>
          <p
            className={`mt-2 text-lg md:text-xl text-center ${
              darkMode
                ? "text-blue-200/80"
                : "text-sky-800/90 drop-shadow"
            }`}
          >
            Selamat datang kembali!
            <br className="block md:hidden" />{" "}
            <span className="inline-block">Lihat ringkasan bisnis Anda di bawah ini.</span>
          </p>
        </div>

        {/* Stat Cards */}
        <div className="w-full flex justify-center">
          <div className="flex flex-col sm:flex-row gap-6 md:gap-10 items-center w-full max-w-3xl">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`
                  flex flex-col items-center justify-center relative px-7 py-8 rounded-2xl md:rounded-3xl border shadow-lg bg-gradient-to-br ${card.color} ${card.shadow} transition-all duration-200 group w-full max-w-[320px]
                  ${card.border} hover:scale-[1.065] hover:brightness-105 hover:shadow-2xl
                  ${darkMode
                    ? "hover:shadow-2xl hover:shadow-cyan-400/20"
                    : "hover:shadow-2xl hover:shadow-primary-100/40"}
                `}
                style={
                  darkMode
                    ? {
                        borderWidth: "1.5px",
                        boxShadow: "0 6px 32px #1a2238cc",
                        backgroundBlendMode: "normal, lighten"
                      }
                    : {
                        borderWidth: "2px",
                        boxShadow:
                          "0 8px 32px 0 #bae6fd60,0 1.5px 2.5px #c7d2fe30",
                        backgroundBlendMode: "lighten, normal"
                      }
                }
              >
                {/* Decorative circle blur */}
                <div className={`
                  absolute -top-8 -right-5 w-32 h-32 rounded-full opacity-30 blur-2xl pointer-events-none
                  ${index === 0 
                    ? "bg-gradient-to-br from-[#38bdf8]/50 via-[#818cf8]/50 to-[#a0eaff]/40"
                    : index === 1 
                    ? "bg-gradient-to-bl from-[#fecdd3]/70 via-[#e9d5ff]/70 to-[#c7d2fe]/70"
                    : "bg-gradient-to-br from-[#faf089]/60 via-[#fbbf24]/70 to-[#fecaca]/60"
                  }
                `}></div>
                {/* Icon */}
                <div
                  className={`
                    min-w-[4rem] min-h-[4rem] w-16 h-16 rounded-full flex items-center justify-center mb-4 text-3xl
                    ${card.iconBg} ${card.shadow} border-2
                    ${darkMode ? "border-blue-800/40 ring-0" : "border-white/70"}
                    group-hover:scale-110 transition-transform duration-300
                    shadow-md
                  `}
                  style={
                    !darkMode
                      ? {
                          background:
                            index === 0
                              ? "linear-gradient(135deg, #82eefd 65%, #38bdf8 95%)"
                              : index === 1
                              ? "linear-gradient(135deg, #fbbae6 55%, #c7d2fe 100%)"
                              : "linear-gradient(135deg, #ffe066 60%, #fecaca 100%)",
                        }
                      : undefined
                  }
                >
                  {card.icon}
                </div>
                {/* Info */}
                <div className="flex flex-col items-center w-full min-w-0">
                  <p
                    className={`uppercase tracking-widest font-bold text-[11px] md:text-xs z-10 relative mb-1 select-none text-center ${
                      darkMode ? "text-cyan-200/85" : "text-sky-900/75"
                    }`}
                  >
                    {card.title}
                  </p>
                  <h2
                    className={`text-4xl md:text-5xl font-extrabold mt-2 tracking-wide z-10 relative break-words text-center 
                      ${darkMode
                        ? "text-cyan-100 drop-shadow-[0_4px_18px_rgba(34,211,238,0.15)]"
                        : "text-sky-900 drop-shadow-[0_5px_18px_rgba(186,230,253,0.18)]"
                      }`}
                    style={
                      !darkMode
                        ? {
                            textShadow:
                              "0 2px 16px #bae6fdcc, 0 2px 0px #a5b4fc60",
                          }
                        : undefined
                    }
                  >
                    {card.value}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div
          className={`
            rounded-3xl p-8 border
            ${darkMode
              ? "bg-gradient-to-tr from-[#163056] via-[#1b2636] to-[#232836] border-blue-900/50 shadow-xl shadow-cyan-900/15"
              : "bg-gradient-to-b from-cyan-50 via-white to-indigo-50 border-[#c7d2fe] shadow-[0_6px_36px_-4px_#bae6fd60] ring-1 ring-primary-100/30"
            }
            transition-all duration-300
          `}
        >
          <div className="mb-8 text-center">
            <h2
              className={`text-2xl md:text-3xl font-bold tracking-tight mb-1 ${
                darkMode
                  ? "text-cyan-300"
                  : "text-transparent bg-gradient-to-r from-cyan-500 via-sky-700 to-indigo-500 bg-clip-text"
              }`}
              style={
                !darkMode
                  ? {
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                  : undefined
              }
            >
              Revenue Overview
            </h2>
            <p
              className={`text-sm md:text-base mt-1 ${
                darkMode ? "text-cyan-100/80" : "text-sky-900/70"
              }`}
            >
              Analisis pendapatan bulanan langsung dari database{" "}
              <span className={`font-bold ${darkMode ? "text-yellow-300/80" : "text-cyan-600/90"}`}>
                (dashboard/revenue)
              </span>.
            </p>
          </div>

          {loadingRevenue ? (
            <div className="flex flex-col justify-center items-center py-20">
              <span
                className={`font-semibold text-lg md:text-xl animate-pulse ${
                  darkMode ? "text-cyan-300" : "text-cyan-600"
                }`}
              >
                Memuat data pendapatan...
              </span>
            </div>
          ) : revenueData.length === 0 ? (
            <div
              className={`flex flex-col items-center py-20 ${
                darkMode ? "text-cyan-400" : "text-sky-400"
              }`}
            >
              <span
                className={`mb-3 text-6xl ${darkMode ? "text-blue-800/50" : "text-blue-200/80"}`}
                role="img"
                aria-label="Money"
              >
                <svg width="1em" height="1em" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" fill="none"/></svg>
              </span>
              <span className="font-semibold text-base">
                Data pendapatan tidak ditemukan.
              </span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={390}>
              <LineChart
                data={revenueData}
                margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorRevenue"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={darkMode ? "#22d3ee" : "#38bdf8"}
                      stopOpacity={0.92}
                    />
                    <stop
                      offset="94%"
                      stopColor={darkMode ? "#0e7490" : "#818cf8"}
                      stopOpacity={0.10}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 8"
                  stroke={darkMode ? "#334155" : "#dbeafe"}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 15,
                    fill: darkMode ? "#67e8f9" : "#0ea5e9",
                    fontWeight: 700,
                    letterSpacing: 0.6
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) =>
                    v >= 1_000_000
                      ? `${(v / 1_000_000).toFixed(1)}jt`
                      : v
                  }
                  tick={{
                    fontSize: 14,
                    fill: darkMode ? "#bae6fd" : "#38bdf8",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          style={{
                            background: darkMode
                              ? "rgba(21,94,117,0.85)"
                              : "rgba(236,254,255,0.96)",
                            color: darkMode ? "#fff" : "#083344",
                            borderRadius: 18,
                            border: "none",
                            fontWeight: 600,
                            padding: "18px 22px",
                            minWidth: 155,
                            boxShadow: darkMode
                              ? "0 2px 20px #38bdf844"
                              : "0 2px 22px #bae6fd88",
                            backdropFilter: "blur(6px)",
                          }}
                        >
                          <div
                            className="mb-1 text-lg font-extrabold tracking-wide"
                            style={{
                              color: darkMode ? "#67e8f9" : "#0ea5e9",
                              fontSize: 18,
                            }}
                          >
                            {label}
                          </div>
                          <div
                            style={{
                              fontWeight: 700,
                              color: darkMode ? "#bbf7d0" : "#0ea5e9",
                              fontSize: 24,
                              marginTop: 2,
                              marginBottom: 6,
                              textShadow: darkMode
                                ? "0 2px 8px #38bdf844"
                                : "0 1px 9px #7dd3fc44",
                            }}
                          >
                            {payload[0].value !== undefined && (
                              <span>
                                Rp{" "}
                                <span
                                  style={{
                                    color: darkMode
                                      ? "#6ee7b7"
                                      : "#06b6d4",
                                    fontWeight: 900,
                                  }}
                                >
                                  {Number(payload[0].value).toLocaleString(
                                    "id-ID"
                                  )}
                                </span>
                              </span>
                            )}
                          </div>
                          <div
                            className="mt-0.5 text-xs font-semibold tracking-wide"
                            style={{
                              color: darkMode
                                ? "#fde68a"
                                : "#eab308",
                              letterSpacing: 1.1
                            }}
                          >
                            Revenue
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{
                    fill: darkMode
                      ? "rgba(34,211,238,0.07)"
                      : "#e0f2fe",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={darkMode ? "#22d3ee" : "#38bdf8"}
                  strokeWidth={4}
                  dot={{
                    r: 6,
                    stroke: darkMode ? "#06b6d4" : "#818cf8",
                    strokeWidth: 2.3,
                    fill: darkMode ? "#1e293b" : "#fff",
                    filter: darkMode
                      ? "drop-shadow(0 2px 12px #38bdf844)"
                      : "drop-shadow(0 2px 12px #bae6fd55)",
                  }}
                  activeDot={{
                    r: 11,
                    fill: darkMode ? "#38bdf8" : "#c7d2fe",
                    stroke: darkMode ? "#06b6d4" : "#38bdf8",
                    strokeWidth: 3,
                  }}
                  fill="url(#colorRevenue)"
                  animationDuration={900}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Custom Scrollbar */}
        <style>
          {`
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: ${darkMode ? "#22d3ee #232a38" : "#bae6fd #e0e7ef"};
              padding-right: 2px;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
              background: ${darkMode ? "#232a38" : "#e0e7ef"};
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: ${darkMode ? "#22d3ee" : "#bae6fd"};
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: ${darkMode ? "#232a38" : "#e0e7ef"};
              border-radius: 10px;
            }
          `}
        </style>
      </div>
    </div>
  );
}

