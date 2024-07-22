export async function fetcher<T>(url: string): Promise<T> {
  return fetch(url).then((r) => {
    if (!r.ok) {
      throw new Error(r.statusText);
    }
    return r.json() as T;
  });
}
