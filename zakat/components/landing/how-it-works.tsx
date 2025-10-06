export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Donate Privately",
      desc: "Contribute Zakat without revealing your identity. Your donation is recorded with privacy-preserving proofs.",
    },
    {
      step: "02",
      title: "DAO & Sharia Review",
      desc: "A transparent DAO process with Sharia oversight validates campaigns and disbursement requests.",
    },
    {
      step: "03",
      title: "Verifiable Proof",
      desc: "Receive anonymous, verifiable proofs of disbursement so you can trust your impact.",
    },
  ]

  return (
    <section id="how-it-works" className="bg-card py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-pretty">How It Works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <article key={s.step} className="rounded-lg border border-border bg-background p-5">
              <div className="mb-3 inline-flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {s.step}
                </span>
                <h3 className="text-lg font-medium">{s.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
