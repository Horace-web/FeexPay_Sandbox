import Image from "next/image";
import Link from "next/link";
import { Mail, User, Building2, UserCircle } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="w-full flex flex-col">
      {/* Logo FeexPay centré */}
      <div className="flex justify-center mb-10">
        <Image src="/logo-feexpay.png" alt="FeexPay" width={180} height={60} priority />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">S'inscrire</h2>

      <form className="flex flex-col gap-y-4"> 
        
        {/* Champ Nom */}
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 pointer-events-none z-20">
            <User size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Nom*" 
            className="input-field" 
          />
        </div>

        {/* Champ Prénom */}
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 pointer-events-none z-20">
            <UserCircle size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Prénom*" 
            className="input-field" 
          />
        </div>

        {/* Champ Email */}
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 pointer-events-none z-20">
            <Mail size={20} />
          </div>
          <input 
            type="email" 
            placeholder="Adresse e-mail*" 
            className="input-field" 
          />
        </div>

        {/* Champ Entreprise */}
        <div className="relative group w-full">
          <div className="absolute inset-y-0 left-6 flex items-center text-gray-400 pointer-events-none z-20">
            <Building2 size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Nom de l'entreprise*" 
            className="input-field" 
          />
        </div>

        {/* Bouton S'inscrire (Utilise btn-primary défini dans ton CSS) */}
        <button className="w-full bg-[#ff5a00] text-white py-4 rounded-2xl font-bold mt-4 shadow-lg hover:bg-[#e65100] transition-all transform active:scale-[0.98] text-[14px]">
          S'inscrire
        </button>
      </form>

      <p className="mt-10 text-center text-[14px] text-gray-600">
        Vous avez déjà un compte ? <Link href="/signin" className="text-[#ff5a00] font-bold hover:underline">Se connecter</Link>
      </p>
    </div>
  );
}