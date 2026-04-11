import { motion } from 'motion/react';

export default function ClientLogos() {
  const logos = [
    { name: "TechFlow", url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=100&auto=format&fit=crop" },
    { name: "Aura", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=100&auto=format&fit=crop" },
    { name: "Lumina", url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=100&auto=format&fit=crop" },
    { name: "NextGen", url: "https://images.unsplash.com/photo-1507238692062-5a042e9e18c4?q=80&w=100&auto=format&fit=crop" },
    { name: "UrbanBrew", url: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=100&auto=format&fit=crop" },
    { name: "Elevate", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=100&auto=format&fit=crop" },
  ];

  // Duplicate for infinite scroll effect
  const scrollingLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-16 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8">
        <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Trusted by innovative brands worldwide
        </p>
      </div>
      
      <div className="relative w-full flex overflow-x-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
        
        <motion.div 
          className="flex gap-16 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            repeat: Infinity, 
            ease: "linear", 
            duration: 20 
          }}
        >
          {scrollingLogos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center min-w-[120px] opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-2xl font-display font-bold text-gray-900">{logo.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
