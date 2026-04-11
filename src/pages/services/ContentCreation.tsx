import PageHeader from '../../components/PageHeader';
import CTA from '../../components/CTA';

export default function ContentCreation() {
  return (
    <div className="pt-20">
      <PageHeader badge="Service" title="Content Creation" description="High-converting Reels, TikToks, and ad creatives that stop the scroll and drive action." />
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">Creative That Converts</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Creative is the new targeting. Our in-house production team specializes in creating thumb-stopping visual assets—from lo-fi UGC to high-production brand films—designed specifically to perform on modern social platforms.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-16">
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-blue-600 font-bold text-xl mb-3">UGC Production</h3>
              <p className="text-gray-600">Authentic, creator-led content that builds trust and drives conversions.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-blue-600 font-bold text-xl mb-3">Short-Form Video</h3>
              <p className="text-gray-600">Engaging Reels, TikToks, and Shorts optimized for algorithmic reach.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200">
              <h3 className="text-blue-600 font-bold text-xl mb-3">Ad Creatives</h3>
              <p className="text-gray-600">Static and motion graphics engineered specifically for performance marketing campaigns.</p>
            </div>
          </div>
        </div>
      </section>
      <CTA 
        title="Need Content That Converts?" 
        description="From raw UGC to high-end studio productions, we create the assets you need to scale your paid and organic channels."
        buttonText="Request a Content Plan"
        buttonLink="/contact"
        theme="gold"
      />
    </div>
  );
}
