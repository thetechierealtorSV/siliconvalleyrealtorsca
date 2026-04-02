'use client'

export function About() {
  const steps = [
    { number: '01', title: 'Discovery Call', description: 'Share your vision, budget, and lifestyle preferences with our Eichler specialists.' },
    { number: '02', title: 'Curated Selection', description: 'We match you with properties from our exclusive inventory and off-market listings.' },
    { number: '03', title: 'Virtual & In-Person Tours', description: 'Experience homes through cinematic video tours and private showings.' },
    { number: '04', title: 'Expert Negotiation', description: 'Our deep market knowledge ensures the strongest position for your offer.' },
    { number: '05', title: 'Seamless Closing', description: 'From inspection to keys-in-hand, we manage every detail of your transaction.' },
  ]

  return (
    <section id="process" className="relative py-28 bg-secondary/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4 font-medium">
            Our Approach
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            Your Journey Home
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A refined, five-step process designed to make finding your Eichler effortless.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex gap-8 mb-12 last:mb-0 group">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-foreground text-primary-foreground flex items-center justify-center font-display font-bold text-lg flex-shrink-0">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-px h-full bg-border mt-4 min-h-[40px]" />
                )}
              </div>
              <div className="pb-8">
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
