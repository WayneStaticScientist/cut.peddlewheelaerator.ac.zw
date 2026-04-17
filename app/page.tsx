"use client";
import React, { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Droplets,
  Thermometer,
  Activity,
  Sun,
  Wind,
  Battery,
  AlertCircle,
  Settings,
  Bell,
  Gauge,
} from "lucide-react";

// --- Components ---

const StatCard = ({ title, value, unit, icon: Icon, color, trend }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md group">
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:scale-110`}
      >
        <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
      </div>
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
      >
        {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
      </span>
    </div>
    <div className="space-y-1">
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">
        {title}
      </h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
          {value}
        </span>
        <span className="text-slate-400 text-sm font-medium">{unit}</span>
      </div>
    </div>
  </div>
);

const AeratorStatus = ({ isActive, speed }: any) => {
  /** * Speed Logic:
   * 100% Speed = 80 RPM = 0.75s per rotation
   * duration = 0.75 * (100 / speed)
   */
  const duration = isActive && speed > 0 ? 0.75 * (100 / speed) : 0;
  const isSpinning = isActive && speed > 0;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 h-full flex flex-col justify-center items-center text-center">
      <div className="relative mb-6">
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 ${isSpinning ? "bg-cyan-400 opacity-20 animate-pulse" : "bg-slate-200 opacity-0"}`}
        />
        <div
          className={`relative w-24 h-24 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${isSpinning ? "border-cyan-500 text-cyan-500" : "border-slate-200 text-slate-300"}`}
        >
          <Wind
            className={`w-12 h-12 ${isSpinning ? "animate-spin" : ""}`}
            style={{ animationDuration: isSpinning ? `${duration}s` : "0s" }}
          />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        Paddle Wheel
      </h3>
      <p
        className={`text-sm font-medium transition-colors ${isSpinning ? "text-cyan-500" : "text-slate-400"}`}
      >
        {isSpinning ? `${Math.round(60 / duration)} RPM` : "Motor Stopped"}
      </p>
    </div>
  );
};

export default function App() {
  const [metrics, setMetrics] = useState({
    ph: 7.2,
    temp: 24.5,
    do: 6.8,
    turbidity: 45,
    solarPower: 850,
  });
  const [history, setHistory] = useState<{ time: string; val: number }[]>([]);
  const [isAerating, setIsAerating] = useState(true);
  const [motorSpeed, setMotorSpeed] = useState(80); // Default to 80%

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const newPh = (prev.ph + (Math.random() - 0.5) * 0.05).toFixed(2);
        const newTemp = (prev.temp + (Math.random() - 0.5) * 0.1).toFixed(1);
        const newDo = (prev.do + (Math.random() - 0.5) * 0.08).toFixed(1);
        const newTurbidity = Math.max(
          0,
          Math.min(100, prev.turbidity + (Math.random() - 0.5) * 2),
        ).toFixed(1);
        const timestamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });

        setHistory((prevH) =>
          [...prevH, { time: timestamp, val: parseFloat(newTurbidity) }].slice(
            -20,
          ),
        );

        return {
          ph: parseFloat(newPh),
          temp: parseFloat(newTemp),
          do: parseFloat(newDo),
          turbidity: parseFloat(newTurbidity),
          solarPower: Math.floor(800 + Math.random() * 100),
        };
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans text-slate-900 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white">
            C
          </span>
          Cut Solar <span className="text-cyan-600 font-normal">Aerator</span>
        </h1>
        <div className="flex gap-3">
          <button className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Bell className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="pH Level"
            value={metrics.ph}
            unit="pH"
            icon={Activity}
            color="bg-indigo-500"
            trend={0.2}
          />
          <StatCard
            title="Temperature"
            value={metrics.temp}
            unit="°C"
            icon={Thermometer}
            color="bg-orange-500"
            trend={-1.5}
          />
          <StatCard
            title="Dissolved Oxygen"
            value={metrics.do}
            unit="mg/L"
            icon={Droplets}
            color="bg-cyan-500"
            trend={4.2}
          />
          <StatCard
            title="Solar Input"
            value={metrics.solarPower}
            unit="W"
            icon={Sun}
            color="bg-yellow-500"
            trend={1.1}
          />

          <div className="md:col-span-2 xl:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-96">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Turbidity Real-time
              </h2>
              <div className="text-right text-3xl font-bold text-indigo-600">
                {metrics.turbidity} NTU
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient
                      id="colorTurbidity"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis dataKey="time" hide />
                  <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                  <Tooltip
                    contentStyle={{ borderRadius: "16px", border: "none" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fill="url(#colorTurbidity)"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="md:col-span-2 xl:col-span-1 grid grid-cols-1 gap-6">
            <div className="bg-emerald-500 p-6 rounded-3xl text-white relative overflow-hidden">
              <Battery className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase opacity-80">
                  Energy Storage
                </span>
                <div className="text-4xl font-bold">98%</div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl text-white">
              <h4 className="text-sm font-medium text-slate-400 mb-4 flex justify-between">
                Motor Speed Control <Gauge className="w-4 h-4" />
              </h4>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">RANGE: 0 - 80 RPM</span>
                    <span className="text-cyan-400">{motorSpeed}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={motorSpeed}
                    onChange={(e) => setMotorSpeed(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
                <button
                  onClick={() => setIsAerating(!isAerating)}
                  className={`w-full py-3 rounded-2xl font-semibold transition-all text-sm ${isAerating ? "bg-rose-500 hover:bg-rose-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
                >
                  {isAerating ? "Emergency Stop" : "Activate System"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <AeratorStatus isActive={isAerating} speed={motorSpeed} />
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              System Alerts
            </h3>
            <div className="space-y-4 text-sm">
              <p className="font-semibold text-slate-600 italic">
                "Optimal oxygen saturation levels achieved at current motor
                velocity."
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
