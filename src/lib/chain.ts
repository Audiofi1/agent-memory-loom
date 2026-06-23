import { NARWHAL_PACKAGE_ID } from "./sui-config";

/**
 * The Narwhal package id can be set two ways:
 *   1. Hard-coded in sui-config.ts (NARWHAL_PACKAGE_ID), or
 *   2. Published live from the dashboard via the connected wallet, in which
 *      case we persist the resulting package id in localStorage.
 * The localStorage value always wins so a fresh deploy takes effect instantly.
 */
const PKG_KEY = "narwhal.packageId.v1";

export function getPackageId(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(PKG_KEY);
    if (stored && stored.startsWith("0x")) return stored;
  }
  return NARWHAL_PACKAGE_ID;
}

export function setPackageId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PKG_KEY, id);
  window.dispatchEvent(new Event("tusk:update"));
}

export function clearPackageId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PKG_KEY);
  window.dispatchEvent(new Event("tusk:update"));
}

export function isDeployed(): boolean {
  return getPackageId().startsWith("0x") && getPackageId().length > 3;
}

/** Pull the published package id out of a transaction's object changes. */
export function findPublishedPackageId(objectChanges: any[] | null | undefined): string | null {
  if (!objectChanges) return null;
  const published = objectChanges.find((c) => c.type === "published");
  return published?.packageId ?? null;
}

/** Find the first created object whose type matches the given suffix (e.g. "::narwhal::AgentIdentity"). */
export function findCreatedObjectId(
  objectChanges: any[] | null | undefined,
  typeSuffix: string,
): string | null {
  if (!objectChanges) return null;
  const created = objectChanges.find(
    (c) => c.type === "created" && typeof c.objectType === "string" && c.objectType.includes(typeSuffix),
  );
  return created?.objectId ?? null;
}
