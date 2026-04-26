"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTransactionPage() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount,      setAmount]      = useState("");
  const [description, setDescription] = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const isValid = phoneNumber.trim().length >= 8 && Number(amount) > 0;

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) { router.push("/signin"); return; }

    try {
      const res = await fetch("http://localhost:3001/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phoneNumber,
          amount: Number(amount),
          description: description || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Une erreur est survenue");
        return;
      }

      // Succès → retour à la liste
      router.push("/dashboard/transactions");

    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1f2937" }}>
          Nouvelle Transaction
        </h1>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
          Encaisser un paiement en débitant directement le compte mobile de vos clients. C'est rapide et efficace !
        </p>
      </div>

      {/* Card formulaire */}
      <div style={{
        backgroundColor: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: "12px",
        padding: "32px",
        maxWidth: "860px",
      }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#1f2937", marginBottom: "20px" }}>
          Paiement Mobile
        </h2>

        {/* Erreur */}
        {error && (
          <div style={{
            marginBottom: "16px", padding: "12px 16px",
            backgroundColor: "#fee2e2", border: "1px solid #fca5a5",
            borderRadius: "8px", fontSize: "13px", color: "#dc2626",
          }}>
            {error}
          </div>
        )}

        {/* Numéro de téléphone */}
        <div style={{
          display: "flex", alignItems: "stretch",
          border: "1px solid #e5e7eb", borderRadius: "8px",
          overflow: "hidden", marginBottom: "12px",
        }}>
          {/* Indicatif pays */}
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "0 12px",
            borderRight: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            fontSize: "13px", fontWeight: 600, color: "#374151",
            whiteSpace: "nowrap",
          }}>
            🇧🇯 +229
          </div>

          {/* Input numéro */}
          <input
            type="tel"
            placeholder="Ex: 66000000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{
              flex: 1, padding: "12px 16px",
              border: "none", outline: "none",
              fontSize: "14px", color: "#1f2937",
            }}
          />
        </div>

        {/* Montant */}
        <div style={{
          display: "flex", alignItems: "stretch",
          border: "1px solid #e5e7eb", borderRadius: "8px",
          overflow: "hidden", marginBottom: "12px",
        }}>
          <input
            type="number"
            placeholder="Montant"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={1}
            style={{
              flex: 1, padding: "12px 16px",
              border: "none", outline: "none",
              fontSize: "14px", color: "#1f2937",
            }}
          />
          <div style={{
            display: "flex", alignItems: "center",
            padding: "0 14px",
            borderLeft: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            fontSize: "13px", fontWeight: 600, color: "#374151",
          }}>
            FCFA
          </div>
        </div>

        {/* Description */}
        <textarea
          placeholder="Description (optionnel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          style={{
            width: "100%", padding: "12px 16px",
            border: "1px solid #e5e7eb", borderRadius: "8px",
            fontSize: "14px", color: "#1f2937",
            outline: "none", resize: "vertical",
            boxSizing: "border-box", marginBottom: "24px",
          }}
        />

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button
            onClick={() => router.push("/dashboard/transactions")}
            style={{
              padding: "11px 24px", borderRadius: "8px",
              border: "1px solid #e5e7eb", background: "#fff",
              fontSize: "13px", fontWeight: 600, color: "#6b7280",
              cursor: "pointer",
            }}
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "11px 28px", borderRadius: "8px",
              border: "none",
              backgroundColor: isValid && !loading ? "#ff5a00" : "#d1d5db",
              color: isValid && !loading ? "#fff" : "#9ca3af",
              fontSize: "13px", fontWeight: 600,
              cursor: isValid && !loading ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            {loading ? "Lancement..." : "Lancer →"}
          </button>
        </div>
      </div>
    </div>
  );
}