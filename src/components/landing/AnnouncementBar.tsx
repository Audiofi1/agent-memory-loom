import { ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="relative z-60 w-full overflow-hidden border-b border-teal-500/20 bg-teal-500/10 dark:border-transparent dark:bg-foreground">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-teal-500/15 to-transparent dark:from-teal-500/20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-violet-500/10 to-transparent dark:from-blue-500/20" />

      <div className="relative mx-auto flex min-h-[40px] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center sm:gap-x-3">
          <span className="hidden h-1.5 w-1.5 animate-pulse rounded-full bg-teal sm:block" />
          <p className="text-xs font-medium text-slate-800 sm:text-sm dark:text-background">
            <strong className="font-semibold text-slate-900 dark:text-background">
              Narwhal Memory is live.
            </strong>
            <span className="mx-1.5 hidden opacity-90 sm:inline">&mdash;</span>
            <span className="hidden opacity-90 sm:inline">Verifiable memory for AI agents.</span>
          </p>
          <ArrowRight className="hidden h-3.5 w-3.5 text-teal sm:block dark:text-background/80" />
        </div>
      </div>
    </div>
  );
}
