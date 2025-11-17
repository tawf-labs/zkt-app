"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

type Proposal = {
  id: string
  title: string
  charity: string
  endsInDays: number
  forVotes: number
  againstVotes: number
}

const initialProposals: Proposal[] = [
  {
    id: "p1",
    title: "Expand Food Packs to Region B",
    charity: "Global Relief Network",
    endsInDays: 3,
    forVotes: 62,
    againstVotes: 38,
  },
  { id: "p2", title: "Deploy 4 New Wells", charity: "Hope Wells", endsInDays: 5, forVotes: 55, againstVotes: 45 },
]

export default function DaoPage() {
  const [proposals, setProposals] = React.useState(initialProposals)

  function vote(id: string, type: "for" | "against") {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === id
          ? type === "for"
            ? { ...p, forVotes: p.forVotes + 1 }
            : { ...p, againstVotes: p.againstVotes + 1 }
          : p,
      ),
    )
  }

  return (
    <main className="container mx-auto min-h-dvh px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">DAO Proposals</h1>
      <div className="space-y-4">
        {proposals.map((p) => {
          const total = p.forVotes + p.againstVotes
          const forPct = total ? Math.round((p.forVotes / total) * 100) : 0
          return (
            <article key={p.id} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-medium">{p.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Submitted by {p.charity} • Ends in {p.endsInDays} days
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => vote(p.id, "for")}
                    className="bg-primary text-primary-foreground hover:opacity-90"
                  >
                    Vote For
                  </Button>
                  <Button variant="outline" onClick={() => vote(p.id, "against")}>
                    Vote Against
                  </Button>
                </div>
              </div>
              <div className="mt-3">
                <div
                  className="h-2 w-full rounded-full bg-muted"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={forPct}
                  aria-label="Voting results"
                >
                  <div className="h-full rounded-full bg-primary" style={{ width: `${forPct}%` }} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  For: {p.forVotes} • Against: {p.againstVotes} • {forPct}% For
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Voter Anonymity: Votes are cast privately using ZK.
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
