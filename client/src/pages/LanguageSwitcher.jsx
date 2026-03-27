import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { languages } from '../utils/rtl';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, switchLanguage } = useLanguage();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <Globe size={16} style={{ color: 'var(--text-light)' }} />
      <select
        value={language}
        onChange={(e) => switchLanguage(e.target.value)}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '0.5rem',
          color: 'var(--text)',
          fontSize: '0.875rem',
          cursor: 'pointer'
        }}
      >
        {Object.entries(languages).map(([code, config]) => (
          <option key={code} value={code}>
            {config.flag} {config.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;