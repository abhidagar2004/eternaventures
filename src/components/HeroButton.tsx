import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import './HeroButton.css';

export default function HeroButton({ href, children }: { href: string; children: ReactNode }) {
  return <a className="hero-banner-button" href={href}>{children}<ArrowRight size={24} aria-hidden="true" /></a>;
}
