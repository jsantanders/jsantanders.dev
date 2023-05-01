/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Fetcher function for SWR
 * @param {string} url - URL to fetch
 * @returns {Promise<any>} Promise with the fetched data
 */
export async function fetcher(url: string): Promise<any> {
  return fetch(url).then((r) => {
    if (!r.ok) {
      throw new Error(r.statusText);
    }
    return r.json();
  });
}
