import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  theme?: 'gold' | 'dark';
  bgColor?: string;
  titleColor?: string;
  titleSize?: string;
  descColor?: string;
  descSize?: string;
  btnColor?: string;
  btnTextColor?: string;
  btnRadius?: string;
}

export default function CTA({
  title,
  description,
  buttonText,
  buttonLink = "/contact",
  theme = "gold",
  bgColor,
  titleColor,
  titleSize = "text-5xl md:text-7xl",
  descColor,
  descSize = "text-lg md:text-xl",
  btnColor,
  btnTextColor,
  btnRadius = "rounded-none"
}: CTAProps) {
  if (!title && !buttonText) return null;

  const isGold = theme === 'gold';
  
  const sectionStyle = bgColor ? { backgroundColor: bgColor } : {};
  const sectionClass = bgColor ? `py-24 relative overflow-hidden` : `py-24 relative overflow-hidden ${isGold ? 'bg-[#2596be]' : 'bg-black border-t border-gray-900'}`;

  const finalTitleColor = titleColor || (isGold ? '#ffffff' : '#ffffff');
  const finalDescColor = descColor || (isGold ? '#dbeafe' : '#9ca3af'); // blue-100 or gray-400
  
  // For button, if custom colors are provided, use them. Otherwise fallback to theme.
  const btnStyle = btnColor || btnTextColor ? {
    backgroundColor: btnColor || (isGold ? '#ffffff' : '#2596be'),
    color: btnTextColor || (isGold ? '#2596be' : '#ffffff'),
    borderColor: btnColor || (isGold ? '#ffffff' : '#2596be')
  } : {};

  const baseBtnRadius = btnRadius || 'rounded-none';
  const btnClass = btnColor || btnTextColor 
    ? `inline-flex items-center gap-2 px-8 py-4 font-bold uppercase tracking-wider transition-colors border hover:opacity-80 ${baseBtnRadius}`
    : `inline-flex items-center gap-2 px-8 py-4 font-bold uppercase tracking-wider transition-colors border ${baseBtnRadius} ${
        isGold 
          ? 'bg-white text-[#2596be] border-white hover:bg-transparent hover:text-white' 
          : 'bg-[#2596be] text-white border-[#2596be] hover:bg-transparent hover:text-[#2596be]'
      }`;

  return (
    <section className={sectionClass} style={sectionStyle}>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className={`${titleSize} font-display font-black uppercase tracking-tighter leading-none mb-6`} style={{ color: finalTitleColor }}>
          {title}
        </h2>
        <p className={`${descSize} mb-10 font-medium max-w-2xl mx-auto`} style={{ color: finalDescColor }}>
          {description}
        </p>
        <Link 
          to={buttonLink} 
          className={btnClass}
          style={btnStyle}
        >
          {buttonText} <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
}
