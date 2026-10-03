const fs = require('fs');
const txtContent = fs.readFileSync('d:/Hackaton/PathTrick/backend/materi_modul2.txt', 'utf8');

const lines = txtContent.split('\n');
const titleLine = lines.find(l => l.toUpperCase().startsWith('# MODUL'));
const title = titleLine ? titleLine.replace(/^#\s+/, '').trim() : "Modul Pendidikan";

const result = {
  "title": title,
  "description": "Modul untuk House of Agriculture.",
  "facultyTags": ["agr_farming"],
  "isFallback": false,
  "isPublished": true,
  "chapters": []
};

// Split by chapters
const chapterBlocks = txtContent.split(/^##\s+(?:\*\*?)?BA?B\s+\d+:?(?:\*\*?)?\s+/gim);
chapterBlocks.shift();

let chapOrder = 1;
for (let chapBody of chapterBlocks) {
  const firstLineEnd = chapBody.indexOf('\n');
  const chapTitle = chapBody.substring(0, firstLineEnd).replace(/\*\*|\*/g, '').trim();
  const restOfChap = chapBody.substring(firstLineEnd);

  const chapter = {
    title: chapTitle,
    order: chapOrder++,
    sections: []
  };

  const levelBlocks = restOfChap.split(/^###\s+(?:\*\*?)?LEVEL\s+\d+\s*(?:\(BOSS LEVEL\))?:?(?:\*\*?)?\s+/gim);
  levelBlocks.shift();

  let levelOrder = 1;
  
  for (let levelBody of levelBlocks) {
    const isBoss = levelBody.toUpperCase().includes('BOSS LEVEL') || levelOrder === 6;
    
    const fLineEnd = levelBody.indexOf('\n');
    let secTitleRaw = levelBody.substring(0, fLineEnd).replace(/\*\*|\*/g, '').trim();
    let secTitle = 'Level ' + levelOrder + ' : ' + secTitleRaw;
    if (isBoss && !secTitle.toLowerCase().includes('boss')) {
      secTitle += ' (Boss Fight)';
    }
    
    const xpReward = isBoss ? 500 : 100;
    
    // Removed 'm' flag so $ matches the true end of the levelBody
    const contentMatch = levelBody.match(/####\s+(?:\*\*?)?Materi(?:\*\*?)?\s*\r?\n(.*?)(?=\r?\n####\s+(?:\*\*?)?(Kuis|SOAL ESSAY)(?:\*\*?)?|$)/is);
    const content = contentMatch ? contentMatch[1].trim() : '';

    const kuisMatch = levelBody.match(/####\s+(?:\*\*?)?Kuis(?:\*\*?)?\s*\r?\n(.*?)(?=\r?\n####\s+(?:\*\*?)?SOAL ESSAY(?:\*\*?)?|$)/is);
    let kuisText = kuisMatch ? kuisMatch[1].trim() : '';

    const essayMatch = levelBody.match(/####\s+(?:\*\*?)?SOAL ESSAY(?:\*\*?)?\s*\r?\n(.*?)(?=$)/is);
    const essayText = essayMatch ? essayMatch[1].trim() : '';

    const questions = [];
    let qOrder = 1;

    if (kuisText) {
      if (kuisText.startsWith('- ')) {
        kuisText = kuisText.substring(2);
      } else if (kuisText.match(/^\d+\.\s+/)) {
        kuisText = kuisText.replace(/^\d+\.\s+/, '');
      }
      const qLines = kuisText.split(/\r?\n(?:-\s+|\d+\.\s+)/).map(s => s.trim()).filter(s => s);
      qLines.forEach(line => {
        // Fix for (**A. ...) format and also \n A. ... | B. ... format
        const optMatch = line.match(/(.+?)(?:\s*\r?\n\s*|\s*\()\s*((?:\*\*)?A\..+?)(?:\)$|$)/is);
        if (optMatch) {
          const prompt = optMatch[1].trim();
          const optionsPart = optMatch[2].trim();
          const splitOpts = optionsPart.match(/(?:\*\*)?[A-D]\..+?(?=(?:\s*[\|,]\s*(?:\*\*)?[A-D]\.)|$)/g) || [];
          
          let correctAns = '';
          const finalOptions = splitOpts.map(opt => {
            let isCorrect = false;
            if (opt.includes('**')) {
              isCorrect = true;
            }
            let clean = opt.replace(/\*\*/g, '').trim();
            let idMatch = clean.match(/^([A-D])\.\s*(.+)$/);
            if (idMatch) {
                let id = idMatch[1];
                let text = idMatch[2].trim();
                if (isCorrect) correctAns = id;
                return { id: id, text: text };
            }
            return { id: '', text: clean };
          });
          
          questions.push({
            type: 'MULTIPLE_CHOICE',
            prompt: prompt,
            options: finalOptions,
            correctAnswer: correctAns,
            points: isBoss ? 15 : 25,
            order: qOrder++
          });
        } else {
            console.log("NO MATCH FOR LINE:", line.substring(0, 50));
        }
      });
    }

    if (isBoss && essayText) {
      let prompt = '';
      let ansText = '';
      
      const qMatch = essayText.match(/- Pertanyaan\s*\r?\n(.*?)- Jawaban/is);
      if (qMatch) {
          prompt = qMatch[1].replace(/^\s*-\s*/gm, '').trim();
      }
      
      const aMatch = essayText.match(/- Jawaban\s*\r?\n(.*?)(?=$)/is);
      if (aMatch) {
          ansText = aMatch[1].replace(/^\s*-\s*\(Kunci Jawaban.*?\):\s*/i, '').trim();
      }
      
      // Generate keywords automatically from the answer text
      let keywords = Array.from(new Set((ansText.match(/[a-zA-Z]{6,}/g) || []).map(w => w.toLowerCase()))).slice(0, 10);
      
      questions.push({
        type: 'ESSAY',
        prompt: prompt.replace(/\*\*/g, ''),
        options: [],
        correctAnswer: {
          text: ansText.replace(/\*\*/g, ''),
          keywords: keywords
        },
        points: 40,
        order: qOrder++
      });
    }

    chapter.sections.push({
      title: secTitle,
      order: levelOrder,
      xpReward: xpReward,
      content: content,
      quiz: {
        title: 'Quiz Level ' + levelOrder,
        passingScore: 75,
        questions: questions
      }
    });
    levelOrder++;
  }

  result.chapters.push(chapter);
}

fs.writeFileSync('d:/Hackaton/PathTrick/backend/modul2_edu.json', JSON.stringify(result, null, 2));
console.log('Parser success. Chapters:', result.chapters.length);
let totalSections = 0;
let totalQuestions = 0;
result.chapters.forEach(c => {
    totalSections += c.sections.length;
    c.sections.forEach(s => {
        totalQuestions += s.quiz.questions.length;
    });
});
console.log('Total sections parsed:', totalSections);
console.log('Total questions parsed:', totalQuestions);

