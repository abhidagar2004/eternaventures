import { motion } from 'motion/react';

export default function TrustBar({
  bgColor = "#000000",
  textColor = "#ffffff",
  stats
}: {
  bgColor?: string,
  textColor?: string,
  stats?: { value: string, label: string }[]
}) {
  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-12 border-y border-gray-800 relative z-20" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-gray-800">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center px-4"
            >
              <h3 className="text-4xl md:text-5xl font-display font-black mb-2" style={{ color: textColor }}>
                {stat.value}
              </h3>
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: textColor, opacity: 0.7 }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
