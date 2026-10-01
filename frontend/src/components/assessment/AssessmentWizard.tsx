'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import AssessmentShell from './AssessmentShell';
import RIASECStep, { isRIASECComplete } from './dreamer/RIASECStep';
import BudgetStep from './dreamer/BudgetStep';
import PreferencesStep from './dreamer/PreferencesStep';
import CVUploadStep from './chaser/CVUploadStep';
import WorkInterestStep from './chaser/WorkInterestStep';
import { useRouter } from 'next/navigation';

const DREAMER_STEPS = [
  { title: 'Asesmen RIASEC',           desc: 'Kenali minat dan bakatmu lewat 6 dimensi kepribadian RIASEC.' },
  { title: 'Preferensi Budget',         desc: 'Pilih rentang biaya kuliah yang sesuai dengan rencana keluargamu.' },
  { title: 'Preferensi Jurusan & Negara', desc: 'Tambahkan preferensi jurusan dan negara tujuan (opsional).' },
];

const CHASER_STEPS = [
  { title: 'Upload CV',              desc: 'Upload CV-mu dan biarkan AI menganalisis skill & pengalamanmu.' },
  { title: 'Minat Kerja',            desc: 'Konfirmasi skill-mu dan pilih industri yang kamu minati.' },
];

export default function AssessmentWizard() {
  const router = useRouter();
  const role = useOnboardingStore((s) => s.selectedRole);
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const totalSteps = useOnboardingStore((s) => s.totalSteps);
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const prevStep = useOnboardingStore((s) => s.prevStep);
  const isSubmitting = useOnboardingStore((s) => s.isSubmitting);
  const submitAssessment = useOnboardingStore((s) => s.submitAssessment);

  // Form State
  const riasec = useOnboardingStore((s) => s.dreamerAssessment.riasec);
  const budget = useOnboardingStore((s) => s.dreamerAssessment.budgetPreference);
  const cvStatus = useOnboardingStore((s) => s.chaserAssessment.cvExtractionStatus);
  const preferredGICS = useOnboardingStore((s) => s.chaserAssessment.preferredGICS);

  if (!role) return null;

  const steps = role === 'dreamer' ? DREAMER_STEPS : CHASER_STEPS;
  const step = steps[currentStep];
  const isLast = currentStep === totalSteps - 1;

  // Next Button Logic
  let canNext = false;
  if (role === 'dreamer') {
    switch (currentStep) {
      case 0: canNext = isRIASECComplete(riasec); break;
      case 1: canNext = budget !== ''; break;
      case 2: canNext = true; break;
    }
  } else {
    switch (currentStep) {
      case 0: canNext = cvStatus === 'done'; break;
      case 1: canNext = preferredGICS.length > 0; break;
    }
  }

  const handleNext = async () => {
    if (!canNext) return;
    if (isLast) {
      await submitAssessment();
      if (role === 'dreamer') {
        router.push('/dreamer/dashboard');
      } else {
        router.push('/chaser/dashboard');
      }
    } else {
      nextStep();
    }
  };

  const renderStepContent = () => {
    if (role === 'dreamer') {
      switch (currentStep) {
        case 0: return <RIASECStep />;
        case 1: return <BudgetStep />;
        case 2: return <PreferencesStep />;
      }
    } else {
      switch (currentStep) {
        case 0: return <CVUploadStep />;
        case 1: return <WorkInterestStep />;
      }
    }
    return null;
  };

  // Framer Motion Variants
  const variants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  return (
    <AssessmentShell
      currentStep={currentStep}
      totalSteps={totalSteps}
      stepTitle={step.title}
      stepDescription={step.desc}
      optionalFrom={role === 'dreamer' ? 2 : undefined}
      canNext={canNext}
      nextLabel={isLast ? 'Mulai Petualangan' : undefined}
      onNext={handleNext}
      onBack={prevStep}
      isSubmitting={isSubmitting}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ width: '100%', height: '100%' }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
    </AssessmentShell>
  );
}
