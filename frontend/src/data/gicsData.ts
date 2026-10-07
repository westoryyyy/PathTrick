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
  description: {
    id: string;
    en: string;
  };
  exampleRoles: string[];
  accentColor: string;
}

export const GICS_SECTORS: GICSSector[] = [
  { code: 'IT',          nameID: 'Teknologi Informasi',  nameEN: 'Information Technology',    icon: '💻', description: { id: 'Dunia ngoding, bikin software, ngurus server, sampai rakit hardware.', en: 'Coding, building software, managing servers, and hardware assembly.' }, exampleRoles: ['Software Engineer', 'DevOps Engineer', 'Data Scientist', 'Cybersecurity Analyst'], accentColor: '#3b82f6' },
  { code: 'COMM',        nameID: 'Layanan Komunikasi',   nameEN: 'Communication Services',    icon: '📡', description: { id: 'Dunia media, entertainment, sosmed, internet, dan periklanan digital.', en: 'Media, entertainment, social media, the internet, and digital advertising.' }, exampleRoles: ['Content Creator', 'Media Planner', 'PR Specialist', 'Digital Marketing'], accentColor: '#ec4899' },
  { code: 'FIN',         nameID: 'Keuangan',             nameEN: 'Financials',                icon: '🏦', description: { id: 'Segala hal soal cuan! Mulai dari perbankan, asuransi, saham, sampai fintech.', en: 'Everything about money! From banking, insurance, stocks, to fintech.' }, exampleRoles: ['Financial Analyst', 'Fintech Developer', 'Auditor', 'Investment Banker'], accentColor: '#10b981' },
  { code: 'HEALTH',      nameID: 'Layanan Kesehatan',    nameEN: 'Health Care',               icon: '🏥', description: { id: 'Dunia medis, rumah sakit, obat-obatan farmasi, sampai riset kesehatan.', en: 'The medical world, hospitals, pharmaceuticals, and health research.' }, exampleRoles: ['Health Tech Specialist', 'Pharmacist', 'Medical Researcher', 'Biotech Engineer'], accentColor: '#ef4444' },
  { code: 'DISC',        nameID: 'Konsumen\nNon-Primer',  nameEN: 'Consumer Discretionary',    icon: '🛍️', description: { id: 'Barang gaya hidup, fashion, mobil, sampai liburan dan nginep di hotel.', en: 'Lifestyle goods, fashion, cars, holidays, and hotel stays.' }, exampleRoles: ['E-Commerce Manager', 'UX Designer', 'Brand Strategist', 'Tourism Analyst'], accentColor: '#f97316' },
  { code: 'STAPLES',     nameID: 'Konsumen Primer',      nameEN: 'Consumer Staples',          icon: '🌾', description: { id: 'Kebutuhan pokok sehari-hari, kayak sembako, makanan, minuman, dan sabun.', en: 'Daily essentials like groceries, food, beverages, and soaps.' }, exampleRoles: ['Supply Chain Analyst', 'Food Technologist', 'Agricultural Consultant'], accentColor: '#84cc16' },
  { code: 'IND',         nameID: 'Industri',             nameEN: 'Industrials',               icon: '🏭', description: { id: 'Pabrik manufaktur gede, proyek jalan/gedung, pesawat, sampai logistik pengiriman.', en: 'Large manufacturing factories, construction projects, aircraft, and logistics.' }, exampleRoles: ['Mechanical Engineer', 'Logistics Manager', 'Quality Control', 'Civil Engineer'], accentColor: '#78716c' },
  { code: 'ENERGY',      nameID: 'Energi',               nameEN: 'Energy',                    icon: '⚡', description: { id: 'Urusan tambang minyak bumi, gas, dan riset energi bersih (terbarukan).', en: 'Oil, gas mining, and clean (renewable) energy research.' }, exampleRoles: ['Energy Analyst', 'Renewable Tech Specialist', 'Environmental Engineer'], accentColor: '#fbbf24' },
  { code: 'MATERIAL',    nameID: 'Material',             nameEN: 'Materials',                 icon: '⚗️', description: { id: 'Tambang mineral, pengelolaan hutan, dan produksi bahan baku kimia dasar.', en: 'Mineral mining, forestry management, and basic chemical production.' }, exampleRoles: ['Chemical Engineer', 'Mining Analyst', 'Materials Scientist', 'Geologist'], accentColor: '#a16207' },
  { code: 'UTIL',        nameID: 'Utilitas',             nameEN: 'Utilities',                 icon: '💧', description: { id: 'Ngurusin pasokan listrik, air bersih, sama limbah biar kota tetep jalan.', en: 'Managing electricity, clean water, and waste to keep cities running.' }, exampleRoles: ['Infrastructure Engineer', 'Smart Grid Specialist', 'Environmental Consultant'], accentColor: '#06b6d4' },
  { code: 'REAL_ESTATE', nameID: 'Real Estate',          nameEN: 'Real Estate',               icon: '🏢', description: { id: 'Bisnis jual beli perumahan, bangun apartemen, sewa gedung, dan tanah.', en: 'Buying and selling housing, building apartments, renting buildings, and land.' }, exampleRoles: ['Property Analyst', 'PropTech Developer', 'Urban Planner', 'Real Estate Broker'], accentColor: '#8b5cf6' },
];

export function getGICSSector(code: GICSSectorCode): GICSSector {
  return GICS_SECTORS.find(s => s.code === code) ?? GICS_SECTORS[0];
}
