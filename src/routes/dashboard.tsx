import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "@/lib/useSession";
import { toast } from "sonner";
import {
  Bot,
  Plus,
  Lock,
  Unlock,
  ShieldCheck,
  Loader2,
  Database,
  Share2,
  ScrollText,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  KeyRound,
  Rocket,
  FileCode2,
  Copy,
  Check,
  Network,
  type LucideIcon,
} from "lucide-react";

import { Logo } from "@/components/landing/Navbar";
import { WalletButton } from "@/components/landing/WalletButton";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { db, type Agent, type Snapshot } from "@/lib/store";
import { useTuskSync } from "@/lib/useTusk";
import { storeBlob, readBlob, walrusBlobUrl, sha256Hex } from "@/lib/walrus";
import { generateSealKey, sealPrivateNote, unsealPrivateNote } from "@/lib/seal";
import {
  SUI_EXPLORER,
  WALRUS_PUBLISHER,
  WALRUS_AGGREGATOR,
  NARWHAL_MODULE,
} from "@/lib/sui-config";
import { getPackageId, isDeployed, explorer } from "@/lib/chain";
import { useNarwhal } from "@/lib/useNarwhal";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/components/providers/ThemeProvider";

/** Extract a human-readable, actionable message from an unknown thrown value. */
function errorMessage(e: unknown): string | undefined {
  const raw = e instanceof Error ? e.message : typeof e === "string" ? e : undefined;
  if (!raw) return undefined;
  const lower = raw.toLowerCase();
  if (lower.includes("reject") || lower.includes("denied") || lower.includes("cancel"))
    return "You rejected the transaction in your wallet.";
  if (lower.includes("insufficient") || lower.includes("no valid gas") || lower.includes("gas"))
    return "Your wallet doesn't have enough testnet SUI for gas. Get free coins at https://faucet.sui.io and try again.";
  if (lower.includes("no wallet") || lower.includes("not connected"))
    return "Connect your Sui wallet first.";
  return raw;
}


export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  useTuskSync();
  const { account, isInitializing } = useSession();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster theme={theme} position="top-right" />
      <Topbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-28">
        {isInitializing ? (
          <SessionSpinner message="Restoring your session…" />
        ) : !account ? (
          <ConnectGate />
        ) : (
          <Workspace owner={account.address} />
        )}
      </main>
    </div>
  );
}

function SessionSpinner({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
      <p className="mt-4 max-w-md text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

function Topbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-foreground">
            <Logo />
          </Link>
          <span className="hidden items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Sui Testnet · Walrus
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}

function ConnectGate() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="aurora-glow pointer-events-none absolute inset-0 -z-10 opacity-30" />
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card">
        <KeyRound className="h-7 w-7 text-teal" />
      </div>
      <h1 className="mt-6 text-3xl font-bold">Connect your Sui wallet</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Narwhal uses your wallet as your agents' on-chain identity. Connect a Sui testnet wallet to
        register agents and write verifiable memory.
      </p>
      <div className="mt-8">
        <WalletButton redirectOnConnect />
      </div>
    </div>
  );
}

