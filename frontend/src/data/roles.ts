export interface RoleOption {
  id: string;
  name?: string;
  displayName: string;
  description: string;
  perks: string[];
  iconUrl: string;
}

export const LOCAL_ROLES: RoleOption[] = [
  {
    id: 'sma',
    name: 'The Dreamer',
    displayName: 'The Dreamer',
    description: 'Masih SMA & bingung mau kuliah apa? Temukan jurusan dan karier sesuai bakatmu.',
    perks: ['Asesmen Minat & Bakat', 'Tes RIASEC', 'Rekomendasi Jurusan', 'Info Beasiswa'],
    iconUrl: '/NPC High School Student.png',
  },
  {
    id: 'mahasiswa',
    name: 'The Chaser',
    displayName: 'The Chaser',
    description: 'Mahasiswa atau baru lulus? Upload CV-mu dan buat roadmap kariermu.',
    perks: ['Asesmen Karier AI', 'CV Analysis', 'Job Matching', 'Career Roadmap'],
    iconUrl: '/NPC University Student.png',
  },
];

