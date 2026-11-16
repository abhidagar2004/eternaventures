import { Children, cloneElement, isValidElement, useEffect, useRef, useState, type ReactNode } from 'react';

/** A full group must cover the viewport before its identical copy takes over. */
export function loopRepeatCount(viewportWidth: number, sequenceWidth: number) {
  return sequenceWidth > 0 ? Math.max(1, Math.ceil((viewportWidth + 1) / sequenceWidth)) : 1;
}

// Hidden duplicates still accept pointer hover/click, but do not repeat keyboard stops.
function pointerCopy(nodes: ReactNode): ReactNode {
  return Children.map(nodes, child => {
    if (!isValidElement(child)) return child;
    const childProps = child.props as Record<string, any>;
    const props: Record<string, any> = {};
    if ('to' in childProps || 'href' in childProps || childProps.tabIndex != null || ['button', 'input', 'select', 'textarea'].includes(String(child.type))) props.tabIndex = -1;
    if (childProps.children) props.children = pointerCopy(childProps.children);
    return cloneElement(child, props);
  });
}

export default function MovingRow({ children, label, className = '' }: { children: ReactNode; label: string; className?: string }) {
  const viewport = useRef<HTMLDivElement>(null);
  const sequence = useRef<HTMLDivElement>(null);
  const [repeats, setRepeats] = useState(1);
  useEffect(() => {
    const measure = () => {
      if (viewport.current && sequence.current) setRepeats(loopRepeatCount(viewport.current.clientWidth, sequence.current.getBoundingClientRect().width));
    };
    const observer = new ResizeObserver(measure);
    if (viewport.current) observer.observe(viewport.current);
    if (sequence.current) observer.observe(sequence.current);
    measure();
    return () => observer.disconnect();
  }, [children]);
  const duplicate = pointerCopy(children);
  return <div className={`home-moving-row ${className}`} role="region" aria-label={label}>
    <div className="home-moving-viewport" ref={viewport}>
      <div className="home-moving-track">
        <div className="home-moving-group">
          <div className="home-moving-sequence" ref={sequence}>{children}</div>
          {Array.from({ length: repeats - 1 }, (_, index) => <div className="home-moving-sequence home-moving-copy" aria-hidden="true" key={index}>{duplicate}</div>)}
        </div>
        <div className="home-moving-group home-moving-copy" aria-hidden="true">
          {Array.from({ length: repeats }, (_, index) => <div className="home-moving-sequence" key={index}>{duplicate}</div>)}
        </div>
      </div>
    </div>
  </div>;
}
