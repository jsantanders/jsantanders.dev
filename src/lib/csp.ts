/**
 * Create a CSP string for the Content-Security-Policy header
 * @param {string} nonce - Nonce for the script-src directive
 * @returns {string} Content-Security-Policy header
 */
export const createCSP = (nonce: string): string => {
  return `script-src 'strict-dynamic' 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' http: https:;`;
};
