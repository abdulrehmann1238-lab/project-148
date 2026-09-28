import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { CoverImage } from './CoverImage';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl: string;
  name: string;
  specialty?: string;
  city?: string;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

export function Lightbox({
  isOpen,
  onClose,
  photoUrl,
  name,
  specialty,
  city,
  triggerRef,
}: LightboxProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Focus management & body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus close button on open
      setTimeout(() => closeBtnRef.current?.focus(), 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
        // Focus trap
        if (e.key === 'Tab' && modalRef.current) {
          const focusables = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        triggerRef?.current?.focus();
      };
    }
  }, [isOpen, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Expanded magazine cover of ${name}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-modal flex flex-col items-center justify-center p-4 sm:p-6"
          style={{ backgroundColor: 'rgba(18, 37, 42, 0.94)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Top Bar with Close Button */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Close magazine cover viewer"
              className="flex items-center justify-center w-11 h-11 rounded-sm text-bg/80 hover:text-bg hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-brass"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Draggable/Interactive Lightbox Container with FLIP motion */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.y) > 100 || Math.abs(info.velocity.y) > 400) {
                onClose();
              }
            }}
            className="relative max-h-[85vh] max-w-[85vw] aspect-[3/4] rounded-sm overflow-hidden shadow-sh-3 border border-brass/60"
          >
            <CoverImage
              photoUrl={photoUrl}
              name={name}
              isDistinguished={true}
              specialty={specialty}
              city={city}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Caption bottom */}
          <div className="mt-4 text-center">
            <p className="text-sm font-sans text-bg/90 tracking-wide">
              {name} — Distinguished Dentist Cover
            </p>
            <p className="text-[12px] text-bg/50 mt-0.5">
              Press ESC or swipe down to close
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
