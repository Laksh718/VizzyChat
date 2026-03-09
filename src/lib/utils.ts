import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function truncate(str: string, maxLen = 40): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
}

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function extractImageCount(text: string): number {
  const patterns = [
    /generate\s+(\d+)\s+image/i,
    /create\s+(\d+)\s+image/i,
    /make\s+(\d+)\s+image/i,
    /show\s+(\d+)\s+image/i,
    /(\d+)\s+image/i,
    /(\d+)\s+version/i,
    /(\d+)\s+variation/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const n = parseInt(match[1], 10);
      return Math.min(Math.max(n, 1), 4);
    }
  }

  // Default to 1 for single requests, 2 for vague multiples
  if (/multiple|several|few|some/i.test(text)) return 2;
  return 1;
}

export function isImageRequest(text: string): boolean {
  const keywords = [
    'paint', 'draw', 'generate', 'create', 'make', 'design', 'show',
    'visualize', 'render', 'illustrate', 'artwork', 'image', 'picture',
    'photo', 'poster', 'visual', 'scene', 'landscape', 'portrait',
    'turn this', 'convert', 'transform', 'style', 'vision board',
  ];
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}
