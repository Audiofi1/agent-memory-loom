/**
 * Real client-side encryption for "sealed" private snapshot fields.
 *
 * Private notes are encrypted with AES-256-GCM BEFORE being written to Walrus,
 * which is a public, permissionless storage layer. Only the ciphertext + IV are
 * ever uploaded; the symmetric key is generated locally and kept by the owner
 * (persisted in the local index alongside the snapshot). Anyone who reads the
 * public blob sees only ciphertext and cannot recover the plaintext without the
 * key.
 */

const SEAL_PREFIX = "__sealed__:v1:";

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Generate a fresh AES-256-GCM key and export it as base64 (kept by the owner). */
export async function generateSealKey(): Promise<string> {
  const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
  const raw = await crypto.subtle.exportKey("raw", key);
  return bytesToBase64(new Uint8Array(raw));
}

async function importKey(keyB64: string, usage: KeyUsage): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", base64ToBytes(keyB64), { name: "AES-GCM" }, false, [usage]);
}

/**
 * Encrypt a private note with the given key. Returns a self-describing token
 * `__sealed__:v1:<ivB64>:<ciphertextB64>` safe to publish to Walrus.
 */
export async function sealPrivateNote(plaintext: string, keyB64: string): Promise<string> {
  const key = await importKey(keyB64, "encrypt");
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );
  return `${SEAL_PREFIX}${bytesToBase64(iv)}:${bytesToBase64(new Uint8Array(ct))}`;
}

export function isSealed(value: string): boolean {
  return value.startsWith(SEAL_PREFIX);
}

/** Decrypt a sealed token using the owner's key. Throws if the key is wrong. */
export async function unsealPrivateNote(token: string, keyB64: string): Promise<string> {
  if (!isSealed(token)) return token;
  const [ivB64, ctB64] = token.slice(SEAL_PREFIX.length).split(":");
  if (!ivB64 || !ctB64) throw new Error("Malformed sealed payload");
  const key = await importKey(keyB64, "decrypt");
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(ivB64) },
    key,
    base64ToBytes(ctB64),
  );
  return new TextDecoder().decode(plain);
}
