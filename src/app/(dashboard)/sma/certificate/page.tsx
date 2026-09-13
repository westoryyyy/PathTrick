'use client';

import React from 'react';

const MOCK_CERTIFICATES = [
  { id: 1, title: 'HTML Basics', issuer: 'House of Tech', date: '10 Sep 2026', type: 'SBT On-Chain' },
  { id: 2, title: 'Python Logic', issuer: 'Algorithm Core', date: '12 Sep 2026', type: 'SBT On-Chain' }
];

export default function CertificateHubPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sertifikat (Web3 Wallet)</h2>
        <p className="text-slate-500 font-medium">
          View and mint your earned on-chain certificates and Soulbound Tokens here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {MOCK_CERTIFICATES.map(cert => (
          <div key={cert.id} className="bg-white border border-slate-200/70 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-inner">
                  🏆
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight">{cert.title}</h3>
                  <p className="text-xs font-semibold text-blue-600 mt-1">{cert.issuer}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-500">Date Issued</span>
                  <span className="text-slate-800">{cert.date}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-500">Asset Type</span>
                  <span className="text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">{cert.type}</span>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs py-3 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors">
              VIEW ON EXPLORER
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
