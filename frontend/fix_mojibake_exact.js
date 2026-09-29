const fs = require('fs');
const path = 'a:\\KULIAH\\HACKATHON\\NEW HACKATHON CODE\\PathTrick\\frontend\\src\\app\\(dashboard)\\sma\\learning-progress\\[missionId]\\page.tsx';
let lines = fs.readFileSync(path, 'utf8').split('\n');

lines = lines.map((line, idx) => {
  const i = idx + 1;
  if (i === 192) return '      ? `🏰 Ksatria! Penjaga Relic bab ini telah menantimu. Sebelum pertempuran final dimulai, pastikan kamu telah memahami semua konsep ${currentChapter.name} yang telah dipelajari di level-level sebelumnya.`';
  if (i === 199) return "            <span style={{ color: isBoss ? '#ef4444' : '#059669', fontSize: '1.2rem', flexShrink: 0 }}>{isBoss ? '⚔️' : '📖'}</span>";
  if (i === 214) return "              {isBoss ? <li><strong style={{ color: '#ef4444' }}>⚠️ Ujian final: Buktikan bahwa kamu telah menguasai seluruh materi bab ini!</strong></li> : <li>Menjawab simulasi skenario dunia nyata dalam Gauntlet Kuis.</li>}";
  if (i === 226) return "              {isBoss ? '⚠️ BRIEFING TERAKHIR' : '📜 TEORI DASAR'}";
  if (i === 306) return "              {isBoss ? `⚔️ BOSS FIGHT: Penjaga ${currentChapter.name}` : `🛠️ Tantangan Praktik — ${currentChapter.name} Lvl.${levelNum}`}";
  if (i === 404) return "                  ← SEBELUMNYA";
  if (i === 562) return "                            showDialog('error', `☠️ GAME OVER ☠️\\nNyawamu telah habis!\\nSilakan pelajari ulang materi ini untuk memulihkan nyawamu dan mencoba lagi!`, () => {";
  if (i === 614) return "                {isSubmitting ? 'AI SEDANG MENILAI...' : (content.project.type === 'essay' ? 'KUMPULKAN ESAI' : '⚔️ SERANG BOSS (SUBMIT)')}";
  if (i === 766) return "            ← KEMBALI KE PETA";
  return line;
});

fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('Done replacing lines!');
