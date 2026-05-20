export function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="page-hero">
      <h1 className="page-title">{title}</h1>
      {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
    </div>
  );
}
