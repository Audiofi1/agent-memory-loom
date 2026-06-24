import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/outfit/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@mysten/dapp-kit/dist/index.css";

import appCss from "../styles.css?url";
import ogImage from "../assets/og-tusk.jpg.asset.json";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SuiProviders } from "../components/providers/SuiProviders";
import { AuthProvider } from "../lib/auth/AuthProvider";
import { Toaster } from "../components/ui/sonner";
import { ThemeProvider, themeInitScript } from "../components/providers/ThemeProvider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tusk — Verifiable memory for AI agents" },
      {
        name: "description",
        content:
          "Tusk is the permanent, verifiable memory backbone for autonomous AI agents — built on Walrus and Sui.",
      },
      { name: "author", content: "Tusk" },
      { property: "og:title", content: "Tusk — Verifiable memory for AI agents" },
      {
        property: "og:description",
        content:
          "Tusk is the permanent, verifiable memory backbone for autonomous AI agents — built on Walrus and Sui.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Tusk" },
      { name: "twitter:title", content: "Tusk — Verifiable memory for AI agents" },
      {
        name: "twitter:description",
        content:
          "Tusk is the permanent, verifiable memory backbone for autonomous AI agents — built on Walrus and Sui.",
      },
      { property: "og:image", content: ogImage.url },
      { name: "twitter:image", content: ogImage.url },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Set the theme class before paint to avoid a light/dark flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { LoaderProvider } from "../hooks/LoaderContext";
import { WelcomeLoader } from "../components/ui/WelcomeLoader";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <SuiProviders>
          <AuthProvider>
            <LoaderProvider>
              <WelcomeLoader />
              {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
              <Outlet />
              <Toaster />
            </LoaderProvider>
          </AuthProvider>
        </SuiProviders>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
