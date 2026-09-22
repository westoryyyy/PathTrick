import re

mock_data_path = "src/data/mockBackendData.ts"
with open(mock_data_path, "r") as f:
    content = f.read()

# Find all chapter ids: { id: 'module-education-1-bab-1', name: '...' }
chapter_ids = re.findall(r"id:\s*'([^']+bab-[^']+)'", content)

mission_content_path = "src/data/missionContent.tsx"
with open(mission_content_path, "r") as f:
    existing_content = f.read()

new_entries = []
for cid in chapter_ids:
    level_id = f"{cid}-level-1"
    if level_id not in existing_content:
        # Create a generic placeholder
        entry = f"""
  '{level_id}': {{
    materials: [
      <div key="1" style={{{{ display: 'flex', flexDirection: 'column', gap: '16px' }}}}>
        <p style={{{{ display: 'flex', alignItems: 'center', gap: '8px' }}}}>
          <span style={{{{ color: '#059669' }}}}>▶</span> <strong>Pengantar {cid.replace('-', ' ').title()}</strong>
        </p>
        <p style={{{{ fontSize: '0.9rem', color: '#57534e', lineHeight: '1.6' }}}}>
          Ini adalah materi awal untuk modul ini. Kami sedang mengembangkan kurikulum lengkap yang akan membantumu memahami konsep-konsep dasar dengan cara yang menyenangkan dan interaktif.
        </p>
      </div>
    ],
    quiz: [
      {{
        question: "Apakah kamu siap untuk mulai belajar?",
        options: [
          {{ text: "Tentu saja, aku siap!", isCorrect: true, feedback: "Semangat yang luar biasa!" }},
          {{ text: "Mungkin nanti", isCorrect: false, feedback: "Ayo, jangan tunda belajarmu!" }}
        ]
      }}
    ]
  }},"""
        new_entries.append(entry)

if new_entries:
    # Insert just before the last closing brace
    last_brace_idx = existing_content.rfind('};')
    if last_brace_idx != -1:
        updated_content = existing_content[:last_brace_idx] + "\n".join(new_entries) + "\n" + existing_content[last_brace_idx:]
        with open(mission_content_path, "w") as f:
            f.write(updated_content)
        print(f"Added {len(new_entries)} new mission content entries.")
    else:
        print("Could not find the closing brace.")
else:
    print("No new entries to add.")
