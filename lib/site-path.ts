const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');

/** Prefix local links and public assets when hosted under a repository path. */
export function sitePath(path: string): string {
  return `${basePath}${path}`;
}
