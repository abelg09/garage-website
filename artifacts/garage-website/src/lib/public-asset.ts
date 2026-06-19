const absoluteUrlPattern = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

export function publicAsset(path: string): string {
  if (!path || absoluteUrlPattern.test(path)) return path;

  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;

  if (path.startsWith(normalizedBase)) return path;

  return `${normalizedBase}${path.replace(/^\/+/, "")}`;
}
