"use client";

import { usePathname } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Détection de la page actuelle pour adapter le message de gauche
  const isSignUp = pathname.includes("signup");
  
  const title = "Bienvenu (e)";
  const description = isSignUp 
    ? "Inscrivez-vous pour créer une boutique sur FeexPay" 
    : "Connectez-vous pour accéder à votre tableau de bord";

  return (
    // Conteneur principal centré
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      
      {/* Cadre principal élargi (max-w-6xl) */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row w-full max-w-6xl overflow-hidden min-h-[620px]">
        
        {/* SECTION GAUCHE (ORANGE AVEC IMAGE) */}
        <div 
            className="hidden md:flex md:w-[45%] p-12 text-white flex-col justify-center items-center text-center relative overflow-hidden"
            style={{ 
              backgroundImage: "url('/orange-card.png')", 
              backgroundSize: 'cover', 
              backgroundPosition: 'center',
              backgroundColor: '#ff5a00'
            }}
          >
            {/* VOILE SOMBRE : Ajoute du contraste pour rendre le texte parfaitement lisible */}
            <div className="absolute inset-0 bg-black/10 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                {title}
              </h1>
              <p className="text-xl opacity-95 leading-relaxed max-w-[340px] font-medium">
                {description}
              </p>
            </div>
        </div>

        {/* SECTION DROITE (FORMULAIRE) */}
        <div className="w-full md:w-[55%] p-8 md:p-12 lg:p-20 flex flex-col items-center justify-center bg-white">
          <div className="w-full max-w-[460px]">
             {children}
          </div>
        </div>

      </div>
    </div>
  );
}