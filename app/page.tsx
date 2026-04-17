"use client";
import React, { useState, useEffect, useMemo } from "react";
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
  Waves,
  Activity,
  Sun,
  Wind,
  Battery,
  AlertCircle,
  Settings,
  Bell,
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
        <span className="text-3xl font-bold text-slate-900 dark:text-white transition-all tabular-nums">
          {value}
        </span>
        <span className="text-slate-400 text-sm font-medium">{unit}</span>
      </div>
    </div>
  </div>
);

const AeratorStatus = ({ isActive }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 h-full flex flex-col justify-center items-center text-center">
    <div className="relative mb-6">
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 ${isActive ? "bg-cyan-400 opacity-20 animate-pulse" : "bg-slate-200 opacity-0"}`}
      />
      <div
        className={`relative w-24 h-24 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${isActive ? "border-cyan-500 text-cyan-500" : "border-slate-200 text-slate-300"}`}
      >
        <Wind
          className={`w-12 h-12 ${isActive ? "animate-spin" : ""}`}
          style={{ animationDuration: "3s" }}
        />
      </div>
    </div>
    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
      Paddle Wheel
    </h3>
    <p
      className={`text-sm font-medium transition-colors ${isActive ? "text-cyan-500" : "text-slate-400"}`}
    >
      {isActive ? "Actively Aerating" : "Standby Mode"}
    </p>
  </div>
);

export default function App() {
  const [metrics, setMetrics] = useState({
    ph: 7.2,
    temp: 24.5,
    do: 6.8, // Dissolved Oxygen
    turbidity: 45,
    solarPower: 850,
  });

  const [history, setHistory] = useState<{ time: string; val: number }[]>([]);
  const [isAerating, setIsAerating] = useState(true);

  // Simulation Logic
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

        setHistory((prevHistory) => {
          const updated = [
            ...prevHistory,
            { time: timestamp, val: parseFloat(newTurbidity) },
          ];
          return updated.slice(-20); // Keep last 20 points
        });

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
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center text-white">
              C
            </span>
            Cut Solar <span className="text-cyan-600 font-normal">Aerator</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Monitoring Station ID: #SW-402
          </p>
        </div>
        <div className="flex gap-3">
          <button className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 transition-colors">
            <Settings className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Metric Cards */}
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

          {/* Large Turbidity Graph Section */}
          <div className="md:col-span-2 xl:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Turbidity Real-time Analysis
                </h2>
                <p className="text-slate-400 text-sm">
                  Water clarity index tracking
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-indigo-600">
                  {metrics.turbidity} NTU
                </div>
                <div className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
                  Current Index
                </div>
              </div>
            </div>

            <div className="h-75 w-full">
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
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    minTickGap={30}
                  />
                  <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="val"
                    stroke="#6366f1"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorTurbidity)"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="md:col-span-2 xl:col-span-1 grid grid-cols-1 gap-6">
            <div className="bg-emerald-500 p-6 rounded-3xl text-white flex flex-col justify-between overflow-hidden relative">
              <Battery className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                    Energy Storage
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1">98%</div>
                <div className="text-sm opacity-80">
                  System fully operational
                </div>
              </div>
              <div className="mt-8 bg-white bg-opacity-20 p-3 rounded-2xl backdrop-blur-md">
                <div className="flex justify-between text-xs mb-1">
                  <span>Charge Rate</span>
                  <span>+2.4 kW</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 h-1.5 rounded-full">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-1000"
                    style={{ width: "98%" }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl text-white">
              <h4 className="text-sm font-medium text-slate-400 mb-4">
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsAerating(!isAerating)}
                  className={`py-3 rounded-2xl font-semibold transition-all text-sm flex items-center justify-center gap-2 ${isAerating ? "bg-rose-500 hover:bg-rose-600" : "bg-cyan-500 hover:bg-cyan-600"}`}
                >
                  {isAerating ? "Stop Motor" : "Start Motor"}
                </button>
                <button className="bg-slate-800 hover:bg-slate-700 py-3 rounded-2xl font-semibold transition-all text-sm">
                  Full Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="lg:col-span-1 space-y-6">
          <AeratorStatus isActive={isAerating} />

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              System Alerts
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1 bg-amber-500 rounded-full" />
                <div>
                  <p className="text-sm font-semibold">
                    Low Turbidity Detected
                  </p>
                  <p className="text-xs text-slate-400">
                    12:45 PM • Water quality improves
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 bg-cyan-500 rounded-full" />
                <div>
                  <p className="text-sm font-semibold">Solar Efficiency High</p>
                  <p className="text-xs text-slate-400">
                    11:30 AM • Optimal sun position
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">
              Pro Tip
            </p>
            <p className="text-sm leading-relaxed">
              Maintain pH between 6.5 and 8.5 for optimal fish health. Your
              current levels are stable.
            </p>
          </div>
        </div>
      </main>

      {/* Background Decorative Element */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
