const fs = require('fs');
const files = [
  'src/components/assessment/sma/BudgetStep.module.css',
  'src/components/assessment/sma/RIASECStep.module.css',
  'src/components/assessment/sma/PreferencesStep.module.css',
  'src/components/assessment/AssessmentShell.module.css',
  'src/components/assessment/mahasiswa/CVUploadStep.module.css',
  'src/components/assessment/mahasiswa/CVUploadStep.tsx',
  'src/components/assessment/mahasiswa/WorkInterestStep.module.css',
  'src/components/assessment/mahasiswa/WorkInterestStep.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/font-family:\s*'Press Start 2P', monospace;/g, 'font-family: var(--font-pixel), monospace;');
  content = content.replace(/fontFamily:\s*'"Press Start 2P"'/g, 'fontFamily: "var(--font-pixel)"');
  content = content.replace(/font-family:\s*"Press Start 2P", monospace;/g, 'font-family: var(--font-pixel), monospace;');
  fs.writeFileSync(file, content);
}
console.log('Fonts fixed!');
