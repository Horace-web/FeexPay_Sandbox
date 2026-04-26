"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface Stats {
  last24h: number;
  totalClients: number;
  totalBalance: number;
}

export default function DashboardPage() {
  const [stats, setStats]       = useState<Stats>({ last24h: 0, totalClients: 0, totalBalance: 0 });
  const [chartData, setChart]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    // Récupère transactions + clients en parallèle
    Promise.all([
      fetch("http://localhost:3001/transactions", { headers }).then(r => r.json()),
      fetch("http://localhost:3001/customers",    { headers }).then(r => r.json()),
    ]).then(([transactions, customers]) => {

      // Stats dernières 24h
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const last24h   = transactions.filter(
        (t: any) => new Date(t.createdAt) >= yesterday && t.status === "success"
      ).length;

      // Solde total (somme des transactions success)
      const totalBalance = transactions
        .filter((t: any) => t.status === "success")
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

      setStats({ last24h, totalClients: customers.length, totalBalance });

      // Prépare les données du graphique (7 derniers jours)
      const days: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days[d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })] = 0;
      }
      transactions.forEach((t: any) => {
        const label = new Date(t.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
        if (label in days) days[label] += Number(t.amount);
      });
      setChart(Object.entries(days).map(([date, montant]) => ({ date, montant })));

    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-sm text-gray-500">Controlez votre business en temps réel</p>
      </div>

      {/* Bannière compte non validé */}
      {/* <div className="mb-6 bg-red-50 border border-red-100 rounded-xl px-6 py-8 text-center">
        <h2 className="text-lg font-bold text-red-500 mb-1">Compte marchand non valide</h2>
        <p className="text-sm text-gray-500 mb-4">Votre compte marchand n'a pas encore été validé.</p>
        <button className="px-6 py-2 border border-[#ff5a00] text-[#ff5a00] rounded-lg text-sm font-semibold hover:bg-orange-50 transition-colors flex items-center gap-2 mx-auto">
          Valider mon compte →
        </button>
      </div> */}

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Dernières 24h</p>
          <p className="text-3xl font-bold text-gray-800">
            {loading ? "—" : stats.last24h}
          </p>
          <div className="mt-3 h-0.5 bg-blue-400 rounded" />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Clients</p>
          <p className="text-3xl font-bold text-gray-800">
            {loading ? "—" : stats.totalClients}
          </p>
          <div className="mt-3 h-0.5 bg-blue-400 rounded" />
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500 mb-1">Solde Total</p>
          <p className="text-3xl font-bold text-gray-800">
            {loading ? "—" : stats.totalBalance.toLocaleString("fr-FR")}
          </p>
          <div className="mt-3 h-0.5 bg-[#ff5a00] rounded" />
          {/* <div className="mt-3 -mx-5 -mb-5 bg-[#ff5a00] rounded-b-xl h-12 flex items-center justify-center text-white font-bold text-xl">
            {loading ? "—" : stats.totalBalance.toLocaleString("fr-FR")}
          </div> */}
        </div>
      </div>

      {/* Graphique */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} FCFA`, "Montant"]}
            />
            <Line
              type="monotone"
              dataKey="montant"
              stroke="#ff5a00"
              strokeWidth={2}
              dot={{ fill: "#ff5a00", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Lien bas */}
      <p className="mt-6 text-sm text-gray-500 hover:underline cursor-pointer">
        Comment suis-je payé ?
      </p>
    </div>
  );
}