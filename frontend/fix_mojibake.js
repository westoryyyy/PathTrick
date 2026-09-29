const fs = require('fs');
const path = 'a:\\KULIAH\\HACKATHON\\NEW HACKATHON CODE\\PathTrick\\frontend\\src\\app\\(dashboard)\\sma\\learning-progress\\[missionId]\\page.tsx';
let content = fs.readFileSync(path, 'utf8');

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
  'Â«': '«'
};

for (const [key, value] of Object.entries(replacements)) {
  content = content.split(key).join(value);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Done replacing mojibake.');
