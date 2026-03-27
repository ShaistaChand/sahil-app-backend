// client/src/components/auth/CountrySelector.jsx
import React from 'react';
import { useAuthStore } from '../../stores/authStore';

const CountrySelector = () => {
  const user = useAuthStore((s) => s.user);
  const updateUserCountry = useAuthStore((s) => s.updateUserCountry);

  const handleCountryChange = async (country) => {
    await updateUserCountry(country);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
        Select Your Country *
      </label>
      <select
        value={user?.country || 'UAE'}
        onChange={(e) => handleCountryChange(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          background: 'var(--surface)',
          fontSize: '0.875rem'
        }}
      >
        <option value="UAE">UAE</option>
        <option value="India">India</option>
      </select>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
        Pricing and features may vary by country
      </div>
    </div>
  );
};

export default CountrySelector;
