'use client';

import { useOnboardingStore } from '@/store/useOnboardingStore';
import Image from 'next/image';

const BUDGET_OPTIONS = [
  { value: 'under5',    label: '< Rp 5 jt / semester',  icon: '/Coin.png', desc: 'Terjangkau' },
  { value: '5to15',     label: 'Rp 5 – 15 jt',          icon: '/Coin 2.png', desc: 'Menengah' },
  { value: '15to30',    label: 'Rp 15 – 30 jt',         icon: '/blue-gem.png', desc: 'Premium' },
  { value: 'above30',   label: '> Rp 30 jt',             icon: '/Gold Ticket.png', desc: 'Eksklusif' },
  { value: 'beasiswa',  label: 'Beasiswa Penuh',         icon: '/Scroll.png', desc: 'Full Scholarship' },
];

export default function BudgetStep() {
  const budget = useOnboardingStore((s) => s.smaAssessment.budgetPreference);
  const setField = useOnboardingStore((s) => s.setSMAField);

  return (
    <div className="flex flex-col gap-6 w-full max-w-[500px] mx-auto">
      <p className="font-pixel text-[0.7rem] text-[rgba(240,232,255,0.7)] text-center m-0 leading-[1.6] uppercase">
        Pilih satu rentang biaya kuliah yang sesuai dengan rencana keluargamu.
      </p>
      <div className="flex flex-col gap-4">
        {BUDGET_OPTIONS.map((opt) => {
          const isSelected = budget === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              className={`flex items-center gap-4 w-full py-4 px-5 bg-[#bc8f65] border-4 border-[#5a3a29] shadow-[inset_0_0_16px_rgba(0,0,0,0.3),4px_4px_0px_0px_rgba(0,0,0,0.5)] cursor-pointer text-left transition-transform duration-100 relative hover:bg-[#cba37b] hover:border-[#6a4734] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[inset_0_0_16px_rgba(0,0,0,0.3),2px_2px_0px_0px_rgba(0,0,0,0.5)] ${isSelected ? '!bg-[#d4a373] !border-[#f59e0b] !shadow-[inset_0_0_16px_rgba(0,0,0,0.3),0_0_0_4px_rgba(245,158,11,0.6)] translate-x-0.5 translate-y-0.5' : ''}`}
              onClick={() => setField('budgetPreference', opt.value)}
              id={`budget-${opt.value}`}
            >
              <span className="text-[2.5rem] leading-none shrink-0 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                <Image src={opt.icon} alt="" width={48} height={48} className="object-contain" />
              </span>
              <div className="flex flex-col gap-1.5 flex-1">
                <span className="font-pixel text-[0.85rem] text-white tracking-[0.05em] drop-shadow-[1px_1px_0_#3b261b]">
                  {opt.label}
                </span>
                <span className="font-pixel text-[0.55rem] text-white drop-shadow-[1px_1px_0_#3b261b]">
                  {opt.desc}
                </span>
              </div>
              {isSelected && (
                <span className="font-pixel text-[1.2rem] text-white drop-shadow-[1px_1px_0_#3b261b] shrink-0 animate-[checkPop_0.2s_steps(3)]">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