function Workspace({ owner }: { owner: string }) {
  const agents = db.agents(owner);
  const pools = db.pools(owner);
  const access = db.access(owner);
  const snapshotCount = agents.reduce((n, a) => n + db.snapshots(a.id).length, 0);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(agents[0]?.id ?? null);
  const [tab, setTab] = useState("agents");

  const stats = [
    { label: "Agents", value: agents.length, icon: Bot },
    { label: "Memory snapshots", value: snapshotCount, icon: Database },
    { label: "Shared pools", value: pools.length, icon: Share2 },
    { label: "Access events", value: access.length, icon: ScrollText },
  ];

  return (
    <div className="flex flex-col">
      <div className="mb-12">
        <h1 className="text-4xl font-light tracking-tight">Memory Console</h1>
        <p className="mt-2 font-light text-muted-foreground max-w-2xl">
          Give your agents a permanent, verifiable memory — then share it securely across networks
          under explicit cryptographic access rules.
        </p>
      </div>

      <DeployCard />

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/40 p-6 backdrop-blur-3xl shadow-xl shadow-black/5 transition-all hover:border-primary/40"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-light text-muted-foreground tracking-wide">
                {s.label}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/80 shadow-inner">
                <s.icon className="h-4 w-4 text-teal-400" />
              </div>
            </div>
            <div className="mt-4 font-mono text-4xl font-light text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab} className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-28 space-y-8">
            <TabsList className="flex flex-col h-auto bg-transparent items-stretch space-y-2 p-0">
              <TabsTrigger
                value="agents"
                className="justify-start gap-3 px-4 py-3 text-sm font-light data-[state=active]:bg-secondary/60 data-[state=active]:text-teal-400 rounded-2xl border border-transparent data-[state=active]:border-border/40 data-[state=active]:shadow-sm transition-all"
              >
                <Bot className="h-4 w-4" />
                Agents
              </TabsTrigger>
              <TabsTrigger
                value="memory"
                className="justify-start gap-3 px-4 py-3 text-sm font-light data-[state=active]:bg-secondary/60 data-[state=active]:text-teal-400 rounded-2xl border border-transparent data-[state=active]:border-border/40 data-[state=active]:shadow-sm transition-all"
              >
                <Database className="h-4 w-4" />
                Memory
              </TabsTrigger>
              <TabsTrigger
                value="pools"
                className="justify-start gap-3 px-4 py-3 text-sm font-light data-[state=active]:bg-secondary/60 data-[state=active]:text-teal-400 rounded-2xl border border-transparent data-[state=active]:border-border/40 data-[state=active]:shadow-sm transition-all"
              >
                <Share2 className="h-4 w-4" />
                Shared pools
              </TabsTrigger>
              <TabsTrigger
                value="log"
                className="justify-start gap-3 px-4 py-3 text-sm font-light data-[state=active]:bg-secondary/60 data-[state=active]:text-teal-400 rounded-2xl border border-transparent data-[state=active]:border-border/40 data-[state=active]:shadow-sm transition-all"
              >
                <ScrollText className="h-4 w-4" />
                Access log
              </TabsTrigger>
              <TabsTrigger
                value="contract"
                className="justify-start gap-3 px-4 py-3 text-sm font-light data-[state=active]:bg-secondary/60 data-[state=active]:text-teal-400 rounded-2xl border border-transparent data-[state=active]:border-border/40 data-[state=active]:shadow-sm transition-all"
              >
                <FileCode2 className="h-4 w-4" />
                Contract
              </TabsTrigger>
            </TabsList>

            <div className="hidden md:block">
              <HowItWorksSidebar />
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <TabsContent
            value="agents"
            className="m-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <AgentsPanel
              owner={owner}
              agents={agents}
              onOpen={(id) => {
                setSelectedAgentId(id);
                setTab("memory");
              }}
            />
          </TabsContent>
          <TabsContent
            value="memory"
            className="m-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <MemoryPanel
              owner={owner}
              agents={agents}
              selectedAgentId={selectedAgentId}
              onSelect={setSelectedAgentId}
            />
          </TabsContent>
          <TabsContent
            value="pools"
            className="m-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <PoolsPanel owner={owner} agents={agents} />
          </TabsContent>
          <TabsContent
            value="log"
            className="m-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <AccessLogPanel owner={owner} />
          </TabsContent>
          <TabsContent
            value="contract"
            className="m-0 focus-visible:outline-none animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <ContractPanel owner={owner} agents={agents} pools={pools} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

/* ============================ HOW IT WORKS ============================ */
function HowItWorksSidebar() {
  return (
    <div className="rounded-3xl border border-border/40 bg-card/40 backdrop-blur-3xl p-6 shadow-xl shadow-black/5">
      <div className="mb-6 flex items-center gap-2">
        <Network className="h-4 w-4 text-teal-400" />
        <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Workflow
        </h2>
      </div>
      <div className="space-y-6 relative before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-border/60">
        <div className="relative pl-8">
          <div className="absolute left-0 top-1 h-6 w-6 rounded-full border border-border bg-card flex items-center justify-center z-10 shadow-sm">
            <span className="text-[10px] font-bold text-teal-400">1</span>
          </div>
          <p className="font-medium text-sm text-foreground">Register Agent</p>
          <p className="mt-1 text-xs font-light text-muted-foreground leading-relaxed">
            Mint an on-chain identity for each AI agent to act on its behalf.
          </p>
        </div>
        <div className="relative pl-8">
          <div className="absolute left-0 top-1 h-6 w-6 rounded-full border border-border bg-card flex items-center justify-center z-10 shadow-sm">
            <span className="text-[10px] font-bold text-teal-400">2</span>
          </div>
          <p className="font-medium text-sm text-foreground">Write Memory</p>
          <p className="mt-1 text-xs font-light text-muted-foreground leading-relaxed">
            Store decisions as hashed blobs on Walrus, forever immutable.
          </p>
        </div>
        <div className="relative pl-8">
          <div className="absolute left-0 top-1 h-6 w-6 rounded-full border border-border bg-card flex items-center justify-center z-10 shadow-sm">
            <span className="text-[10px] font-bold text-teal-400">3</span>
          </div>
          <p className="font-medium text-sm text-foreground">Share Pools</p>
          <p className="mt-1 text-xs font-light text-muted-foreground leading-relaxed">
            Authorize external agents to read findings securely.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================ DEPLOY ============================ */
function DeployCard() {
  const { publish, account } = useNarwhal();
  const [busy, setBusy] = useState(false);
  const deployed = isDeployed();
  const pkg = getPackageId();

  const onDeploy = async () => {
    if (!account) return toast.error("Connect your wallet first");
    setBusy(true);
    try {
      toast.loading("Publishing contract to Sui testnet…", { id: "deploy" });
      const id = await publish();
      toast.success("Contract live on Sui testnet 🎉", {
        id: "deploy",
        description: `Package ${id.slice(0, 18)}…`,
      });
    } catch (e: unknown) {
      toast.error("Deploy failed", { id: "deploy", description: errorMessage(e) ?? "Try again" });
    } finally {
      setBusy(false);
    }
  };

  if (deployed) {
    return (
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-teal/40 bg-teal/5 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15">
            <CheckCircle2 className="h-5 w-5 text-teal" />
          </span>
          <div>
            <p className="font-semibold">Smart contract deployed</p>
            <p className="font-mono text-xs text-muted-foreground">{pkg}</p>
          </div>
        </div>
        <a
          href={`${SUI_EXPLORER}/object/${pkg}`}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
        >
          <ExternalLink className="h-4 w-4" /> View on Suiscan
        </a>
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber/40 bg-amber/5 p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/15">
          <Rocket className="h-5 w-5 text-amber" />
        </span>
        <div>
          <p className="font-semibold">Deploy the on-chain contract</p>
          <p className="text-sm text-muted-foreground">
            One click — published & paid for by your connected wallet. No CLI, no private keys.
          </p>
        </div>
      </div>
      <button onClick={onDeploy} disabled={busy} className="btn-primary disabled:opacity-60">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
        {busy ? "Deploying…" : "Deploy to testnet"}
      </button>
    </div>
  );
}

/* ============================ AGENTS ============================ */
function AgentsPanel({
  owner,
  agents,
  onOpen,
}: {
  owner: string;
  agents: Agent[];
  onOpen: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [busy, setBusy] = useState(false);
  const [touched, setTouched] = useState(false);
  const { registerAgent } = useNarwhal();
  const deployed = isDeployed();

  const NAME_MAX = 60;
  const PURPOSE_MAX = 280;
  const trimmedName = name.trim();
  const nameError = !trimmedName
    ? "Give your agent a name"
    : trimmedName.length > NAME_MAX
      ? `Keep the name under ${NAME_MAX} characters`
      : "";

  const register = async () => {
    setTouched(true);
    if (nameError) return toast.error(nameError);
    setBusy(true);
    try {
      if (deployed) {
        toast.loading("Registering agent on-chain…", { id: "agent" });
        const { objectId, digest } = await registerAgent(name.trim(), purpose.trim() || "agent");
        db.addAgent({
          id: objectId,
          owner,
          name: name.trim(),
          purpose: purpose.trim(),
          onChainId: objectId,
          txDigest: digest,
        });
        toast.success(`Agent “${name.trim()}” registered on-chain`, {
          id: "agent",
          description: `Identity object ${objectId.slice(0, 14)}…`,
        });
      } else {
        db.addAgent({ owner, name: name.trim(), purpose: purpose.trim() });
        toast.success(`Agent “${name.trim()}” registered`, {
          description: "Deploy the contract to anchor it on-chain.",
        });
      }
      setName("");
      setPurpose("");
      setTouched(false);
    } catch (e: unknown) {
      toast.error("Registration failed", {
        id: "agent",
        description: errorMessage(e) ?? "Try again",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <Panel title="Register an agent" subtitle="Mint a permanent identity tied to your wallet.">
        <div className="space-y-4">
          <Field label="Agent name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Alpha Trading Bot"
              maxLength={NAME_MAX}
              aria-invalid={touched && !!nameError}
            />
            {touched && nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </Field>
          <Field label="Purpose">
            <Textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Executes momentum strategies on SUI/USDC and records every decision."
              rows={3}
              maxLength={PURPOSE_MAX}
            />
          </Field>
          <button
            onClick={register}
            disabled={busy || !trimmedName}
            className="btn-primary w-full disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {busy ? "Registering…" : deployed ? "Register agent on-chain" : "Register agent"}
          </button>
        </div>
      </Panel>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Your agents
        </h3>
        {agents.length === 0 ? (
          <Empty
            icon={Bot}
            text="No agents yet. Register your first one to start writing memory."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {agents.map((a) => (
              <button
                key={a.id}
                onClick={() => onOpen(a.id)}
                className="hover-lift group rounded-2xl border border-border bg-card p-5 text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary/60">
                    <Bot className="h-5 w-5 text-teal" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <h4 className="mt-4 text-lg font-bold">{a.name}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {a.purpose || "No purpose set"}
                </p>
                <p className="mt-3 font-mono text-xs text-muted-foreground/70">
                  {a.id.slice(0, 18)}…
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {db.snapshots(a.id).length} snapshots
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================ MEMORY ============================ */
function MemoryPanel({
  owner,
  agents,
  selectedAgentId,
  onSelect,
}: {
  owner: string;
  agents: Agent[];
  selectedAgentId: string | null;
  onSelect: (id: string) => void;
}) {
  const agent = agents.find((a) => a.id === selectedAgentId) ?? agents[0] ?? null;
  const snapshots = agent ? db.snapshots(agent.id) : [];
  const [open, setOpen] = useState<Snapshot | null>(null);

  if (!agent) {
    return (
      <Empty icon={Database} text="Register an agent first, then come back to write its memory." />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <SnapshotComposer owner={owner} agent={agent} agents={agents} onSelectAgent={onSelect} />

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {agent.name} · memory timeline
        </h3>
        {snapshots.length === 0 ? (
          <Empty icon={Clock} text="No memory written yet. Create the first snapshot." />
        ) : (
          <ol className="relative space-y-3 border-l border-border pl-6">
            {snapshots.map((s) => (
              <li key={s.id} className="relative">
                <span className="absolute -left-[31px] top-4 h-3 w-3 rounded-full border-2 border-background bg-teal" />
                <button
                  onClick={() => setOpen(s)}
                  className="hover-lift block w-full rounded-2xl border border-border bg-card p-5 text-left"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="flex items-center gap-2 font-semibold">
                      {s.isPrivate ? (
                        <Lock className="h-4 w-4 text-amber" />
                      ) : (
                        <Unlock className="h-4 w-4 text-muted-foreground" />
                      )}
                      {s.title}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(s.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{s.decision}</p>
                  <p className="mt-3 font-mono text-xs text-teal/80">
                    blob {s.blobId.slice(0, 16)}…
                  </p>
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      <SnapshotDialog snapshot={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function SnapshotComposer({
  owner,
  agent,
  agents,
  onSelectAgent,
}: {
  owner: string;
  agent: Agent;
  agents: Agent[];
  onSelectAgent: (id: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [decision, setDecision] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [privateNote, setPrivateNote] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [busy, setBusy] = useState(false);
  const { anchorSnapshot } = useNarwhal();

  const submit = async () => {
    if (!title.trim() || !decision.trim()) return toast.error("Title and decision are required");
    setBusy(true);
    try {
      // Real client-side encryption: private fields are AES-256-GCM encrypted
      // before they ever touch the public Walrus network. The key is generated
      // locally and kept by the owner — only ciphertext is uploaded.
      let sealKey: string | undefined;
      let sealedNote = privateNote.trim();
      if (isPrivate && privateNote.trim()) {
        sealKey = await generateSealKey();
        sealedNote = await sealPrivateNote(privateNote.trim(), sealKey);
      }
      const payload = {
        agent: agent.id,
        title: title.trim(),
        decision: decision.trim(),
        reasoning: reasoning.trim(),
        privateNote: sealedNote,
        ts: Date.now(),
      };
      const content = JSON.stringify(payload);
      const hash = await sha256Hex(content);
      toast.loading("Writing to Walrus…", { id: "store" });
      const result = await storeBlob(content);
      toast.success("Stored on Walrus", {
        id: "store",
        description: `Blob ${result.blobId.slice(0, 18)}…`,
      });

      // If deployed and we have an on-chain agent + a pool to anchor against, bind it on-chain.
      let txDigest: string | undefined;
      const pool = db.pools(owner).find((p) => p.ownerAgentId === agent.id && p.onChainId);
      if (isDeployed() && agent.onChainId && pool?.onChainId) {
        try {
          toast.loading("Anchoring on-chain…", { id: "anchor" });
          txDigest = await anchorSnapshot(
            agent.onChainId,
            pool.onChainId,
            result.blobId,
            hash,
            isPrivate,
          );
          toast.success("Anchored on Sui", {
            id: "anchor",
            description: `Tx ${txDigest.slice(0, 14)}…`,
          });
        } catch (e: unknown) {
          toast.error("On-chain anchor skipped", {
            id: "anchor",
            description: errorMessage(e) ?? "Stored on Walrus only",
          });
        }
      }

      db.addSnapshot({
        agentId: agent.id,
        owner,
        title: title.trim(),
        decision: decision.trim(),
        reasoning: reasoning.trim(),
        privateNote: privateNote.trim() || undefined,
        sealKey,
        isPrivate,
        blobId: result.blobId,
        hash,
        endEpoch: result.endEpoch,
        txDigest,
      });
      setTitle("");
      setDecision("");
      setReasoning("");
      setPrivateNote("");
      setIsPrivate(false);
    } catch (e: unknown) {
      toast.error("Walrus write failed", {
        id: "store",
        description: errorMessage(e) ?? "Try again",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Panel
      title="Write a memory snapshot"
      subtitle="Stored as a permanent, content-addressed blob on Walrus."
    >
      <div className="space-y-4">
        <Field label="Acting agent">
          <select
            value={agent.id}
            onChange={(e) => onSelectAgent(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-secondary/40 px-3 text-sm outline-none focus:border-primary"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Title">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Opened long SUI position"
          />
        </Field>
        <Field label="Decision">
          <Textarea
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            rows={2}
            placeholder="Bought 1,200 SUI at $3.41"
          />
        </Field>
        <Field label="Reasoning">
          <Textarea
            value={reasoning}
            onChange={(e) => setReasoning(e.target.value)}
            rows={2}
            placeholder="RSI crossed 30 with rising volume."
          />
        </Field>

        <div className="rounded-xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-sm">
              {isPrivate ? <Lock className="h-4 w-4 text-amber" /> : <Unlock className="h-4 w-4" />}{" "}
              Private field (Seal)
            </Label>
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} />
          </div>
          {isPrivate && (
            <Textarea
              value={privateNote}
              onChange={(e) => setPrivateNote(e.target.value)}
              rows={2}
              className="mt-3"
              placeholder="Secret signal source — encrypted before storage."
            />
          )}
        </div>

        <button onClick={submit} disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
          {busy ? "Writing to Walrus…" : "Store snapshot"}
        </button>
      </div>
    </Panel>
  );
}

function SnapshotDialog({ snapshot, onClose }: { snapshot: Snapshot | null; onClose: () => void }) {
  const [state, setState] = useState<"idle" | "verifying" | "ok" | "fail">("idle");
  const [fetched, setFetched] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<string | null>(null);

  const reveal = async () => {
    if (!snapshot?.sealKey) return;
    try {
      const raw = await readBlob(snapshot.blobId);
      const sealedField = (JSON.parse(raw) as { privateNote?: string }).privateNote ?? "";
      const plain = await unsealPrivateNote(sealedField, snapshot.sealKey);
      setRevealed(plain);
    } catch (e: unknown) {
      toast.error("Could not decrypt sealed field", { description: errorMessage(e) });
    }
  };

  const verify = async () => {
    if (!snapshot) return;
    setState("verifying");
    try {
      const raw = await readBlob(snapshot.blobId);
      const hash = await sha256Hex(raw);
      setFetched(raw);
      const ok = hash === snapshot.hash;
      setState(ok ? "ok" : "fail");
      db.logAccess({
        poolId: "self",
        poolName: "self-verify",
        readerAgentId: snapshot.agentId,
        action: "verify",
        detail: ok ? `Hash verified for ${snapshot.title}` : `Hash MISMATCH for ${snapshot.title}`,
      });
      toast[ok ? "success" : "error"](ok ? "Verified — hash matches Walrus" : "Hash mismatch!");
    } catch (e: unknown) {
      setState("fail");
      toast.error("Verification failed", { description: errorMessage(e) });
    }
  };

  return (
    <Dialog
      open={!!snapshot}
      onOpenChange={(o) => {
        if (!o) {
          onClose();
          setState("idle");
          setFetched(null);
          setRevealed(null);
        }
      }}
    >
      <DialogContent className="max-w-lg">
        {snapshot && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {snapshot.isPrivate ? (
                  <Lock className="h-4 w-4 text-amber" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
                {snapshot.title}
              </DialogTitle>
              <DialogDescription>{new Date(snapshot.createdAt).toLocaleString()}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              <Row label="Decision" value={snapshot.decision} />
              <Row label="Reasoning" value={snapshot.reasoning || "—"} />
              {snapshot.isPrivate ? (
                <div className="rounded-lg border border-amber/40 bg-amber/5 p-3">
                  <p className="flex items-center gap-2 text-amber">
                    <Lock className="h-4 w-4" /> Sealed field (AES-256-GCM)
                  </p>
                  {revealed !== null ? (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{revealed}</p>
                  ) : (
                    <>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {snapshot.privateNote
                          ? "•••••••••••••••• (encrypted on Walrus — key held locally by the owner)"
                          : "—"}
                      </p>
                      {snapshot.privateNote && snapshot.sealKey ? (
                        <button
                          onClick={reveal}
                          className="btn-ghost mt-2 text-xs"
                          type="button"
                        >
                          <Unlock className="h-3.5 w-3.5" /> Decrypt with my key
                        </button>
                      ) : null}
                    </>
                  )}
                </div>
              ) : null}


              <div className="space-y-2 rounded-lg border border-border bg-secondary/30 p-3 font-mono text-xs">
                <KV k="Walrus blob" v={snapshot.blobId} />
                <KV k="SHA-256" v={snapshot.hash} />
                {snapshot.endEpoch ? <KV k="End epoch" v={String(snapshot.endEpoch)} /> : null}
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={verify} className="btn-primary flex-1">
                  {state === "verifying" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  Verify on Walrus
                </button>
                <a
                  href={walrusBlobUrl(snapshot.blobId)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                >
                  <ExternalLink className="h-4 w-4" /> Raw blob
                </a>
              </div>

              <AnimatePresence>
                {state === "ok" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-teal/40 bg-teal/10 p-3 text-teal"
                  >
                    <CheckCircle2 className="h-5 w-5" /> Stored hash matches the live Walrus blob.
                    Tamper-free.
                  </motion.div>
                )}
                {state === "fail" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-destructive"
                  >
                    <XCircle className="h-5 w-5" /> Verification failed — content does not match.
                  </motion.div>
                )}
              </AnimatePresence>
              {fetched && state === "ok" && (
                <a
                  href={`${SUI_EXPLORER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs text-muted-foreground underline"
                >
                  View network on Suiscan
                </a>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ============================ POOLS ============================ */
function PoolsPanel({ owner, agents }: { owner: string; agents: Agent[] }) {
  const pools = db.pools(owner);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ownerAgentId, setOwnerAgentId] = useState(agents[0]?.id ?? "");
  const [readerId, setReaderId] = useState("");
  const [busy, setBusy] = useState(false);
  const { createPool, authorizeReader, revokeReader } = useNarwhal();
  const deployed = isDeployed();

  const create = async () => {
    if (!name.trim()) return toast.error("Name the pool");
    if (!ownerAgentId) return toast.error("Pick an owning agent");
    setBusy(true);
    try {
      const ownerAgent = agents.find((a) => a.id === ownerAgentId);
      if (deployed && ownerAgent?.onChainId) {
        toast.loading("Creating pool on-chain…", { id: "pool" });
        const { objectId } = await createPool(ownerAgent.onChainId, name.trim());
        db.addPool({
          id: objectId,
          owner,
          ownerAgentId,
          name: name.trim(),
          description: description.trim(),
          onChainId: objectId,
        });
        toast.success(`Pool “${name.trim()}” created on-chain`, {
          id: "pool",
          description: `Object ${objectId.slice(0, 14)}…`,
        });
      } else {
        db.addPool({ owner, ownerAgentId, name: name.trim(), description: description.trim() });
        toast.success(`Pool “${name.trim()}” created`);
      }
      setName("");
      setDescription("");
    } catch (e: unknown) {
      toast.error("Pool creation failed", {
        id: "pool",
        description: errorMessage(e) ?? "Try again",
      });
    } finally {
      setBusy(false);
    }
  };

  const authorize = async (pool: (typeof pools)[number], reader: string) => {
    try {
      if (deployed && pool.onChainId && /^0x[a-fA-F0-9]+$/.test(reader)) {
        toast.loading("Authorizing reader on-chain…", { id: "auth" });
        await authorizeReader(pool.onChainId, reader);
        toast.success("Reader authorized on-chain", { id: "auth" });
      } else {
        toast.success("Reader authorized");
      }
      db.setReader(pool.id, reader, true);
    } catch (e: unknown) {
      toast.error("Authorize failed", { id: "auth", description: errorMessage(e) ?? "Try again" });
    }
  };

  const revoke = async (pool: (typeof pools)[number], reader: string) => {
    try {
      const onChain = deployed && pool.onChainId && /^0x[a-fA-F0-9]+$/.test(reader);
      if (onChain) {
        toast.loading("Revoking reader on-chain…", { id: "rev" });
        await revokeReader(pool.onChainId!, reader);
      }
      db.setReader(pool.id, reader, false);

      // Verify the revoke actually applied before reporting success: read the
      // pool back from the store and confirm the reader is no longer authorized.
      const updated = db.all().pools.find((p) => p.id === pool.id);
      if (updated?.readers.includes(reader)) {
        toast.error("Revoke did not apply — reader still listed", { id: "rev" });
        return;
      }
      toast.success(onChain ? "Reader revoked on-chain" : "Reader access revoked", { id: "rev" });
    } catch (e: unknown) {
      toast.error("Revoke failed", { id: "rev", description: errorMessage(e) ?? "Try again" });
    }
  };

  const query = (poolId: string, poolName: string, ownerAgentId: string) => {
    db.logAccess({
      poolId,
      poolName,
      readerAgentId: "external-agent",
      action: "query",
      detail: "Pool queried live",
    });
    const count = db.snapshots(ownerAgentId).length;
    toast.success(`Queried ${poolName}`, {
      description: `${count} shared snapshots returned. Logged to access log.`,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <Panel
        title="Create a memory pool"
        subtitle="Share one agent's memory with others under access rules."
      >
        <div className="space-y-4">
          <Field label="Owning agent">
            <select
              value={ownerAgentId}
              onChange={(e) => setOwnerAgentId(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-secondary/40 px-3 text-sm outline-none focus:border-primary"
            >
              <option value="">Select…</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pool name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Market signals pool"
            />
          </Field>
          <Field label="Description">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Shared trading signals for partner agents."
            />
          </Field>
          <button
            onClick={create}
            disabled={busy}
            className="btn-primary w-full disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {busy ? "Creating…" : deployed ? "Create pool on-chain" : "Create pool"}
          </button>
        </div>
      </Panel>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Your pools
        </h3>
        {pools.length === 0 ? (
          <Empty icon={Share2} text="No pools yet. Create one to share memory across agents." />
        ) : (
          pools.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-lg font-bold">{p.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {p.description || "No description"}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground/70">
                    owner agent {p.ownerAgentId.slice(0, 14)}…
                  </p>
                </div>
                <button
                  onClick={() => query(p.id, p.name, p.ownerAgentId)}
                  className="btn-ghost shrink-0"
                >
                  Query live
                </button>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Authorized readers
                </p>
                {p.readers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">None yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {p.readers.map((r) => (
                      <span
                        key={r}
                        className="flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 font-mono text-xs"
                      >
                        {r.slice(0, 12)}…
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="text-destructive hover:underline">revoke</button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke reader access?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes <span className="font-mono">{r.slice(0, 12)}…</span>{" "}
                                from “{p.name}”. They will no longer be able to read this pool's
                                memory. You can re-authorize them later.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => revoke(p, r)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Revoke
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <Input
                    value={readerId}
                    onChange={(e) => setReaderId(e.target.value)}
                    placeholder="Reader agent id (0x…)"
                    className="font-mono text-xs"
                  />
                  <button
                    onClick={() => {
                      if (!readerId.trim()) return toast.error("Enter an agent id");
                      authorize(p, readerId.trim());
                      setReaderId("");
                    }}
                    className="btn-primary shrink-0"
                  >
                    Authorize
                  </button>
                </div>

                {agents.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {agents.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => authorize(p, a.id)}
                        className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground hover:text-foreground"
                      >
                        + {a.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ============================ ACCESS LOG ============================ */
function AccessLogPanel({ owner }: { owner: string }) {
  const events = db.access(owner);
  const icon = (a: string) =>
    a === "authorize"
      ? CheckCircle2
      : a === "revoke"
        ? XCircle
        : a === "verify"
          ? ShieldCheck
          : ScrollText;
  if (events.length === 0)
    return (
      <Empty icon={ScrollText} text="No access events yet. Authorize readers or query a pool." />
    );
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Action</th>
            <th className="px-4 py-3">Pool</th>
            <th className="px-4 py-3">Reader</th>
            <th className="px-4 py-3">Detail</th>
            <th className="px-4 py-3 text-right">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {events.map((e) => {
            const Icon = icon(e.action);
            return (
              <tr key={e.id} className="hover:bg-secondary/20">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2 font-medium capitalize">
                    <Icon className="h-4 w-4 text-teal" />
                    {e.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{e.poolName}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {e.readerAgentId.slice(0, 14)}…
                </td>
                <td className="px-4 py-3 text-muted-foreground">{e.detail}</td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground">
                  {new Date(e.at).toLocaleTimeString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ============================ CONTRACT ============================ */
function ContractPanel({
  owner,
  agents,
  pools,
}: {
  owner: string;
  agents: Agent[];
  pools: ReturnType<typeof db.pools>;
}) {
  const deployed = isDeployed();
  const pkg = getPackageId();

  const functions = [
    {
      sig: "register_agent(name, kind, clock)",
      desc: "Mints an AgentIdentity object owned by the caller.",
    },
    {
      sig: "create_memory_pool(agent, name)",
      desc: "Creates a shareable MemoryPool tied to an agent.",
    },
    {
      sig: "authorize_reader(pool, reader)",
      desc: "Adds an address to a pool's on-chain reader allowlist.",
    },
    { sig: "revoke_reader(pool, reader)", desc: "Removes an address from the allowlist." },
    {
      sig: "anchor_snapshot(agent, pool, blob_id, hash, has_private, clock)",
      desc: "Binds a Walrus blob id + SHA-256 hash on-chain.",
    },
    {
      sig: "log_access(pool, blob_id, clock)",
      desc: "Records an authorized read in the audit log.",
    },
  ];

  const onChainAgents = agents.filter((a) => a.onChainId);
  const onChainPools = pools.filter((p) => p.onChainId);

  return (
    <div className="space-y-6">
      <Panel
        title="Network & deployment"
        subtitle="Everything below is live on public infrastructure — no private keys held by this app."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoRow k="Sui network" v="Testnet" link={SUI_EXPLORER} />
          <InfoRow k="Move module" v={`${NARWHAL_MODULE}`} />
          <InfoRow k="Walrus publisher" v={WALRUS_PUBLISHER} link={WALRUS_PUBLISHER} />
          <InfoRow k="Walrus aggregator" v={WALRUS_AGGREGATOR} link={WALRUS_AGGREGATOR} />
        </div>

        <div className="mt-5 rounded-xl border border-border bg-secondary/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Package ID
          </p>
          {deployed ? (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <code className="break-all rounded-md bg-background px-2 py-1 font-mono text-xs">
                {pkg}
              </code>
              <CopyButton value={pkg} />
              <a href={explorer.object(pkg)} target="_blank" rel="noreferrer" className="btn-ghost">
                <ExternalLink className="h-4 w-4" /> Suiscan
              </a>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Not deployed in this browser yet. Click{" "}
              <span className="text-foreground">Deploy to testnet</span> above, then your package id
              and explorer link appear here.
            </p>
          )}
        </div>
      </Panel>

      <Panel
        title="Entry functions"
        subtitle={`Public Move calls in ${NARWHAL_MODULE}::${NARWHAL_MODULE}.`}
      >
        <div className="space-y-2">
          {functions.map((f) => (
            <div key={f.sig} className="rounded-xl border border-border bg-secondary/20 p-3">
              <code className="font-mono text-xs text-teal">{f.sig}</code>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Your on-chain objects"
        subtitle="Agent identities and pools you own, with direct explorer links."
      >
        {onChainAgents.length === 0 && onChainPools.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing anchored on-chain yet. Deploy the contract, then register an agent / create a
            pool to mint real Sui objects.
          </p>
        ) : (
          <div className="space-y-3">
            {onChainAgents.map((a) => (
              <ObjectRow
                key={a.id}
                icon={Bot}
                label={a.name}
                id={a.onChainId!}
                kind="AgentIdentity"
              />
            ))}
            {onChainPools.map((p) => (
              <ObjectRow
                key={p.id}
                icon={Share2}
                label={p.name}
                id={p.onChainId!}
                kind="MemoryPool"
              />
            ))}
          </div>
        )}
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <KeyRound className="h-3.5 w-3.5" /> Owner wallet:{" "}
          <a
            href={explorer.account(owner)}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-teal hover:underline"
          >
            {owner.slice(0, 16)}…
          </a>
        </p>
      </Panel>
    </div>
  );
}

function InfoRow({ k, v, link }: { k: string; v: string; link?: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{k}</p>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block break-all font-mono text-xs text-teal hover:underline"
        >
          {v}
        </a>
      ) : (
        <p className="mt-1 break-all font-mono text-xs">{v}</p>
      )}
    </div>
  );
}

function ObjectRow({
  icon: Icon,
  label,
  id,
  kind,
}: {
  icon: LucideIcon;
  label: string;
  id: string;
  kind: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-secondary/20 p-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card">
          <Icon className="h-4 w-4 text-teal" />
        </span>
        <div>
          <p className="font-semibold">{label}</p>
          <p className="font-mono text-xs text-muted-foreground">
            {kind} · {id.slice(0, 18)}…
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <CopyButton value={id} />
        <a href={explorer.object(id)} target="_blank" rel="noreferrer" className="btn-ghost">
          <ExternalLink className="h-4 w-4" /> Suiscan
        </a>
      </div>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success("Copied");
        setTimeout(() => setCopied(false), 1500);
      }}
      className="btn-ghost"
    >
      {copied ? <Check className="h-4 w-4 text-teal" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ============================ SHARED UI ============================ */
function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border/40 bg-card/40 backdrop-blur-3xl p-8 shadow-xl shadow-black/5">
      <h3 className="text-2xl font-light tracking-tight">{title}</h3>
      {subtitle && (
        <p className="mt-2 text-sm font-light text-muted-foreground max-w-lg">{subtitle}</p>
      )}
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-3">
      <Label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Empty({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/40 bg-card/20 p-16 text-center backdrop-blur-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/50 shadow-inner mb-6">
        <Icon className="h-6 w-6 text-muted-foreground/60" />
      </div>
      <p className="max-w-xs text-sm font-light text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1">{value}</p>
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="break-all text-right">{v}</span>
    </div>
  );
}
