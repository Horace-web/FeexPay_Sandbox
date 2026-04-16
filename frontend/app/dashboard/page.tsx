"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Si pas de token → retour au login
    const token = localStorage.getItem("token");
    if (!token) router.push("/signin");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold text-gray-800">
        🎉 Bienvenue sur le Dashboard !
      </h1>
    </div>
  );
}