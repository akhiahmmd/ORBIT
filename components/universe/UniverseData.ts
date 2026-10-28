import { MOODS, Mood, getClusterForMood, CLUSTERS } from '../../lib/shared-constants';

export interface MemoryEntry {
  id: string;
  date: string;
  title: string;
  excerpt: string;
  mood: string;
  tags: string[];
  position: [number, number, number]; // 3D space coordinates
  clusterId?: string;
  opacity?: number;
  isDemo?: boolean;
}

export const SAMPLE_MEMORIES: MemoryEntry[] = [
  // Cluster 1: Work & Focus (Right, warm colors)
  {
    id: 'mem-2',
    date: '2026-09-18', // This month, but not this week
    title: 'Project Milestone',
    excerpt: 'Finally cracked the algorithm for the new feature! It took three days of intense debugging but the rush of solving it was incredible.',
    mood: 'Focused',
    tags: ['Work', 'Coding', 'Success'],
    position: [4, 1, -2], 
    clusterId: 'work'
  },
  {
    id: 'mem-6',
    date: '2026-08-10', // Last month!
    title: 'Reading Session',
    excerpt: 'Finished the sci-fi novel. The ending was mind-bending. I love how good books can completely transport you to another reality.',
    mood: 'Focused',
    tags: ['Reading', 'Sci-Fi', 'Relaxation'],
    position: [4.5, 0.5, -1.5],
    clusterId: 'work'
  },
  {
    id: 'mem-8',
    date: '2026-09-25', // Today (This week)
    title: 'Sunday Preparation',
    excerpt: 'Prepping meals and planning the week ahead. Trying to build better systems so I don\'t rely purely on motivation.',
    mood: 'Calm',
    tags: ['Planning', 'Habits', 'Sunday'],
    position: [3.5, 1.5, -2.5],
    clusterId: 'work'
  },

  // Cluster 2: Personal & Reflective (Center-Left, cool colors)
  {
    id: 'mem-1',
    date: '2026-09-22', // This week
    title: 'Morning Clarity',
    excerpt: 'Woke up early and watched the sunrise. The house was so quiet. Felt a deep sense of peace that has been missing lately.',
    mood: 'Calm',
    tags: ['Morning', 'Peace', 'Mindfulness'],
    position: [-2, 0.5, 1],
    clusterId: 'personal'
  },
  {
    id: 'mem-4',
    date: '2026-07-22', // Months ago!
    title: 'Late Night Doubts',
    excerpt: 'Can\'t sleep. Keep wondering if I\'m on the right path. Need to remind myself that uncertainty is part of the process.',
    mood: 'Anxious',
    tags: ['Late Night', 'Thoughts', 'Career'],
    position: [-2.5, -0.5, 1.5],
    clusterId: 'personal'
  },
  {
    id: 'mem-5',
    date: '2026-09-15', // This month
    title: 'Autumn Walk',
    excerpt: 'The leaves are starting to turn. Took a long walk through the park without my phone. The crisp air really helped clear my head.',
    mood: 'Reflective',
    tags: ['Nature', 'Walking', 'Disconnect'],
    position: [-1.5, 1.5, 0.5],
    clusterId: 'personal'
  },

  // Cluster 3: Social & Joy (Top, bright colors)
  {
    id: 'mem-3',
    date: '2026-09-20', // This week
    title: 'Coffee with Sarah',
    excerpt: 'We talked for hours about the future. It’s comforting to know someone else is also figuring things out as they go.',
    mood: 'Joyful',
    tags: ['Social', 'Friendship', 'Future'],
    position: [0.5, 3.5, -1],
    clusterId: 'social'
  },
  {
    id: 'mem-7',
    date: '2026-05-12', // Much older
    title: 'Unexpected Rain',
    excerpt: 'Got caught in a massive downpour on the way home. Instead of being annoyed, I just laughed. Sometimes you just have to let go of control.',
    mood: 'Joyful',
    tags: ['Weather', 'Letting Go', 'Spontaneous'],
    position: [-0.5, 4.0, -0.5],
    clusterId: 'social'
  }
];

export const FILTER_OPTIONS = {
  time: ['All Time', 'This Month', 'This Week'],
  mood: ['All Moods', ...MOODS]
};

export function loadUniverseMemories(): { memories: MemoryEntry[]; isDemoOnly: boolean } {
  if (typeof window === 'undefined') {
    return { memories: SAMPLE_MEMORIES, isDemoOnly: true };
  }

  let rawEntries: any[] = [];
  try {
    const saved = localStorage.getItem('orbit_journal_entries_v2');
    if (saved) {
      rawEntries = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse orbit_journal_entries_v2', e);
  }

  const validEntries = Array.isArray(rawEntries)
    ? rawEntries.filter(e => e && typeof e === 'object' && (e.text || e.title))
    : [];

  if (validEntries.length === 0) {
    return { memories: SAMPLE_MEMORIES, isDemoOnly: true };
  }

  const realMemories: MemoryEntry[] = validEntries.map((entry, idx) => {
    const aiCluster = entry.analysis?.cluster?.toLowerCase?.();
    const clusterId =
      aiCluster && CLUSTERS.some((c) => c.id === aiCluster)
        ? aiCluster
        : getClusterForMood(entry.mood as Mood);

    const cluster = CLUSTERS.find(c => c.id === clusterId) || CLUSTERS[0];
    const basePos = cluster.position;

    const hash = (entry.id || String(idx))
      .split('')
      .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const radius = 0.8 + pseudoRandom(hash) * 1.6;
    const theta = pseudoRandom(hash + 1) * Math.PI * 2;
    const phi = Math.acos(2 * pseudoRandom(hash + 2) - 1);
    const x = basePos[0] + radius * Math.sin(phi) * Math.cos(theta);
    const y = basePos[1] + radius * Math.sin(phi) * Math.sin(theta);
    const z = basePos[2] + radius * Math.cos(phi);

    const title = entry.title?.trim() || 
      (entry.text ? (entry.text.length > 25 ? entry.text.slice(0, 25) + '…' : entry.text) : 'Moment');

    const tags = Array.isArray(entry.analysis?.themes) && entry.analysis.themes.length > 0
      ? entry.analysis.themes
      : [entry.mood || 'Reflection'];

    return {
      id: entry.id || `entry-${idx}`,
      date: entry.date || new Date().toISOString(),
      title,
      excerpt: entry.text || '',
      mood: entry.mood || 'Reflective',
      tags,
      position: [x, y, z],
      clusterId,
      opacity: 1.0,
      isDemo: false,
    };
  });

  const demoMemories: MemoryEntry[] = SAMPLE_MEMORIES.map(demo => ({
    ...demo,
    opacity: 0.4,
    isDemo: true,
  }));

  return {
    memories: [...realMemories, ...demoMemories],
    isDemoOnly: false,
  };
}
