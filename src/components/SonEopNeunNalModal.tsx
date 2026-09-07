import React from 'react';
import { SonEopNeunNalCalendar } from './SonEopNeunNalCalendar';
import { X } from 'lucide-react';

interface SonEopNeunNalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SonEopNeunNalModal: React.FC<SonEopNeunNalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        <SonEopNeunNalCalendar id="modal-son-eop-neun-nal-calendar" />
      </div>
    </div>
  );
};
