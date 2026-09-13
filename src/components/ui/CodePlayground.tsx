'use client';
import React, { useState } from 'react';
import styles from './CodePlayground.module.css';

interface Props {
  initialCode: string;
  language: 'html' | 'python';
}

export default function CodePlayground({ initialCode, language }: Props) {
  const [code, setCode] = useState(initialCode);
  const [outputHtml, setOutputHtml] = useState(language === 'html' ? initialCode : '');
  const [terminalOutput, setTerminalOutput] = useState<string>('');

  const handleRun = () => {
    if (language === 'html') {
      setOutputHtml(code);
    } else {
      // Mock Python execution
      try {
        const lines = code.split('\n');
        let out = '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
            // Very naive print extraction
            const content = trimmed.substring(6, trimmed.length - 1);
            // Handle basic f-strings and strings for the mock
            let parsed = content.replace(/^f?["']|["']$/g, '');
            // Just a naive replace for our mock specific case
            parsed = parsed.replace('{nama}', 'Ksatria Kode');
            out += parsed + '\n';
          }
        }
        if (out === '') out = 'Process finished with exit code 0';
        setTerminalOutput(out);
      } catch {
        setTerminalOutput('SyntaxError: invalid syntax');
      }
    }
  };

  return (
    <div className={styles.playgroundContainer}>
      <div className={styles.header}>
        <div className={styles.title}>💻 Interactive Playground</div>
        <button className={styles.runBtn} onClick={handleRun}>▶ RUN CODE</button>
      </div>
      <div className={styles.splitView}>
        <div className={styles.editorPane}>
          <div className={styles.paneLabel}>main.{language === 'html' ? 'html' : 'py'}</div>
          <textarea
            className={styles.textarea}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>
        <div className={styles.outputPane}>
          <div className={styles.paneLabel}>Output</div>
          {language === 'html' ? (
            <iframe
              className={styles.outputFrame}
              srcDoc={outputHtml}
              title="output"
              sandbox="allow-scripts allow-modals allow-same-origin"
            />
          ) : (
            <div className={styles.terminalOutput}>
              {terminalOutput || '> Ready.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
