import React from 'react';
import { REFUND_POLICY, REFUND_POLICY_UPDATED } from '../data/refundPolicy';

/** 취소·환불 규정 본문 */
export const RefundPolicyList: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <div className={compact ? 'space-y-2.5 text-[11px]' : 'space-y-4 text-xs sm:text-sm'}>
    {REFUND_POLICY.map((sec) => (
      <div key={sec.title}>
        <p className="font-extrabold text-[#0A1D37]">{sec.title}</p>
        <ul className="mt-1 space-y-0.5 text-slate-600 leading-relaxed">
          {sec.lines.map((l) => (
            <li key={l}>{l.startsWith('※') ? l : `• ${l}`}</li>
          ))}
        </ul>
      </div>
    ))}
    <p className="text-slate-400 text-[10px]">시행일: {REFUND_POLICY_UPDATED}</p>
  </div>
);
