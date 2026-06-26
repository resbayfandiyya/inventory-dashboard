import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
  } from "recharts";
  
  export default function InventoryChart() {
    const data = [
      { name: "Laptop", value: 35 },
      { name: "Monitor", value: 20 },
      { name: "Keyboard", value: 15 },
      { name: "Mouse", value: 30 },
    ];
  
    const COLORS = [
      "#2563eb",
      "#16a34a",
      "#eab308",
      "#dc2626",
    ];
  
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-lg mb-4">
          Product Categories
        </h3>
  
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                outerRadius={120}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>
  
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }