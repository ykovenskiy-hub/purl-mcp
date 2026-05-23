/**
 * Purl file types - subset needed for MCP tools
 * Full spec: https://knowledge.purl.studio/fileformat.html
 */
// Type guards
export function isComponent(obj) {
    return 'children' in obj && Array.isArray(obj.children);
}
export function isPrime(obj) {
    return 'primeType' in obj;
}
