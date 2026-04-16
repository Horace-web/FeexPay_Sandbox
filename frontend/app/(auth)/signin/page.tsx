"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isFormValid = email.includes("@") && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Identifiants incorrects");
        return;
      }
      
      // Sauvegarde du token JWT dans le localStorage
      localStorage.setItem("token", data.token);
      // Stocker les infos user pour les afficher dans le dashboard
      localStorage.setItem("user", JSON.stringify(data.user));
      // Redirection vers le dashboard
      router.push("/dashboard");

    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-center mb-12">
        <Image src="/logo-feexpay.png" alt="FeexPay" width={180} height={60} priority />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">Connexion</h2>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-y-6" onSubmit={handleSubmit}>

        {/* Email */}
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 pointer-events-none z-20">
            <Mail size={22} />
          </div>
          <input
            type="email"
            placeholder="Adresse e-mail"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Mot de passe */}
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 pointer-events-none z-20">
            <Lock size={22} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            className="input-field pr-16"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="absolute inset-y-0 right-6 flex items-center text-gray-400 cursor-pointer hover:text-gray-600 z-20"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-[13px]">
          <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-[#1E40AF]" />
            Se souvenir de moi
          </label>
          <Link href="#" className="text-[#ff5a00] font-semibold hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-4 rounded-2xl font-bold mt-4 transition-all transform active:scale-[0.98] ${
            isFormValid && !loading
              ? "bg-[#ff5a00] text-white hover:bg-[#e65100] cursor-pointer shadow-lg"
              : "bg-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed shadow-none"
          }`}
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-16 text-center text-[14px] text-gray-600">
        Vous n'avez pas de compte ?{" "}
        <Link href="/signup" className="text-[#ff5a00] font-bold hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}