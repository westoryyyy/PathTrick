'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Code2, FileCheck2, FlaskConical } from 'lucide-react';
import type { House } from '@/mocks/mockAICourses';
import useEvaluationStore from '@/store/useEvaluationStore';
import styles from './HouseModal.module.css';

type TabId = 'materi' | 'lab' | 'quiz' | 'project';

type Props = {
  house: House;
  courseId?: string;
};

const renderInlineCode = (text: string) => {
  const parts = text.split(/(<\/?[a-zA-Z][^>\s]*>)/g);

  return parts.map((part, index) => {
    if (/^<\/?[a-zA-Z][^>\s]*>$/.test(part)) {
      return (
        <code className={styles.codeTag} key={`${part}-${index}`}>
          {part}
        </code>
      );
    }

    return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
  });
};

const buildPreviewDoc = (code: string) => {
  const hasHtmlTag = /<html[\s>]/i.test(code);
  const hasBodyTag = /<body[\s>]/i.test(code);

  if (hasHtmlTag || hasBodyTag) return code;

  return `<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        font-family: system-ui, sans-serif;
        line-height: 1.6;
        padding: 24px;
        color: #1f2937;
      }
    </style>
  </head>
  <body>${code}</body>
</html>`;
};

export default function HouseModal({ house, courseId = house.id }: Props) {
  const evalStore = useEvaluationStore();
  const record = evalStore.records[courseId];
  const [activeTab, setActiveTab] = useState<TabId>('materi');
  const [code, setCode] = useState(house.lab?.initialCode ?? '');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [projectCode, setProjectCode] = useState('');
  const [uploadName, setUploadName] = useState<string | undefined>();
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);

  useEffect(() => {
    evalStore.initRecord(courseId);
  }, [courseId, evalStore]);

  const previewDoc = useMemo(() => buildPreviewDoc(code), [code]);
  const questions = useMemo(() => house.quiz ?? [], [house.quiz]);
  const quizScore = useMemo(() => {
    if (questions.length === 0) return 0;

    const correct = questions.filter((question) => answers[question.id] === question.correctIndex).length;
    return Math.round((correct / questions.length) * 100);
  }, [answers, questions]);

  const handleSubmitQuiz = async () => {
    setIsSubmittingQuiz(true);
    try {
      await evalStore.submitQuiz(courseId, quizScore);
      setQuizSubmitted(true);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleFile = (file: File | null) => {
    if (!file) return;

    setUploadName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setProjectCode(String(event.target?.result ?? ''));
    };
    reader.readAsText(file);
  };

  const handleSubmitProject = async () => {
    setIsSubmittingProject(true);
    try {
      await evalStore.submitProject(courseId, { filename: uploadName, code: projectCode });
    } finally {
      setIsSubmittingProject(false);
    }
  };

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
    { id: 'materi', label: 'Materi', icon: <BookOpen size={16} aria-hidden /> },
    { id: 'lab', label: 'Live Lab', icon: <FlaskConical size={16} aria-hidden /> },
    { id: 'quiz', label: 'Quiz', icon: <CheckCircle2 size={16} aria-hidden /> },
    { id: 'project', label: 'Project', icon: <FileCheck2 size={16} aria-hidden /> },
  ];

  return (
    <section className={styles.shell} aria-label={house.title}>
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Web Development Track</p>
          <h1 className={styles.title}>{house.title}</h1>
          <p className={styles.description}>{house.shortDescription}</p>
        </div>
        <div className={styles.progress} aria-live="polite">
          <span className={styles.progressLabel}>Progress</span>
          <span className={styles.progressValue}>{record?.userCourseProgress ?? 'not_started'}</span>
        </div>
      </header>

      <nav className={styles.tabs} aria-label="House learning sections">
        {tabs.map((tab) => (
          <button
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.tabButtonActive : ''}`}
            key={tab.id}
            onClick={() => {
              if (tab.id === 'lab') evalStore.startMaterial(courseId);
              setActiveTab(tab.id);
            }}
            type="button"
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      <div className={styles.body}>
        {activeTab === 'materi' && (
          <>
            <div className={styles.materialGrid}>
              {(house.materialBlocks ?? []).map((block) => (
                <article className={styles.materialCard} key={block.id}>
                  <span className={styles.materialLabel}>{block.label}</span>
                  <h2 className={styles.sectionTitle}>{block.title}</h2>
                  <p className={styles.bodyText}>{renderInlineCode(block.body)}</p>
                  {block.points && (
                    <ul className={styles.pointList}>
                      {block.points.map((point) => (
                        <li key={point}>{renderInlineCode(point)}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
            <div className={styles.actions}>
              <button className={styles.primaryButton} onClick={() => { evalStore.startMaterial(courseId); setActiveTab('lab'); }} type="button">
                Mulai Live Lab
              </button>
              <button className={styles.secondaryButton} onClick={() => setActiveTab('quiz')} type="button">
                Coba Quiz
              </button>
            </div>
          </>
        )}

        {activeTab === 'lab' && (
          <div className={styles.labGrid}>
            <section className={styles.editorPanel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>{house.lab?.title}</h2>
                <Code2 size={20} aria-hidden />
              </div>
              <p className={styles.taskText}>{house.lab?.description}</p>
              <p className={styles.taskText}>{renderInlineCode(house.lab?.task ?? '')}</p>
              <textarea
                aria-label="HTML live lab editor"
                className={styles.textarea}
                onChange={(event) => setCode(event.target.value)}
                spellCheck={false}
                value={code}
              />
            </section>
            <section className={styles.previewPanel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Preview</h2>
              </div>
              <iframe className={styles.previewFrame} sandbox="" srcDoc={previewDoc} title="Live HTML preview" />
            </section>
          </div>
        )}

        {activeTab === 'quiz' && (
          <section className={styles.quizStack}>
            {questions.map((question, questionIndex) => (
              <article className={styles.quizCard} key={question.id}>
                <p className={styles.question}>
                  {questionIndex + 1}. {renderInlineCode(question.question)}
                </p>
                {question.choices.map((choice, choiceIndex) => (
                  <label
                    className={`${styles.choice} ${answers[question.id] === choiceIndex ? styles.choiceSelected : ''}`}
                    key={choice}
                  >
                    <input
                      checked={answers[question.id] === choiceIndex}
                      name={question.id}
                      onChange={() => setAnswers((current) => ({ ...current, [question.id]: choiceIndex }))}
                      type="radio"
                    />
                    <span>{renderInlineCode(choice)}</span>
                  </label>
                ))}
              </article>
            ))}
            <div className={styles.actions}>
              <button className={styles.primaryButton} disabled={isSubmittingQuiz} onClick={handleSubmitQuiz} type="button">
                {isSubmittingQuiz ? 'Mengirim...' : 'Submit Quiz'}
              </button>
              {quizSubmitted && <p className={styles.feedbackText}>Skor quiz: {quizScore}. {record?.lastFeedback}</p>}
            </div>
          </section>
        )}

        {activeTab === 'project' && (
          <section className={styles.projectPanel}>
            <h2 className={styles.sectionTitle}>{house.miniProject?.title}</h2>
            <p className={styles.promptText}>{house.miniProject?.prompt}</p>
            <ul className={styles.rubricList}>
              {(house.miniProject?.aiRubric ?? []).map((rule) => (
                <li key={rule}>{renderInlineCode(rule)}</li>
              ))}
            </ul>
            <input
              accept=".html,text/html"
              className={styles.fileInput}
              onChange={(event) => handleFile(event.target.files ? event.target.files[0] : null)}
              type="file"
            />
            <textarea
              aria-label="Mini project HTML submission"
              className={`${styles.textarea} ${styles.projectTextarea}`}
              onChange={(event) => setProjectCode(event.target.value)}
              placeholder={'<h1>Nama Saya</h1>\n<p>Deskripsi diri...</p>\n<ul>\n  <li>Skill 1</li>\n  <li>Skill 2</li>\n  <li>Skill 3</li>\n</ul>'}
              spellCheck={false}
              value={projectCode}
            />
            <div className={styles.actions}>
              <button className={styles.primaryButton} disabled={isSubmittingProject} onClick={handleSubmitProject} type="button">
                {isSubmittingProject ? 'Menilai...' : 'Submit Project'}
              </button>
              {record?.projectStatus === 'failed' && (
                <button
                  className={styles.secondaryButton}
                  onClick={() => evalStore.resubmitProject(courseId, { filename: uploadName, code: projectCode })}
                  type="button"
                >
                  Resubmit
                </button>
              )}
            </div>
            <div className={styles.statusGrid}>
              <div className={styles.statusBox}>
                <span className={styles.statusLabel}>Project</span>
                <span className={styles.statusValue}>{record?.projectStatus ?? 'not_submitted'}</span>
              </div>
              <div className={styles.statusBox}>
                <span className={styles.statusLabel}>Feedback</span>
                <span className={styles.statusValue}>{record?.lastFeedback ?? '-'}</span>
              </div>
              <div className={styles.statusBox}>
                <span className={styles.statusLabel}>On-chain</span>
                <span className={styles.statusValue}>{record?.onChainStatus ?? 'not_started'}</span>
              </div>
              <div className={styles.statusBox}>
                <span className={styles.statusLabel}>XP</span>
                <span className={styles.statusValue}>{record?.xpEarned ?? 0}</span>
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  );
}
