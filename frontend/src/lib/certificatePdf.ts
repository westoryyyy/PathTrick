'use client';

export interface CertificatePdfData {
  userName: string;
  moduleName: string;
  walletAddress: string;
  date: string;
}

const TEMPLATE_SRC = '/pathtrick-certificate-blank.png';
// Same aspect ratio as the template (6250 x 4419), rendered at a print-friendly size.
const WIDTH = 3000;
const HEIGHT = Math.round((WIDTH * 4419) / 6250);
const TITLE_FONT = '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif';
const BODY_FONT = 'system-ui, -apple-system, sans-serif';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Template sertifikat gagal dimuat.'));
    img.src = src;
  });
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, size: number, weight: string, family: string) {
  let current = size;
  ctx.font = `${weight} ${current}px ${family}`;
  while (ctx.measureText(text).width > maxWidth && current > 10) {
    current -= 2;
    ctx.font = `${weight} ${current}px ${family}`;
  }
}

/**
 * Renders the certificate (same layout as CertificatePreview) into a PDF and opens it in a new tab.
 * The tab is opened synchronously so popup blockers allow it.
 */
export async function openCertificatePdf(data: CertificatePdfData): Promise<void> {
  const tab = window.open('', '_blank');
  if (tab) tab.document.title = 'Menyiapkan sertifikat...';

  try {
    const [{ jsPDF }, template] = await Promise.all([import('jspdf'), loadImage(TEMPLATE_SRC)]);

    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas tidak tersedia.');

    ctx.drawImage(template, 0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = '#1f2937';
    ctx.textBaseline = 'middle';

    // Positions mirror CertificatePreview (percentages of the template).
    ctx.textAlign = 'center';
    fitText(ctx, data.userName, WIDTH * 0.8, WIDTH * 0.041, '700', TITLE_FONT);
    ctx.fillText(data.userName, WIDTH / 2, HEIGHT * 0.44);

    const moduleName = data.moduleName.toUpperCase();
    fitText(ctx, moduleName, WIDTH * 0.8, WIDTH * 0.03, '700', TITLE_FONT);
    ctx.fillText(moduleName, WIDTH / 2, HEIGHT * 0.555);

    ctx.textAlign = 'left';
    ctx.font = `600 ${Math.round(WIDTH * 0.015)}px ${BODY_FONT}`;
    ctx.fillText(data.walletAddress, WIDTH * 0.425, HEIGHT * 0.705);
    ctx.fillText(data.date, WIDTH * 0.425, HEIGHT * 0.75);
    ctx.fillText('MINTED', WIDTH * 0.425, HEIGHT * 0.795);

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [WIDTH, HEIGHT], compress: true });
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, WIDTH, HEIGHT);
    pdf.setProperties({ title: `PathTrick Certificate - ${data.moduleName}` });

    const url = URL.createObjectURL(pdf.output('blob'));
    if (tab) {
      tab.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  } catch (error) {
    tab?.close();
    throw error;
  }
}
