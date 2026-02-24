'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip protection for login page itself
    if (pathname === '/admin/login') {
      setIsAuthorized(true);
      return;
    }

    const auth = localStorage.getItem('roktodao_admin_auth');
    if (auth === 'true') {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
      router.push('/admin/login');
    }
  }, [pathname, router]);

  if (isAuthorized === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">নিরাপত্তা যাচাই করা হচ্ছে...</p>
      </div>
    );
  }

  return <>{children}</>;
}