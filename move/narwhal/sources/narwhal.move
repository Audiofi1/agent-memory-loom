/// Narwhal — verifiable memory layer for autonomous AI agents.
///
/// On-chain anchor for:
///   - AgentIdentity : a permanent, wallet-owned identity for an agent.
///   - MemoryPool    : a shareable pool with an explicit reader allowlist.
///   - Snapshot anchor events that bind a Walrus blob id + content hash on-chain.
///   - Access log events so any human/agent can audit who read what, and when.
///
/// Design notes:
///   - Identities and pools are Sui objects owned by the creator's address.
///   - Reads/authorizations/anchors emit events; an off-chain indexer
///     (Lovable Cloud) mirrors them for fast querying and the audit UI.
module narwhal::narwhal;

use std::string::String;
use sui::event;
use sui::clock::{Self, Clock};
use sui::vec_set::{Self, VecSet};

// ------------------------------------------------------------------
// Errors
// ------------------------------------------------------------------
const ENotPoolOwner: u64 = 0;
const ENotAuthorized: u64 = 1;

// ------------------------------------------------------------------
// Objects
// ------------------------------------------------------------------

/// A permanent identity for an AI agent, owned by the wallet that registered it.
public struct AgentIdentity has key, store {
    id: UID,
    owner: address,
    name: String,
    /// Free-form role/description, e.g. "trading-bot", "research-assistant".
    kind: String,
    created_at_ms: u64,
    snapshot_count: u64,
}

/// A pool of shared memory with an explicit allowlist of reader addresses.
public struct MemoryPool has key, store {
    id: UID,
    owner: address,
    agent: ID,
    name: String,
    readers: VecSet<address>,
    snapshot_count: u64,
}

// ------------------------------------------------------------------
// Events (mirrored off-chain by the indexer)
// ------------------------------------------------------------------

public struct AgentRegistered has copy, drop {
    agent: ID,
    owner: address,
    name: String,
    kind: String,
    at_ms: u64,
}

public struct PoolCreated has copy, drop {
    pool: ID,
    agent: ID,
    owner: address,
    name: String,
}

public struct ReaderAuthorized has copy, drop {
    pool: ID,
    reader: address,
    by: address,
}

public struct ReaderRevoked has copy, drop {
    pool: ID,
    reader: address,
    by: address,
}

/// Emitted when a memory snapshot is anchored. Binds the Walrus blob id
/// and the sha-256 content hash so anyone can verify tamper-resistance.
public struct SnapshotAnchored has copy, drop {
    agent: ID,
    pool: ID,
    /// Walrus blob id (base64url string).
    blob_id: String,
    /// Hex sha-256 of the snapshot bytes stored on Walrus.
    content_hash: String,
    /// True when one or more fields were Seal-encrypted before storage.
    has_private: bool,
    at_ms: u64,
}

/// Emitted whenever an authorized reader accesses a pool snapshot.
public struct AccessLogged has copy, drop {
    pool: ID,
    reader: address,
    blob_id: String,
    at_ms: u64,
}

// ------------------------------------------------------------------
// Entry functions
// ------------------------------------------------------------------

/// Register a new agent identity. The object is transferred to the caller.
public entry fun register_agent(
    name: String,
    kind: String,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let sender = ctx.sender();
    let at_ms = clock::timestamp_ms(clock);
    let agent = AgentIdentity {
        id: object::new(ctx),
        owner: sender,
        name,
        kind,
        created_at_ms: at_ms,
        snapshot_count: 0,
    };
    event::emit(AgentRegistered {
        agent: object::id(&agent),
        owner: sender,
        name: agent.name,
        kind: agent.kind,
        at_ms,
    });
    transfer::transfer(agent, sender);
}

/// Create a shared memory pool tied to an agent. Owned by the caller.
public entry fun create_memory_pool(
    agent: &AgentIdentity,
    name: String,
    ctx: &mut TxContext,
) {
    let sender = ctx.sender();
    let pool = MemoryPool {
        id: object::new(ctx),
        owner: sender,
        agent: object::id(agent),
        name,
        readers: vec_set::empty(),
        snapshot_count: 0,
    };
    event::emit(PoolCreated {
        pool: object::id(&pool),
        agent: object::id(agent),
        owner: sender,
        name: pool.name,
    });
    transfer::transfer(pool, sender);
}

/// Grant a reader address access to a pool.
public entry fun authorize_reader(
    pool: &mut MemoryPool,
    reader: address,
    ctx: &TxContext,
) {
    assert!(pool.owner == ctx.sender(), ENotPoolOwner);
    if (!pool.readers.contains(&reader)) {
        pool.readers.insert(reader);
    };
    event::emit(ReaderAuthorized { pool: object::id(pool), reader, by: ctx.sender() });
}

/// Revoke a reader's access to a pool.
public entry fun revoke_reader(
    pool: &mut MemoryPool,
    reader: address,
    ctx: &TxContext,
) {
    assert!(pool.owner == ctx.sender(), ENotPoolOwner);
    if (pool.readers.contains(&reader)) {
        pool.readers.remove(&reader);
    };
    event::emit(ReaderRevoked { pool: object::id(pool), reader, by: ctx.sender() });
}

/// Anchor a memory snapshot: binds the Walrus blob id + content hash on-chain.
public entry fun anchor_snapshot(
    agent: &mut AgentIdentity,
    pool: &mut MemoryPool,
    blob_id: String,
    content_hash: String,
    has_private: bool,
    clock: &Clock,
    ctx: &TxContext,
) {
    assert!(agent.owner == ctx.sender(), ENotAuthorized);
    assert!(pool.owner == ctx.sender(), ENotPoolOwner);
    agent.snapshot_count = agent.snapshot_count + 1;
    pool.snapshot_count = pool.snapshot_count + 1;
    event::emit(SnapshotAnchored {
        agent: object::id(agent),
        pool: object::id(pool),
        blob_id,
        content_hash,
        has_private,
        at_ms: clock::timestamp_ms(clock),
    });
}

/// Log an access by an authorized reader (caller must be on the allowlist
/// or be the pool owner).
public entry fun log_access(
    pool: &MemoryPool,
    blob_id: String,
    clock: &Clock,
    ctx: &TxContext,
) {
    let reader = ctx.sender();
    assert!(pool.owner == reader || pool.readers.contains(&reader), ENotAuthorized);
    event::emit(AccessLogged {
        pool: object::id(pool),
        reader,
        blob_id,
        at_ms: clock::timestamp_ms(clock),
    });
}
