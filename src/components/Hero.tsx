import { motion } from 'motion/react';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Video/Abstract Element */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white z-10" />
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
          alt="Agency Background"
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        {/* Decorative blur circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] z-0" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[1.1] mb-6">
            We Don't Just Market Brands. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">
              We Build Them.
            </span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            EternaVentures helps brands scale with strategy, creativity, and performance-driven marketing.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-full flex items-center justify-center gap-2 transition-all transform hover:scale-105"
            >
              Book a Call <ArrowRight size={18} />
            </Link>
            <Link
              to="/projects"
              className="w-full sm:w-auto px-8 py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold rounded-full flex items-center justify-center gap-2 border border-gray-200 transition-all"
            >
              <Play size={18} className="text-blue-600" /> View Our Work
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
