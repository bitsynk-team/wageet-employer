export function PageHeader({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">{kicker}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-forest">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}
