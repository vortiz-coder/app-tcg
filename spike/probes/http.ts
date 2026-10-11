const headers = { "User-Agent": "AppTCG-spike/0.1", Accept: "application/json" };

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getJson<T>(url: string, delayMs: number): Promise<T> {
  await sleep(delayMs);
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return (await res.json()) as T;
}

export const pct = (n: number, total: number) => Math.round((n / total) * 1000) / 10;
