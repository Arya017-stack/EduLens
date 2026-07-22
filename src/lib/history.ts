// Lightweight client-side history of completed diagnostics, used to
// populate the dashboard. No backend required — persisted to localStorage.

export interface DiagnosticRecord {
  id: string;
  topic: string;
  subject: string;
  grade: string;
  overall_score: number;
  mastery_level: string;
  date: string; // ISO string
}

const STORAGE_KEY = "edulens.history.v1";

export function loadHistory(): DiagnosticRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecord(record: DiagnosticRecord): DiagnosticRecord[] {
  const current = loadHistory();
  const updated = [record, ...current].slice(0, 25);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage unavailable — fail silently, dashboard just won't persist
    }
  }
  return updated;
}

export interface HistoryStats {
  topicsStudied: number;
  averageScore: number | null;
  bestSubject: string | null;
  lastSessionDate: string | null;
}

export function computeStats(history: DiagnosticRecord[]): HistoryStats {
  if (history.length === 0) {
    return { topicsStudied: 0, averageScore: null, bestSubject: null, lastSessionDate: null };
  }

  const uniqueTopics = new Set(history.map((r) => r.topic));
  const averageScore = Math.round(
    history.reduce((sum, r) => sum + r.overall_score, 0) / history.length
  );

  const bySubject = new Map<string, number[]>();
  for (const r of history) {
    const scores = bySubject.get(r.subject) ?? [];
    scores.push(r.overall_score);
    bySubject.set(r.subject, scores);
  }
  let bestSubject: string | null = null;
  let bestAvg = -1;
  for (const [subject, scores] of bySubject) {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestSubject = subject;
    }
  }

  return {
    topicsStudied: uniqueTopics.size,
    averageScore,
    bestSubject,
    lastSessionDate: history[0].date,
  };
}