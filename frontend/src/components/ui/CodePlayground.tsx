'use client';
import React, { useState } from 'react';
import styles from './CodePlayground.module.css';

interface Props {
  initialCode: string;
  language: 'html' | 'python' | 'javascript';
  onChange?: (code: string) => void;
}

export default function CodePlayground({ initialCode, language, onChange }: Props) {
  const [code, setCode] = useState(initialCode);
  const [outputHtml, setOutputHtml] = useState(
    language === 'html' ? `<script src="https://cdn.tailwindcss.com"></script>${initialCode}` : ''
  );
  const [terminalOutput, setTerminalOutput] = useState<string>('');

  const playHoverSound = () => {
    try {
      const audio = new Audio('/HoverTombol.ogg');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch(e) {}
  };

  const handleRun = () => {
    if (language === 'html') {
      setOutputHtml(`<script src="https://cdn.tailwindcss.com"></script>${code}`);
    } else if (language === 'javascript') {
      try {
        let out = '';
        const originalLog = console.log;
        console.log = (...args) => {
          out += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        };
        // Evaluate code safely-ish to capture actual output
        new Function(code)();
        console.log = originalLog;
        if (out === '') out = 'Process finished with exit code 0';
        setTerminalOutput(out);
      } catch (err: any) {
        setTerminalOutput('Error: ' + err.message);
      }
    } else {
      // Enhanced Python mock using JS translation
      try {
        let jsCode = code
          .replace(/print\s*\(/g, 'console.log(')
          .replace(/#.*/g, '//$&')
          .replace(/\bTrue\b/g, 'true')
          .replace(/\bFalse\b/g, 'false')
          .replace(/\bNone\b/g, 'null')
          .replace(/f(["'])(.*?)\1/g, (match, quote, content) => {
            return '`' + content.replace(/\{/g, '${') + '`';
          })
          .replace(/f(["']{3})(.*?)\1/g, (match, quote, content) => {
             return '`' + content.replace(/\{/g, '${') + '`';
          });
          
        let out = '';
        const originalLog = console.log;
        console.log = (...args) => {
          out += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
        };
        new Function(jsCode)();
        console.log = originalLog;
        if (out === '') out = 'Process finished with exit code 0';
        setTerminalOutput(out);
      } catch (err: any) {
        setTerminalOutput('Error: ' + err.message);
      }
    }
  };

  return (
    <div className={styles.playgroundContainer}>
      <div className={styles.header}>
        <div className={styles.title}>Interactive Playground</div>
        <button onMouseEnter={playHoverSound} className={styles.runBtn} onClick={handleRun}>▶ RUN CODE</button>
      </div>
      <div className={styles.splitView}>
        <div className={styles.editorPane}>
          <div className={styles.paneLabel}>main.{language === 'html' ? 'html' : language === 'javascript' ? 'js' : 'py'}</div>
          <textarea
            className={styles.textarea}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (onChange) onChange(e.target.value);
            }}
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
