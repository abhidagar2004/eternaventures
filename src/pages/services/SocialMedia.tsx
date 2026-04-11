import PageHeader from '../../components/PageHeader';
import CTA from '../../components/CTA';
import WhyUs from '../../components/WhyUs';

export default function SocialMedia() {
  return (
    <div className="pt-20">
      <PageHeader badge="Service" title="Social Media Management" description="Build a loyal community and dominate your niche with strategic, platform-native content." />
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">Your Brand's Digital Voice</h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            In today's attention economy, posting generic graphics isn't enough. We build organic social media strategies that foster genuine community engagement, build brand equity, and turn followers into brand advocates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-16">
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <h3 className="text-blue-600 font-bold text-xl mb-3">Platform Strategy</h3>
              <p className="text-gray-600">Customized playbooks for Instagram, TikTok, LinkedIn, and X based on where your audience actually lives.</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <h3 className="text-blue-600 font-bold text-xl mb-3">Community Management</h3>
              <p className="text-gray-600">Active engagement, comment moderation, and relationship building to foster brand loyalty.</p>
            </div>
          </div>
        </div>
      </section>
      <WhyUs />
      <CTA 
        title="Turn Followers Into Customers" 
        description="Stop posting into the void. Let's build a social media presence that actually drives revenue and brand loyalty."
        buttonText="Discuss Your Social Strategy"
        buttonLink="/contact"
        theme="dark"
      />
    </div>
  );
}
