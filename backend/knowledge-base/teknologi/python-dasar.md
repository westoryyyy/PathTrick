# Knowledge Base: Teknologi — Dasar Pemrograman Python

## Apa itu Pemrograman Python?

Python adalah bahasa pemrograman tingkat tinggi yang mudah dipelajari, dengan sintaks yang bersih dan mudah dibaca. Python banyak digunakan di berbagai bidang:
- **Web Development**: Django, Flask, FastAPI
- **Data Science & AI/ML**: Pandas, NumPy, TensorFlow, PyTorch
- **Otomasi & Scripting**: pengolahan file, web scraping, task automation
- **Cybersecurity**: penetration testing tools

## Konsep Dasar Python

### Variabel dan Tipe Data
```python
# Integer
umur = 17

# Float
nilai = 85.5

# String
nama = "Budi"

# Boolean
lulus = True

# List (urutan, bisa diubah)
mata_pelajaran = ["Matematika", "Fisika", "Kimia"]

# Dictionary (key-value pairs)
profil = {"nama": "Budi", "umur": 17, "kelas": "XII"}
```

### Kontrol Alur (Control Flow)
```python
# If-Else
nilai = 85
if nilai >= 75:
    print("Lulus")
elif nilai >= 60:
    print("Remedi")
else:
    print("Tidak Lulus")

# Loop For
for i in range(5):
    print(f"Iterasi ke-{i}")

# Loop While
counter = 0
while counter < 3:
    print(counter)
    counter += 1
```

### Fungsi
```python
def hitung_rata_rata(daftar_nilai):
    """Menghitung rata-rata dari sebuah list nilai."""
    if len(daftar_nilai) == 0:
        return 0
    return sum(daftar_nilai) / len(daftar_nilai)

hasil = hitung_rata_rata([80, 90, 75, 85])
print(f"Rata-rata: {hasil}")  # Output: Rata-rata: 82.5
```

## Kenapa Python Penting di Bidang Teknologi?

1. **Gaji tinggi** — Python developer termasuk kategori dengan gaji kompetitif
2. **Permintaan tinggi** — hampir semua perusahaan teknologi butuh Python developer
3. **Versatile** — satu bahasa, banyak bidang (web, AI, data, cloud)
4. **Komunitas besar** — banyak library gratis, dokumentasi lengkap
5. **Entry barrier rendah** — mudah dipelajari untuk pemula, tapi powerful untuk expert

## Roadmap Belajar Python untuk Pemula

1. **Level 1 (1-2 minggu)**: Sintaks dasar, variabel, tipe data, kontrol alur
2. **Level 2 (2-3 minggu)**: Fungsi, list comprehension, file I/O, error handling
3. **Level 3 (3-4 minggu)**: OOP (class, inheritance), module, package
4. **Level 4 (1 bulan)**: Pilih spesialisasi — Web (Flask/Django) atau Data (Pandas/NumPy)
