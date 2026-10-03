import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

interface DialogProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ title, onClose, children }: DialogProps) {
  const panelRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>('button,a,input,select');
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      previousFocus?.focus();
    };
  }, [onClose, title]);

  return (
    <div className="panel-backdrop" onClick={onClose}>
      <section
        ref={panelRef}
        className="detail-panel surface"
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="panel-heading">
          <span className="eyebrow">Bay Observatory</span>
          <IconButton label="Close panel" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </div>
        <h2 id="panel-title">{title}</h2>
        {children}
      </section>
    </div>
  );
}
