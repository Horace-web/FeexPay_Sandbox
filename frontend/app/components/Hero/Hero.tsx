"use client";
import React from 'react';
import styles from './Hero.module.css';
import { useRouter } from "next/navigation";

const Hero: React.FC = () => {
  const router = useRouter();
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        
        {/* Bloc Texte */}
        <div className={styles.textContent}>
          <img 
            src="/logo-feexpay.png" 
            alt="Logo FeexPay" 
            className={styles.logoImg} 
          />
          
          <h1 className={styles.title}>
            Votre passerelle de paiement <br />
            <span className={styles.bold}>rapide</span> et <span className={styles.bold}>sécurisée</span>
          </h1>

          <button className={styles.btnCta} onClick={() => router.push("/signup")}>
            Démarrer
            <div className={styles.iconBox}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </button>
        </div>

        {/* Bloc Image */}
        <div className={styles.imageContent}>
          <img 
            src="/hero-person.png" 
            alt="Illustration FeexPay" 
            className={styles.personImg} 
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;