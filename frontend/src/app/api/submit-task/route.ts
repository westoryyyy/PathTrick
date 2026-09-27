import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { code, missionId } = data;

    // Simulate AI grading delay (2.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Basic logic to simulate AI assessment of the code
    let passed = false;
    let message = '';
    
    const cleanCode = code.replace('<!-- Tulis kodemu di bawah ini -->', '').replace('<!-- Tulis kodemu di sini -->', '').trim().toLowerCase();
    
    const openBrackets = cleanCode.split('<').length - 1;
    const closeBrackets = cleanCode.split('>').length - 1;

    if (!cleanCode) {
      passed = false;
      message = 'Kode masih kosong atau belum diubah. Silakan kerjakan tantangan ini!';
    } else if (openBrackets !== closeBrackets) {
      passed = false;
      message = 'Sintaks Error! Sepertinya ada tag HTML yang tidak ditutup dengan benar (kekurangan karakter "<" atau ">"). Harap lebih teliti ya, Ksatria!';
    } else {
      switch (missionId) {
        case 'module-html-css-level-1':
          if (cleanCode.includes('<body') && cleanCode.includes('hello world')) {
            passed = true;
            message = 'Luar Biasa! Kamu berhasil membuat struktur kerangka tubuh (body) dan mencetak Hello World pertama kalinya!';
          } else {
            passed = false;
            message = 'Hampir! Pastikan kamu menulis teks "Hello World" di dalam tag <body>...</body>.';
          }
          break;
        case 'module-html-css-level-2':
          if (cleanCode.includes('<h1') && cleanCode.includes('<p')) {
            passed = true;
            message = 'Sempurna! Kamu telah menguasai dasar pembuatan Judul dan Paragraf.';
          } else {
            passed = false;
            message = 'Hampir! Sepertinya kamu melupakan tag <h1> atau <p>. Periksa kembali kode kamu.';
          }
          break;
        case 'module-html-css-level-6':
          if (cleanCode.includes('<html') && cleanCode.includes('<body') && cleanCode.includes('<h1') && cleanCode.includes('<p') && cleanCode.includes('<img') && cleanCode.includes('<a') && cleanCode.includes('<ul') && cleanCode.includes('<li') && cleanCode.includes('<style')) {
            passed = true;
            message = 'BOSS KALAH TELAK! Portofolio buatanmu sangat sempurna. Selamat, kamu berhasil menaklukkan Modul HTML & CSS secara penuh!';
          } else {
            passed = false;
            message = 'Boss menangkis seranganmu! Pastikan kamu menyertakan SEMUA elemen yang diminta (html, body, h1, p, img, a, ul, li, style).';
          }
          break;
        case 'module-html-css-level-3':
          if (cleanCode.includes('<img') && cleanCode.includes('<a')) {
            passed = true;
            message = 'Bagus sekali! Tautan dan Gambarmu sudah berhasil dirender.';
          } else {
            passed = false;
            message = 'Oops! Pastikan kamu memiliki minimal 1 tag <img> dan 1 tag <a>.';
          }
          break;
        case 'module-html-css-level-4':
          if (cleanCode.includes('<h1') && cleanCode.includes('<h2') && cleanCode.includes('<p') && cleanCode.includes('<a')) {
            passed = true;
            message = 'Biodata yang sangat keren! Kamu berhasil menggunakan berbagai macam elemen HTML secara bersamaan.';
          } else {
            passed = false;
            message = 'Tunggu, sepertinya kamu belum memasukkan semua tag yang diminta (h1, h2, p, a).';
          }
          break;
        case 'module-html-css-level-5':
          if (cleanCode.includes('<style') && (cleanCode.includes('color: red') || cleanCode.includes('color:red'))) {
            passed = true;
            message = 'Mantra yang indah! Tulisanmu kini menyala berwarna merah.';
          } else {
            passed = false;
            message = 'Sihirnya gagal. Pastikan kamu menggunakan tag <style> dan properti color: red.';
          }
          break;
        default:
          // Fallback if somehow there's an unknown level
          passed = true;
          message = 'Tantangan berhasil diselesaikan!';
          break;
      }
    }

    return NextResponse.json({
      success: true,
      passed,
      message,
      score: passed ? 100 : 40,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to submit task' },
      { status: 500 }
    );
  }
}
