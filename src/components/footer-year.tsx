'use client';

import { useState, useEffect } from 'react';

export function FooterYear() {
  const [currentYear, setCurrentYear] = useState<string>('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <p>© {currentYear} RoktoDao. সর্বস্বত্ব সংরক্ষিত।</p>
  );
}
