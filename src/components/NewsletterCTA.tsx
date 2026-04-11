import { Send } from 'lucide-react';

export default function NewsletterCTA() {
  return (
    <section className="py-24 bg-black border-t border-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#2596be]/10 blur-[100px] rounded-full w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter text-white mb-6">Get Growth Tactics in Your Inbox</h2>
        <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
          Join 10,000+ founders and marketers receiving our weekly insights on performance marketing, creative strategy, and brand scaling.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="flex-1 bg-[#111] border border-gray-800 rounded-full px-6 py-4 text-white focus:outline-none focus:border-[#2596be] transition-colors" 
            required
          />
          <button className="px-8 py-4 bg-[#2596be] hover:bg-[#1e7a9b] text-white font-bold uppercase tracking-wider rounded-full flex items-center justify-center gap-2 transition-colors">
            Subscribe <Send size={18} />
          </button>
        </form>
      </div>
    </section>
  );
}
