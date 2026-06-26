import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
  } from "recharts";
  
  export default function UserGrowthChart() {
    const data = [
      { month: "Jan", users: 200 },
      { month: "Feb", users: 350 },
      { month: "Mar", users: 500 },
      { month: "Apr", users: 700 },
      { month: "May", users: 900 },
      { month: "Jun", users: 1200 },
    ];
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-lg mb-4">
          User Growth
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
                dataKey="users"
                stroke="#16a34a"
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }