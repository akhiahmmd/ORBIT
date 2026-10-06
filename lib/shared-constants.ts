export const MOODS = ['Happy', 'Calm', 'Productive', 'Anxious', 'Sad', 'Reflective'] as const;
export type Mood = typeof MOODS[number];

export const CLUSTERS = [
  { id: 'study', name: 'STUDY', color: '#4488ff', position: [-5, 0, -5] },
  { id: 'productivity', name: 'PRODUCTIVITY', color: '#ff8844', position: [6, -2, 3] },
  { id: 'stress', name: 'STRESS', color: '#ff4466', position: [-3, 5, 5] },
  { id: 'goals', name: 'GOALS', color: '#aa44ff', position: [4, 3, -4] },
  { id: 'reflection', name: 'REFLECTION', color: '#44ccaa', position: [0, -5, -3] },
  { id: 'social', name: 'SOCIAL', color: '#ffcc44', position: [7, 2, 0] },
];

export function getClusterForMood(mood: Mood | string): string {
  switch (mood) {
    case 'Happy': return 'social';
    case 'Calm': return 'reflection';
    case 'Productive': return 'productivity';
    case 'Anxious': return 'stress';
    case 'Sad': return 'reflection';
    case 'Reflective': return 'reflection';
    default: return 'study';
  }
}

export function formatDate(dateStr: string | Date): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
