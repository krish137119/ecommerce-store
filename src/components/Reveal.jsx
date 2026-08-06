import { useInView } from '../hooks/useInView';

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const { ref, inView } = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'reveal--visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  );
}
