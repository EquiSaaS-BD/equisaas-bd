import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function WorkspaceKpi({ label, value, note }) {
  return (
    <div className="workspace-kpi">
      <p className="workspace-kpi-label">{label}</p>
      <p className="workspace-kpi-value">{value}</p>
      {note ? <p className="workspace-kpi-note">{note}</p> : null}
    </div>
  );
}

export function WorkspacePageHeader({
  badge,
  title,
  description,
  actions,
  stats = [],
  children,
  className,
  reveal = "up",
}) {
  return (
    <section className={cn("workspace-hero", className)} data-reveal={reveal}>
      <div className="workspace-hero-body">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-4xl space-y-4">
            {badge ? (
              typeof badge === "string" ? (
                <Badge variant="subtle" className="workspace-eyebrow border-0 bg-transparent px-0 py-0">
                  {badge}
                </Badge>
              ) : (
                badge
              )
            ) : null}

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
              {description ? (
                <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-[1.05rem]">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          {actions ? <div className="w-full xl:max-w-[28rem]">{actions}</div> : null}
        </div>

        {stats.length ? (
          <div className="workspace-kpi-grid mt-6">
            {stats.map((item) => (
              <WorkspaceKpi
                key={`${item.label}-${item.value}`}
                label={item.label}
                value={item.value}
                note={item.note}
              />
            ))}
          </div>
        ) : null}

        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
