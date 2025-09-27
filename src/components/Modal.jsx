import { createPortal } from 'react-dom';
import { forwardRef, useImperativeHandle, useState } from 'react';

const Modal = forwardRef(function Modal({ children }, ref) {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open() {
      setIsOpen(true);
    },
    close() {
      setIsOpen(false);
    },
  }));

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full relative">
        {children}
        <div className="mt-4 text-right">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium bg-stone-800 text-white rounded hover:bg-stone-950"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
});

export default Modal;
