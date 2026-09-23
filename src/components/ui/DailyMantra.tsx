'use client';

import React, { useMemo, useState } from 'react';

const MANTRAS = [
  { quote: "Kamu nggak harus tahu jawabannya sekarang. Yang penting kamu mau cari tahu. Itu sudah lebih dari cukup." },
  { quote: "Nilai ujianmu bukan ukuran seberapa berharganya kamu. Percayai itu." },
  { quote: "Ada momen di mana kamu akan merasa ini terlalu susah. Di momen itulah pertumbuhanmu sedang terjadi." },
  { quote: "Guru terbaik yang pernah kamu punya adalah rasa penasaranmu sendiri. Jangan matikan itu." },
  { quote: "Bukan siapa yang paling pintar yang akan sukses. Tapi siapa yang paling mau belajar." },
  { quote: "Setiap orang yang kamu kagumi pernah ada di posisi yang sama persis dengan kamu sekarang." },
  { quote: "Kalau hari ini terasa berat, itu bukan tanda kamu lemah. Itu tanda kamu sedang menanggung sesuatu yang berarti." },
  { quote: "Kamu boleh takut. Tapi tetap melangkah meski takut, itu namanya berani." },
  { quote: "Kesalahan bukan musuhmu. Kesalahan adalah cara terbaikmu untuk belajar hal yang tidak diajarkan di buku mana pun." },
  { quote: "Jangan bandingkan chapter 1 hidupmu dengan chapter 20 hidup orang lain." },
  { quote: "Ilmu yang kamu dapat hari ini adalah sesuatu yang tidak bisa diambil siapapun darimu. Selamanya." },
  { quote: "Kamu tidak sedang membuang waktu. Kamu sedang membangun fondasi yang nanti akan menopang semuanya." },
  { quote: "Cinta terhadap belajar bukan bakat bawaan. Itu sesuatu yang kamu temukan saat kamu menemukan hal yang tepat." },
  { quote: "Satu langkah kecil yang konsisten mengalahkan lompatan besar yang cuma terjadi sekali." },
  { quote: "Kamu lebih capable dari yang kamu kira. Serius. Orang di luar sana kadang melihat itu lebih jelas dari kamu sendiri." },
  { quote: "Mimpi yang samar pun tetap layak diperjuangkan. Nanti di tengah jalan, peta itu akan semakin jelas." },
  { quote: "Tidak ada yang sia-sia dari setiap hal yang kamu pelajari, meski rasanya tidak relevan sekarang." },
  { quote: "Rasa bosan dalam belajar itu normal. Tapi di balik kebosanan itu, ada keahlian yang sedang terbentuk." },
  { quote: "Kamu bukan terlambat. Kamu tepat waktu untuk versimu sendiri." },
  { quote: "Satu hal yang ingin aku katakan: kamu sudah melakukan hal yang benar dengan ada di sini hari ini." },
];

export default function DailyMantra() {
  const [isOpen, setIsOpen] = useState(false);

  const mantra = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return MANTRAS[dayOfYear % MANTRAS.length];
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '24px', 
      right: '24px', 
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      pointerEvents: 'none', // So the invisible part doesn't block clicks
    }}>

      {/* ── STARDEW-STYLE DIALOGUE BOX ── */}
      {isOpen && (
        <div style={{
          position: 'relative',
          marginBottom: '16px',
          width: '420px',
          imageRendering: 'pixelated',
          pointerEvents: 'auto',
        }}>
          {/* Outer wooden frame */}
          <div style={{
            background: '#c8a96e',
            border: '4px solid #5a3520',
            borderRadius: '4px',
            padding: '3px',
            boxShadow: '3px 3px 0 #3b1f0e, inset 0 0 0 2px #e8c98a',
          }}>
            {/* Inner content area */}
            <div style={{
              background: '#f5e6c8',
              border: '2px solid #8b5e34',
              borderRadius: '2px',
              padding: '16px',
            }}>
              {/* Name plate */}
              <div style={{
                display: 'inline-block',
                background: '#5a3520',
                color: '#f5e6c8',
                fontFamily: '"Press Start 2P"',
                fontSize: '0.6rem',
                padding: '6px 12px',
                marginBottom: '12px',
                borderRadius: '2px',
                letterSpacing: '0.05em',
              }}>
                Profesor Pathrick
              </div>

              {/* Quote text */}
              <p style={{
                fontFamily: '"Press Start 2P"',
                fontSize: '0.7rem',
                color: '#3b1f0e',
                lineHeight: '1.9',
                margin: 0,
              }}>
                {mantra.quote}
              </p>

              {/* ▼ continue indicator */}
              <div
                onClick={() => setIsOpen(false)}
                style={{
                  textAlign: 'right',
                  marginTop: '12px',
                  fontFamily: '"Press Start 2P"',
                  fontSize: '0.8rem',
                  color: '#5a3520',
                  cursor: 'pointer',
                  opacity: 0.7,
                }}
              >
                ▼
              </div>
            </div>
          </div>

          {/* Tail pointing down to the avatar */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            right: '22px',
            width: 0, height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: '8px solid #5a3520',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            right: '24px',
            width: 0, height: 0,
            borderLeft: '5px solid transparent',
            borderRight: '5px solid transparent',
            borderTop: '6px solid #c8a96e',
          }} />
        </div>
      )}

      {/* ── FLOATING NPC BUTTON ── */}
      <div
        onClick={() => setIsOpen(o => !o)}
        style={{
          width: '64px',
          height: '64px',
          background: '#c8a96e',
          border: '4px solid #5a3520',
          borderRadius: '8px',
          boxShadow: '3px 3px 0 rgba(0,0,0,0.3), inset 0 0 0 2px #e8c98a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.5rem',
          cursor: 'pointer',
          position: 'relative',
          pointerEvents: 'auto',
          transition: 'transform 0.1s',
          transform: isOpen ? 'scale(0.95)' : 'scale(1)',
        }}
      >
        🧙‍♂️
        {/* "!" badge */}
        {!isOpen && (
          <div style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: '#e8b422',
            border: '2px solid #5a3520',
            borderRadius: '4px',
            width: '20px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Press Start 2P"',
            fontSize: '0.6rem',
            color: '#3b1f0e',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
          }}>
            !
          </div>
        )}
      </div>
    </div>
  );
}
