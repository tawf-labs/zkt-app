import Link from "next/link"

type Campaign = {
  id: string
  title: string
  charity: string
  raised: number
  goal: number
  imageQuery: string
}

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { id, title, charity, raised, goal, imageQuery } = campaign
  const pct = Math.max(0, Math.min(100, Math.round((raised / goal) * 100)))

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-[16/9] w-full overflow-hidden border-b border-border">
        <img
          src={`/.jpg?key=fgxto&height=360&width=640&query=${imageQuery}`}
          alt={`${title} - ${charity}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-pretty">{title}</h3>
            <p className="text-sm text-muted-foreground">{charity}</p>
          </div>
          <span className="whitespace-nowrap rounded-full bg-accent px-2 py-1 text-xs text-accent-foreground">
            {pct}% funded
          </span>
        </div>

        {/* Progress bar using tokens */}
        <div
          className="h-2 w-full rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Funding progress"
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {"$"}
            {raised.toLocaleString()} {"raised"}
          </span>
          <span className="text-muted-foreground">
            {"of $"}
            {goal.toLocaleString()}
          </span>
        </div>

        <div className="pt-1">
          <Link
            href={`/campaigns/${id}`}
            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            aria-label={`View details for ${title}`}
          >
            {"Details"}
          </Link>
        </div>
      </div>
    </article>
  )
}
