'use client';

import { useEffect, useState } from 'react';
import { ChildProfile, SessionConfig, SessionDuration, RewardSettings } from '@/types';
import { SetupPage } from '@/components/setup/SetupPage';
import { WatchPage } from '@/components/watch/WatchPage';
import { storage } from '@/lib/storage';

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [kids, setKids] = useState<ChildProfile[]>([]);
  const [session, setSession] = useState<SessionConfig | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setKids(storage.getKids());
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (hydrated) storage.setKids(kids);
  }, [kids, hydrated]);

  const handleStart = (
    child: ChildProfile,
    duration: SessionDuration,
    categories: string[],
    rewards: RewardSettings,
  ) => {
    storage.setActiveKidId(child.id);
    setSession({ child, duration, categories, rewards });
  };

  const handleAddKid = (kid: ChildProfile) => {
    setKids((prev) => [...prev, kid]);
  };

  const handleEnd = () => {
    storage.setActiveKidId(null);
    setSession(null);
  };

  if (!hydrated) {
    return <div style={{ minHeight: '100vh', background: 'var(--kindi-cream)' }} />;
  }

  if (session) {
    return (
      <WatchPage
        child={session.child}
        duration={session.duration}
        categories={session.categories}
        rewards={session.rewards}
        onEnd={handleEnd}
      />
    );
  }

  return <SetupPage kids={kids} onStart={handleStart} onAdd={handleAddKid} />;
}
