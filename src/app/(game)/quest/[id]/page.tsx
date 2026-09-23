'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMapStore } from '@/store/useMapStore';
import { fetchAIQuestContentMock, AIQuestContent } from '@/store/mockAIBackend';
import CodePlayground from '@/components/ui/CodePlayground';
import GameLoadingScreen from '@/components/ui/GameLoadingScreen';
import styles from './QuestPage.module.css';

export default function QuestPage() {
  const router = useRouter();
  const params = useParams();
  const questId = params.id as string;
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('module');
  const chapterId = searchParams.get('chapter');

  const completeQuest = useMapStore(state => state.completeQuest);
  const completeDynamicNode = useMapStore(state => state.completeDynamicNode);

  const [content, setContent] = useState<AIQuestContent | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (!questId) return;
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContent(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowQuiz(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentQuestionIndex(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedOption(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsCorrect(null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSubmitting(false);
    
    fetchAIQuestContentMock(questId).then(data => setContent(data));
  }, [questId]);

  if (!content) {
    return <GameLoadingScreen statusText="Memuat Modul AI..." />;
  }

  const currentQuestion = content.questions[currentQuestionIndex];

  const handleOptionClick = (index: number) => {
    if (isCorrect) return;

    setSelectedOption(index);
    if (index === currentQuestion.correctAnswerIndex) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleContinue = async () => {
    if (isSubmitting) return;

    if (currentQuestionIndex < content.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setIsSubmitting(true);
      
      // Return to map so the user can manually move the character to the next unlocked node
      if (moduleId && chapterId) {
        completeDynamicNode(questId);
        router.push(`/map?module=${moduleId}&chapter=${chapterId}`);
      } else {
        await completeQuest(questId);
        router.push('/map');
      }
    }
  };

  return (
    <div className={styles.container}>
      {!showQuiz ? (
        <div className={styles.materiContainer}>
          <h1 className={styles.title}>{content.title}</h1>
          <div 
            className={styles.materiContent}
            dangerouslySetInnerHTML={{ __html: content.materi }}
          />

          {content.playgroundCode && content.playgroundLang && (
            <CodePlayground 
              initialCode={content.playgroundCode} 
              language={content.playgroundLang} 
            />
          )}

          <button 
            className={styles.startQuizBtn} 
            onClick={() => setShowQuiz(true)}
          >
            LANJUT KE LATIHAN SOAL
          </button>
        </div>
      ) : (
        <div className={styles.quizContainer}>
          <div className={styles.questionCard}>
            <p className={styles.questionText}>
              <span style={{ color: '#3b82f6', marginRight: '8px' }}>
                Q{currentQuestionIndex + 1}/{content.questions.length}.
              </span>
              {currentQuestion.question}
            </p>
            
            <div className={styles.optionsGrid}>
              {currentQuestion.options.map((opt, index) => {
                let btnClass = styles.optionBtn;
                if (selectedOption === index) {
                  btnClass += ` ${styles.selected}`;
                  if (isCorrect === true) btnClass += ` ${styles.correct}`;
                  if (isCorrect === false) btnClass += ` ${styles.wrong}`;
                }

                return (
                  <button
                    key={index}
                    className={btnClass}
                    onClick={() => handleOptionClick(index)}
                    disabled={isCorrect === true}
                  >
                    <span className={styles.optionIndex}>{String.fromCharCode(65 + index)}</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback Banner */}
            {selectedOption !== null && (
              <div className={`${styles.feedbackBanner} ${isCorrect ? styles.success : styles.error}`}>
                <div className={styles.feedbackTitle}>
                  {isCorrect ? 'Tepat Sekali! 🎉' : 'Kurang Tepat 😅'}
                </div>
                <div className={styles.feedbackText}>
                  {isCorrect 
                    ? currentQuestion.explanation 
                    : 'Jawabanmu masih kurang tepat. Coba lagi atau ingat-ingat materinya!'}
                </div>
                
                {isCorrect && (
                  <button 
                    className={styles.continueBtn} 
                    onClick={handleContinue}
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? 'Menyiapkan...' 
                      : (currentQuestionIndex < content.questions.length - 1 
                          ? 'SOAL SELANJUTNYA ➜' 
                          : 'LANJUT MATERI BERIKUTNYA')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
