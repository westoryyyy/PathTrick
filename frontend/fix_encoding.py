import os

paths = [
    r"a:\KULIAH\HACKATHON\NEW HACKATHON CODE\PathTrick\frontend\src\app\(dashboard)\sma\learning-progress\[missionId]\page.tsx",
    r"a:\KULIAH\HACKATHON\NEW HACKATHON CODE\PathTrick\frontend\src\app\(dashboard)\mahasiswa\learning-mission\mission\[missionId]\page.tsx"
]

replacements = {
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
}

for path in paths:
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for k, v in replacements.items():
        content = content.replace(k, v)
        
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done python script")
