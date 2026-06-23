/**
 * Lightweight local index for the Tusk dashboard.
 *
 * This mirrors the on-chain / Walrus records so the audit layer stays fast and
 * queryable in the browser. Scoped per connected wallet address. When the Move
 * contract + Lovable Cloud are wired in, this is the layer that gets replaced.
 */

export type Agent = {
  id: string;
  owner: string;
  name: string;
  purpose: string;
  onChainId?: string; // Sui object id of the AgentIdentity (when deployed)
  txDigest?: string;
  createdAt: number;
};

export type Snapshot = {
  id: string;
  agentId: string;
  owner: string;
  title: string;
  decision: string;
  reasoning: string;
  privateNote?: string; // "encrypted" field
  isPrivate: boolean;
  blobId: string;
  hash: string;
  endEpoch?: number;
  txDigest?: string; // on-chain anchor digest (when anchored)
  createdAt: number;
};

export type Pool = {
  id: string;
  owner: string;
  ownerAgentId: string;
  name: string;
  description: string;
  readers: string[]; // authorized agent ids
  onChainId?: string; // Sui object id of the MemoryPool (when deployed)
  createdAt: number;
};

export type AccessEvent = {
  id: string;
  poolId: string;
  poolName: string;
  readerAgentId: string;
  action: "query" | "authorize" | "revoke" | "verify";
  detail: string;
  at: number;
};

type DB = {
  agents: Agent[];
  snapshots: Snapshot[];
  pools: Pool[];
  access: AccessEvent[];
};

const KEY = "tusk.index.v1";
const empty: DB = { agents: [], snapshots: [], pools: [], access: [] };

function read(): DB {
  if (typeof window === "undefined") return { ...empty };
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : { ...empty };
  } catch {
    return { ...empty };
  }
}

function write(db: DB) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(db));
  window.dispatchEvent(new Event("tusk:update"));
}

export const uid = () =>
  `0x${crypto.getRandomValues(new Uint8Array(16)).reduce((s, b) => s + b.toString(16).padStart(2, "0"), "")}`;

export const db = {
  all: read,
  agents: (owner: string) => read().agents.filter((a) => a.owner === owner),
  agent: (id: string) => read().agents.find((a) => a.id === id),
  snapshots: (agentId: string) =>
    read()
      .snapshots.filter((s) => s.agentId === agentId)
      .sort((a, b) => b.createdAt - a.createdAt),
  snapshot: (id: string) => read().snapshots.find((s) => s.id === id),
  pools: (owner: string) => read().pools.filter((p) => p.owner === owner),
  access: (owner: string) => {
    const d = read();
    const myPools = new Set(d.pools.filter((p) => p.owner === owner).map((p) => p.id));
    return d.access.filter((e) => myPools.has(e.poolId)).sort((a, b) => b.at - a.at);
  },

  addAgent(a: Omit<Agent, "id" | "createdAt">) {
    const d = read();
    const agent: Agent = { ...a, id: uid(), createdAt: Date.now() };
    d.agents.push(agent);
    write(d);
    return agent;
  },
  addSnapshot(s: Omit<Snapshot, "id" | "createdAt">) {
    const d = read();
    const snap: Snapshot = { ...s, id: uid(), createdAt: Date.now() };
    d.snapshots.push(snap);
    write(d);
    return snap;
  },
  addPool(p: Omit<Pool, "id" | "createdAt" | "readers">) {
    const d = read();
    const pool: Pool = { ...p, readers: [], id: uid(), createdAt: Date.now() };
    d.pools.push(pool);
    write(d);
    return pool;
  },
  setReader(poolId: string, agentId: string, authorize: boolean) {
    const d = read();
    const pool = d.pools.find((p) => p.id === poolId);
    if (!pool) return;
    pool.readers = authorize
      ? Array.from(new Set([...pool.readers, agentId]))
      : pool.readers.filter((r) => r !== agentId);
    d.access.push({
      id: uid(),
      poolId,
      poolName: pool.name,
      readerAgentId: agentId,
      action: authorize ? "authorize" : "revoke",
      detail: authorize ? "Reader authorized" : "Reader access revoked",
      at: Date.now(),
    });
    write(d);
  },
  logAccess(e: Omit<AccessEvent, "id" | "at">) {
    const d = read();
    d.access.push({ ...e, id: uid(), at: Date.now() });
    write(d);
  },
};
