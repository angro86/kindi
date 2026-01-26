'use client';

import { useState } from 'react';
import { ChildProfile, SessionConfig, SessionDuration, RewardSettings } from '@/types';
import { SetupPage } from '@/components/setup/SetupPage';
import { WatchPage } from '@/components/watch/WatchPage';

export default function Home() {
  const [kids, setKids] = useState<ChildProfile[]>([
    { id: 1, name: 'Nico', age: 5, avatar: 0 },
    { id: 2, name: 'Adri', age: 3, avatar: 1 },
  ]);
  const [session, setSession] = useState<SessionConfig | null>(null);

  const handleStart = (
    child: ChildProfile,
    duration: SessionDuration,
    categories: string[],
    rewards: RewardSettings
  ) => {
    setSession({ child, duration, categories, rewards });
  };

  const handleAddKid = (kid: ChildProfile) => {
    setKids([...kids, kid]);
  };

  if (session) {
    return (
      <WatchPage
        child={session.child}
        duration={session.duration}
        categories={session.categories}
        rewards={session.rewards}
        onEnd={() => setSession(null)}
      />
    );
  }

  return <SetupPage kids={kids} onStart={handleStart} onAdd={handleAddKid} />;
}
