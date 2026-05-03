'use client';

import { useI18n } from '@/lib/i18n-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
      className="rounded-full font-black text-[12px] gap-2 hover:bg-primary/5 text-primary border border-primary/10 px-3 h-9"
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
    </Button>
  );
}
