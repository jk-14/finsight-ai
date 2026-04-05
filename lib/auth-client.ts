/**
 * Client-side auth utilities.
 * All authenticated fetch calls should go through `fetchWithAuth` so that
 * missing/null tokens are caught in one place instead of scattered call sites.
 */

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function fetchWithAuth(url: string, options?: RequestInit): Promise<Response> {
  const token = getToken();

  if (!token) {
    return Promise.reject(new Error("No auth token found"));
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

export function fetchWithAuthJson<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  return fetchWithAuth(url, options).then((r) => r.json() as Promise<T>);
}
