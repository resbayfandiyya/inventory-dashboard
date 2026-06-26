import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
  } from "recharts";
  
  export default function RevenueChart() {
    const data = [
      { month: "Jan", revenue: 4000 },
      { month: "Feb", revenue: 6000 },
      { month: "Mar", revenue: 5500 },
      { month: "Apr", revenue: 8000 },
      { month: "May", revenue: 10000 },
      { month: "Jun", revenue: 9000 },
    ];
  
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-lg mb-6">
          Revenue Overview
        </h3>
  
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
  
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }