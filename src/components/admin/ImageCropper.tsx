'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageBase64: string) => void;
  onCancel: () => void;
  aspect?: number;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel, aspect = 16 / 9 }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async () => {
    try {
      const canvas = document.createElement('canvas');
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => (image.onload = resolve));

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      const base64Image = canvas.toDataURL('image/jpeg');
      onCropComplete(base64Image);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: 1, width: '100%' }}>
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropCompleteInternal}
          onZoomChange={setZoom}
        />
      </div>
      <div style={{ padding: '20px', background: '#3b1f0a', display: 'flex', justifyContent: 'center', gap: '20px', borderTop: '2px solid #5a3a29' }}>
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))}
          style={{ width: '200px' }}
        />
        <button
          onClick={onCancel}
          style={{ fontFamily: '"Pixelify Sans"', fontSize: '1rem', background: 'transparent', border: '2px solid #ef4444', color: '#ef4444', padding: '8px 16px', cursor: 'pointer' }}
        >
          Batal
        </button>
        <button
          onClick={getCroppedImg}
          style={{ fontFamily: '"Pixelify Sans"', fontSize: '1rem', background: '#34d399', border: '2px solid #10b981', color: '#000', padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Simpan Crop
        </button>
      </div>
    </div>
  );
}
