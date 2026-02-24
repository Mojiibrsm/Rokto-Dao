'use client';

import { useState, useEffect } from 'react';

export function FooterYear() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <p>© {currentYear ?? ''} RoktoDao. সর্বস্বত্ব সংরক্ষিত।</p>
  );
}
