export interface AnalysisResult {
  cluster: string;
  mood: string;
  reflection: string;
  themes: string[];
}

export interface AnalysisError {
  error: string;
}

/**
 * Calls the server-side /api/analyze route.
 * Always resolves — never throws.
 * Returns AnalysisResult on success, AnalysisError otherwise.
 */
export async function analyzeEntry(
  text: string
): Promise<AnalysisResult | AnalysisError> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'content-type': 'application/json' },
      // Send only the text — no entry id, no extra fields
      body: JSON.stringify({ text }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Surface the server error code for the UI to handle (e.g. AI_NOT_CONFIGURED)
      return { error: data?.error ?? 'AI_UPSTREAM' };
    }

    return data as AnalysisResult;
  } catch {
    return { error: 'AI_UPSTREAM' };
  } finally {
    clearTimeout(timer);
  }
}
