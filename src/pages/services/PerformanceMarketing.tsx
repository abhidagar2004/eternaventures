import PageHeader from '../../components/PageHeader';
import CTA from '../../components/CTA';
import Process from '../../components/Process';
import TrustBar from '../../components/TrustBar';

export default function PerformanceMarketing() {
  return (
    <div className="pt-20">
      <PageHeader badge="Service" title="Performance Marketing" description="Data-driven Meta and Google Ads campaigns designed to maximize ROAS and scale revenue predictably." />
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">Stop Guessing. Start Scaling.</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            We don't just run ads; we engineer profitable customer acquisition systems. By combining rigorous media buying strategies with high-converting creative, we help D2C brands and startups turn advertising spend into predictable revenue.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16">
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-blue-600 font-bold text-xl mb-3">Meta Ads</h3>
              <p className="text-gray-600">Full-funnel Facebook and Instagram campaigns optimized for conversions and MER.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-blue-600 font-bold text-xl mb-3">Google Ads</h3>
              <p className="text-gray-600">Intent-driven Search, Shopping, and Performance Max campaigns to capture high-quality leads.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-blue-600 font-bold text-xl mb-3">TikTok Ads</h3>
              <p className="text-gray-600">Native, UGC-style campaigns designed to go viral and drive massive top-of-funnel awareness.</p>
            </div>
          </div>
        </div>
      </section>
      <TrustBar />
      <Process />
      <CTA 
        title="Scale Your Ad Spend Profitably" 
        description="Stop burning cash on inefficient campaigns. Let our media buyers build a high-ROI acquisition engine for your brand."
        buttonText="Audit My Ad Account"
        buttonLink="/contact"
        theme="gold"
      />
    </div>
  );
}
