'use client';

import { Chip, Icon } from '@/components/ui';
import { Video } from '@/types';
import { VideoGrid } from '@/components/watch/VideoGrid';

const CAT_BG: Record<string, string> = {
  songs: 'var(--kindi-lilac)',
  movement: 'var(--kindi-mint)',
  social: 'var(--kindi-blush)',
  math: 'var(--kindi-butter)',
  reading: 'var(--kindi-butter)',
  science: 'var(--kindi-sky)',
  stories: 'var(--kindi-butter)',
  nature: 'var(--kindi-mint)',
  geography: 'var(--kindi-mint)',
  coding: 'var(--kindi-sky)',
  space: 'var(--kindi-sky)',
  history: 'var(--kindi-blush)',
};

const TRENDING = [
  'why is the sky blue',
  'how do cats purr',
  'octopus facts',
  'easy origami',
  'volcanoes',
  'space rockets',
  'rainbow science',
];

interface BrowseScreenProps {
  search: string;
  setSearch: (s: string) => void;
  availCats: [string, string][];
  active: string[];
  setActive: React.Dispatch<React.SetStateAction<string[]>>;
  filteredVideos: Video[];
  videosPerCat: Record<string, number>;
  onSelect: (v: Video) => void;
}

export function BrowseScreen({
  search,
  setSearch,
  availCats,
  active,
  setActive,
  filteredVideos,
  videosPerCat,
  onSelect,
}: BrowseScreenProps) {
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 48px' }}>
      <h1
        className="kindi-display"
        style={{
          margin: '0 0 22px',
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: '-0.022em',
        }}
      >
        Find something <span className="squig">cool.</span>
      </h1>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          borderRadius: 14,
          background: 'var(--kindi-paper)',
          border: '1px solid var(--kindi-line-2)',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: 28,
        }}
      >
        <Icon.search size={18} color="var(--kindi-ink-soft)" />
        <input
          placeholder="Search videos, channels, topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            outline: 'none',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--kindi-ink)',
            fontFamily: 'var(--kindi-body)',
          }}
        />
      </div>

      {!search && (
        <>
          <h3 className="t-h3" style={{ marginBottom: 12 }}>
            Browse by topic
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 12,
              marginBottom: 32,
            }}
          >
            {availCats.map(([k, l]) => {
              const emoji = l.split(' ')[0];
              const label = l.split(' ').slice(1).join(' ') || l;
              const count = videosPerCat[k] || 0;
              const isActive = active.includes(k);
              return (
                <button
                  key={k}
                  onClick={() =>
                    setActive((p) =>
                      p.includes(k) ? p.filter((c) => c !== k) : [...p, k],
                    )
                  }
                  style={{
                    padding: 18,
                    borderRadius: 16,
                    background: CAT_BG[k] || 'var(--kindi-cream-2)',
                    border: isActive
                      ? '2px solid var(--kindi-ink)'
                      : '1px solid rgba(40,30,20,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    alignItems: 'flex-start',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: 'var(--shadow-xs)',
                    minHeight: 120,
                    fontFamily: 'var(--kindi-body)',
                    transition: 'all .14s',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      lineHeight: 1,
                    }}
                  >
                    {emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      className="kindi-display"
                      style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--kindi-ink-soft)',
                        marginTop: 2,
                      }}
                    >
                      {count} video{count === 1 ? '' : 's'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <h3 className="t-h3" style={{ marginBottom: 12 }}>
            Trending with kids your age
          </h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TRENDING.map((t) => (
              <Chip
                key={t}
                onClick={() => setSearch(t)}
                icon={<Icon.search size={11} color="var(--kindi-ink-soft)" />}
              >
                {t}
              </Chip>
            ))}
          </div>
        </>
      )}

      {search && (
        <section>
          <h3 className="t-h3" style={{ marginBottom: 12 }}>
            {filteredVideos.length} result{filteredVideos.length === 1 ? '' : 's'} for &ldquo;{search}&rdquo;
          </h3>
          {filteredVideos.length === 0 ? (
            <div
              className="surface"
              style={{ padding: '48px 24px', textAlign: 'center', borderRadius: 20 }}
            >
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
              <p style={{ color: 'var(--kindi-ink-soft)', fontWeight: 600 }}>
                No videos match your search
              </p>
            </div>
          ) : (
            <VideoGrid videos={filteredVideos} onSelect={onSelect} />
          )}
        </section>
      )}
    </main>
  );
}
