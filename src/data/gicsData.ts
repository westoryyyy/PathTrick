// ─── GICS — Global Industry Classification Standard ───────────────────────
// Developed by MSCI & S&P. Used by LinkedIn, Bloomberg, and global exchanges
// to categorize all job roles into 11 standardized industry sectors.

export type GICSSectorCode =
  | 'IT'
  | 'COMM'
  | 'FIN'
  | 'HEALTH'
  | 'DISC'
  | 'STAPLES'
  | 'IND'
  | 'ENERGY'
  | 'MATERIAL'
  | 'UTIL'
  | 'REAL_ESTATE';

export interface GICSSector {
  code: GICSSectorCode;
  nameID: string;
  nameEN: string;
  icon: string;
  description: string;
  exampleRoles: string[];
  accentColor: string;
}

export const GICS_SECTORS: GICSSector[] = [
  { code: 'ENERGY',      nameID: 'Energi',               nameEN: 'Energy',                    icon: '⚡', description: 'Urusan tambang minyak bumi, gas, dan riset energi bersih (terbarukan).', exampleRoles: ['Energy Analyst', 'Renewable Tech Specialist', 'Environmental Engineer'], accentColor: '#fbbf24' },
  { code: 'IND',         nameID: 'Industri',             nameEN: 'Industrials',               icon: '🏭', description: 'Pabrik manufaktur gede, proyek jalan/gedung, pesawat, sampai logistik pengiriman.', exampleRoles: ['Mechanical Engineer', 'Logistics Manager', 'Quality Control', 'Civil Engineer'], accentColor: '#78716c' },
  { code: 'FIN',         nameID: 'Keuangan',             nameEN: 'Financials',                icon: '🏦', description: 'Segala hal soal cuan! Mulai dari perbankan, asuransi, saham, sampai fintech.', exampleRoles: ['Financial Analyst', 'Fintech Developer', 'Auditor', 'Investment Banker'], accentColor: '#10b981' },
  { code: 'DISC',        nameID: 'Konsumen\nNon-Primer',  nameEN: 'Consumer Discretionary',    icon: '🛍️', description: 'Barang gaya hidup, fashion, mobil, sampai liburan dan nginep di hotel.', exampleRoles: ['E-Commerce Manager', 'UX Designer', 'Brand Strategist', 'Tourism Analyst'], accentColor: '#f97316' },
  { code: 'STAPLES',     nameID: 'Konsumen Primer',      nameEN: 'Consumer Staples',          icon: '🌾', description: 'Kebutuhan pokok sehari-hari, kayak sembako, makanan, minuman, dan sabun.', exampleRoles: ['Supply Chain Analyst', 'Food Technologist', 'Agricultural Consultant'], accentColor: '#84cc16' },
  { code: 'HEALTH',      nameID: 'Layanan Kesehatan',    nameEN: 'Health Care',               icon: '🏥', description: 'Dunia medis, rumah sakit, obat-obatan farmasi, sampai riset kesehatan.', exampleRoles: ['Health Tech Specialist', 'Pharmacist', 'Medical Researcher', 'Biotech Engineer'], accentColor: '#ef4444' },
  { code: 'COMM',        nameID: 'Layanan Komunikasi',   nameEN: 'Communication Services',    icon: '📡', description: 'Dunia media, entertainment, sosmed, internet, dan periklanan digital.', exampleRoles: ['Content Creator', 'Media Planner', 'PR Specialist', 'Digital Marketing'], accentColor: '#ec4899' },
  { code: 'MATERIAL',    nameID: 'Material',             nameEN: 'Materials',                 icon: '⚗️', description: 'Tambang mineral, pengelolaan hutan, dan produksi bahan baku kimia dasar.', exampleRoles: ['Chemical Engineer', 'Mining Analyst', 'Materials Scientist', 'Geologist'], accentColor: '#a16207' },
  { code: 'REAL_ESTATE', nameID: 'Real Estate',          nameEN: 'Real Estate',               icon: '🏢', description: 'Bisnis jual beli perumahan, bangun apartemen, sewa gedung, dan tanah.', exampleRoles: ['Property Analyst', 'PropTech Developer', 'Urban Planner', 'Real Estate Broker'], accentColor: '#8b5cf6' },
  { code: 'IT',          nameID: 'Teknologi Informasi',  nameEN: 'Information Technology',    icon: '💻', description: 'Dunia ngoding, bikin software, ngurus server, sampai rakit hardware.', exampleRoles: ['Software Engineer', 'DevOps Engineer', 'Data Scientist', 'Cybersecurity Analyst'], accentColor: '#3b82f6' },
  { code: 'UTIL',        nameID: 'Utilitas',             nameEN: 'Utilities',                 icon: '💧', description: 'Ngurusin pasokan listrik, air bersih, sama limbah biar kota tetep jalan.', exampleRoles: ['Infrastructure Engineer', 'Smart Grid Specialist', 'Environmental Consultant'], accentColor: '#06b6d4' },
];

export function getGICSSector(code: GICSSectorCode): GICSSector {
  return GICS_SECTORS.find(s => s.code === code) ?? GICS_SECTORS[0];
}
