'use client';

import React, { useMemo, useState } from 'react';

const MANTRAS = [
  { quote: "Kamu meragukan dirimu sendiri, padahal diam-diam banyak yang mengagumi progresmu. Berhentilah menjadi kritikus paling kejam untuk dirimu sendiri." },
  { quote: "Merasa seperti penipu karena belum jago? Itu bukan tanda kamu lemah. Itu tanda kamu berani masuk ke ruangan yang lebih besar dari zona nyamanmu." },
  { quote: "Levelmu sudah naik, tapi mentalmu masih merasa di level satu. Akui pencapaianmu hari ini, sekecil apa pun itu." },
  { quote: "Pintar itu bukan berarti tidak pernah bingung. Pintar itu berani terus mencari tahu walau sedang merasa paling bodoh di ruangan ini." },
  { quote: "Ruangan ini memang terasa terlalu besar untukmu sekarang. Tapi tak apa, sebentar lagi kamu akan tumbuh memenuhi seluruh sudutnya." },
  { quote: "Banyaknya jalan membuatmu diam di tempat. Pejamkan mata, pilih satu skill hari ini. Tersesat saat mencoba jauh lebih baik daripada membeku di garis start." },
  { quote: "Kepalamu terlalu berisik memikirkan skenario terburuk tahun depan. Tarik napas. Tugasmu hari ini hanyalah menyelesaikan apa yang ada di depan mata." },
  { quote: "Kamu panik karena tujuan akhirnya belum terlihat. Tapi sadarkah kamu? Langkah-langkah kecil yang kamu ambil setiap hari secara otomatis sedang merakit jalan itu." },
  { quote: "Jangan biarkan masa depan yang belum terjadi merenggut kedamaianmu hari ini. Selesaikan satu tugas kecil, lalu beristirahatlah." },
  { quote: "Skenario gagal di kepalamu itu cuma fiksi. Realitanya, kamu jauh lebih tangguh dari apa yang kamu bayangkan." },
  { quote: "Tidak ada yang melihat berapa kali kamu mengulang, menghapus, dan mencoba lagi semalam. Tapi percayalah, malam-malam sunyi itulah yang akan membentukmu jadi ahli." },
  { quote: "Kamu lelah karena merasa usahamu hari ini tidak membuahkan hasil instan. Jangan tertipu. Fondasi yang kuat selalu dibangun di bawah tanah, tak terlihat pada awalnya." },
  { quote: "Terkadang sepi sekali rasanya berjuang sendirian memahami hal baru. Tapi ingat, senjata paling mematikan selalu ditempa dalam ruang yang sunyi." },
  { quote: "Layar komputermu adalah saksi bisu berapa kali kamu menolak untuk menyerah. Banggalah pada kegigihan itu." },
  { quote: "Hasil akhir memang yang dipajang untuk dunia, tapi proses berantakan di balik layar itulah yang sebenarnya mendewasakanmu." },
  { quote: "Terus-menerus mengintip layar orang lain hanya akan membuatmu buta pada petamu sendiri. Kamu tidak tertinggal, kamu sedang membuat jalan pintasmu sendiri." },
  { quote: "Gelisah melihat mereka yang sudah melesat jauh? Mereka punya cheat code mereka sendiri, dan kamu punya trikmu sendiri. Jangan gunakan penggaris orang lain untuk mengukur suksesmu." },
  { quote: "Iri melihat hasil akhir mereka itu manusiawi. Tapi kamu lupa, kamu tidak pernah melihat seberapa hancur mereka saat pertama kali memulai." },
  { quote: "Mekar di waktu yang berbeda bukan berarti kamu gagal mekar. Waktumu akan tiba saat akarmu sudah siap." },
  { quote: "Mereka berlari cepat di lintasan lari. Kamu sedang mendaki gunung. Tentu saja kecepatan kalian berbeda. Nikmati saja pendakianmu." },
  { quote: "Kamu menunggu momen 'siap seratus persen' yang tidak akan pernah datang. Lompat saja dulu. Kamu akan belajar cara mendarat saat sedang melayang." },
  { quote: "Takut salah pilih role atau skill? Kesalahan terbesar bukanlah memilih jalan yang salah, melainkan tidak berani memilih sama sekali." },
  { quote: "Di balik setiap ketakutanmu untuk memulai, ada versi dirimu di masa depan yang berterima kasih karena hari ini kamu berani menekan tombol start." },
  { quote: "Tombol 'mulai' memang yang paling berat ditekan. Tapi percayalah, begitu ditekan, ketakutan terbesarmu sudah berhasil dilewati." },
  { quote: "Jauh lebih baik gagal karena mencoba melangkah, daripada menyesal karena seumur hidup hanya diam di pinggir lapangan." },
  { quote: "Kalau hari ini terasa terlalu berat, sekadar bertahan dan menutup mata juga sebuah kemenangan. Istirahatlah, besok kita mulai lagi." },
  { quote: "Sistem yang paling canggih pun butuh restart. Kamu juga manusia, bukan mesin. Izinkan dirimu beristirahat tanpa rasa bersalah." },
  { quote: "Menangis saat menghadapi jalan buntu itu wajar. Keluarkan saja semuanya, lalu lihat layarmu lagi nanti dengan pikiran yang lebih jernih." },
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


const CSS = `
  @keyframes dm-bounce {
    0%, 100% { transform: translateY(0) scale(1); }
    40% { transform: translateY(-6px) scale(1.04); }
    60% { transform: translateY(-3px) scale(1.02); }
  }
  @keyframes dm-pulse-badge {
    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(232, 180, 34, 0.7); }
    50% { transform: scale(1.15); box-shadow: 0 0 0 6px rgba(232, 180, 34, 0); }
  }
  @keyframes dm-slide-in {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes dm-star-spin {
    from { transform: rotate(0deg) scale(1); }
    to   { transform: rotate(360deg) scale(1); }
  }
  @keyframes dm-cursor-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  .dm-bounce { animation: dm-bounce 2.4s ease-in-out infinite; }
  .dm-badge  { animation: dm-pulse-badge 1.8s ease-in-out infinite; }
  .dm-dialog { animation: dm-slide-in 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .dm-star   { animation: dm-star-spin 4s linear infinite; display: inline-block; }
  .dm-cursor { animation: dm-cursor-blink 1s step-end infinite; }
  .dm-close-btn:hover { background: #7a4a2e !important; }
  .dm-wizard-btn:hover { filter: brightness(1.15); transform: scale(1.08) !important; }
`;

export default function DailyMantra() {
  const [isOpen, setIsOpen] = useState(false);

  const mantra = useMemo(() => {
    const now = new Date();
    // Rotate per-hour: total hours elapsed since start of year
    const start = new Date(now.getFullYear(), 0, 0);
    const hourOfYear = Math.floor((now.getTime() - start.getTime()) / 3600000);
    return MANTRAS[hourOfYear % MANTRAS.length];
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none',
        gap: '12px',
      }}>

        {/* ── REDESIGNED DIALOGUE BOX ── */}
        {isOpen && (
          <div className="dm-dialog" style={{
            position: 'relative',
            width: '460px',
            pointerEvents: 'auto',
            filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.45))',
          }}>
            {/* Outer golden frame */}
            <div style={{
              background: 'linear-gradient(135deg, #d4a843 0%, #c8962e 50%, #b8841e 100%)',
              border: '3px solid #7a4a10',
              borderRadius: '6px',
              padding: '3px',
              boxShadow: 'inset 0 1px 0 rgba(255,220,100,0.6), inset 0 -1px 0 rgba(0,0,0,0.3)',
            }}>
              {/* Inner parchment */}
              <div style={{
                background: 'linear-gradient(160deg, #fdf3dc 0%, #f5e6c0 60%, #eedcaa 100%)',
                border: '2px solid #a0672a',
                borderRadius: '4px',
                padding: '18px 20px 14px',
                position: 'relative',
                overflow: 'hidden',
              }}>

                {/* Decorative corner stars */}
                <span className="dm-star" style={{ position: 'absolute', top: 8, right: 10, fontSize: '0.7rem', opacity: 0.4 }}>✦</span>
                <span className="dm-star" style={{ position: 'absolute', bottom: 10, left: 10, fontSize: '0.55rem', opacity: 0.3, animationDirection: 'reverse', animationDuration: '6s' }}>✦</span>

                {/* Header row: nameplate + close */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#5a3520',
                    color: '#fde9b5',
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: '0.55rem',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    letterSpacing: '0.05em',
                    boxShadow: '2px 2px 0 #3b1f0e, inset 0 1px 0 rgba(255,200,100,0.2)',
                  }}>
                    <span>🧙</span>
                    <span>Profesor PathTrick</span>
                  </div>
                  <button
                    className="dm-close-btn"
                    onClick={() => setIsOpen(false)}
                    style={{
                      background: '#5a3520',
                      border: '2px solid #3b1f0e',
                      borderRadius: '3px',
                      color: '#fde9b5',
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: '0.5rem',
                      width: '24px', height: '24px',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '2px 2px 0 #3b1f0e',
                      transition: 'background 0.15s',
                      pointerEvents: 'auto',
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Divider */}
                <div style={{
                  height: '2px',
                  background: 'repeating-linear-gradient(90deg, #a0672a 0, #a0672a 6px, transparent 6px, transparent 12px)',
                  marginBottom: '14px',
                  opacity: 0.5,
                }} />

                {/* Quote text – Pixelify Sans for readability */}
                <p style={{
                  fontFamily: '"Pixelify Sans", "Press Start 2P", monospace',
                  fontSize: '1.05rem',
                  color: '#3b1f0e',
                  lineHeight: '1.75',
                  margin: 0,
                  letterSpacing: '0.01em',
                }}>
                  "{mantra.quote}"
                </p>

                {/* Footer: next indicator */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: '0.45rem',
                    color: '#8b5e34',
                    opacity: 0.7,
                    letterSpacing: '0.08em',
                  }}>
                    klik untuk tutup
                  </span>
                  <span
                    className="dm-cursor"
                    onClick={() => setIsOpen(false)}
                    style={{
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: '0.75rem',
                      color: '#7a4a10',
                      cursor: 'pointer',
                      pointerEvents: 'auto',
                    }}
                  >▼</span>
                </div>
              </div>
            </div>

            {/* Speech bubble tail */}
            <div style={{
              position: 'absolute',
              bottom: '-10px', right: '26px',
              width: 0, height: 0,
              borderLeft: '9px solid transparent',
              borderRight: '9px solid transparent',
              borderTop: '10px solid #7a4a10',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-7px', right: '28px',
              width: 0, height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '8px solid #d4a843',
            }} />
          </div>
        )}

        {/* ── FLOATING WIZARD BUTTON ── */}
        <div
          className={`dm-wizard-btn ${!isOpen ? 'dm-bounce' : ''}`}
          onClick={() => setIsOpen(o => !o)}
          style={{
            width: '72px',
            height: '72px',
            background: 'linear-gradient(145deg, #d4a843 0%, #b8841e 100%)',
            border: '3px solid #7a4a10',
            borderRadius: '10px',
            boxShadow: '0 4px 0 #5a3208, 0 6px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,220,100,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.8rem',
            cursor: 'pointer',
            position: 'relative',
            pointerEvents: 'auto',
            transition: 'transform 0.15s, filter 0.15s',
            transform: isOpen ? 'scale(0.95) translateY(2px)' : 'scale(1)',
            userSelect: 'none',
          }}
        >
          🧙‍♂️

          {/* Pulsing "!" badge */}
          {!isOpen && (
            <div
              className="dm-badge"
              style={{
                position: 'absolute',
                top: '-10px', right: '-10px',
                background: 'linear-gradient(135deg, #fde047, #f59e0b)',
                border: '2px solid #7a4a10',
                borderRadius: '5px',
                width: '22px', height: '26px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.65rem',
                color: '#3b1f0e',
              }}
            >
              !
            </div>
          )}

          {/* Tooltip on hover (shown via title) */}
          <div suppressHydrationWarning style={{
            position: 'absolute',
            bottom: '100%', right: 0,
            marginBottom: '6px',
            background: '#3b1f0e',
            color: '#fde9b5',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '0.4rem',
            padding: '4px 8px',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
            opacity: isOpen ? 0 : 1,
            pointerEvents: 'none',
            transition: 'opacity 0.2s',
            boxShadow: '2px 2px 0 rgba(0,0,0,0.4)',
          }}>
            Sabda PathTrick ✦
          </div>
        </div>
      </div>
    </>
  );
}
