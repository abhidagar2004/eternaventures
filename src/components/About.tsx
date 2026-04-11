import { motion } from 'motion/react';

interface AboutProps {
  bgColor?: string;
  tag?: string;
  tagColor?: string;
  heading?: string;
  headingColor?: string;
  headingSize?: string;
  mission?: string;
  vision?: string;
  story?: string;
  textColor?: string;
  yearFounded?: string;
  yearFoundedLabel?: string;
  globalValue?: string;
  globalReach?: string;
  imageUrl?: string;
  imageOverlayColor?: string;
  imageOverlayOpacity?: number | string;
}

export default function About({
  bgColor = '#000000',
  tag,
  tagColor = '#2596be',
  heading,
  headingColor = '#ffffff',
  headingSize = 'text-5xl md:text-7xl',
  mission,
  vision,
  story,
  textColor = '#9ca3af',
  yearFounded,
  yearFoundedLabel,
  globalValue,
  globalReach,
  imageUrl,
  imageOverlayColor = '#000000',
  imageOverlayOpacity = 0.2,
}: AboutProps) {
  if (!heading && !tag && !story) return null;

  return (
    <section id="about" className="py-24 relative border-t border-gray-900" style={{ backgroundColor: bgColor }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
              <div
                className="absolute inset-0 z-10"
                style={{
                  backgroundColor: imageOverlayColor || '#000000',
                  opacity: imageOverlayOpacity !== null && imageOverlayOpacity !== undefined ? Number(imageOverlayOpacity) : 0.2
                }}
              />
              <img
                src={imageUrl}
                alt="EternaVentures Team"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h2 className="font-bold tracking-widest uppercase text-sm mb-3" style={{ color: tagColor }}>{tag}</h2>
            <h3 className={`${headingSize} font-display font-black uppercase tracking-tighter mb-6 leading-none`} style={{ color: headingColor }}>
              {heading}
            </h3>

            <div className="space-y-6 text-lg" style={{ color: textColor }}>
              <p>{story}</p>
              <p>
                <strong style={{ color: headingColor }}>Our Mission:</strong> {mission}
              </p>
              <p>
                <strong style={{ color: headingColor }}>Our Vision:</strong> {vision}
              </p>
            </div>

            <div className="mt-10 pt-10 border-t border-gray-800 flex items-center gap-6">
              <div>
                <p className="text-4xl font-display font-black" style={{ color: headingColor }}>{yearFounded}</p>
                <p className="text-sm uppercase tracking-widest mt-1 font-bold" style={{ color: textColor, opacity: 0.7 }}>{yearFoundedLabel}</p>
              </div>
              <div className="w-px h-12 bg-gray-800" />
              <div>
                <p className="text-4xl font-display font-black" style={{ color: headingColor }}>{globalValue}</p>
                <p className="text-sm uppercase tracking-widest mt-1 font-bold" style={{ color: textColor, opacity: 0.7 }}>{globalReach}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
