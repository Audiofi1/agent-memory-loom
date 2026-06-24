const PHRASE = "THE FUTURE RUNS ON NARWHAL";

type Variant = "solid" | "outline" | "gradient";
const SEQUENCE: Variant[] = ["solid", "outline", "gradient", "outline"];

function Word({ variant }: { variant: Variant }) {
  return (
    <span
      className={
        variant === "gradient"
          ? "text-gradient"
          : variant === "outline"
            ? "mq-outline"
            : "text-foreground/85"
      }
    >
      {PHRASE}
    </span>
  );
}

function Group({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="mq-group" aria-hidden="true">
      {SEQUENCE.map((variant, i) => (
        <span key={i} className="mq-item">
          <Word variant={variant} />
          <span className="mq-sep font-mono" aria-hidden="true">
            {reverse ? "/" : "✦"}
          </span>
        </span>
      ))}
    </div>
  );
}

function Row({ reverse = false, fast = false }: { reverse?: boolean; fast?: boolean }) {
  return (
    <div
      className={[
        "mq-track",
        reverse ? "mq-track--reverse" : "",
        fast ? "mq-track--fast" : "",
      ].join(" ")}
    >
      <div className="mq-scroller">
        <Group reverse={reverse} />
        <Group reverse={reverse} />
      </div>
    </div>
  );
}

export function TextMarquee() {
  return (
    <section
      className="mq-section relative overflow-hidden border-y border-border py-12 sm:py-16"
      aria-label={PHRASE}
    >
      <div className="mq-aura pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="mq-rows relative flex flex-col gap-3 sm:gap-4">
        <Row />
        <Row reverse fast />
      </div>
      <span className="sr-only">{PHRASE}</span>
    </section>
  );
}
