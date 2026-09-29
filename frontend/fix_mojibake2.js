const fs = require('fs');

const paths = [
  'a:\\KULIAH\\HACKATHON\\NEW HACKATHON CODE\\PathTrick\\frontend\\src\\app\\(dashboard)\\sma\\learning-progress\\[missionId]\\page.tsx',
  'a:\\KULIAH\\HACKATHON\\NEW HACKATHON CODE\\PathTrick\\frontend\\src\\app\\(dashboard)\\mahasiswa\\learning-mission\\mission\\[missionId]\\page.tsx'
];

const replacements = {
  'ðŸ °': '🏰',
  'âš”ï¸ ': '⚔️',
  'ðŸ“–': '📖',
  'â€”': '—',
  'ðŸ“‹': '📋',
  'âš ï¸ ': '⚠️',
  'ðŸ’¡': '💡',
  'ðŸ“œ': '📜',
  'ðŸ’»': '💻',
  'ðŸš€': '🚀',
  'ðŸ“Œ': '📌',
  'â† ': '←',
  'âž”': '➔',
  'â™¥': '♥',
  'â˜ ï¸ ': '☠️',
  'Â»': '»',
  'Â«': '«',
  'ðŸ’Ž': '💎',
  'ðŸ› ': '🛠️'
};

for (const p of paths) {
  let content = fs.readFileSync(p, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }
  fs.writeFileSync(p, content, 'utf8');
}
console.log('Done replacing mojibake in both files.');
