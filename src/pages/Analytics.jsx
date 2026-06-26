import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Color themes for light & dark mode
const PIE_COLORS_LIGHT = [
  "#2563eb", "#38bdf8", "#fbbf24", "#f87171", "#7c3aed", "#22d3ee", "#a3e635"
];
const PIE_COLORS_DARK = [
  "#60a5fa", "#06b6d4", "#fde68a", "#fca5a5", "#c084fc", "#67e8f9", "#d3f9a3"
];

// Utility to check dark mode using tailwind class on <html>
const isDarkMode = () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

export default function Analytics() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueOverviewData, setRevenueOverviewData] = useState([]);
  const [dark, setDark] = useState(isDarkMode());

  // Track dark mode changes
  useEffect(() => {
    const onMut = () => setDark(isDarkMode());
    window.addEventListener("storage", onMut);
    const obs = new MutationObserver(onMut);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => {
      obs.disconnect();
      window.removeEventListener("storage", onMut);
    };
  }, []);

  useEffect(() => {
    api.get("/users")
      .then(res => setTotalUsers(Array.isArray(res.data) ? res.data.length : 0))
      .catch(() => setTotalUsers(0));

    api.get("/inventory")
      .then(res => {
        const inventory = Array.isArray(res.data) ? res.data : [];
        setTotalProducts(inventory.length);
        const counts = {};
        inventory.forEach(item => {
          const cat = (typeof item.category === "string" && item.category.trim()) ? item.category.trim() : "Uncategorized";
          counts[cat] = (counts[cat] || 0) + 1;
        });
        const categoryArray = Object.keys(counts);
        setCategories(categoryArray);
        const chartData = categoryArray.map(cat => ({
          name: cat,
          value: counts[cat]
        }));
        setCategoryCounts(chartData);
      })
      .catch(() => {
        setTotalProducts(0);
        setCategories([]);
        setCategoryCounts([]);
      });

    api.get("/dashboard/revenue")
      .then(res => {
        if (res.data && typeof res.data.total === "number") {
          setTotalRevenue(res.data.total);
          const overview = Array.isArray(res.data.data)
            ? res.data.data
            : (Array.isArray(res.data.history) ? res.data.history : []);
          setRevenueOverviewData(overview);
        } else if (Array.isArray(res.data)) {
          const sum = res.data.reduce((acc, cur) => acc + (cur.revenue || 0), 0);
          setTotalRevenue(sum);
          setRevenueOverviewData(res.data);
        } else {
          setTotalRevenue(0);
          setRevenueOverviewData([]);
        }
      })
      .catch(() => {
        setTotalRevenue(0);
        setRevenueOverviewData([]);
      });
    // Listen for dark mode
  }, []);

  const formatRupiahJt = (val) => {
    if (!val || isNaN(val)) return "0";
    const jt = Math.floor(val / 1000000);
    return `Rp ${jt.toLocaleString("id-ID")}\u00A0`;
  };

  const PIE_COLORS = dark ? PIE_COLORS_DARK : PIE_COLORS_LIGHT;
  const mainBg = dark ? "bg-gradient-to-br from-slate-900 via-slate-800 to-[#101827]" : "bg-gradient-to-tl from-blue-50 via-white to-slate-50";
  const cardGlass = dark
    ? "bg-gradient-to-tr from-[#232936]/80 via-[#232f3d]/95 to-[#101c38]/90"
    : "bg-gradient-to-br from-blue-600/80 via-blue-400/80 to-blue-700/80";
  const cardWhite = dark
    ? "bg-[#22263d]/95 border-[#2d355b] shadow-xl"
    : "bg-white/95 border-blue-100 shadow-md";
  const textMain = dark ? "text-white" : "text-slate-900";
  const textSoft = dark ? "text-slate-300" : "text-slate-500";
  const textAccent = dark ? "text-blue-300" : "text-blue-600";
  const borderPie = dark ? "border-[#3e4874]" : "border-blue-100";

  return (
    <div className={`min-h-screen pb-10 px-2 md:px-8 ${mainBg} transition-colors duration-400`}>
      <div className={`max-w-7xl mx-auto pt-10`}>
        <h1 className={`text-[2.35rem] sm:text-4xl font-extrabold mb-6 ${textMain} tracking-tight flex items-center gap-4`}>
          <span className="inline-block bg-gradient-to-tr from-blue-500 to-indigo-700 text-transparent bg-clip-text drop-shadow-xl dark:from-blue-300 dark:to-[#7281ec]">
            Analytics Dashboard
          </span>
          <svg width="33" height="33" viewBox="0 0 36 36" className="inline-block ml-2">
            <circle cx="18" cy="18" r="18" fill={dark ? "#2563eb" : "#38bdf8"} opacity="0.15"/>
            <path d="M11 20a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1zm2.93-7.87a1 1 0 0 1 1.37 0L18 14.17l2.7-2.04A1 1 0 0 1 22 13.09v7.07a1 1 0 1 1-2 0v-5.25l-2.3 1.74a1 1 0 1 1-1.14-1.67l2.44-1.85z"
              fill={dark ? "#c7d2fe" : "#2563eb"} />
          </svg>
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className={`relative overflow-hidden ${cardGlass} p-7 rounded-3xl group transition shadow-xl border-none hover:scale-[1.03] duration-200`}>
            <div className="absolute top-0 right-0 opacity-40 -mt-4 -mr-5 pointer-events-none z-0">
              <svg width="88" height="56" fill="none">
                <ellipse cx="44" cy="28" rx="44" ry="28" fill={dark ? "#0ea5e9" : "#fff"} fillOpacity="0.22" />
              </svg>
            </div>
            <p className="uppercase tracking-wide text-white/80 text-sm font-medium z-10 relative drop-shadow">Total Revenue</p>
            <h2 className="text-4xl font-extrabold mt-2 text-white drop-shadow-2xl z-10 relative flex items-end gap-2">
              {formatRupiahJt(totalRevenue)}
              <span className="font-extralight text-2xl align-baseline">Jt</span>
            </h2>
            <span className="inline-block mt-4 bg-white/20 dark:bg-black/20 px-4 py-1.5 text-xs rounded-full font-semibold text-white/90 z-10 relative shadow">
              Real-time estimate
            </span>
          </div>

          <div className={`${cardWhite} py-7 px-8 rounded-3xl flex flex-col justify-between group transition hover:scale-[1.02] duration-200 border shadow-lg`}>
            <p className={`${textSoft} font-medium text-[15px]`}>Total Users</p>
            <h2 className={`text-4xl font-bold mt-2 mb-1 ${textAccent} group-hover:text-blue-500 dark:group-hover:text-blue-300 transition`}>
              {totalUsers.toLocaleString()}
            </h2>
            <span className={`inline-block mt-2 ${dark ? "bg-blue-900/40" : "bg-blue-50"} px-4 py-1 text-xs rounded-full ${textAccent} font-semibold`}>
              Registered
            </span>
          </div>

          <div className={`${cardWhite} py-7 px-8 rounded-3xl flex flex-col justify-between group transition hover:scale-[1.02] duration-200 border shadow-lg`}>
            <p className={`${textSoft} font-medium text-[15px]`}>Products</p>
            <h2 className={`text-4xl font-bold mt-2 mb-1 ${dark ? "text-purple-400" : "text-purple-600"} group-hover:text-purple-500 dark:group-hover:text-purple-300 transition`}>
              {totalProducts.toLocaleString()}
            </h2>
            <span className={`inline-block mt-2 ${dark ? "bg-purple-900/30" : "bg-purple-50"} px-4 py-1 text-xs rounded-full ${dark ? "text-purple-200" : "text-purple-600"} font-semibold`}>
              In Inventory
            </span>
          </div>
        </div>

        {/* Chart Panels */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 mb-10">
          {/* Pie Chart */}
          <div className={`col-span-1 ${cardWhite} ${borderPie} rounded-3xl p-6 flex flex-col items-center h-[330px] transition`}>
            <div className="w-full flex flex-col items-center mb-2">
              <h3 className={`font-semibold text-lg ${dark ? "text-blue-200" : "text-slate-700"} mb-1 tracking-tight`}>
                Inventory By Category
              </h3>
              <span className={`text-xs ${dark ? "text-slate-400/80" : "text-slate-400"}`}>
                {totalProducts ? totalProducts + " items" : "—"}
              </span>
            </div>
            <div
              // tambahkan gap antara chart dengan legend nama category
              className="w-full flex-grow flex flex-col items-center justify-start relative pt-1"
            >
              {categoryCounts.length > 0 ? (
                <>
                  <div className="w-full flex flex-col items-center justify-center">
                    <ResponsiveContainer width="96%" height={170}>
                      <PieChart>
                        <Pie
                          data={categoryCounts}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={86}
                          paddingAngle={2}
                          labelLine={false}
                          label={({ name, percent }) => (
                            <tspan>
                              {name.length > 17 ? name.slice(0, 13) + "..." : name}
                              <tspan
                                x="0"
                                dy="1.2em"
                                style={{
                                  fontSize: "12px",
                                  fill: dark ? "#cbd5e1" : "#64748b"
                                }}
                              >{`(${(percent * 100).toFixed(1)}%)`}</tspan>
                            </tspan>
                          )}
                          labelStyle={{
                            fontWeight: "bold",
                            fontSize: "13px",
                            fill: dark ? "#f1f5f9" : "#334155",
                            textShadow: "0 1px 7px " + (dark ? "#18181b" : "#f8fafc"),
                          }}
                        >
                          {categoryCounts.map((entry, idx) => (
                            <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [
                            value,
                            name
                          ]}
                          contentStyle={{
                            borderRadius: 14,
                            background: dark ? "#1e293b" : "#f8fafc",
                            color: dark ? "#cbd5e1" : "#334155",
                            boxShadow: "0 2px 12px " + (dark ? "#0f172ab3" : "#94a3b8a9"),
                            border: `1px solid ${dark ? "#334155" : "#dbeafe"}`
                          }}
                          labelStyle={{
                            fontWeight: "bold",
                            color: dark ? "#60a5fa" : "#2563eb" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Tambah jarak di sini antara chart dengan daftar nama item dan legend */}
                  <div className="mt-5 flex flex-wrap justify-center w-full gap-x-3 gap-y-2">
                    {categoryCounts.map((entry, idx) => (
                      <div
                        key={entry.name}
                        className="flex items-center space-x-2 px-2 py-1 rounded-full"
                        style={{
                          background: dark ? "#23294622" : "#e0e7efaa",
                        }}
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                        />
                        <span className={`text-xs font-semibold ${dark ? "text-slate-200" : "text-slate-700"}`}>
                          {entry.name.length > 17 ? entry.name.slice(0, 15) + "..." : entry.name}
                        </span>
                        <span className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                          ({entry.value})
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[180px] w-full">
                  <span className={`text-lg ${dark ? "text-slate-500" : "text-slate-400"}`}>No data</span>
                </div>
              )}
            </div>
          </div>

          {/* Revenue Bar Chart */}
          <div className="col-span-2 flex flex-col space-y-6">
            <div className={`${cardWhite} rounded-3xl p-6 min-h-[200px] flex flex-col border shadow-lg`}>
              <h3 className={`font-semibold text-lg ${dark ? "text-blue-200" : "text-slate-700"} mb-2`}>
                Revenue Overview{" "}
                <span className={`text-sm font-normal ${dark ? "text-blue-400" : "text-blue-500"}`}>
                  (Data dari <span className="font-semibold">dashboard/revenue</span>)
                </span>
              </h3>
              <div className="flex-1">
                {Array.isArray(revenueOverviewData) && revenueOverviewData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart
                      data={revenueOverviewData}
                      margin={{ top: 8, right: 28, left: 5, bottom: 26 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#334155" : "#cbd5e1"} />
                      <XAxis
                        dataKey="month"
                        tick={{
                          fontSize: 13,
                          fill: dark ? "#cbd5e1" : "#64748b",
                          fontWeight: 500
                        }}
                        interval={revenueOverviewData.length > 8 ? 0 : "preserveEnd"}
                        angle={revenueOverviewData.length > 8 ? -25 : 0}
                        textAnchor={revenueOverviewData.length > 8 ? "end" : "middle"}
                        height={revenueOverviewData.length > 8 ? 38 : 24}
                        axisLine={{stroke: dark ? "#475569" : "#cbd5e1"}}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={val =>
                          val >= 1_000_000
                            ? `${(val / 1_000_000).toFixed(1)}jt`
                            : val
                        }
                        tick={{
                          fontSize: 13,
                          fill: dark ? "#cbd5e1" : "#64748b",
                          fontWeight: 500
                        }}
                        width={65}
                        axisLine={{stroke: dark ? "#475569" : "#cbd5e1"}}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={val =>
                          val !== undefined
                            ? `Rp ${Number(val).toLocaleString("id-ID")}`
                            : val
                        }
                        labelFormatter={label => label}
                        contentStyle={{
                          borderRadius: 14,
                          background: dark ? "#1e293b" : "#f8fafc",
                          color: dark ? "#cbd5e1" : "#334155",
                          boxShadow: "0 2px 12px " + (dark ? "#0f172ab3" : "#94a3b8a9"),
                          border: `1px solid ${dark ? "#334155" : "#dbeafe"}`
                        }}
                        labelStyle={{
                          fontWeight: "bold",
                          color: dark ? "#60a5fa" : "#2563eb"
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill={dark ? "#818cf8" : "#6366f1"}
                        radius={[8, 8, 0, 0]}
                        maxBarSize={36}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[180px] w-full">
                    <span className={`text-lg ${dark ? "text-slate-500" : "text-slate-400"}`}>No revenue data</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* End of analytics main */}
      </div>
    </div>
  );
}



