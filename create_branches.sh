#!/bin/bash
set -e

# 1 is already pushed
# git checkout 16b3905 -b feat/1-ui-overhaul
# git push -u origin feat/1-ui-overhaul

# 2
git checkout d529df5 -b feat/2-house-ui
git push -u origin feat/2-house-ui

# 3
git checkout 1f02167 -b feat/3-mission-detail
git push -u origin feat/3-mission-detail

# 4
git checkout f6aea90 -b feat/4-mantra-loading
git push -u origin feat/4-mantra-loading

# 5
git checkout 895c316 -b feat/5-mahasiswa-views
git push -u origin feat/5-mahasiswa-views

# 6
git checkout 06b684e -b feat/6-map-logic
git push -u origin feat/6-map-logic

# 7
git checkout 96db24f -b feat/7-dev-panel
git push -u origin feat/7-dev-panel

git checkout feature
echo "Branches pushed!"
