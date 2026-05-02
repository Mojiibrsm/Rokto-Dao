'use client';

import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

/**
 * @fileOverview Manages the real-time presence status of the logged-in user.
 */
export function PresenceManager() {
  const firestore = useFirestore();

  useEffect(() => {
    const savedUser = localStorage.getItem('roktodao_user');
    if (!savedUser || !firestore) return;

    try {
      const user = JSON.parse(savedUser);
      const phone = user.phone;
      if (!phone) return;

      const presenceRef = doc(firestore, 'presence', phone);

      const updatePresence = (status: 'online' | 'offline') => {
        setDoc(presenceRef, {
          status,
          lastSeen: serverTimestamp(),
          fullName: user.fullName,
        }, { merge: true });
      };

      // Set online on mount
      updatePresence('online');

      // Update on visibility change (tab active/inactive)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          updatePresence('online');
        } else {
          updatePresence('offline');
        }
      };

      // Set offline on tab close
      const handleBeforeUnload = () => {
        updatePresence('offline');
      };

      window.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        updatePresence('offline');
        window.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    } catch (e) {
      console.error('Presence error:', e);
    }
  }, [firestore]);

  return null;
}
