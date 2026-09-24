'use client';

import * as pdfjsLib from 'pdfjs-dist';

// Wajib set workerSrc agar tidak error di browser
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Ekstrak teks dari file PDF.
 * @param file - File object dari <input type="file">
 * @param maxChars - Batas karakter hasil ekstraksi (default 8000)
 * @returns string teks yang diekstrak dari PDF
 */
export async function extractTextFromPDF(
  file: File,
  maxChars = 8000
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  // Menggunakan `promise` karena API pdfjs-dist yang baru (v4+) mungkin memiliki tipe Promise berbeda, tapi doc backend menyuruh seperti ini.
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ');
    fullText += pageText + '\n';

    // Hentikan lebih awal jika sudah melebihi batas
    if (fullText.length >= maxChars) break;
  }

  return fullText.slice(0, maxChars).trim();
}
