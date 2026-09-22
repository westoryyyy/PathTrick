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
  { code: 'IT',          nameID: 'Teknologi Informasi',  nameEN: 'Information Technology',    icon: '💻', description: 'Pengembangan software, perangkat keras, infrastruktur jaringan, semikonduktor.', exampleRoles: ['Software Engineer', 'DevOps Engineer', 'Data Scientist', 'Cybersecurity Analyst'], accentColor: '#3b82f6' },
  { code: 'COMM',        nameID: 'Layanan Komunikasi',   nameEN: 'Communication Services',    icon: '📡', description: 'Media, hiburan, telekomunikasi, agensi periklanan digital.', exampleRoles: ['Content Creator', 'Media Planner', 'PR Specialist', 'Digital Marketing'], accentColor: '#ec4899' },
  { code: 'FIN',         nameID: 'Keuangan',             nameEN: 'Financials',                icon: '🏦', description: 'Perbankan, asuransi, investasi, fintech, akuntansi.', exampleRoles: ['Financial Analyst', 'Fintech Developer', 'Auditor', 'Investment Banker'], accentColor: '#10b981' },
  { code: 'HEALTH',      nameID: 'Layanan Kesehatan',    nameEN: 'Health Care',               icon: '🏥', description: 'Medis, rumah sakit, farmasi, bioteknologi.', exampleRoles: ['Health Tech Specialist', 'Pharmacist', 'Medical Researcher', 'Biotech Engineer'], accentColor: '#ef4444' },
  { code: 'DISC',        nameID: 'Konsumen Non-Primer',  nameEN: 'Consumer Discretionary',    icon: '🛍️', description: 'Retail, otomotif, perhotelan, pariwisata, fashion, e-commerce.', exampleRoles: ['E-Commerce Manager', 'UX Designer', 'Brand Strategist', 'Tourism Analyst'], accentColor: '#f97316' },
  { code: 'STAPLES',     nameID: 'Konsumen Primer',      nameEN: 'Consumer Staples',          icon: '🌾', description: 'Produksi makanan, minuman, agrikultur, barang kebutuhan sehari-hari.', exampleRoles: ['Supply Chain Analyst', 'Food Technologist', 'Agricultural Consultant'], accentColor: '#84cc16' },
  { code: 'IND',         nameID: 'Industri',             nameEN: 'Industrials',               icon: '🏭', description: 'Manufaktur, konstruksi sipil, transportasi, aviasi, logistik.', exampleRoles: ['Mechanical Engineer', 'Logistics Manager', 'Quality Control', 'Civil Engineer'], accentColor: '#78716c' },
  { code: 'ENERGY',      nameID: 'Energi',               nameEN: 'Energy',                    icon: '⚡', description: 'Ekstraksi minyak, gas, hingga riset energi terbarukan.', exampleRoles: ['Energy Analyst', 'Renewable Tech Specialist', 'Environmental Engineer'], accentColor: '#fbbf24' },
  { code: 'MATERIAL',    nameID: 'Material',             nameEN: 'Materials',                 icon: '⚗️', description: 'Bahan kimia, pertambangan, perhutanan.', exampleRoles: ['Chemical Engineer', 'Mining Analyst', 'Materials Scientist', 'Geologist'], accentColor: '#a16207' },
  { code: 'UTIL',        nameID: 'Utilitas',             nameEN: 'Utilities',                 icon: '💧', description: 'Pengelolaan listrik, air, dan limbah masyarakat.', exampleRoles: ['Infrastructure Engineer', 'Smart Grid Specialist', 'Environmental Consultant'], accentColor: '#06b6d4' },
  { code: 'REAL_ESTATE', nameID: 'Real Estate',          nameEN: 'Real Estate',               icon: '🏢', description: 'Pengelolaan, pengembangan, dan investasi properti.', exampleRoles: ['Property Analyst', 'PropTech Developer', 'Urban Planner', 'Real Estate Broker'], accentColor: '#8b5cf6' },
];

export function getGICSSector(code: GICSSectorCode): GICSSector {
  return GICS_SECTORS.find(s => s.code === code) ?? GICS_SECTORS[0];
}
