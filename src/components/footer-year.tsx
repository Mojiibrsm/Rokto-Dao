'use client';

import { useState, useEffect } from 'react';

export function FooterYear() {
  const [currentYear, setCurrentYear] = useState<string>('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  if (!currentYear) {
    return <p>© .... RoktoDao. সর্বস্বত্ব সংরক্ষিত।</p>;
  }

  return (
    <p>© {currentYear} RoktoDao. সর্বস্বত্ব সংরক্ষিত।</p>
  );
}