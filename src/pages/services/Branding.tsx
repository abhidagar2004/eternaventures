import PageHeader from '../../components/PageHeader';
import CTA from '../../components/CTA';
import Testimonials from '../../components/Testimonials';

export default function Branding() {
  return (
    <div className="pt-20">
      <PageHeader badge="Service" title="Branding & Strategy" description="Position your brand for long-term success with a cohesive identity and market strategy." />
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">Stand Out in a Crowded Market</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            A strong brand is your ultimate moat. We help you define your unique value proposition, visual identity, and brand voice to ensure you resonate deeply with your target audience and command premium pricing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-16">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <h3 className="text-blue-600 font-bold text-xl mb-3">Brand Identity</h3>
              <p className="text-gray-600">Logos, typography, color palettes, and visual guidelines that capture your brand's essence.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <h3 className="text-blue-600 font-bold text-xl mb-3">Positioning Strategy</h3>
              <p className="text-gray-600">Market research, competitor analysis, and messaging frameworks to differentiate your business.</p>
            </div>
          </div>
        </div>
      </section>
      <Testimonials />
      <CTA 
        title="Build a Brand, Not Just a Business" 
        description="Ready to elevate your visual identity and command premium pricing in your market?"
        buttonText="Start Your Rebrand"
        buttonLink="/contact"
        theme="dark"
      />
    </div>
  );
}
