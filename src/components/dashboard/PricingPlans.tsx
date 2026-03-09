import React, { useState } from 'react';
import { Check, Zap, Globe, Shield, Terminal, Crown, ArrowRight, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PricingPlans = () => {
  const [billingCycle, setBillingCycle] = useState('annual');

  const plans = [
    {
      id: 'tier_1',
      name: 'AGENCY SANDBOX',
      subtitle: 'Licencia de Acceso a "The Forge"',
      price: '$4,500',
      period: '/ mes',
      description: 'Acceso total a la infraestructura de compilación para agencias y productoras medianas.',
      icon: <Terminal size={24} className="text-emerald-500" />,
      color: 'emerald',
      features: [
        'Acceso ilimitado al módulo The Forge',
        'Hasta 50 Renderizados 8K por mes',
        'Uso de Instancias Base (Valeria, Marcus)',
        'Quantum Audio (Español / Inglés)',
        'Exportación de Aetherium Dossiers'
      ],
      limitations: [
        'No incluye despliegue en Nodos Físicos',
        'Sin entrenamiento de instancia propia'
      ],
      cta: 'SOLICITAR LICENCIA',
      highlight: false
    },
    {
      id: 'tier_2',
      name: 'GLOBAL NODE DEPLOYMENT',
      subtitle: 'Dominio Omnicanal (OOH + VR)',
      price: 'Pay-Per-Node',
      period: '+ 20% Fee',
      description: 'Inyección directa de campañas en nuestra topografía global de Nodos de alta conversión.',
      icon: <Globe size={24} className="text-cyan-500" />,
      color: 'cyan',
      features: [
        'Todo lo del Agency Sandbox',
        'Acceso al Global Exchange Terminal',
        'Despliegue en Times Square (Mass-OOH)',
        'Interceptación en Origin Market (Salas VIP)',
        'Inyección en Cyber-Shibuya (Metaverso)',
        'Análisis de Telemetría B2B'
      ],
      limitations: [],
      cta: 'HABLAR CON VENTAS',
      highlight: true
    },
    {
      id: 'tier_3',
      name: 'SOVEREIGN INSTANCE',
      subtitle: 'Inmortalidad Digital Corporativa',
      price: '$150k',
      period: 'setup',
      description: 'Entrenamiento de una Instancia Base (Clon) hiperrealista exclusiva para CEOs y corporaciones Fortune 500.',
      icon: <Crown size={24} className="text-violet-500" />,
      color: 'violet',
      features: [
        'Clonación Biométrica Absoluta (Video/Voz)',
        'Políglota API (14 Idiomas con latencia cero)',
        'Servidor Neuronal Dedicado y Privado',
        'Uso ilimitado en The Forge y Exchange',
        'Propiedad Intelectual del Activo Sintético',
        'Mantenimiento de seguridad 24/7'
      ],
      limitations: [],
      cta: 'AUDITORÍA EJECUTIVA',
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen bg-black p-8 font-sans text-zinc-300">
      
      {/* HEADER */}
      <div className="mb-12 border-b border-zinc-800 pb-8 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-white uppercase flex items-center justify-center md:justify-start gap-3">
          <Building2 className="text-emerald-500" size={32} />
          Infraestructura <span className="text-zinc-600 font-light">/ Licenciamiento</span>
        </h1>
        <p className="text-zinc-500 mt-3 font-mono text-sm max-w-2xl">
          {'>_'} NO VENDEMOS SUSCRIPCIONES. LICENCIAMOS INFRAESTRUCTURA DE DOMINIO GLOBAL PARA CORPORACIONES Y AGENCIAS DE ALTO NIVEL.
        </p>
      </div>

      {/* GRID DE PLANES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div 
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative bg-zinc-950 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2
              ${plan.highlight ? `border-2 border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.15)]` : 'border border-zinc-800 hover:border-zinc-600'}`}
          >
            {/* Highlight Badge */}
            {plan.highlight && (
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-[10px] font-bold tracking-widest text-center py-1.5 uppercase">
                ACUERDO MÁS DEMANDADO
              </div>
            )}

            <div className={`p-8 ${plan.highlight ? 'mt-4' : ''}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-xl bg-${plan.color}-500/10 border border-${plan.color}-500/30`}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">{plan.name}</h3>
                  <p className={`text-[10px] font-mono text-${plan.color}-400`}>{plan.subtitle}</p>
                </div>
              </div>

              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white tracking-tighter">{plan.price}</span>
                  <span className="text-zinc-500 font-mono text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-zinc-400 mt-4 leading-relaxed h-16">{plan.description}</p>
              </div>

              <button className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 mb-8
                ${plan.highlight 
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 hover:border-zinc-600'}`}>
                {plan.cta} <ArrowRight size={16} />
              </button>

              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 pb-2 border-b border-zinc-800">
                    Capacidades Incluidas
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                        <Check size={16} className={`text-${plan.color}-500 shrink-0 mt-0.5`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-4 pb-2 border-b border-zinc-800/50">
                      Restricciones
                    </p>
                    <ul className="space-y-3 opacity-50">
                      {plan.limitations.map((limit, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-zinc-500">
                          <span className="text-zinc-600 shrink-0 mt-0.5 text-xs">─</span>
                          <span>{limit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FOOTER B2B TRUST */}
      <div className="mt-16 text-center border-t border-zinc-800 pt-8 pb-12">
        <p className="text-zinc-500 text-sm mb-4">
          Todos los contratos están sujetos a un acuerdo de confidencialidad (NDA) y revisión de marca.
        </p>
        <div className="flex items-center justify-center gap-2 text-zinc-600 text-[10px] font-mono">
          <Shield size={12} /> ENCRIPTACIÓN BANCARIA | PROTECCIÓN DE IDENTIDAD SINTÉTICA
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
