"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, RefreshCw, Plus } from "lucide-react";

interface Transaction {
  id: string;
  phoneNumber: string;
  amount: number;
  description?: string;
  status: "pending" | "success" | "failed" | "cancelled";
  createdAt: string;
}

const STATUS_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "En attente", color: "#d97706", bg: "#fef3c7" },
  success:   { label: "Succès",     color: "#16a34a", bg: "#dcfce7" },
  failed:    { label: "Échoué",     color: "#dc2626", bg: "#fee2e2" },
  cancelled: { label: "Annulé",     color: "#6b7280", bg: "#f3f4f6" },
};

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function TransactionsPage() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered,     setFiltered]     = useState<Transaction[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [sortField,    setSortField]    = useState("date");
  const [sortOrder,    setSortOrder]    = useState("desc");
  const [page,         setPage]         = useState(1);
  const [pageSize,     setPageSize]     = useState(5);

  const fetchTransactions = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) { router.push("/signin"); return; }

    try {
      const res  = await fetch("http://localhost:3001/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTransactions(data);
      setFiltered(data);
    } catch {
      console.error("Erreur chargement transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  // Recherche + tri
  useEffect(() => {
    let result = [...transactions];

    if (search.trim()) {
      result = result.filter((t) =>
        t.phoneNumber.includes(search) ||
        t.amount.toString().includes(search) ||
        (t.description ?? "").toLowerCase().includes(search.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortField === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortField === "montant") {
        return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });

    setFiltered(result);
    setPage(1);
  }, [search, sortField, sortOrder, transactions]);

  // Pagination
  const totalPages  = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated   = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1f2937" }}>Transactions</h1>
        <button
          onClick={() => router.push("/dashboard/transactions/new")}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 18px", borderRadius: "8px",
            border: "1px solid #e5e7eb", background: "#fff",
            fontSize: "13px", fontWeight: 600, color: "#374151",
            cursor: "pointer",
          }}
        >
          <Plus size={15} /> Créer une transaction
        </button>
      </div>

      {/* ── Barre filtres ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "16px",
        backgroundColor: "#fff", border: "1px solid #f0f0f0",
        borderRadius: "12px", padding: "14px 20px", marginBottom: "16px",
      }}>
        {/* Compteur */}
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151", whiteSpace: "nowrap" }}>
          {filtered.length} Transaction{filtered.length !== 1 ? "s" : ""}
        </span>

        {/* Recherche */}
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            placeholder="Rechercher dans l'historique"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "8px 16px 8px 38px",
              border: "1px solid #e5e7eb", borderRadius: "8px",
              fontSize: "13px", color: "#374151", outline: "none",
            }}
          />
          <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
        </div>

        {/* Trier par */}
        <span style={{ fontSize: "13px", color: "#6b7280", whiteSpace: "nowrap" }}>Triez</span>
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          style={{
            padding: "8px 12px", borderRadius: "8px",
            border: "1px solid #e5e7eb", fontSize: "13px", color: "#374151",
            background: "#fff", cursor: "pointer",
          }}
        >
          <option value="date">Date</option>
          <option value="montant">Montant</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{
            padding: "8px 12px", borderRadius: "8px",
            border: "1px solid #e5e7eb", fontSize: "13px", color: "#374151",
            background: "#fff", cursor: "pointer",
          }}
        >
          <option value="desc">Décroissant</option>
          <option value="asc">Croissant</option>
        </select>
      </div>

      {/* ── Table ── */}
      <div style={{
        backgroundColor: "#fff", border: "1px solid #f0f0f0",
        borderRadius: "12px", overflow: "hidden",
      }}>
        {/* Bouton actualiser */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #fef0e8" }}>
          <button
            onClick={fetchTransactions}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", borderRadius: "6px",
              backgroundColor: "#ff5a00", color: "#fff",
              border: "none", fontSize: "13px", fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} /> Actualiser
          </button>
        </div>

        {/* En-têtes */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1.5fr 1fr 1fr 80px",
          padding: "12px 20px",
          backgroundColor: "#fff8f5",
          borderBottom: "1px solid #fef0e8",
        }}>
          {["Status", "Montant", "Info Client", "Type", "Date", "Actions"].map((h) => (
            <span key={h} style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>{h}</span>
          ))}
        </div>

        {/* Lignes */}
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>
            Chargement...
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>
            Aucune donnée à afficher
          </div>
        ) : (
          paginated.map((t, i) => {
            const s = STATUS_STYLE[t.status] ?? STATUS_STYLE.pending;
            return (
              <div
                key={t.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1.5fr 1fr 1fr 80px",
                  padding: "14px 20px",
                  borderBottom: i < paginated.length - 1 ? "1px solid #f9fafb" : "none",
                  alignItems: "center",
                }}
              >
                {/* Status badge */}
                <span style={{
                  display: "inline-flex", alignItems: "center",
                  padding: "3px 10px", borderRadius: "20px",
                  backgroundColor: s.bg, color: s.color,
                  fontSize: "12px", fontWeight: 600, width: "fit-content",
                }}>
                  {s.label}
                </span>

                {/* Montant */}
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#1f2937" }}>
                  {Number(t.amount).toLocaleString("fr-FR")} FCFA
                </span>

                {/* Info client (numéro de téléphone) */}
                <span style={{ fontSize: "13px", color: "#6b7280" }}>
                  +229 {t.phoneNumber}
                </span>

                {/* Type */}
                <span style={{ fontSize: "13px", color: "#6b7280" }}>
                  Mobile Money
                </span>

                {/* Date */}
                <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                  {new Date(t.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit", month: "2-digit", year: "numeric",
                  })}
                </span>

                {/* Actions */}
                <button style={{
                  padding: "6px 12px", borderRadius: "6px",
                  border: "1px solid #e5e7eb", background: "#fff",
                  fontSize: "12px", color: "#374151", cursor: "pointer",
                }}>
                  Voir
                </button>
              </div>
            );
          })
        )}

        {/* ── Pagination ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", borderTop: "1px solid #f0f0f0",
        }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {/* « ‹ pages › » */}
            {[
              { label: "«", action: () => setPage(1) },
              { label: "‹", action: () => setPage((p) => Math.max(1, p - 1)) },
            ].map(({ label, action }) => (
              <button key={label} onClick={action} disabled={page === 1} style={paginBtn(page === 1)}>
                {label}
              </button>
            ))}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={paginBtn(false, p === page)}>
                {p}
              </button>
            ))}

            {[
              { label: "›", action: () => setPage((p) => Math.min(totalPages, p + 1)) },
              { label: "»", action: () => setPage(totalPages) },
            ].map(({ label, action }) => (
              <button key={label} onClick={action} disabled={page === totalPages} style={paginBtn(page === totalPages)}>
                {label}
              </button>
            ))}
          </div>

          {/* Par page */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>Par page</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              style={{
                padding: "6px 10px", borderRadius: "6px",
                border: "1px solid #e5e7eb", fontSize: "13px", color: "#374151",
                background: "#fff", cursor: "pointer",
              }}
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper style bouton pagination
function paginBtn(disabled: boolean, active = false): React.CSSProperties {
  return {
    width: "32px", height: "32px",
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: "6px", border: "1px solid #e5e7eb",
    backgroundColor: active ? "#1e3a8a" : "#fff",
    color: active ? "#fff" : disabled ? "#d1d5db" : "#374151",
    fontSize: "13px", fontWeight: active ? 700 : 400,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}