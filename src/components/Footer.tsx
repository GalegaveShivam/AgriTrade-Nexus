import React from 'react';
import { BRAND_LOGO_URL } from '../data/initialData';
import { useLanguage } from '../i18n';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[#f8f9fc] border-t border-gray-200 text-gray-700 text-xs py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Column 1: Brand & Institutional Overview */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <img
              src={BRAND_LOGO_URL}
              alt="AgriTrade Nexus Logo"
              className="h-8 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="font-headline text-[17px] font-bold text-[#131b2e] leading-none">
                {t('appName', 'AgriTrade Nexus')}
              </span>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-[11px]">
            {t(
              'footerDesc',
              'An institutional digital terminal bridging certified Farmer Producer Organizations (FPOs) and institutional agricultural buyers. Engineered for transparency, assaying precision, and guaranteed escrow settlement.'
            )}
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#e8f5e9] border border-[#c8e6c9] text-[#1b5e20] text-[11px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>{t('footerGovtAligned', 'GOVT. FRAMEWORK ALIGNED')}</span>
          </div>
        </div>

        {/* Column 2: Interoperability & Standards */}
        <div className="space-y-3">
          <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-gray-900">
            {t('footerInteroperability', 'INTEROPERABILITY & STANDARDS')}
          </h4>
          <p className="text-gray-600 leading-relaxed text-[11px]">
            {t(
              'footerInteroperabilityDesc',
              'Fully aligned with e-NAM (National Agriculture Market) and state APMC model frameworks for seamless interstate digital mandi transit, unified trade licensing, and certified weighing protocol validation.'
            )}
          </p>
          <ul className="space-y-1.5 text-[11px] font-medium text-gray-800">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              <span>{t('footerApmc', 'APMC Model Act Harmonized')}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              <span>{t('footerAgmark', 'AGMARK Assaying Protocols')}</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              <span>{t('footerEnwr', 'Electronic Negotiable Warehouse Receipts (e-NWR)')}</span>
            </li>
          </ul>
        </div>

        {/* Column 3: FPO Verification & Network */}
        <div className="space-y-3">
          <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-gray-900">
            {t('footerFpoNetwork', 'FPO VERIFICATION & NETWORK')}
          </h4>
          <p className="text-gray-600 leading-relaxed text-[11px]">
            {t(
              'footerFpoNetworkDesc',
              'Over 850+ verified FPOs onboarded across Punjab, Haryana, Madhya Pradesh, and Maharashtra. Cluster logistics points audited quarterly for cold storage and moisture containment.'
            )}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1 rounded bg-white border border-gray-300 text-gray-700 text-[10px] font-bold">
              SFAC Registered
            </span>
            <span className="px-2.5 py-1 rounded bg-white border border-gray-300 text-gray-700 text-[10px] font-bold">
              NABARD Supported
            </span>
          </div>
        </div>

        {/* Column 4: Grievance Redressal */}
        <div className="space-y-3">
          <h4 className="font-headline text-xs font-bold uppercase tracking-wider text-gray-900">
            {t('footerGrievance', 'GRIEVANCE REDRESSAL')}
          </h4>
          <p className="text-gray-600 text-[11px]">
            {t('footerDisputeDesk', 'Toll-Free Commodity Dispute Desk (Mon - Sat, 06:00 - 20:00 IST):')}
          </p>
          <p className="font-mono text-sm font-bold text-[#063b28]">
            1800-419-AGRI (2474)
          </p>
          <div className="text-[11px] text-gray-600 space-y-1">
            <p>Email: <span className="text-blue-700 font-mono">{t('footerDisputeEmail', 'dispute-officer@agritradenexus.gov.in')}</span></p>
            <p>{t('footerArbitration', 'Arbitration Cell: Krishi Bhawan Annex, New Delhi')}</p>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Hackathon Bar */}
      <div className="max-w-[1400px] mx-auto mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px] tracking-wider uppercase">
            SIH PROTOTYPE
          </span>
          <span>
            Smart India Hackathon Demonstration Architecture • Built for Open Agricultural Commerce Innovation
          </span>
        </div>
        <div>
          © 2025 AgriTrade Nexus. {t('footerCopyright', 'All rights reserved.')}
        </div>
      </div>
    </footer>
  );
};
