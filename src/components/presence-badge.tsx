'use client';

import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';

/**
 * @fileOverview UI Component to show real-time status of a donor.
 */
export function PresenceBadge({ phone, showLastSeen = false }: { phone: string; showLastSeen?: boolean }) {
  const firestore = useFirestore();
  const presenceDocRef = firestore ? doc(firestore, 'presence', phone) : null;
  const { data: presence, loading } = useDoc(presenceDocRef);

  if (loading || !presence) {
    return (
      <div className="flex items-center gap-2 animate-pulse opacity-50">
        <div className="h-2.5 w-2.5 rounded-full bg-slate-300"></div>
        <div className="h-2 w-12 bg-slate-200 rounded"></div>
      </div>
    );
  }

  const isOnline = presence.status === 'online';

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <div className="relative flex h-2.5 w-2.5">
          {isOnline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`}></span>
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-green-600' : 'text-slate-500'}`}>
          {isOnline ? 'Active Now' : 'Offline'}
        </span>
      </div>
      {showLastSeen && !isOnline && presence.lastSeen && (
        <span className="text-[9px] text-muted-foreground font-bold italic ml-4.5">
          শেষ সক্রিয়: {formatDistanceToNow(new Date(presence.lastSeen.toDate()), { addSuffix: true, locale: bn })}
        </span>
      )}
    </div>
  );
}
