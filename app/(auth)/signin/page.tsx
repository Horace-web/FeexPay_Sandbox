"use client"; // Obligatoire pour utiliser useState

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";

export default function SignInPage() {
  // États pour les champs et la visibilité du mot de passe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Vérification de la validité (Email contient @ + Password >= 6 caractères)
  const isFormValid = email.includes("@") && password.length >= 6;

  return (
    <div className="w-full flex flex-col">
      <div className="flex justify-center mb-12">
        <Image src="/logo-feexpay.png" alt="FeexPay" width={180} height={60} priority />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">Connexion</h2>

      <form className="flex flex-col gap-y-6" onSubmit={(e) => e.preventDefault()}> 
        
        {/* Champ Email */}
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

        {/* Champ Mot de passe */}
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

        {/* Bouton dynamique : Orange si valide, Gris si invalide */}
        <button 
          disabled={!isFormValid}
          className={`w-full py-4 rounded-2xl font-bold mt-4 transition-all transform active:scale-[0.98] ${
            isFormValid 
              ? "bg-[#ff5a00] text-white hover:bg-[#e65100] cursor-pointer shadow-lg" 
              : "bg-[#D1D5DB] text-[#9CA3AF] cursor-not-allowed shadow-none"
          }`}
        >
          Se connecter
        </button>
      </form>

      <p className="mt-16 text-center text-[14px] text-gray-600">
        Vous n'avez pas de compte ? <Link href="/signup" className="text-[#ff5a00] font-bold hover:underline">Créer un compte</Link>
      </p>
    </div>
  );
}