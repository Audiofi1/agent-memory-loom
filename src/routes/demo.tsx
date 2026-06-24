import { createFileRoute } from "@tanstack/react-router";
import ShaderBackground from "@/components/ui/shader-background";

export const Route = createFileRoute("/demo")({
  component: DemoRoute,
});

function DemoOne() {
  return (
    <div className="relative min-h-screen">
      <ShaderBackground />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <p className="rounded-2xl border border-white/20 bg-black/40 px-6 py-4 text-sm text-white backdrop-blur-md">
          Shader background demo
        </p>
      </div>
    </div>
  );
}

function DemoRoute() {
  return <DemoOne />;
}

export { DemoOne };
