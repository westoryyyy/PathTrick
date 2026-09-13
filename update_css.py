import re

with open('src/app/(auth)/select-role/page.module.css', 'r') as f:
    content = f.read()

# Replace from line 19 to the end
lines = content.split('\n')
new_lines = lines[:18]

new_css = """
/* ── Wooden Board Outer Container ── */
.boardContainer {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #8c5d41; /* Dark wood */
  border: 6px solid #3b261b;
  border-radius: 8px;
  box-shadow: 
    inset 0 0 0 4px #a37255,
    inset 0 0 0 8px #704730,
    0 24px 48px rgba(0, 0, 0, 0.7);
  padding: 16px;
  width: 100%;
  max-width: 800px;
  animation: fadeInUp 0.5s cubic-bezier(0.22,1,0.36,1) both;
}

/* Metal corners simulation */
.boardContainer::before,
.boardContainer::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  background: #94a3b8;
  border: 3px solid #334155;
  box-shadow: inset -2px -2px 0 rgba(0,0,0,0.3), inset 2px 2px 0 rgba(255,255,255,0.4);
  z-index: 2;
}
.boardContainer::before {
  top: -6px; left: -6px;
  border-radius: 4px;
}
.boardContainer::after {
  bottom: -6px; right: -6px;
  border-radius: 4px;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Wooden Board Header ── */
.boardHeader {
  width: calc(100% + 32px);
  margin-top: -16px;
  padding: 16px;
  background-color: #684530;
  border-bottom: 6px solid #3b261b;
  text-align: center;
  border-radius: 8px 8px 0 0;
  margin-bottom: 24px;
}

.boardTitle {
  font-family: var(--font-pixel), 'Press Start 2P', monospace;
  font-size: 1.4rem;
  color: #fff;
  margin: 0;
  text-shadow: 2px 2px 0 #3b261b;
  letter-spacing: 2px;
}

/* ── Board Content (Cards) ── */
.boardContent {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  gap: 40px;
  padding: 0 24px 16px 40px; /* Extra left padding for A/B button overlap */
}

@media (max-width: 768px) {
  .boardContent {
    flex-direction: column;
    align-items: center;
    padding: 0 16px 16px;
  }
}

.panelWrapper {
  position: relative;
  display: flex;
  flex: 1;
  max-width: 320px;
}

/* ── A/B Button ── */
.letterBtn {
  position: absolute;
  left: -28px;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #a67c5b;
  border: 4px solid #3b261b;
  color: #fcd34d;
  font-family: var(--font-pixel), 'Press Start 2P', monospace;
  font-size: 1.5rem;
  text-shadow: 2px 2px 0 #3b261b;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  cursor: pointer;
  box-shadow: 
    inset 0 0 0 4px #c29b7a,
    0 4px 0 rgba(0,0,0,0.4);
  transition: all 0.1s;
}

.letterBtn:active {
  transform: translateY(calc(-50% + 4px));
  box-shadow: inset 0 0 0 4px #c29b7a, 0 0 0 rgba(0,0,0,0.4);
}

.letterBtnSelected {
  background-color: #fbbf24;
  color: #fff;
  border-color: #92400e;
  text-shadow: 2px 2px 0 #92400e;
  box-shadow: 
    inset 0 0 0 4px #fcd34d,
    0 4px 0 rgba(0,0,0,0.4);
}

/* ── Inner Wooden Panel ── */
.innerPanel {
  width: 100%;
  background-color: #bc8f65; /* Medium light wood */
  border: 4px solid #5a3a29;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-shadow: inset 0 0 16px rgba(0,0,0,0.3);
  cursor: pointer;
  transition: filter 0.2s, transform 0.2s;
  text-align: center;
}

.innerPanel:hover {
  filter: brightness(1.05);
}

.innerPanelSelected {
  border-color: #fbbf24;
  box-shadow: 
    inset 0 0 16px rgba(0,0,0,0.3),
    0 0 0 4px rgba(251, 191, 36, 0.6);
  transform: scale(1.02);
}

.panelHeader {
  font-family: var(--font-pixel), 'Press Start 2P', monospace;
  font-size: 0.8rem;
  color: #fff;
  text-shadow: 1px 1px 0 #3b261b;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(90, 58, 41, 0.5);
  margin-bottom: 16px;
}

.panelBody {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  min-height: 180px;
}

.charImg {
  image-rendering: pixelated;
  transform: scale(1.2);
}

.panelFooter {
  font-family: var(--font-pixel), 'Press Start 2P', monospace;
  font-size: 0.65rem;
  line-height: 1.6;
  color: #fff;
  text-shadow: 1px 1px 0 #3b261b;
  padding: 16px 12px;
  background-color: #8c5d41;
  border: 2px solid #5a3a29;
  border-radius: 6px;
  margin-top: 16px;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.2);
}

/* ── CTA Button ── */
.continueBtn {
  font-family: var(--font-pixel), 'Press Start 2P', monospace;
  font-size: 1rem;
  padding: 16px 40px;
  margin-top: 24px;
  color: #ffffff;
  background: #64748b;
  border: 3px solid #0f172a;
  border-radius: 8px;
  cursor: not-allowed;
  opacity: 0.5;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-shadow: 2px 2px 0 #0f172a;
  box-shadow: 
    inset 0 4px 0 rgba(255,255,255,0.2),
    0 8px 0 #0f172a,
    0 12px 16px rgba(0,0,0,0.4);
}

.continueBtnActive {
  background: #f59e0b;
  border-color: #78350f;
  cursor: pointer;
  opacity: 1;
  text-shadow: 2px 2px 0 #78350f;
  box-shadow: 
    inset 0 4px 0 rgba(255,255,255,0.3),
    0 8px 0 #78350f,
    0 12px 16px rgba(0,0,0,0.4);
}

.continueBtnActive:hover {
  transform: translateY(-2px);
  background: #fbbf24;
  box-shadow: 
    inset 0 4px 0 rgba(255,255,255,0.4),
    0 10px 0 #78350f,
    0 16px 20px rgba(0,0,0,0.5);
}

.continueBtnActive:active {
  transform: translateY(6px);
  box-shadow: 
    inset 0 2px 0 rgba(255,255,255,0.2),
    0 2px 0 #78350f,
    0 4px 8px rgba(0,0,0,0.4);
}
"""

with open('src/app/(auth)/select-role/page.module.css', 'w') as f:
    f.write('\n'.join(new_lines) + '\n' + new_css)
