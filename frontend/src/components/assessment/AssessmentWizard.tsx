'use client';

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useOnboardingStore } from '@/store/useOnboardingStore';
import AssessmentShell from './AssessmentShell';
import RIASECStep from './dreamer/RIASECStep';
import BudgetStep from './dreamer/BudgetStep';
import PreferencesStep from './dreamer/PreferencesStep';
import CVUploadStep from './chaser/CVUploadStep';
import WorkInterestStep from './chaser/WorkInterestStep';
import { useRouter } from 'next/navigation';

import { useTranslation } from '@/hooks/useTranslation';

export default function AssessmentWizard() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const role = useOnboardingStore((s) => s.selectedRole);
  const currentStep = useOnboardingStore((s) => s.currentStep);
  const totalSteps = useOnboardingStore((s) => s.totalSteps);
  const nextStep = useOnboardingStore((s) => s.nextStep);
  const prevStep = useOnboardingStore((s) => s.prevStep);
  const isSubmitting = useOnboardingStore((s) => s.isSubmitting);
  const submitAssessment = useOnboardingStore((s) => s.submitAssessment);

  // Form State
  const riasecAnswers = useOnboardingStore((s) => s.dreamerAssessment.riasecAnswers);
  const riasecTotalQuestions = useOnboardingStore((s) => s.dreamerAssessment.riasecTotalQuestions);
  const budget = useOnboardingStore((s) => s.dreamerAssessment.budgetPreference);
  const cvStatus = useOnboardingStore((s) => s.chaserAssessment.cvExtractionStatus);
  const preferredGICS = useOnboardingStore((s) => s.chaserAssessment.preferredGICS);

  if (!role) return null;

  const DREAMER_STEPS = [
    { title: locale === 'id' ? 'Asesmen RIASEC' : 'RIASEC Assessment',           desc: locale === 'id' ? 'Jawab setiap pertanyaan untuk mengetahui profil minat & bakatmu (RIASEC).' : 'Answer each question to discover your interest & talent profile (RIASEC).' },
    { title: locale === 'id' ? 'Preferensi Budget' : 'Budget Preference',         desc: locale === 'id' ? 'Pilih rentang biaya kuliah yang sesuai dengan rencana keluargamu.' : 'Select the tuition fee range that fits your family plan.' },
    { title: locale === 'id' ? 'Preferensi Jurusan & Negara' : 'Major & Country Preference', desc: locale === 'id' ? 'Tambahkan preferensi jurusan dan negara tujuan (opsional).' : 'Add your preferred major and study destination (optional).' },
  ];

  const CHASER_STEPS = [
    { title: locale === 'id' ? 'Upload CV' : 'Upload CV',              desc: locale === 'id' ? 'Upload CV-mu dan biarkan AI menganalisis skill & pengalamanmu.' : 'Upload your CV and let AI analyze your skills & experience.' },
    { title: locale === 'id' ? 'Minat Kerja' : 'Work Interest',            desc: locale === 'id' ? 'Konfirmasi skill-mu dan pilih industri yang kamu minati.' : 'Confirm your skills and select your industry of interest.' },
  ];

  const steps = role === 'dreamer' ? DREAMER_STEPS : CHASER_STEPS;
  const step = steps[currentStep];
  const isLast = currentStep === totalSteps - 1;

  // Next Button Logic
  let canNext = false;
  if (role === 'dreamer') {
    switch (currentStep) {
      case 0: {
        const answers = riasecAnswers ?? {};
        const expectedCount = riasecTotalQuestions > 0 ? riasecTotalQuestions : 42;
        const answeredCount = Object.keys(answers).filter(k => /^q\d{2}$/.test(k)).length;
        canNext = answeredCount >= expectedCount;
        break;
      }
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
      if (!useOnboardingStore.getState().onboardingCompleted) {
        alert(locale === 'id' ? 'Gagal menyimpan asesmen ke server. Periksa koneksi lalu coba lagi.' : 'Failed to save assessment to server. Check your connection and try again.');
        return;
      }
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
      nextLabel={isLast ? (locale === 'id' ? 'Mulai Petualangan' : 'Start Adventure') : undefined}
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
