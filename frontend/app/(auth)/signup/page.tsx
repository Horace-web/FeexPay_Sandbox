"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, User, Building2, UserCircle, Lock, Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    EnterpriseName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid =
    form.lastName.trim() !== "" &&
    form.firstName.trim() !== "" &&
    form.email.includes("@") &&
    form.EnterpriseName.trim() !== "" &&
    form.password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        // Le backend renvoie souvent { message: "..." }
        setError(data.message || "Une erreur est survenue");
        return;
      }

      // Stocker les infos user pour les afficher dans le dashboard
      localStorage.setItem("user", JSON.stringify(data.user));

      // Inscription réussie → redirection vers signin
      router.push("/signin");

    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-center mb-10">
        <Image src="/logo-feexpay.png" alt="FeexPay" width={180} height={60} priority />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">S'inscrire</h2>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>

        {/* Nom */}
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 pointer-events-none z-20">
            <User size={20} />
          </div>
          <input
            type="text"
            name="lastName"
            placeholder="Nom*"
            className="input-field"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        {/* Prénom */}
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 pointer-events-none z-20">
            <UserCircle size={20} />
          </div>
          <input
            type="text"
            name="firstName"
            placeholder="Prénom*"
            className="input-field"
            value={form.firstName}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 pointer-events-none z-20">
            <Mail size={20} />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Adresse e-mail*"
            className="input-field"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* Entreprise */}
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 pointer-events-none z-20">
            <Building2 size={20} />
          </div>
          <input
            type="text"
            name="EnterpriseName"
            placeholder="Nom de l'entreprise*"
            className="input-field"
            value={form.EnterpriseName}
            onChange={handleChange}
          />
        </div>

        {/* Mot de passe */}
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 pointer-events-none z-20">
            <Lock size={20} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mot de passe* (min. 6 caractères)"
            className="input-field pr-16"
            value={form.password}
            onChange={handleChange}
          />
          <div
            className="absolute inset-y-0 right-6 flex items-center text-gray-400 cursor-pointer hover:text-gray-600 z-20"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-4 rounded-2xl font-bold mt-4 transition-all transform active:scale-[0.98] text-[14px] ${
            isFormValid && !loading
              ? "bg-[#ff5a00] text-white hover:bg-[#e65100] cursor-pointer shadow-lg"
              : "bg-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed shadow-none"
          }`}
        >
          {loading ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </form>

      <p className="mt-10 text-center text-[14px] text-gray-600">
        Vous avez déjà un compte ?{" "}
        <Link href="/signin" className="text-[#ff5a00] font-bold hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}