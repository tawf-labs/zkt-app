import Link from "next/link"

type Campaign = {
  id: string
  title: string
  charity: string
  raised: number
  goal: number
  imageQuery: string
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const { id, title, charity, raised, goal, imageQuery } = campaign
  const pct = Math.max(0, Math.min(100, Math.round((raised / goal) * 100)))

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
      <div className="aspect-[16/9] w-full overflow-hidden border-b border-border">
        <img
          src={`/.jpg?key=fgxto&height=360&width=640&query=${imageQuery}`}
          alt={`${title} - ${charity}`}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-pretty leading-tight">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{charity}</p>
          </div>
          <span className="whitespace-nowrap rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
            {pct}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="h-2.5 w-full rounded-full bg-muted overflow-hidden"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress donasi"
        >
          <div 
            className="h-full rounded-full bg-primary transition-all duration-500" 
            style={{ width: `${pct}%` }} 
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Rp {raised.toLocaleString('id-ID')}
          </span>
          <span className="text-muted-foreground">
            dari Rp {goal.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="pt-2">
          <Link
            href={`/campaigns/${id}`}
            className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            aria-label={`Lihat detail ${title}`}
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </article>
  )
}

export default CampaignCard;