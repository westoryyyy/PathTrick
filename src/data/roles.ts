export interface RoleOption {
  id: string;
  displayName: string;
  description: string;
  perks: string[];
  imageUrl: string;
}

export const LOCAL_ROLES: RoleOption[] = [
  {
    id: 'sma',
    displayName: 'The Dreamer',
    description: 'Masih SMA & bingung mau kuliah apa? Temukan jurusan dan karier sesuai bakatmu.',
    perks: ['Asesmen Minat & Bakat', 'Tes RIASEC', 'Rekomendasi Jurusan', 'Info Beasiswa'],
    imageUrl: '/NPC High School Student.png',
  },
  {
    id: 'mahasiswa',
    displayName: 'The Chaser',
    description: 'Mahasiswa atau baru lulus? Upload CV-mu dan buat roadmap kariermu.',
    perks: ['Asesmen Karier AI', 'CV Analysis', 'Job Matching', 'Career Roadmap'],
    imageUrl: '/NPC University Student.png',
  },
];
