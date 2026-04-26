"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, ArrowLeftRight, RefreshCcw,
  Users, Code2, ChevronDown, LogOut, Settings,
} from "lucide-react";

const navItems = [
  { label: "Tableau de bord", href: "/dashboard",                icon: LayoutDashboard },
  { label: "Transactions",    href: "/dashboard/transactions",   icon: ArrowLeftRight },
  { label: "Reversements",    href: "/dashboard/reversements",   icon: RefreshCcw },
  { label: "Clients",         href: "/dashboard/clients",        icon: Users },
  { label: "Développeurs",    href: "/dashboard/developpeurs",   icon: Code2 },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [user, setUser]           = useState<any>(null);
  const [mode, setMode]           = useState<"Test" | "Live">("Test");
  const [dropdownOpen, setDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/signin"); return; }
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
  };

  const enterpriseName = user?.enterpriseName || user?.EnterpriseName || "Mon entreprise";
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`;

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", backgroundColor: "#f9fafb" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: "240px",
        minWidth: "240px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
        padding: "24px 12px",
        gap: "8px",
      }}>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <Image src="/logo-feexpay.png" alt="FeexPay" width={140} height={46} priority />
        </div>

        {/* Nom entreprise */}
        <div style={{ padding: "0 4px", marginBottom: "4px" }}>
          <div style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            fontSize: "13px",
            fontWeight: 600,
            color: "#374151",
          }}>
            {enterpriseName}
          </div>
        </div>

        {/* Valider mon compte */}
        <div style={{ padding: "0 4px", marginBottom: "8px" }}>
          <button style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 14px",
            borderRadius: "8px",
            backgroundColor: "#ff5a00",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}>
            <Settings size={16} />
            Valider mon compte
          </button>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#ff5a00" : "#6b7280",
                backgroundColor: isActive ? "#fff5f0" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              }}>
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Toggle Test / Live */}
        <div style={{
          display: "flex",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          marginTop: "8px",
        }}>
          {(["Test", "Live"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: "8px 0",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                backgroundColor: mode === m ? "#ff5a00" : "#ffffff",
                color: mode === m ? "#ffffff" : "#9ca3af",
                transition: "all 0.15s",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

        {/* NAVBAR */}
        <header style={{
          height: "64px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 32px",
          flexShrink: 0,
        }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropdown(!dropdownOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
              }}
            >
              {/* Avatar initiales */}
              <div style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                backgroundColor: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 700,
                color: "#374151",
              }}>
                {initials}
              </div>
              {user?.firstName} {user?.lastName}
              <ChevronDown size={15} color="#9ca3af" />
            </button>

            {dropdownOpen && (
              <div style={{
                position: "absolute",
                right: 0,
                top: "44px",
                width: "180px",
                backgroundColor: "#ffffff",
                border: "1px solid #f0f0f0",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                zIndex: 100,
                padding: "4px",
              }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "#ef4444",
                    borderRadius: "8px",
                  }}
                >
                  <LogOut size={15} /> Se déconnecter
                </button>
              </div>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}