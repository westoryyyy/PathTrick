#!/bin/bash
set -e

# 1
git checkout 16b3905 -b feat/1-ui-overhaul
git push -u origin feat/1-ui-overhaul
gh pr create --base main --title "feat: overhaul UI with RPG pixel theme across login, assessment, and dashboard" --body "Part 1 of feature updates."

# 2
git checkout d529df5 -b feat/2-house-ui
git push -u origin feat/2-house-ui
gh pr create --base feat/1-ui-overhaul --title "feat(ui): redesign house detail page, add hover info to learning progress cards, and update hub typography" --body "Part 2 of feature updates."

# 3
git checkout 1f02167 -b feat/3-mission-detail
git push -u origin feat/3-mission-detail
gh pr create --base feat/2-house-ui --title "feat(mission): update mission detail page layout, styling, and logic" --body "Part 3 of feature updates."

# 4
git checkout f6aea90 -b feat/4-mantra-loading
git push -u origin feat/4-mantra-loading
gh pr create --base feat/3-mission-detail --title "feat(ui): improve Daily Mantra and Game Loading Screen visuals" --body "Part 4 of feature updates."

# 5
git checkout 895c316 -b feat/5-mahasiswa-views
git push -u origin feat/5-mahasiswa-views
gh pr create --base feat/4-mantra-loading --title "feat(mahasiswa): enhance learning progress, career hub, and dashboard views" --body "Part 5 of feature updates."

# 6
git checkout 06b684e -b feat/6-map-logic
git push -u origin feat/6-map-logic
gh pr create --base feat/5-mahasiswa-views --title "feat(map): update world map scene and store logic" --body "Part 6 of feature updates."

# 7
git checkout 96db24f -b feat/7-dev-panel
git push -u origin feat/7-dev-panel
gh pr create --base feat/6-map-logic --title "chore: update dev panel, global styles, layout, and mock data" --body "Part 7 of feature updates."

git checkout feature
echo "Done!"
