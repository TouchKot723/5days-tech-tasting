export type CheckResult = {
  url: string;
  ok: boolean;
  status: number | null;
  elapsedMs: number;
  error: string | null;
};

export type Fetcher = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export type CliOptions = { input: string; output: string };

export function parseCliArgs(args: string[]): CliOptions {
  const values = new Map<string, string>();
  for (let index = 0; index < args.length; index += 1) {
    const key = args[index];
    if (key === "--input" || key === "--output") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${key} requires a value`);
      values.set(key, value);
      index += 1;
    } else {
      throw new Error(`Unknown argument: ${key}`);
    }
  }

  const input = values.get("--input");
  const output = values.get("--output");
  if (!input || !output) throw new Error("Usage: --input <file> --output <file>");
  return { input, output };
}

export function parseResourceLines(text: string): string[] {
  return text.split(/\r?\n/).map((line) => line.trim()).filter((line) =>
    line && !line.startsWith("#")
  );
}

export async function checkResource(url: string, fetcher: Fetcher = fetch): Promise<CheckResult> {
  const startedAt = performance.now();
  try {
    new URL(url);
    const response = await fetcher(url, { redirect: "follow" });
    return {
      url,
      ok: response.ok,
      status: response.status,
      elapsedMs: Math.round(performance.now() - startedAt),
      error: response.ok ? null : `HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      url,
      ok: false,
      status: null,
      elapsedMs: Math.round(performance.now() - startedAt),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function checkResources(
  urls: string[],
  fetcher: Fetcher = fetch,
): Promise<CheckResult[]> {
  return await Promise.all(urls.map((url) => checkResource(url, fetcher)));
}
