'use client';

interface AssessmentShellProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  stepDescription?: string;
  /** Index of the first optional step (renders "Opsional" badge) */
  optionalFrom?: number;
  canNext: boolean;
  nextLabel?: string;
  onNext: () => void;
  onBack: () => void;
  showBack?: boolean;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

const STEP_LABELS_SMA      = ['RIASEC', 'Budget', 'Preferensi'];
const STEP_LABELS_MAHASISWA = ['Upload CV', 'Minat Kerja'];

export default function AssessmentShell({
  currentStep,
  totalSteps,
  stepTitle,
  stepDescription,
  optionalFrom,
  canNext,
  nextLabel,
  onNext,
  onBack,
  showBack = true,
  isSubmitting = false,
  children,
}: AssessmentShellProps) {
  const stepLabels = totalSteps === 3 ? STEP_LABELS_SMA : STEP_LABELS_MAHASISWA;
  const isLast = currentStep === totalSteps - 1;
  const finalLabel = nextLabel ?? (isLast ? '🚀 Mulai Petualangan' : 'Lanjut →');
  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="relative z-10 w-full max-w-3xl flex flex-col gap-7 bg-[#8c5d41] border-6 border-[#3b261b] rounded-lg shadow-lg p-6 animate-shellIn"
         style={{
           boxShadow: 'inset 0 0 0 4px #a37255, inset 0 0 0 8px #704730, 0 24px 48px rgba(0, 0, 0, 0.7)'
         }}>
      
      {/* Metal corners simulation */}
      <div className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-slate-400 border-[3px] border-slate-900 rounded" 
           style={{boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(255,255,255,0.4)'}} />
      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-slate-400 border-[3px] border-slate-900 rounded"
           style={{boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(255,255,255,0.4)'}} />

      {/* ── Progress Bar ── */}
      <div className="flex flex-col gap-3.5">
        <div className="w-full h-3 bg-[#3b261b] border-2 border-[#2a1b13] rounded-full overflow-hidden shadow-md"
             style={{boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'}}>
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-500 border-r-2 border-green-900 transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), inset 0 -2px 0 rgba(0,0,0,0.2)'
            }}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-between gap-2">
          {stepLabels.map((label, i) => {
            const isOptional = optionalFrom !== undefined && i >= optionalFrom;
            const isActive = i <= currentStep;
            const isCurrent = i === currentStep;
            
            return (
              <div
                key={i}
                className={`flex items-center gap-2 flex-1 transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-35'
                }`}
              >
                <div className={`w-7 h-7 flex items-center justify-center rounded border-[1.5px] flex-shrink-0 font-pixel text-xs transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-gradient-to-br from-violet-800 to-violet-600 border-violet-500 text-white shadow-md'
                    : isActive
                    ? 'bg-opacity-20 bg-violet-500 border-opacity-60 border-violet-400 text-opacity-100 text-violet-300 shadow-md'
                    : 'bg-opacity-4 bg-white border-opacity-20 border-violet-400 text-opacity-50 text-violet-200'
                }` }
                  style={isCurrent ? {boxShadow: '0 0 20px rgba(168,85,247,0.5)'} : isActive ? {boxShadow: '0 0 12px rgba(168,85,247,0.3)'} : {}}>
                  {i < currentStep ? '✓' : i + 1}
                </div>
                <span className={`font-pixel text-xs tracking-wider transition-colors duration-300 flex items-center gap-1.5 ${
                  isActive ? 'text-opacity-80 text-purple-50' : 'text-opacity-50 text-purple-50'
                }`}>
                  {label}
                  {isOptional && (
                    <span className="text-[0.4rem] px-1 py-0.5 bg-amber-900 bg-opacity-15 border border-amber-600 border-opacity-30 text-amber-500 tracking-wider">
                      Opsional
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step Header ── */}
      <div className="w-[calc(100%+3rem)] -ml-6 px-6 py-4 bg-[#684530] border-t-4 border-b-4 border-[#3b261b] text-center flex flex-col gap-2.5">
        <h1 className="font-pixel text-[1.3rem] md:text-2xl text-white m-0 tracking-wider" style={{textShadow: '2px 2px 0 #3b261b'}}>
          {stepTitle}
        </h1>
        {stepDescription && (
          <p className="font-pixel text-[0.55rem] md:text-xs text-amber-300 m-0 leading-relaxed max-w-2xl mx-auto uppercase" style={{textShadow: '1px 1px 0 rgba(0,0,0,0.5)'}}>
            {stepDescription}
          </p>
        )}
      </div>

      {/* ── Step Content ── */}
      <div className="min-h-80 animate-contentFade">
        {children}
      </div>

      {/* ── Navigation Buttons ── */}
      <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-opacity-50 border-amber-900">
        {showBack && currentStep > 0 ? (
          <button
            className="font-pixel text-sm text-white bg-slate-500 border-3 border-slate-900 rounded px-5 py-3 cursor-pointer transition-all duration-200 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed hover:not-disabled:bg-slate-600 hover:not-disabled:translate-y-0.5"
            onClick={onBack}
            disabled={isSubmitting}
            type="button"
            style={{textShadow: '1px 1px 0 #0f172a', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.2), 0 4px 0 #0f172a'}}
          >
            ← Kembali
          </button>
        ) : (
          <div />
        )}

        <button
          className={`font-pixel px-7 py-3.5 rounded border-3 flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            canNext && !isSubmitting
              ? 'bg-amber-500 border-amber-900 text-white hover:bg-amber-400 active:translate-y-1'
              : 'bg-slate-500 border-slate-900 text-white opacity-50'
          }`}
          onClick={onNext}
          disabled={!canNext || isSubmitting}
          type="button"
          style={canNext && !isSubmitting ? {
            textShadow: '2px 2px 0 #78350f',
            boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.3), 0 6px 0 #78350f'
          } : {
            textShadow: '2px 2px 0 #0f172a',
            boxShadow: 'inset 0 4px 0 rgba(255,255,255,0.2), 0 6px 0 #0f172a'
          }}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Memproses...
            </>
          ) : (
            finalLabel
          )}
        </button>
      </div>
    </div>
  );
}
