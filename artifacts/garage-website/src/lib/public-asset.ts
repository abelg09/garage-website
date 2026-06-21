const absoluteUrlPattern = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

export function publicAsset(path: string): string {
  if (!path || absoluteUrlPattern.test(path)) return path;

  const env = (import.meta as ImportMeta & { env?: { BASE_URL?: string } }).env;
  const base = env?.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;

  if (path.startsWith(normalizedBase)) return path;

  return `${normalizedBase}${path.replace(/^\/+/, "")}`;
}
