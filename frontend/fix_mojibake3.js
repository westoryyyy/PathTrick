const fs = require('fs');

const paths = [
  'a:\\KULIAH\\HACKATHON\\NEW HACKATHON CODE\\PathTrick\\frontend\\src\\app\\(dashboard)\\sma\\learning-progress\\[missionId]\\page.tsx'
];

const replacements = {
  'ðŸ °': '🏰',
  'âš”ï¸ ': '⚔️',
  'âš ï¸ ': '⚠️',
  'â† ': '←',
  'â˜ ï¸ ': '☠️',
  'âœ“': '✓',
  'ðŸ”’': '🔒',
  'â”€â”€': '──'
};

for (const p of paths) {
  let content = fs.readFileSync(p, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.split(key).join(value);
  }
  fs.writeFileSync(p, content, 'utf8');
}
console.log('Done fixing remaining mojibake.');
