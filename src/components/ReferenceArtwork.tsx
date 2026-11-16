import type { CSSProperties } from 'react';

/** Displays an artwork region of a supplied reference without baking its UI into the page. */
export default function ReferenceArtwork({ x, y, width, height, alt, className = '' }: { x: number; y: number; width: number; height: number; alt: string; className?: string }) {
  const style: CSSProperties = { position: 'relative', overflow: 'hidden', aspectRatio: `${width} / ${height}` };
  return <div className={className} style={style}><img src="/images/services-reference.png" alt={alt} loading={className === 'practices-hero-art' ? 'eager' : 'lazy'} style={{ position: 'absolute', maxWidth: 'none', width: `${1086 / width * 100}%`, left: 0, top: 0, transform: `translate(${-x / 1086 * 100}%, ${-y / 1448 * 100}%)`, height: 'auto' }} /></div>;
}
