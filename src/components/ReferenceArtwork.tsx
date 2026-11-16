import type { CSSProperties } from 'react';

interface ReferenceArtworkProps {
  x: number;
  y: number;
  width: number;
  height: number;
  alt: string;
  className?: string;
  src?: string;
  sourceWidth?: number;
  sourceHeight?: number;
  priority?: boolean;
}

/** Displays a photograph region from a supplied reference while keeping page UI in HTML. */
export default function ReferenceArtwork({ x, y, width, height, alt, className = '', src = '/images/services-reference.png', sourceWidth = 1086, sourceHeight = 1448, priority = false }: ReferenceArtworkProps) {
  const style: CSSProperties = { position: 'relative', overflow: 'hidden', aspectRatio: `${width} / ${height}` };
  return <div className={className} style={style}>
    <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} style={{ position: 'absolute', maxWidth: 'none', width: `${sourceWidth / width * 100}%`, left: 0, top: 0, transform: `translate(${-x / sourceWidth * 100}%, ${-y / sourceHeight * 100}%)`, height: 'auto' }} />
  </div>;
}
